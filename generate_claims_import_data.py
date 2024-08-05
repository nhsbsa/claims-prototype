import json
import uuid
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from faker import Faker
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

fake = Faker()

# Load environment variables
load_dotenv()

# Database connection settings
db_params = {
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

def create_tables(db_params):
    commands = (
        """
        CREATE TABLE IF NOT EXISTS claims (
            claimid SERIAL PRIMARY KEY,
            claimreference VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            financialyear INT NOT NULL,
            articletype VARCHAR(255) NOT NULL,
            claimtype VARCHAR(255) NOT NULL,
            claimstatus VARCHAR(255) NOT NULL,
            targetdate DATE NOT NULL,
            deadline DATE NOT NULL,
            datereceived DATE NOT NULL,
            invoicesnumber JSONB NOT NULL,
            claimamount JSONB NOT NULL,
            claimcost VARCHAR(255) NOT NULL,
            agebracket VARCHAR(255) NOT NULL
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS invoices (
            invoiceid SERIAL PRIMARY KEY,
            claimid INT NOT NULL,
            invoicereference VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            startdate DATE NOT NULL,
            enddate DATE NOT NULL,
            status VARCHAR(255) NOT NULL,
            person JSONB NOT NULL,
            contestationreason TEXT,
            FOREIGN KEY (claimid) REFERENCES claims (claimid) ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS persons (
            personid SERIAL PRIMARY KEY,
            lastname VARCHAR(255) NOT NULL,
            firstname VARCHAR(255) NOT NULL,
            dob JSONB NOT NULL,
            uniqueid JSONB NOT NULL,
            address JSONB NOT NULL,
            entitlements JSONB NOT NULL,
            treatments JSONB NOT NULL,
            agebracket VARCHAR(255) NOT NULL,
            articletype VARCHAR(255) NOT NULL
        )
        """
    )
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        for command in commands:
            cursor.execute(command)
        conn.commit()
        cursor.close()
        conn.close()
        print("Tables created successfully")
    except psycopg2.Error as e:
        print(f"Error creating tables: {e}")

# Ensure tables are created
create_tables(db_params)

# Define required functions and variables
rina_countries = ["CountryA", "CountryB", "CountryC"]
average_cost_countries = ["CountryA", "CountryB"]

def generate_dates_within_year(year):
    return fake.date_between(start_date=f'{year}-01-01', end_date=f'{year}-12-31')

def generate_claim_reference(country, article, year, month, day):
    return f"{country}-{article}-{year}{month:02d}{day:02d}"

def generate_invoice(claim_cost, article, country, claim_date):
    invoice_date = claim_date + timedelta(days=random.randint(1, 30))
    return {
        'invoicereference': f"{country}-INV-{invoice_date.year}{invoice_date.month:02d}{invoice_date.day:02d}",
        'amount': round(random.uniform(100, 1000), 2),
        'startdate': claim_date.strftime('%Y-%m-%d'),
        'enddate': invoice_date.strftime('%Y-%m-%d'),
        'status': random.choice(["Completed", "To Check", "Contested"]),
        'person': generate_person(),
        'contestationreason': "" if random.choice([True, False]) else fake.text()
    }

def generate_person():
    return {
        'lastname': fake.last_name(),
        'firstname': fake.first_name(),
        'dob': fake.date_of_birth().isoformat(),
        'uniqueid': str(uuid.uuid4()),
        'address': fake.address(),
        'entitlements': fake.text(),
        'treatments': fake.text(),
        'agebracket': random.choice(["20-64", "65+"]),
        'articletype': "Article"
    }

def calculate_invoice_stats(invoices):
    return {'total': len(invoices)}

def calculate_claim_amount(invoices):
    return {'total': sum(invoice['amount'] for invoice in invoices)}

def generate_claims(num_claims):
    claims = []
    for _ in range(num_claims):
        country = random.choice(rina_countries)
        claim_date = generate_dates_within_year(random.randint(2011, 2023))
        claim_reference = generate_claim_reference(country, "Article", claim_date.year, claim_date.month, claim_date.day)
        claim_type = random.choice(["Main", "Supplementary"])
        claim_cost = "Actual" if country not in average_cost_countries else random.choice(["Average", "Actual"])
        invoices = [generate_invoice(claim_cost, "Article", country, claim_date) for _ in range(random.randint(10, 99))]
        status = "Completed"
        for invoice in invoices:
            if invoice['status'] in ["To Check", "Contested"]:
                status = random.choice(["Active", "Not Started"])
                break
        claim = {
            "claimreference": claim_reference,
            "country": country,
            "financialyear": claim_date.year,
            "articletype": invoices[0]['articletype'],
            "claimtype": claim_type,
            "claimstatus": status,
            "targetdate": (claim_date + timedelta(days=90)).strftime('%d %B %Y'),
            "deadline": (claim_date + relativedelta(years=1)).strftime('%d %B %Y'),
            "datereceived": claim_date.strftime('%d %B %Y'),
            "invoicesnumber": calculate_invoice_stats(invoices),
            "claimamount": calculate_claim_amount(invoices),
            "claimcost": claim_cost,
            "invoices": invoices,
            "agebracket": "65+" if random.randint(60, 90) >= 65 else "20-64"
        }
        claims.append(claim)
    return claims

def insert_claims_into_db(claims, db_params):
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        
        for claim in claims:
            cursor.execute(
                """
                INSERT INTO claims (claimreference, country, financialyear, articletype, claimtype, claimstatus, targetdate, deadline, datereceived, invoicesnumber, claimamount, claimcost, agebracket)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING claimid;
                """,
                (
                    claim['claimreference'], claim['country'], claim['financialyear'], claim['articletype'], claim['claimtype'],
                    claim['claimstatus'], claim['targetdate'], claim['deadline'], claim['datereceived'],
                    json.dumps(claim['invoicesnumber']), json.dumps(claim['claimamount']), claim['claimcost'], claim['agebracket']
                )
            )
            claim_id = cursor.fetchone()[0]
            
            for invoice in claim['invoices']:
                cursor.execute(
                    """
                    INSERT INTO invoices (claimid, invoicereference, amount, startdate, enddate, status, person, contestationreason)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        claim_id, invoice['invoicereference'], invoice['amount'], invoice['startdate'], invoice['enddate'],
                        invoice['status'], json.dumps(invoice['person']), invoice['contestationreason']
                    )
                )
                
                # Insert person data into persons table
                person = invoice['person']
                cursor.execute(
                    """
                    INSERT INTO persons (lastname, firstname, dob, uniqueid, address, entitlements, treatments, agebracket, articletype)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        person['lastname'], person['firstname'], json.dumps(person['dob']),
                        json.dumps(person['uniqueid']), json.dumps(person['address']),
                        json.dumps(person['entitlements']), json.dumps(person['treatments']),
                        person['agebracket'], person['articletype']
                    )
                )
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Data inserted successfully")
    except psycopg2.Error as e:
        print(f"Error inserting data: {e}")

# Generate and insert claims
claims = generate_claims(500)
print(claims[:5])  # Print the first 5 claims to verify
try:
    insert_claims_into_db(claims, db_params)
    print("Data inserted successfully")
except psycopg2.Error as e:
    print(f"Error inserting data: {e}")
