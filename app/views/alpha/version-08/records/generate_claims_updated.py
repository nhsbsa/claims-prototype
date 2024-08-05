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

country_currency_map = {
    "Austria": "EUR",
    "Bulgaria": "BGN",
    "Cyprus": "EUR",
    "Denmark": "DKK",
    "Estonia": "EUR",
    "Finland": "EUR",
    "France": "EUR",
    "Germany": "EUR",
    "Hungary": "HUF",
    "Iceland": "ISK",
    "Italy": "EUR",
    "Latvia": "EUR",
    "Liechtenstein": "CHF",
    "Lithuania": "EUR",
    "Malta": "EUR",
    "Netherlands": "EUR",
    "Norway": "NOK",
    "Portugal": "EUR",
    "Republic of Ireland": "EUR",
    "Slovakia": "EUR",
    "Sweden": "SEK"
}

rina_countries = [
    "Austria", "Bulgaria", "Cyprus", "Denmark", "Estonia", "Finland", "France", "Germany", 
    "Hungary", "Iceland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Malta", 
    "Netherlands", "Norway", "Portugal", "Republic of Ireland", "Slovakia", "Sweden"
]

average_cost_countries = ["Cyprus", "Malta", "Portugal", "Spain", "Sweden"]

average_claim_articles = {
    "Article 63 (2a)": ["Insured person S1 entitlements"],
    "Article 63 (2b)": ["Pensioner S1 entitlements"],
    "Article 63": ["Dependants S1 entitlements (0-19)", "Dependants S1 entitlements (20-64)"],
    "Article 65": ["Pensioner S1 entitlements (65+)"],
    "Article 94": ["Worker S1 entitlements"],
    "Article 95": ["Pensioner S1 entitlements"]
}

actual_claim_articles = {
    "AW03": ["Injuries in the workplace DA1 entitlements"],
    "Article 62(36)": ["Injuries in the workplace DA1 entitlements"],
    "Article 20(2)": ["Scheduled treatment S2 entitlements"],
    "Article 62": ["Tourist EHIC", "Tourist PRC", "Worker S1 entitlements", "Dependant S1 entitlements", "Pensioner S1 entitlements"],
    "Article 94": ["Worker S1 entitlements"],
    "Article 95": ["Pensioner S1 entitlements"]
}

def generate_dates_within_year(year):
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    return random_date

def generate_person(country_name, claim_date, article_type, entitlement_type, is_main_claim=True):
    age = random.randint(60, 90) if is_main_claim else random.randint(0, 89)
    birth_year = claim_date.year - age
    birth_month = random.randint(1, 12)
    birth_day = random.randint(1, 28)

    medicalcarecosts = round(random.uniform(100, 999.99), 2)
    medicinecosts = round(random.uniform(100, 999.99), 2)
    totalcost = round(medicalcarecosts + medicinecosts, 2)

    person = {
        "lastname": fake.last_name(),
        "firstname": fake.first_name(),
        "dob": {
            "day": birth_day,
            "month": birth_month,
            "year": birth_year,
            "formatted": datetime(birth_year, birth_month, birth_day).strftime('%d %B %Y')
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
                "totalcost": totalcost,
                "medicalcarecosts": medicalcarecosts,
                "medicinecosts": medicinecosts,
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
                },
                "benefits": random.choice(['01 - Sickness', '02 - Treatment', '03 - Injury', '04 - Disability'])
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
        "agebracket": "65 years and over" if age >= 65 else "20 to 64 years" if age >= 20 else "0 to 19 years",
        "articletype": article_type
    }

    debtor_info = {
        "EHIC": ("Department of Health and Social Care", f"UK{fake.numerify('###')}"),
        "PRC": ("Department of Health and Social Care", f"UK{fake.numerify('###')}"),
        "S1": ("Department of Work and Pensions", fake.numerify('#####')),
        "S2": ("Department of Work and Pensions", fake.numerify('#####')),
        "DA1": ("Department of Work and Pensions", fake.numerify('#####'))
    }

    # Handle specific entitlement_type keys
    if 'DA1' in entitlement_type:
        key = 'DA1'
    elif 'S1' in entitlement_type:
        key = 'S1'
    elif 'S2' in entitlement_type:
        key = 'S2'
    elif 'PRC' in entitlement_type:
        key = 'PRC'
    elif 'EHIC' in entitlement_type:
        key = 'EHIC'
    else:
        raise KeyError(f"Unknown entitlement type: {entitlement_type}")

    ent = {
        "type": entitlement_type,
        "holder": random.choice(["Main", "Dependant"]),
        "status": random.choice(["Issued", "Inactive", "Rejected", "Expired"]),
        "debtorname": debtor_info[key][0],
        "debtorid": debtor_info[key][1]
    }

    ent["start"] = {
        "day": claim_date.day,
        "month": claim_date.month,
        "year": claim_date.year,
        "formatted": claim_date.strftime('%d %B %Y')
    }
    end_date = claim_date + timedelta(days=random.randint(1, 730))
    ent["end"] = {
        "day": end_date.day,
        "month": end_date.month,
        "year": end_date.year,
        "formatted": end_date.strftime('%d %B %Y')
    }
    issued_date = claim_date - timedelta(days=random.randint(1, 365))
    ent["issued"] = {
        "day": issued_date.day,
        "month": issued_date.month,
        "year": issued_date.year,
        "formatted": issued_date.strftime('%d %B %Y')
    }

    if entitlement_type == 'EHIC':
        ent["form"] = "Tourist"
        ent["pin"] = f"CRA{fake.numerify('######')}"
        ent["issuenumber"] = fake.numerify('####################')
    elif entitlement_type == 'PRC':
        ent["form"] = "Tourist"
        ent["issuenumber"] = fake.numerify('####################')
    elif entitlement_type == 'S1':
        ent["form"] = random.choice(['Worker', 'Pensioner', 'Dependant'])
    elif entitlement_type == 'S2':
        ent["form"] = 'Scheduled treatment'
    elif entitlement_type == 'DA1':
        ent["form"] = 'Industrial Injuries Disablement Benefit'

    person['entitlements'].append(ent)

    return person

