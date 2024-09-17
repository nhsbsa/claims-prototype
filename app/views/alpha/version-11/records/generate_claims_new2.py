import json
import uuid
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from faker import Faker
import psycopg2
import copy
import calendar

fake = Faker()

# Database connection settings for local and Heroku
local_db_params = {
    'dbname': 'my_new_database',
    'user': 'postgres',
    'password': 'CrystalClearQuartz9785',
    'host': 'localhost',
    'port': '5432'
}

heroku_db_url = 'postgres://ubobgqoqej653q:pde17990d6bbb88adeeb3f31594400217457e4d7879a67747a4affd69ccad2648@c6b7lkfdshud3i.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com:5432/d8nvfikconvdqf'

heroku_db_params = {
    'dbname': heroku_db_url.split('/')[-1],
    'user': heroku_db_url.split(':')[1][2:],
    'password': heroku_db_url.split(':')[2].split('@')[0],
    'host': heroku_db_url.split('@')[1].split(':')[0],
    'port': heroku_db_url.split(':')[-1].split('/')[0]
}

# Create both tables in local and Heroku databases
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
            period VARCHAR(255) NOT NULL
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
            amounts JSONB NOT NULL,
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
            uniqueid JSONB NOT NULL,
            address JSONB NOT NULL,
            entitlements JSONB NOT NULL,
            treatments JSONB NOT NULL,
            invoices JSONB NOT NULL,
            agebracket VARCHAR(255) NOT NULL,
            articletype VARCHAR(255) NOT NULL,
            deceaseddate DATE
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
        print(f"Tables created successfully in {db_params['dbname']}")
    except Exception as e:
        print(f"Error creating tables in {db_params['dbname']}: {e}")

# Ensure tables are created in both local and Heroku databases
create_tables(local_db_params)
create_tables(heroku_db_params)

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

# Updated article types and entitlements based on current and old regulations
current_claim_articles = {
    "Article 63(2a)": {"claimcost": "Average", "entitlement": "Insured person S1"},
    "Article 63(2b)": {"claimcost": "Average", "entitlement": "Pensioner S1"},
    "AW03": {"claimcost": "Actual", "entitlement": "DA1"},
    "Article 62": {"claimcost": "Actual", "entitlement": ["Tourist EHIC", "Tourist PRC", "Worker S1", "Dependant S1", "Pensioner S1", "Pensioner S2"]}
}

old_claim_articles = {
    "Article 20(2)": {"claimcost": "Actual", "entitlement": "Scheduled treatment S2"},
    "Article 62(36)": {"claimcost": "Actual", "entitlement": "DA1"},
    "Article 65": {"claimcost": "Average", "entitlement": "Pensioner S1"},
    "Article 93": {"claimcost": "Actual", "entitlement": ["Tourist EHIC", "Tourist PRC"]},
    "Article 94": {"claimcost": "Actual", "entitlement": "Dependant of worker S1"},
    "Article 95": {"claimcost": "Average", "entitlement": "Pensioner S1"}
}

def generate_dates_within_year(year):
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    return random_date


