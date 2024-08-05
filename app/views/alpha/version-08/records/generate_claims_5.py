import json
import uuid
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from faker import Faker
import psycopg2
import os

fake = Faker()

# Determine if running in production
is_production = os.getenv('DATABASE_URL') is not None

# Database connection settings
db_params = {
    'dbname': 'my_new_database',
    'user': 'postgres',
    'password': 'CrystalClearQuartz9785',
    'host': 'localhost',
    'port': '5432'
}

if is_production:
    db_params = {
        'dbname': os.getenv('DATABASE_URL').split('/')[-1],
        'user': os.getenv('DATABASE_URL').split(':')[1][2:],
        'password': os.getenv('DATABASE_URL').split(':')[2].split('@')[0],
        'host': os.getenv('DATABASE_URL').split('@')[1].split(':')[0],
        'port': os.getenv('DATABASE_URL').split(':')[-1].split('/')[0]
    }

# Function to create tables if they don't exist
def create_tables():
    commands = (
        """
        CREATE TABLE IF NOT EXISTS claims (
            claimid SERIAL PRIMARY KEY,
            claimreference VARCHAR(255),
            country VARCHAR(255),
            financialyear INT,
            articletype VARCHAR(255),
            claimtype VARCHAR(255),
            claimstatus VARCHAR(255),
            targetdate DATE,
            deadline DATE,
            datereceived DATE,
            invoicesnumber JSONB,
            claimamount JSONB,
            claimcost VARCHAR(255),
            agebracket VARCHAR(255)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS invoices (
            invoiceid SERIAL PRIMARY KEY,
            claimid INT REFERENCES claims(claimid),
            invoicereference VARCHAR(255),
            amount NUMERIC,
            date DATE,
            status VARCHAR(255),
            person JSONB,
            contestationreason TEXT
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS persons (
            personid SERIAL PRIMARY KEY,
            lastname VARCHAR(255),
            firstname VARCHAR(255),
            dob JSONB,
            uniqueid JSONB,
            address JSONB,
            entitlements JSONB,
            treatments JSONB,
            agebracket VARCHAR(255),
            articletype VARCHAR(255)
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

# Create tables
create_tables()

# Mapping for currency based on country
country_currency_map = {
    "Austria": "EUR", "Bulgaria": "BGN", "Cyprus": "EUR", "Denmark": "DKK", "Estonia": "EUR",
    "Finland": "EUR", "France": "EUR", "Germany": "EUR", "Hungary": "HUF", "Iceland": "ISK",
    "Italy": "EUR", "Latvia": "EUR", "Liechtenstein": "CHF", "Lithuania": "EUR", "Malta": "EUR",
    "Netherlands": "EUR", "Norway": "NOK", "Portugal": "EUR", "Republic of Ireland": "EUR",
    "Slovakia": "EUR", "Sweden": "SEK"
}

def generate_dates_within_year(year):
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    return random_date

def generate_person(country_name, claim_date, article_type, is_main_claim=True):
    age = random.randint(60, 90) if is_main_claim else random.randint(0, 89)
    birth_year = claim_date.year - age
    birth_month = random.randint(1, 12)
    birth_day = random.randint(1, 28)  # Simplify for example purposes, adjust as needed for actual month/day logic

    person = {
        "lastname": fake.last_name(),
        "firstname": fake.first_name(),
        "dob": {
            "day": birth_day,
            "month": birth_month,
            "year": birth_year,
            "formatted": datetime(birth_year, birth_month, birth_day).strftime('%d %B %Y')  # Formatted DOB
        },
        "uniqueid": {
            "ohs": fake.numerify('########'),
            "nino": f"{fake.random_uppercase_letter()}{fake.random_uppercase_letter()} {fake.numerify('## ## ##')} {fake.random_uppercase_letter()}",
            "nhs": fake.numerify('##########')
        },
        "address": {
            "firstline": fake.street_address(),
            "secondline": "",
            "city": fake.city(),
            "postcode": fake.postcode(),
            "residencecountry": country_name
        },
        "entitlements": [],
        "treatments": {
            "details": {
                "total": round(random.uniform(100, 999.99), 2),
                "currencycode": country_currency_map.get(country_name, "EUR"),
                "start": {
                    "day": claim_date.day,
                    "month": claim_date.month,
                    "year": claim_date.year,
                    "formatted": claim_date.strftime('%d %B %Y')
                },
                "end": {
                    "day": (claim_date + timedelta(days=random.randint(10, 100))).day,
                    "month": (claim_date + timedelta(days=random.randint(10, 100))).month,
                    "year": (claim_date + timedelta(days=random.randint(10, 100))).year,
                    "formatted": (claim_date + timedelta(days=random.randint(10, 100))).strftime('%d %B %Y')
                }
            },
            "hospitalisation": {
                "cost": round(random.uniform(100, 999.99), 2),
                "start": {
                    "day": claim_date.day,
                    "month": claim_date.month,
                    "year": claim_date.year,
                    "formatted": claim_date.strftime('%d %B %Y')
                },
                "end": {
                    "day": (claim_date + timedelta(days=random.randint(1, 9))).day,
                    "month": (claim_date + timedelta(days=random.randint(1, 9))).month,
                    "year": (claim_date + timedelta(days=random.randint(1, 9))).year,
                    "formatted": (claim_date + timedelta(days=random.randint(1, 9))).strftime('%d %B %Y')
                }
            }
        },
        "agebracket": "65+" if age >= 65 else "20-64" if age >= 20 else "0-19",
        "articletype": article_type
    }

    entitlement_types = ['GHIC', 'EHIC', 'PRC', 'S1', 'DA1']
    debtor_info = {
        "GHIC": ("DHSC", f"UK{fake.numerify('###')}"),
        "EHIC": ("DHSC", f"UK{fake.numerify('###')}"),
        "PRC": ("DHSC", f"UK{fake.numerify('###')}"),
        "S1": ("DWP", fake.numerify('#####')),
        "S2": ("DWP", fake.numerify('#####')),
        "DA1": ("DWP", fake.numerify('#####'))
    }

    for _ in range(random.randint(1, 3)):
        ent_type = random.choice(entitlement_types)
        issue_date = claim_date
        ent = {
            "type": ent_type,
            "holder": random.choice(["Main", "Dependant"]),
            "status": random.choice(["Issued", "Inactive", "Rejected", "Expired"]),
            "debtorname": debtor_info[ent_type][0],
            "debtorid": debtor_info[ent_type][1]
        }

        if ent_type in ['GHIC', 'EHIC']:
            ent["form"] = "Tourist"
            ent["pin"] = f"{country_name[:2].upper()}{fake.numerify('######')}"
            ent["issuenumber"] = fake.numerify('##')
            ent["start"] = {
                "day": issue_date.day,
                "month": issue_date.month,
                "year": issue_date.year,
                "formatted": issue_date.strftime('%d %B %Y')
            }
            ent["end"] = {
                "day": (issue_date + timedelta(days=365*5)).day,
                "month": (issue_date + timedelta(days=365*5)).month,
                "year": (issue_date + timedelta(days=365*5)).year,
                "formatted": (issue_date + timedelta(days=365*5)).strftime('%d %B %Y')
            }
            ent["issued"] = {
                "day": issue_date.day,
                "month": issue_date.month,
                "year": issue_date.year,
                "formatted": issue_date.strftime('%d %B %Y')
            }

        if ent_type == 'PRC':
            ent["form"] = "Tourist"
            ent["issuenumber"] = fake.numerify('##')
            ent["start"] = {
                "day": issue_date.day,
                "month": issue_date.month,
                "year": issue_date.year,
                "formatted": issue_date.strftime('%d %B %Y')
            }
            ent["end"] = {
                "day": (issue_date + timedelta(days=random.randint(1, 90))).day,
                "month": (issue_date + timedelta(days=random.randint(1, 90))).month,
                "year": (issue_date + timedelta(days=random.randint(1, 90))).year,
                "formatted": (issue_date + timedelta(days=random.randint(1, 90))).strftime('%d %B %Y')
            }

        if ent_type in ['S1', 'S2']:
            ent["form"] = 'Scheduled treatment' if ent_type == 'S2' else random.choice(['Worker', 'Pensioner', 'Dependant'])
            ent["start"] = {
                "day": issue_date.day,
                "month": issue_date.month,
                "year": issue_date.year,
                "formatted": issue_date.strftime('%d %B %Y')
            }
            ent["end"] = {
                "day": (issue_date + timedelta(days=random.randint(365, 365*5))).day,
                "month": (issue_date + timedelta(days=random.randint(365, 365*5))).month,
                "year": (issue_date + timedelta(days=random.randint(365, 365*5))).year,
                "formatted": (issue_date + timedelta(days=random.randint(365, 365*5))).strftime('%d %B %Y')
            }

        person["entitlements"].append(ent)

    return person

def calculate_claim_age_bracket(persons):
    age_ranges = {"0-19": 0, "20-64": 0, "65+": 0}
    for person in persons:
        age_bracket = person["agebracket"]
        age_ranges[age_bracket] += 1
    max_age_bracket = max(age_ranges, key=age_ranges.get)
    return max_age_bracket

def insert_data():
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()

        for _ in range(100):  # Adjust the range for more or fewer claims
            country = random.choice(list(country_currency_map.keys()))
            financial_year = random.randint(2010, 2024)
            claim_reference = f"PT-{uuid.uuid4()}"
            claim_date = generate_dates_within_year(financial_year)
            article_type = random.choice(["Article AW03", "Article 63(2a)", "Article 62"])

            persons = []
            for _ in range(random.randint(1, 5)):
                persons.append(generate_person(country, claim_date, article_type))

            age_bracket = calculate_claim_age_bracket(persons)

            claim = {
                "claimreference": claim_reference,
                "country": country,
                "financialyear": financial_year,
                "articletype": article_type,
                "claimtype": random.choice(["main", "supplementary"]),
                "claimstatus": random.choice(["Active", "Pending", "Closed"]),
                "targetdate": claim_date + relativedelta(months=+6),
                "deadline": claim_date + relativedelta(months=+12),
                "datereceived": claim_date,
                "invoicesnumber": {
                    "total": len(persons),
                    "toCheck": len(persons),
                    "accepted": 0,
                    "contested": 0,
                    "partial": 0,
                    "withdrawn": 0
                },
                "claimamount": {
                    "total": round(sum(p["treatments"]["details"]["total"] for p in persons), 2),
                    "toCheck": round(sum(p["treatments"]["details"]["total"] for p in persons), 2),
                    "accepted": 0,
                    "contested": 0,
                    "partial": 0,
                    "withdrawn": 0
                },
                "claimcost": random.choice(["average", "actual"]),
                "agebracket": age_bracket
            }

            # Insert claim
            cursor.execute(
                """
                INSERT INTO claims (
                    claimreference, country, financialyear, articletype, claimtype, claimstatus,
                    targetdate, deadline, datereceived, invoicesnumber, claimamount, claimcost, agebracket
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING claimid
                """,
                (
                    claim["claimreference"], claim["country"], claim["financialyear"], claim["articletype"],
                    claim["claimtype"], claim["claimstatus"], claim["targetdate"], claim["deadline"],
                    claim["datereceived"], json.dumps(claim["invoicesnumber"]), json.dumps(claim["claimamount"]),
                    claim["claimcost"], claim["agebracket"]
                )
            )
            claim_id = cursor.fetchone()[0]

            # Insert persons and invoices
            for person in persons:
                cursor.execute(
                    """
                    INSERT INTO invoices (
                        claimid, invoicereference, amount, date, status, person, contestationreason
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        claim_id, f"INV-{uuid.uuid4()}", person["treatments"]["details"]["total"],
                        generate_dates_within_year(financial_year), random.choice(["To Check", "Accepted", "Contested"]),
                        json.dumps(person), fake.text()
                    )
                )
                cursor.execute(
                    """
                    INSERT INTO persons (
                        lastname, firstname, dob, uniqueid, address, entitlements, treatments, agebracket, articletype
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        person["lastname"], person["firstname"], json.dumps(person["dob"]),
                        json.dumps(person["uniqueid"]), json.dumps(person["address"]),
                        json.dumps(person["entitlements"]), json.dumps(person["treatments"]),
                        person["agebracket"], person["articletype"]
                    )
                )

        conn.commit()
        cursor.close()
        conn.close()
        print("Data inserted successfully")
    except Exception as e:
        print(f"Error inserting data: {e}")

# Insert data
insert_data()