def generate_claim_reference(country, article_type, claim_year, claim_month, claim_day):
    unique_id = str(uuid.uuid4())[:8]
    random_number = fake.numerify(text="######")
    year_full = claim_year
    year_short = claim_year % 100
    month_full = f"{claim_month:02d}"
    day_full = f"{claim_day:02d}"

    ref_formats = {
        "Austria": f"AT-UK/{year_short}-{random_number}",
        "Bulgaria": f"BG{year_full}-{random_number[:4]}",
        "Cyprus": f"CY-{year_short}-{random_number}",
        "Denmark": f"DK-{random_number[:4]}-{year_full}",
        "Estonia": f"EE{random_number[:5]}{year_short}",
        "Finland": f"FI-{random_number[:3]}-{year_full}",
        "France": f"FR{random_number[:5]}{year_short}{random_number[:3]}",
        "Germany": f"DE{year_short}-{random_number[:5]}",
        "Hungary": f"HU-{year_full}{random_number[:4]}",
        "Iceland": f"IS-{random_number[:3]}-{year_short}",
        "Italy": f"IT-{random_number[:3]}-{year_full}",
        "Latvia": f"LV-{year_full}-{random_number[:5]}",
        "Liechtenstein": f"LI-{year_short}{random_number[:4]}",
        "Lithuania": f"LT-{random_number[:4]}-{year_full}",
        "Malta": f"MT-{random_number[:3]}-{year_full}",
        "Netherlands": f"NL-{random_number[:4]}-{year_full}",
        "Norway": f"NO{year_short}{random_number[:4]}",
        "Portugal": f"PT-{year_short}{random_number[:4]}",
        "Republic of Ireland": f"IE-{random_number[:4]}{year_full}",
        "Slovakia": f"SK-{random_number[:4]}{year_full}",
        "Sweden": f"SE-{random_number[:5]}-{year_short}"
    }

    default_format = f"{country[:2]}-{article_type[:3]}-{year_full}-{random_number}"

    return ref_formats.get(country, default_format)

def generate_invoice_id(country, article_type, claim_year):
    random_number = random.randint(100000, 999999)
    country_codes = {
        "Austria": "AT",
        "Bulgaria": "BG",
        "Cyprus": "CY",
        "Denmark": "DK",
        "Estonia": "EE",
        "Finland": "FI",
        "France": "FR",
        "Germany": "DE",
        "Hungary": "HU",
        "Iceland": "IS",
        "Italy": "IT",
        "Latvia": "LV",
        "Liechtenstein": "LI",
        "Lithuania": "LT",
        "Malta": "MT",
        "Netherlands": "NL",
        "Norway": "NO",
        "Portugal": "PT",
        "Republic of Ireland": "IE",
        "Slovakia": "SK",
        "Sweden": "SE"
    }

    return f"{country_codes.get(country, 'XX')}-{random_number}"

def calculate_invoice_amount(claim_cost, start_date, end_date):
    if claim_cost == "Average":
        # Calculate number of months between start and end dates
        return (end_date.year - start_date.year) * 12 + end_date.month - start_date.month + 1
    else:
        # Return a random monetary value
        return round(random.uniform(1000, 5000), 2)