# Modify the treatment details to include medicalcarecosts and medicinecosts
def generate_person(country_name, claim_date, article_type):
    age = random.randint(60, 90)
    birth_year = claim_date.year - age
    birth_month = random.randint(1, 12)
    birth_day = random.randint(1, 28)

    # Generate treatment details with medicalcarecosts and medicinecosts
    treatment_details = {
        "total": round(random.uniform(100, 999.99), 2),
        "medicalcarecosts": round(random.uniform(50, 499.99), 2),
        "medicinecosts": round(random.uniform(20, 299.99), 2),
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
    }

    hospitalisation_details = {
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

    treatments = {
        "details": treatment_details,
        "hospitalisation": hospitalisation_details
    }

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
        "agebracket": "65+" if age >= 65 else "20-64" if age >= 20 else "0-19",
        "articletype": article_type,
        "invoices": [],  # Empty initially, will be filled as invoices are generated
        "entitlements": [],  # Will be populated with multiple entitlements
        "treatments": treatments  # Populate treatments
    }

    # Generate entitlements with start and end dates
    entitlement_types = [
        {"type": "GHIC", "form": "Tourist"},
        {"type": "EHIC", "form": "Tourist"},
        {"type": "PRC", "form": "Tourist"},
        {"type": "S1", "form": random.choice(["Worker", "Pensioner", "Dependant"])},
        {"type": "S2", "form": "Scheduled treatment"},
        {"type": "DA1", "form": "Industrial Injuries"}
    ]
    random.shuffle(entitlement_types)
    num_entitlements = random.randint(5, 6)

    for i in range(num_entitlements):
        entitlement = entitlement_types[i % len(entitlement_types)]  # Now a dict with 'type' and 'form'
        entitlement_type = entitlement["type"]
        entitlement_form = entitlement["form"]

        debtor_info = {
            "GHIC": ("DHSC", f"UK{fake.numerify('###')}"),
            "EHIC": ("DHSC", f"UK{fake.numerify('###')}"),
            "PRC": ("DHSC", f"UK{fake.numerify('###')}"),
            "S1": ("DWP", fake.numerify('#####')),
            "S2": ("DWP", fake.numerify('#####')),
            "DA1": ("DWP", fake.numerify('#####'))
        }

        if entitlement_type not in debtor_info:
            raise KeyError(f"Debtor information for entitlement type '{entitlement_type}' not found.")

        debtorname, debtorid = debtor_info[entitlement_type]

        ent = {
            "type": entitlement_type,
            "form": entitlement_form,
            "holder": random.choice(["Main", "Dependant"]),
            "status": random.choice(["Issued", "Inactive", "Rejected", "Expired"]),
            "debtorname": debtorname,
            "debtorid": debtorid,
            "start": {
                "day": claim_date.day,
                "month": claim_date.month,
                "year": claim_date.year,
                "formatted": claim_date.strftime('%d %B %Y')
            },
            "country": country_name,  # Ensure country reflects the invoice country
            "end": {  # Always include the end date
                "day": (claim_date + timedelta(days=random.randint(90, 365))).day,
                "month": (claim_date + timedelta(days=random.randint(90, 365))).month,
                "year": (claim_date + timedelta(days=random.randint(90, 365))).year,
                "formatted": (claim_date + timedelta(days=random.randint(90, 365))).strftime('%d %B %Y')
            }
        }

        # Ensure the issuenumber is always 20 digits starting with "00"
        ent["issuenumber"] = f"00{fake.numerify('################')}"

        # Add issued date for certain entitlement types
        if entitlement_type in ['GHIC', 'EHIC', 'PRC']:
            ent["issued"] = {
                "day": claim_date.day,
                "month": claim_date.month,
                "year": claim_date.year,
                "formatted": claim_date.strftime('%d %B %Y')
            }

        # Add additional fields for GHIC, EHIC, PRC
        if entitlement_type in ['GHIC', 'EHIC']:
            ent["pin"] = f"{country_name[:2].upper()}{fake.numerify('######')}"
        
        # Add the entitlement to the person's entitlements
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

def generate_invoice_id():
    return random.randint(20000000, 20009999)

def generate_invoicereference():
    return str(random.randint(1000000000, 9999999999))

def calculate_invoice_amount(claim_cost, start_date, end_date):
    if claim_cost == "Average":
        # Calculate number of months between start and end dates
        return (end_date.year - start_date.year) * 12 + end_date.month - start_date.month + 1
    else:
        # Return a random monetary value
        return round(random.uniform(1000, 5000), 2)
    

# Function to ensure the generated date is valid within the month
def generate_valid_end_date(base_date, days_offset):
    potential_date = base_date + timedelta(days=days_offset)
    last_day_of_month = calendar.monthrange(potential_date.year, potential_date.month)[1]

    # If the day is out of range, set it to the last valid day of the month
    if potential_date.day > last_day_of_month:
        potential_date = potential_date.replace(day=last_day_of_month)

    return potential_date


