import json
import uuid
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from faker import Faker
import psycopg2

fake = Faker()

# Database connection settings
db_params = {
    'database': 'my_new_database',
    'user': 'postgres',
    'password': 'CrystalClearQuartz9785',
    'host': 'localhost',
    'port': '5432'
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
            agebracket VARCHAR(255) NOT NULL,
            period VARCHAR(255)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS invoices (
            invoiceid SERIAL PRIMARY KEY,
            claimid INT NOT NULL,
            country VARCHAR(255) NOT NULL,
            invoicereference VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            startdate DATE NOT NULL,
            enddate DATE NOT NULL,
            status VARCHAR(255) NOT NULL,
            person JSONB NOT NULL,
            contestationreason TEXT,
            amounts JSONB,
            recorded DATE NOT NULL,
            foreigninstitutionname VARCHAR(255) NOT NULL,
            foreigninstitutionid VARCHAR(10) NOT NULL,
            FOREIGN KEY (claimid) REFERENCES claims (claimid) ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS persons (
            personid SERIAL PRIMARY KEY,
            lastname VARCHAR(255) NOT NULL,
            firstname VARCHAR(255) NOT NULL,
            dob JSONB NOT NULL,
            dob_day INT NOT NULL,
            dob_month INT NOT NULL,
            dob_year INT NOT NULL,
            dob_formatted VARCHAR(255) NOT NULL,
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
    except Exception as e:
        print(f"Error creating tables: {e}")

# Ensure tables are created
create_tables(db_params)

# Map for foreign institution names based on country
# Map for foreign institution names based on country
foreign_institution_names = {
    "Austria": [
        "Allgemeines Krankenhaus der Stadt Wien", 
        "Landesklinikum Wiener Neustadt", 
        "Universitätsklinikum Graz"
    ],
    "Bulgaria": [
        "Pirogov Hospital Sofia", 
        "Tokuda Hospital Sofia", 
        "University Hospital St. Marina"
    ],
    "Cyprus": [
        "Nicosia General Hospital", 
        "Limassol General Hospital", 
        "Larnaca General Hospital"
    ],
    "Denmark": [
        "Rigshospitalet", 
        "Odense University Hospital", 
        "Aarhus University Hospital"
    ],
    "Estonia": [
        "Tartu University Hospital", 
        "North Estonia Medical Centre", 
        "Pärnu Hospital"
    ],
    "Finland": [
        "Helsinki University Hospital", 
        "Turku University Hospital", 
        "Tampere University Hospital"
    ],
    "France": [
        "Hôpital de la Pitié-Salpêtrière", 
        "Centre Hospitalier Universitaire de Bordeaux", 
        "Hôpital Necker-Enfants Malades"
    ],
    "Germany": [
        "Charité – Universitätsmedizin Berlin", 
        "Universitätsklinikum Heidelberg", 
        "Klinikum der Universität München"
    ],
    "Hungary": [
        "Semmelweis University Hospital", 
        "University of Debrecen Clinical Center", 
        "Bajcsy-Zsilinszky Hospital"
    ],
    "Iceland": [
        "Landspítali University Hospital", 
        "Akureyri Hospital", 
        "Reykjavík City Hospital"
    ],
    "Italy": [
        "Ospedale San Raffaele", 
        "Policlinico Universitario A. Gemelli", 
        "Ospedale Niguarda"
    ],
    "Latvia": [
        "Pauls Stradins Clinical University Hospital", 
        "Riga East Clinical University Hospital", 
        "Children's Clinical University Hospital"
    ],
    "Liechtenstein": [
        "Liechtensteinisches Landesspital", 
        "Rehazentrum Valens", 
        "St. Gallen Regional Hospital"
    ],
    "Lithuania": [
        "Vilnius University Hospital Santaros Klinikos", 
        "Kaunas Clinics", 
        "Klaipeda University Hospital"
    ],
    "Malta": [
        "Mater Dei Hospital", 
        "Gozo General Hospital", 
        "St. James Hospital"
    ],
    "Netherlands": [
        "Erasmus MC", 
        "Amsterdam UMC", 
        "Leiden University Medical Center"
    ],
    "Norway": [
        "Oslo University Hospital", 
        "Haukeland University Hospital", 
        "St. Olavs Hospital"
    ],
    "Portugal": [
        "Hospital de Santa Maria", 
        "Centro Hospitalar de São João", 
        "Hospital da Luz"
    ],
    "Republic of Ireland": [
        "Mater Misericordiae University Hospital", 
        "St. James's Hospital", 
        "Beaumont Hospital"
    ],
    "Slovakia": [
        "National Institute of Cardiovascular Diseases", 
        "University Hospital Bratislava", 
        "Children’s University Hospital Bratislava"
    ],
    "Sweden": [
        "Karolinska University Hospital", 
        "Sahlgrenska University Hospital", 
        "Skåne University Hospital"
    ],
    "Spain": [
        "Hospital Clínic de Barcelona", 
        "Hospital Universitario La Paz", 
        "Hospital General Universitario Gregorio Marañón"
    ],
    "Switzerland": [
        "University Hospital Zurich", 
        "Geneva University Hospitals", 
        "Inselspital Bern"
    ],
    "Belgium": [
        "UZ Leuven", 
        "UZ Brussel", 
        "Cliniques Universitaires Saint-Luc"
    ],
    "Greece": [
        "Evangelismos Hospital", 
        "Attikon University Hospital", 
        "General Hospital of Thessaloniki"
    ],
    "Luxembourg": [
        "Centre Hospitalier de Luxembourg", 
        "Hôpital Kirchberg", 
        "Clinique Bohler"
    ],
    "Czech Republic": [
        "General University Hospital in Prague", 
        "Motol University Hospital", 
        "St. Anne's University Hospital"
    ],
    "Poland": [
        "Central Clinical Hospital of the Medical University of Warsaw", 
        "University Hospital in Krakow", 
        "Wroclaw Medical University Hospital"
    ],
    "Romania": [
        "Emergency Clinical Hospital Bucharest", 
        "Coltea Clinical Hospital", 
        "Floreasca Emergency Hospital"
    ],
    "Slovenia": [
        "University Medical Centre Ljubljana", 
        "Maribor University Medical Centre", 
        "Celje General Hospital"
    ],
    "Croatia": [
        "University Hospital Centre Zagreb", 
        "Clinical Hospital Dubrava", 
        "Sisters of Charity University Hospital"
    ]
}

def generate_foreign_institution_name(country):
    return random.choice(foreign_institution_names.get(country, ["General Hospital"]))

def generate_invoice_id():
    return random.randint(20000000, 20009999)

def generate_invoicereference():
    return str(random.randint(1000000000, 9999999999))

def generate_invoice(claim_cost, article_name, country_name, claim_date):
    if claim_cost == "Actual":
        article_type = random.choice(list(actual_claim_articles.keys()))
        entitlement_type = random.choice(actual_claim_articles[article_type])
        costtype = random.choice(["Sickness", "Accident at work"])
        costcode = "S BUC 19" if costtype == "Sickness" else "AW BUC 05"
    else:
        article_type = random.choice(list(average_claim_articles.keys()))
        entitlement_type = random.choice(average_claim_articles[article_type])
        costtype = "Sickness"
        costcode = "S BUC 21"

    person = generate_person(country_name, claim_date, article_type, entitlement_type)
    invoice_id = generate_invoice_id()
    invoicereference = generate_invoicereference()
    status = random.choice(["To Check", "Accepted", "Contested"])
    invoice_start_date = claim_date + timedelta(days=random.randint(-30, 0))
    invoice_end_date = invoice_start_date + timedelta(days=random.randint(10, 100))

    amount = calculate_invoice_amount(claim_cost, invoice_start_date, invoice_end_date)

    amounts = {
        "accepted": amount if status == "Accepted" else 0,
        "contested": amount if status == "Contested" else 0,
        "withdrawn": 0
    }

    contestationreason = random.choice([
        "None - invoice accepted",
        "This document does not concern us",
        "Institution code is incorrect. Please provide correct institution code.",
        "Unable to identify the person from the information provided. Please check.",
        "Entitlement document is unknown or not found. Please provide copy.",
        "Scheduled treatment may be suspected. Please check.",
        "There is an overlapping in hospitalisation periods. Please adjust the claim.",
        "Person was not insured during benefits period. Please provide copy of entitlement document.",
        "The period of benefits in kind is not covered by the entitlement period",
        "The period of benefits in kind is partially covered by the entitlement period. Please adjust the claim.",
        "The costs are to be settled by lump-sum as from",
        "The costs are to be settled by lump-sum until",
        "The person is not registered on the entitlement document",
        "The entitlement document has not been registered.",
        "Double invoice",
        "The entitlement in the state of residence started on",
        "The benefits seem to concern an accident at work that happened on",
        "The person died on",
        "Lack of information about the other benefits provided. Please specify",
        "Total amount of claim different to the sum of individual claims",
        "Total amount of individual claim different to the sum of benefits",
        "Cost of benefits have been refunded in full or partially to the insured person",
        "Claim introduced after deadline",
        "Contestation reply received after deadline",
        "Other"
    ]) if status == "Contested" else "None - invoice accepted"

    invoice = {
        "country": country_name,
        "invoicereference": invoicereference,
        "amount": amount,
        "startdate": invoice_start_date.strftime('%Y-%m-%d'),
        "enddate": invoice_end_date.strftime('%Y-%m-%d'),
        "status": status,
        "person": person,
        "articletype": article_type,
        "contestationreason": contestationreason,
        "period": {
            "start": invoice_start_date.strftime('%d %B %Y'),
            "end": invoice_end_date.strftime('%d %B %Y')
        },
        "amounts": amounts,
        "recorded": claim_date.strftime('%Y-%m-%d'),
        "foreigninstitutionname": generate_foreign_institution_name(country_name),
        "foreigninstitutionid": fake.numerify('##########')
    }

    return invoice

def generate_claims(num_claims):
    claims = []
    for _ in range(num_claims):
        country = random.choice(rina_countries)
        claim_date = generate_dates_within_year(random.randint(2011, 2023))
        claim_reference = generate_claim_reference(country, "Article", claim_date.year, claim_date.month, claim_date.day)
        claim_type = random.choice(["Main", "Supplementary"])
        claim_cost = "Actual" if country not in average_cost_countries else random.choice(["Average", "Actual"])
        invoices = [generate_invoice(claim_cost, "Article", country, claim_date) for _ in range(random.randint(10, 99))]
        status = random.choice(["Active", "Not started"])
        agebracket = random.choice(["65 years and over", "20 to 64 years", "Combination"]) if claim_cost == "Average" else "65 years and over" if random.randint(60, 90) >= 65 else "20 to 64 years"
        
        claim_period = "First half year" if claim_date.month <= 6 else "Second half year"
        if claim_type == "Supplementary":
            claim_period = "Second half year"
        
        for invoice in invoices:
            if invoice['status'] in ["To Check", "Contested"]:
                status = "Active"
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
            "agebracket": agebracket,
            "period": claim_period
        }
        
        # Duplicate some invoices
        if random.choice([True, False]):
            duplicate_invoice = random.choice(invoices)
            duplicate_invoice["invoiceid"] = generate_invoice_id()
            duplicate_invoice["invoicereference"] = generate_invoicereference()
            claim["invoices"].append(duplicate_invoice)
        
        claims.append(claim)
    return claims

def insert_claims_into_db(claims, db_params):
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        
        for claim in claims:
            cursor.execute(
                """
                INSERT INTO claims (claimreference, country, financialyear, articletype, claimtype, claimstatus, targetdate, deadline, datereceived, invoicesnumber, claimamount, claimcost, agebracket, period)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING claimid;
                """,
                (
                    claim['claimreference'], claim['country'], claim['financialyear'], claim['articletype'], claim['claimtype'],
                    claim['claimstatus'], claim['targetdate'], claim['deadline'], claim['datereceived'],
                    json.dumps(claim['invoicesnumber']), json.dumps(claim['claimamount']), claim['claimcost'], claim['agebracket'],
                    claim['period']
                )
            )
            claim_id = cursor.fetchone()[0]
            
            for invoice in claim['invoices']:
                cursor.execute(
                    """
                    INSERT INTO invoices (claimid, country, invoicereference, amount, startdate, enddate, status, person, contestationreason, amounts, recorded, foreigninstitutionname, foreigninstitutionid)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        claim_id, invoice['country'], invoice['invoicereference'], invoice['amount'], invoice['startdate'], invoice['enddate'],
                        invoice['status'], json.dumps(invoice['person']), invoice['contestationreason'], json.dumps(invoice['amounts']),
                        invoice['recorded'], invoice['foreigninstitutionname'], invoice['foreigninstitutionid']
                    )
                )
                
                # Insert person data into persons table
                person = invoice['person']
                cursor.execute(
                    """
                    INSERT INTO persons (lastname, firstname, dob, dob_day, dob_month, dob_year, dob_formatted, uniqueid, address, entitlements, treatments, agebracket, articletype)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        person['lastname'], person['firstname'], json.dumps(person['dob']), person['dob']['day'], person['dob']['month'], person['dob']['year'], person['dob']['formatted'],
                        json.dumps(person['uniqueid']), json.dumps(person['address']),
                        json.dumps(person['entitlements']), json.dumps(person['treatments']),
                        person['agebracket'], person['articletype']
                    )
                )
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Data inserted successfully")
    except Exception as e:
        print(f"Error inserting data: {e}")

# Generate and insert claims
claims = generate_claims(900)
insert_claims_into_db(claims, db_params)

# Save generated data to a JSON file
with open('claims_new_data.json', 'w') as file:
    json.dump({"claims": claims}, file, indent=4)