def generate_invoice(claim_cost, article_name, country_name, claim_date):
    if claim_cost == "Actual":
        article_type = random.choice(list(actual_claim_articles.keys()))
        entitlement_type = random.choice(actual_claim_articles[article_type])
    else:
        article_type = random.choice(list(average_claim_articles.keys()))
        entitlement_type = random.choice(average_claim_articles[article_type])

    person = generate_person(country_name, claim_date, article_type, entitlement_type)
    invoice_id = generate_invoice_id(country_name, article_type, claim_date.year)
    status_choices = ["To Check", "Accepted", "Contested", "Withdrawn"]
    status = random.choice(status_choices)
    invoice_start_date = claim_date + timedelta(days=random.randint(-30, 0))
    invoice_end_date = invoice_start_date + timedelta(days=random.randint(10, 100))

    amount = calculate_invoice_amount(claim_cost, invoice_start_date, invoice_end_date)

    amounts = {
        "accepted": amount if status == "Accepted" else 0,
        "contested": amount if status == "Contested" else 0,
        "withdrawn": amount if status == "Withdrawn" else 0
    }

    if status == "To Check":
        accepted_amount = round(random.uniform(100, amount), 2)
        contested_amount = amount - accepted_amount
        amounts["accepted"] = accepted_amount
        amounts["contested"] = contested_amount

    foreigninstitutionname = "Foreign Institution Name"  # Adjust as needed
    foreigninstitutionid = fake.numerify('##########')
    recorded_date = claim_date.strftime('%Y-%m-%d')

    invoice = {
        "country": country_name,
        "invoicereference": invoice_id,
        "amount": amount,
        "startdate": invoice_start_date.strftime('%Y-%m-%d'),
        "enddate": invoice_end_date.strftime('%Y-%m-%d'),
        "status": status,
        "person": person,
        "articletype": article_type,
        "contestationreason": random.choice([
            "This document does not concern us.",
            "Institution code is incorrect. Please provide correct institution code.",
            "Unable to identify the person from the information provided. Please check.",
            "Entitlement document is unknown or not found. Please provide copy.",
            "Scheduled treatment may be suspected. Please check.",
            "There is an overlapping in hospitalisation periods. Please adjust the claim.",
            "Person was not insured during benefits period. Please provide copy of entitlement document.",
            "The period of benefits in kind is not covered by the entitlement period.",
            "The period of benefits in kind is partially covered by the entitlement period. Please adjust the claim.",
            "The costs are to be settled by lump-sum as from [date should be filled in].",
            "The costs are to be settled by lump-sum until [date should be filled in].",
            "The person is not registered on the entitlement document.",
            "The entitlement document has not been registered.",
            "Double invoice [duplicated invoice number should be filled in].",
            "The entitlement in the state of residence started on [date should be filled in].",
            "The benefits seem to concern an accident at work that happened on [date should be filled in].",
            "The person died on [date should be filled in].",
            "Lack of information about the other benefits provided. Please specify.",
            "Total amount of claim different to the sum of individual claims.",
            "Total amount of individual claim different to the sum of benefits.",
            "Cost of benefits have been refunded in full or partially to the insured person.",
            "Claim introduced after deadline [date should be filled in].",
            "Contestation reply received after deadline [date should be filled in].",
            "Other"
        ]) if status == "Contested" else None,
        "period": {
            "start": invoice_start_date.strftime('%d %B %Y'),
            "end": invoice_end_date.strftime('%d %B %Y')
        },
        "amounts": amounts,
        "recorded": recorded_date,
        "foreigninstitutionname": foreigninstitutionname,
        "foreigninstitutionid": foreigninstitutionid
    }

    return invoice

def calculate_invoice_stats(invoices):
    stats = {
        "total": len(invoices),
        "toCheck": len([inv for inv in invoices if inv['status'] == "To Check"]),
        "accepted": len([inv for inv in invoices if inv['status'] == "Accepted"]),
        "contested": len([inv for inv in invoices if inv['status'] == "Contested"]),
        "withdrawn": len([inv for inv in invoices if inv['status'] == "Withdrawn"]),
    }
    return stats

def calculate_claim_amount(invoices):
    amounts = {
        "total": sum(inv['amount'] for inv in invoices),
        "toCheck": sum(inv['amount'] for inv in invoices if inv['status'] == "To Check"),
        "accepted": sum(inv['amount'] for inv in invoices if inv['status'] == "Accepted"),
        "contested": sum(inv['amount'] for inv in invoices if inv['status'] == "Contested"),
        "withdrawn": sum(inv['amount'] for inv in invoices if inv['status'] == "Withdrawn"),
    }
    return amounts

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
            "agebracket": "65 years and over" if random.randint(60, 90) >= 65 else "20 to 64 years",
            "period": "First half year" if claim_date.month <= 6 else "Second half year"
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