def generate_invoice(claim_cost, article_name, country_name, claim_date, person):
    actual_claim_articles = {
        "AW03": [{"type": "DA1", "form": "Injuries in the workplace"}],
        "Article 62(36)": [{"type": "DA1", "form": "Injuries in the workplace"}],
        "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment"}],
        "Article 62": [
            {"type": "EHIC", "form": "Tourist"},
            {"type": "GHIC", "form": "Tourist"},
            {"type": "PRC", "form": "Tourist"},
            {"type": "S1", "form": "Worker"},
            {"type": "S1", "form": "Dependant"},
            {"type": "S1", "form": "Pensioner"}
        ]
    }

    average_claim_articles = {
        "Article 63(2a)": [{"type": "S1", "form": "Insured person"}],
        "Article 63(2b)": [{"type": "S1", "form": "Pensioner"}],
        "Article 65": [{"type": "S1", "form": "Pensioner"}],
        "Article 93": [{"type": "EHIC", "form": "Tourist"}, {"type": "PRC", "form": "Tourist"}],
        "Article 94": [{"type": "S1", "form": "Dependant (0-19)"}, {"type": "S1", "form": "Dependant (20-64)"}],
        "Article 95": [{"type": "S1", "form": "Pensioner"}]
    }

    # Choose article type and entitlement based on claim cost
    if claim_cost == "Actual":
        article_type = random.choice(list(actual_claim_articles.keys()))
        entitlement = random.choice(actual_claim_articles[article_type])
        costtype = random.choice(["Sickness", "Accident at work"])
        costcode = "S BUC 19" if costtype == "Sickness" else "AW BUC 05"
    else:
        article_type = random.choice(list(average_claim_articles.keys()))
        entitlement = random.choice(average_claim_articles[article_type])
        costtype = "Sickness"
        costcode = "S BUC 21"  # Default costcode for average claim cost

    entitlement_type = entitlement["type"]
    entitlement_form = entitlement["form"]
    
    # Use entitlement type for debtor_info
    debtor_info = {
        "GHIC": ("DHSC", f"UK{fake.numerify('###')}"),
        "EHIC": ("DHSC", f"UK{fake.numerify('###')}"),
        "PRC": ("DHSC", f"UK{fake.numerify('###')}"),
        "S1": ("DWP", fake.numerify('#####')),
        "S2": ("DWP", fake.numerify('#####')),
        "DA1": ("DWP", fake.numerify('#####'))
    }

    if entitlement_type not in debtor_info:
        raise KeyError(f"Debtor information for entitlement type '{entitlement_type}' not found.")

    debtorname, debtorid = debtor_info[entitlement_type]

    # Determine age bracket based on entitlement type and person age
    birth_year = person['dob']['year']
    current_year = claim_date.year
    person_age = current_year - birth_year

    if "Dependant" in entitlement_form:
        if person_age <= 19:
            agebracket = "0-19"
        elif 20 <= person_age <= 64:
            agebracket = "20-64"
        else:
            agebracket = "65+"
    elif "Pensioner" in entitlement_type:
        agebracket = "65+" if person_age >= 65 else "20-64"
    elif "Insured" in entitlement_type or "Worker" in entitlement_type:
        agebracket = "20-64"  # Assuming most insured/workers fall in this range
    else:
        agebracket = "20-64"  # Default to this range for most other types

    # Determine if the entitlement holder is "Main" or "Dependant"
    entitlement_holder = "Main" if "Insured" in entitlement_type or "Worker" in entitlement_type else "Dependant"

    ent = {
        "type": entitlement_type,
        "form": entitlement_form,
        "holder": entitlement_holder,
        "status": random.choice(["Issued", "Inactive", "Rejected", "Expired"]),
        "debtorname": debtorname,
        "debtorid": debtorid,
        "start": {
            "day": claim_date.day,
            "month": claim_date.month,
            "year": claim_date.year,
            "formatted": claim_date.strftime('%d %B %Y')
        },
        "country": country_name,  # Ensure country reflects the invoice country
        # Ensure valid end date by using the helper function
        "end": {
            "day": generate_valid_end_date(claim_date, random.randint(90, 365)).day,
            "month": generate_valid_end_date(claim_date, random.randint(90, 365)).month,
            "year": generate_valid_end_date(claim_date, random.randint(90, 365)).year,
            "formatted": generate_valid_end_date(claim_date, random.randint(90, 365)).strftime('%d %B %Y')
        }
    }

    if entitlement_type in ['GHIC', 'EHIC', 'PRC']:
        # Add issued date and issue number for GHIC, EHIC, PRC
        ent["issued"] = {
            "day": claim_date.day,
            "month": claim_date.month,
            "year": claim_date.year,
            "formatted": claim_date.strftime('%d %B %Y')
        }
        ent["issuenumber"] = f"00{fake.numerify('################')}"

    if entitlement_type in ['GHIC', 'EHIC']:
        ent["pin"] = f"{country_name[:2].upper()}{fake.numerify('######')}"
        end_date = claim_date + timedelta(days=365 * 5)
        ent["end"] = {
            "day": end_date.day,
            "month": end_date.month,
            "year": end_date.year,
            "formatted": end_date.strftime('%d %B %Y')
        }
        
    elif entitlement_type == 'PRC':
        end_date = claim_date + timedelta(days=random.randint(1, 90))
        ent["end"] = {
            "day": end_date.day,
            "month": end_date.month,
            "year": end_date.year,
            "formatted": end_date.strftime('%d %B %Y')
        }

    elif entitlement_type == 'S1':
        ent["form"] = random.choice(['Worker', 'Pensioner', 'Dependant'])
        end_date = claim_date + timedelta(days=random.randint(365, 730))
        ent["end"] = {
            "day": end_date.day,
            "month": end_date.month,
            "year": end_date.year,
            "formatted": end_date.strftime('%d %B %Y')
        }

    elif entitlement_type == 'S2':
        ent["form"] = 'Scheduled treatment'
        end_date = claim_date + timedelta(days=90)
        ent["end"] = {
            "day": end_date.day,
            "month": end_date.month,
            "year": end_date.year,
            "formatted": end_date.strftime('%d %B %Y')
        }

    elif entitlement_type == 'DA1':
        ent["form"] = 'Industrial Injuries Disablement Benefit'
        end_date = claim_date + timedelta(days=90)
        ent["end"] = {
            "day": end_date.day,
            "month": end_date.month,
            "year": end_date.year,
            "formatted": end_date.strftime('%d %B %Y')
        }

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
        "This document does not concern us",
        "Institution code is incorrect. Please provide correct institution code.",
        "Unable to identify the person from the information provided. Please check.",
        # additional reasons omitted for brevity
        "Other"
    ]) if status == "Contested" else "None - invoice accepted"

    # Create a copy of the person without the invoices field to avoid circular reference
    person_copy = copy.deepcopy(person)
    person_copy.pop('invoices', None)

    # Update the entitlements for the person object
    person['entitlements'].append(ent)

    invoice = {
        "invoiceid": invoice_id,
        "country": country_name,
        "invoicereference": invoicereference,
        "amount": amount,
        "startdate": invoice_start_date.strftime('%Y-%m-%d'),
        "enddate": invoice_end_date.strftime('%Y-%m-%d'),
        "status": status,
        "person": person_copy,  # Use the copy without the invoices field
        "articletype": article_type,
        "contestationreason": contestationreason,
        "period": {
            "start": invoice_start_date.strftime('%d %B %Y'),
            "end": invoice_end_date.strftime('%d %B %Y')
        },
        "costcode": costcode,
        "costtype": costtype,
        "amounts": amounts,
        "recorded": claim_date.strftime('%Y-%m-%d'),
        "foreigninstitutionname": generate_foreign_institution_name(country_name),
        "foreigninstitutionid": fake.numerify('##########'),
        "agebracket": agebracket,  # Include the age bracket in the invoice data
        "entitlement_holder": entitlement_holder,  # Include the entitlement holder in the invoice data
        "entitlements": [ent]  # Assign the generated entitlement specifically to this invoice
    }

    person['invoices'].append(invoice)

    return invoice



def generate_foreign_institution_name(country):
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
    return random.choice(foreign_institution_names.get(country, ["General Hospital"]))

def calculate_invoice_stats(invoices):
    stats = {
        "total": len(invoices),
        "toCheck": len([inv for inv in invoices if inv['status'] == "To Check"]),
        "accepted": len([inv for inv in invoices if inv['status'] == "Accepted"]),
        "contested": len([inv for inv in invoices if inv['status'] == "Contested"])
    }
    return stats

def calculate_claim_amount(invoices):
    amounts = {
        "total": sum(inv['amount'] for inv in invoices),
        "toCheck": sum(inv['amount'] for inv in invoices if inv['status'] == "To Check"),
        "accepted": sum(inv['amount'] for inv in invoices if inv['status'] == "Accepted"),
        "contested": sum(inv['amount'] for inv in invoices if inv['status'] == "Contested")
    }
    return amounts

def assign_condition(invoice, person):
    # Treatment period
    treatment_start = datetime.strptime(invoice['startdate'], '%Y-%m-%d')
    treatment_end = datetime.strptime(invoice['enddate'], '%Y-%m-%d')
    
    entitlements = person['entitlements']
    entitlements_countries = [ent.get('country', None) for ent in entitlements if 'country' in ent]

    # Check condition 1: All entitlements country do not match invoice country
    if all(ent_country != invoice['country'] for ent_country in entitlements_countries):
        return "1"

    # Check condition 2: Unable to identify person, randomly assigned
    if random.random() < 0.1:  # Assign this condition randomly to 10% of 'To Check' or 'Rejected' statuses
        return "2"

    # Check condition 3: Missing entitlement covering invoice treatment period
    entitlement_periods = [(datetime(ent['start']['year'], ent['start']['month'], ent['start']['day']),
                            datetime(ent['end']['year'], ent['end']['month'], min(ent['end']['day'], calendar.monthrange(ent['end']['year'], ent['end']['month'])[1]))) 
                           for ent in entitlements]
    
    if not any(ent_start <= treatment_start <= ent_end for ent_start, ent_end in entitlement_periods):
        return "3"

    # Check condition 4: Partially covered treatment period
    if any((ent_start <= treatment_start <= ent_end) != (ent_start <= treatment_end <= ent_end)
           for ent_start, ent_end in entitlement_periods):
        return "4"

    # Check condition 5: Treatment period not covered by any entitlement
    if not any(ent_start <= treatment_start <= ent_end and ent_start <= treatment_end <= ent_end
               for ent_start, ent_end in entitlement_periods):
        return "5"

    # Check condition 6: Missing entitlement
    if len(entitlements) == 0:
        return "6"

    # Check condition 7: Double invoice (This will be assigned when duplicates are generated)
    if invoice.get('is_duplicate', False):
        return "7"

    # Check condition 8: Person has deceased date
    if person.get('deceaseddate'):
        return "8"

    # If none of the above conditions apply, return None
    return None



def generate_claims(num_claims):
    claims = []
    for _ in range(num_claims):
        country = random.choice(rina_countries)
        claim_date = generate_dates_within_year(random.randint(2011, 2023))
        claim_reference = generate_claim_reference(country, "Article", claim_date.year, claim_date.month, claim_date.day)
        claim_type = random.choice(["Main", "Supplementary"])
        claim_cost = "Actual" if country not in ["Cyprus", "Malta", "Portugal", "Spain", "Sweden"] else random.choice(["Average", "Actual"])
        articletype_options = list(current_claim_articles.keys()) + list(old_claim_articles.keys())
        article_type = random.choice(articletype_options)

        # Determine article details based on whether it's a current or old regulation
        if article_type in current_claim_articles:
            details = current_claim_articles[article_type]
        else:
            details = old_claim_articles[article_type]

        entitlement_type = details["entitlement"]
        if isinstance(entitlement_type, list):
            entitlement_type = random.choice(entitlement_type)

        invoices = []
        duplicates = []
        for _ in range(random.randint(6, 15)):
            person = generate_person(country, claim_date, article_type)
            invoice = generate_invoice(claim_cost, "Article", country, claim_date, person)

            # Assign conditions based on status 'To Check' or 'Rejected'
            if invoice['status'] in ["To Check", "Rejected"]:
                invoice['condition'] = assign_condition(invoice, person)  # No claim_date argument here
            else:
                invoice['condition'] = None  # No condition for 'Accepted' invoices

            invoices.append(invoice)

            # Create duplicates for 1/4 of the invoices
            if random.random() < 0.25:  # 25% chance to duplicate this invoice
                duplicate_invoice = copy.deepcopy(invoice)
                duplicate_invoice['invoiceid'] = generate_invoice_id()  # New unique invoice ID
                duplicate_invoice['invoicereference'] = generate_invoicereference()  # New unique invoice reference
                duplicate_invoice['is_duplicate'] = True  # Mark this as a duplicate
                duplicates.append(duplicate_invoice)
                invoices.append(duplicate_invoice)

        status = random.choice(["Active", "Not started"])
        agebracket = random.choice(["65 years and over", "20 to 64 years", "Combination"]) if claim_cost == "Average" else "65 years and over" if random.randint(60, 90) >= 65 else "20 to 64 years"

        claim_period = "First half year" if claim_date.month <= 6 else "Second half year"
        if claim_type == "Supplementary":
            claim_period == "Second half year"

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

        claims.append(claim)
    return claims


# Insert claims into both databases
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
                    INSERT INTO persons (lastname, firstname, dob, uniqueid, address, entitlements, treatments, invoices, agebracket, articletype, deceaseddate)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        person['lastname'], person['firstname'], json.dumps(person['dob']),
                        json.dumps(person['uniqueid']), json.dumps(person['address']),
                        json.dumps(person['entitlements']), json.dumps(person['treatments']), json.dumps([]),  # Empty list for invoices to avoid circular reference
                        person['agebracket'], person['articletype'], person.get('deceaseddate')
                    )
                )
        
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Data inserted successfully into {db_params['dbname']}")
    except Exception as e:
        print(f"Error inserting data into {db_params['dbname']}: {e}")

# Generate and insert claims into both local and Heroku databases
claims = generate_claims(900)
insert_claims_into_db(claims, local_db_params)  # Insert into local DB
insert_claims_into_db(claims, heroku_db_params)  # Insert into Heroku DB

# Save generated data to a JSON file
for claim in claims:
    for invoice in claim['invoices']:
        invoice['person'].pop('invoices', None)  # Remove circular reference before serializing

with open('claims_new_data.json', 'w') as file:
    json.dump({"claims": claims}, file, indent=4)
