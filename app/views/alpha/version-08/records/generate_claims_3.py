import json
import uuid
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

def generate_dates_within_year(year):
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    return random_date

def generate_person(country_name, claim_year, claim_month, claim_day):
    # Make sure to update the logic to handle claim_month and claim_day
    age = random.randint(60, 90)
    birth_year = claim_year - age
    claim_date = datetime(claim_year, claim_month, claim_day)

    person = {
        "lastName": fake.last_name(),
        "firstName": fake.first_name(),
        "dob": {"day": random.randint(1, 28), "month": random.randint(1, 12), "year": birth_year},
        "uniqueID": {
            "ohs": fake.numerify('########'),
            "nino": f"{fake.random_uppercase_letter()}{fake.random_uppercase_letter()} {fake.numerify('######')} {fake.random_uppercase_letter()}",
            "nhs": fake.numerify('### ### ####')
        },
        "address": {
            "firstLine": fake.street_address(),
            "secondLine": "",
            "city": fake.city(),
            "postcode": fake.postcode(),
            "residenceCountry": country_name
        },
        "entitlements": [],
        "treatments": {
            "details": {
                "total": round(random.uniform(100, 999.99), 2),
                "currencyCode": "EUR",
                "start": claim_date.strftime('%d/%m/%Y'),
                "end": (claim_date + timedelta(days=random.randint(10, 100))).strftime('%d/%m/%Y')
            },
            "hospitalisation": {
                "cost": round(random.uniform(100, 999.99), 2),
                "start": claim_date.strftime('%d/%m/%Y'),
                "end": (claim_date + timedelta(days=random.randint(1, 9))).strftime('%d/%m/%Y')
            }
        }
    }

    # Generating entitlements
    entitlement_types = ['GHIC', 'EHIC', 'PRC', 'S1', 'DA1']
    debtor_info = {
        "GHIC": ("DHSC (Department of Health and Social Care)", f"UK{fake.numerify('###')}"),
        "EHIC": ("DHSC (Department of Health and Social Care)", f"UK{fake.numerify('###')}"),
        "PRC": ("DHSC (Department of Health and Social Care)", f"UK{fake.numerify('###')}"),
        "S1": ("DWP (Department for Work and Pensions)", fake.numerify('#####')),
        "S2": ("DWP (Department for Work and Pensions)", fake.numerify('#####')),
        "DA1": ("DWP (Department for Work and Pensions)", fake.numerify('#####'))
    }

    for _ in range(random.randint(1, 3)):
        ent_type = random.choice(entitlement_types)
        issue_date = claim_date
        ent = {
            "type": ent_type,
            "holder": random.choice(["Main", "Dependant"]),
            "status": random.choice(["Issued", "Inactive", "Rejected", "Expired"]),
            "debtorName": debtor_info[ent_type][0],
            "debtorID": debtor_info[ent_type][1]
        }

        # Adjusting entitlement specifics based on type
        if ent_type in ['GHIC', 'EHIC']:
            ent["form"] = "Tourist"
            ent["pin"] = 'UK' + fake.numerify('######')
            ent["issueNumber"] = fake.numerify('##')
            ent["start"] = issue_date.strftime('%d/%m/%Y')
            ent["end"] = (issue_date + timedelta(days=365*5)).strftime('%d/%m/%Y')
            ent["issued"] = issue_date.strftime('%d/%m/%Y')

        if ent_type == 'PRC':
            ent["form"] = "Tourist"
            ent["issueNumber"] = fake.numerify('##')
            ent["start"] = issue_date.strftime('%d/%m/%Y')
            ent["end"] = (issue_date + timedelta(days=random.randint(1, 90))).strftime('%d/%m/%Y')  # At least 1 day, max 90 days

        if ent_type in ['S1', 'S2']:
            ent["form"] = 'Scheduled treatment' if ent_type == 'S2' else random.choice(['Worker', 'Pensioner', 'Dependant'])
            ent["start"] = issue_date.strftime('%d/%m/%Y')
            ent["end"] = (issue_date + timedelta(days=90)).strftime('%d/%m/%Y') if ent_type == 'S2' else (issue_date + timedelta(days=random.randint(365, 730))).strftime('%d/%m/%Y')

        if ent_type == 'DA1':
            ent["form"] = 'Industrial Injuries Disablement Benefit'
            ent["start"] = issue_date.strftime('%d/%m/%Y')
            ent["end"] = (issue_date + timedelta(days=90)).strftime('%d/%m/%Y')  # At least 3 months

        person['entitlements'].append(ent)

    return person


def generate_claim_reference(country, article_type, claim_year, claim_month, claim_day):
    unique_id = str(uuid.uuid4())[:8]
    random_number = fake.numerify(text="######")
    year_full = claim_year
    year_short = claim_year % 100  # Extracts the last two digits for short year format
    month_full = f"{claim_month:02d}"  # Ensures month is two digits
    day_full = f"{claim_day:02d}"  # Ensures day is two digits

    # For France, generate a string matching [0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{1}
    one_digit = fake.numerify(text="#")
    two_digits = fake.numerify(text="##")
    three_digits = fake.numerify(text="###")
    four_digits = fake.numerify(text="####")
    five_digits = fake.numerify(text="#####")
    six_digits = fake.numerify(text="######")
    seven_digits = fake.numerify(text="#######")
    two_letters = fake.lexify(text="??", letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    three_letters = fake.lexify(text="???", letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    four_digits = fake.numerify(text="####")
    one_letter = fake.lexify(text="?", letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    ref_formats = {
        "Austria": f"AT-UK/{year_short}-{three_digits}",
        "Belgium": f"{four_digits}/{article_type}/{two_digits}/{two_letters}{one_digit}/{two_letters}",
        "Bulgaria": f"{article_type}_GB{year_full}{two_digits}",
        "Croatia": f"HRGB{year_full}{two_digits}",
        "Czech Republic": f"{year_full}{seven_digits}",
        "Estonia": f"VSO{year_full}-{four_digits}",
        "Finland": unique_id,
        "France": f"{year_full}{five_digits}{two_letters}{four_digits}{one_letter}",
        "Germany": f"UK1S{year_short}8000000{three_digits}" if article_type == "62" else f"GB/{month_full}/{year_full}/{five_digits}",
        "Greece": f"{year_full}{six_digits}",
        "Hungary": f"HU-UK/{year_full}/{two_digits}" if article_type == "62" else f"{year_short}GB/{year_full}{month_full}{day_full}/{two_digits}",
        "Iceland": f"UK/{year_short}-{month_full}/{three_letters}",
        "Ireland": f"{day_full}/{month_full}/{year_full}",
        "Italy": f"{random_number}{year_full}{two_digits}",
        "Latvia": f"S080.OUT.LV.{year_full}/{two_digits}",
        "Liechtenstein": f"GB{day_full}{month_full}{year_short}",
        "Lithuania": f"1E-{year_full}-{five_digits}",
        "Luxembourg": f"Int-Dep-{year_short}{four_digits}",
        "Netherlands": f"{three_letters}/{year_full}/{random_number}/{three_letters}",
        "Norway": f"{year_full}-{random_number[:2]}",
        "Poland": f"{six_digits}{year_full}",
        "Portugal": f"UK{year_full - 1}PT0AD_S0",
        "Republic of Cyprus": f"{day_full}-{month_full}-{year_full} UK" if article_type == "EHIC" else f"CY{year_full - 1}E{random_number}EURO",
        "Romania": f"P{random_number}/{day_full}.{month_full}.{year_full}",
        "Slovakia": f"{seven_digits}{one_digit}_{three_digits}",
        "Slovenia": f"{four_digits}-{three_digits}/{year_full}-{two_letters}/{one_digit}",
        "Spain": f"{year_full}GB {random_number}{year_full}({article_type})",
        "Sweden": f"{random_number}{random_number}",
        "Switzerland": f"PCHGB{random_number}_{one_digit}{random_number[:3]} or PCHGB{random_number}_{month_full}{year_short}_GB{random_number[:5]}"
    }

    # Default format if country not listed or specific format not matched
    default_format = f"{country[:2]}-{article_type[:3]}-{year_full}-{random_number}"

    return ref_formats.get(country, default_format)


def generate_invoice_id(country, article_type, claim_year):
    random_number = random.randint(100000, 999999)  # Generic 6-digit random number
    short_random_number = random.randint(100, 999)  # Short 3-digit random number

    # Dictionary for country codes
    country_codes = {
        "Austria": "AT",
        "Belgium": "BE",
        "Bulgaria": "BG",
        "Croatia": "HR",
        "Czech Republic": "CZ",
        "Estonia": "EE",
        "Finland": "FI",
        "France": "FR",
        "Germany": "DE",
        "Greece": "GR",
        "Hungary": "HU",
        "Iceland": "IS",
        "Ireland": "IE",
        "Italy": "IT",
        "Latvia": "LV",
        "Liechtenstein": "LI",
        "Lithuania": "LT",
        "Luxembourg": "LU",
        "The Netherlands": "NL",
        "Norway": "NO",
        "Poland": "PL",
        "Portugal": "PT",
        "The Republic of Cyprus": "CY",
        "Romania": "RO",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Spain": "ES",
        "Sweden": "SE",
        "Switzerland": "CH",
        "UK": "GB"  # Adding an entry for the United Kingdom
    }

    formats = {
        # Format definitions for various countries...
        "Austria": f"{random_number}",
        "Belgium": f"{random_number}",
        "Bulgaria": f"{random_number}",
        "Croatia": f"{random_number}",
        "Czech Republic": f"{random_number}",
        "Estonia": f"{random_number}",
        "Finland": f"{random_number}",
        "France": f"FR{random_number}/{claim_year}",
        "Germany": f"{random_number}GB/{claim_year}{random_number}/00{short_random_number}" if article_type == "62" else f"DE{random_number}",
        "Greece": f"{random_number}",
        "Hungary": f"{random_number}",
        "Iceland": f"{random_number}",
        "Ireland": f"IE{random_number}",
        "Italy": f"{random_number}",
        "Latvia": f"{random_number}",
        "Liechtenstein": f"{claim_year}{short_random_number}",
        "Lithuania": f"{random_number}",
        "Luxembourg": f"LX{random_number}",
        "The Netherlands": f"{random_number}",
        "Norway": f"{claim_year}-{short_random_number}-1",
        "Poland": f"PL{random_number}/0" if article_type == "Art 62" else f"PL{random_number}",
        "Portugal": f"PT{short_random_number}",
        "The Republic of Cyprus": f"CY{random_number}",
        "Romania": f"RO{random_number}",
        "Slovakia": f"{random_number}",
        "Slovenia": f"{random_number}",
        "Spain": {
            "article_62": f"ES{short_random_number}{claim_year}",
            "article_63(2a)": f"2ES{random_number}",
            "article_63(2b)": f"3ES{short_random_number}{claim_year}"
        }.get(article_type, f"ES{random_number}"),
        "Sweden": f"SE{random_number}",
        "Switzerland": f"CH{random_number}"
        # Include additional country formats as necessary
    }

    # Default format if specific format not found in the dictionary, using country code from the dictionary
    default_code = country_codes.get(country, 'XX')  # 'XX' as a fallback if country code is not found
    return formats.get(country, f"{default_code}-{random_number}")

def generate_invoice(article_name, entitlement, country_name, is_actual, claim_year, claim_month, claim_day):
    claim_date = datetime(claim_year, claim_month, claim_day)
    person = generate_person(country_name, claim_year, claim_month, claim_day)  # This also needs to be aligned if needed

    invoice_id = generate_invoice_id(country_name, article_name, claim_year)
    if is_actual:
        status_choices = ["To Check", "Accepted", "Contested", "Withdrawn"]
    else:
        status_choices = ["To Check", "Accepted", "Contested", "Partial", "Withdrawn"]
    status = random.choice(status_choices)
    amount = round(random.uniform(1000, 5000), 2) if is_actual else random.randint(1, 12)

    invoice_date = claim_date + timedelta(days=random.randint(-30, 30))

    invoice = {
        "invoiceID": invoice_id,
        "amount": amount,
        "date": invoice_date.strftime('%d/%m/%Y'),
        "status": status,
        "person": person
    }


    if status != "Accepted":
        contestation_reasons = [
            # List of contestation reasons
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
            # Add more reasons as needed
        ]
        invoice["contestationReason"] = random.choice(contestation_reasons)

    return invoice

def calculate_invoice_stats(invoices):
    return {
        "total": len(invoices),
        "toCheck": sum(1 for inv in invoices if inv['status'] == "To Check"),
        "accepted": sum(1 for inv in invoices if inv['status'] == "Accepted"),
        "contested": sum(1 for inv in invoices if inv['status'] == "Contested"),
        "partial": sum(1 for inv in invoices if inv['status'] == "Partial"),
        "withdrawn": sum(1 for inv in invoices if inv['status'] == "Withdrawn")
    }

def calculate_claim_amounts(invoices, is_actual):
    if is_actual:
        return {
          "total": sum(inv['amount'] for inv in invoices),
            "toCheck": sum(inv['amount'] for inv in invoices if inv['status'] == "To Check"),
            "accepted": sum(inv['amount'] for inv in invoices if inv['status'] == "Accepted"),
            "contested": sum(inv['amount'] for inv in invoices if inv['status'] == "Contested"),
            "withdrawn": sum(inv['amount'] for inv in invoices if inv['status'] == "Withdrawn")
        }
    else:  # For average claims, amounts represent months
        return {
          "total": sum(inv['amount'] for inv in invoices),  # Here 'amount' represents months
            "toCheck": sum(inv['amount'] for inv in invoices if inv['status'] == "To Check"),
            "accepted": sum(inv['amount'] for inv in invoices if inv['status'] == "Accepted"),
            "contested": sum(inv['amount'] for inv in invoices if inv['status'] == "Contested"),
            "partial": sum(inv['amount'] for inv in invoices if inv['status'] == "Partial"),
            "withdrawn": sum(inv['amount'] for inv in invoices if inv['status'] == "Withdrawn")
        }

def generate_claims_for_country(country_name, details):
    country_claims = {}
    for year in range(details['start_year'], details['end_year'] + 1):
        received_date = datetime(year, 1, 1)
        country_claims[year] = {"articles": {"actual": {}, "average": {}}}
        
        for article_type in ['actual', 'average']:
            is_actual = (article_type == 'actual')
            for article_info in details[f'{article_type}_articles']:
                article_name = article_info['name']
                entitlements = details['entitlements'].get(article_name, [])
                if not entitlements:
                    continue  # Skip if no entitlements are found for the article
                
                # Generate random month and day for each invoice
                claim_month = random.randint(1, 12)
                claim_day = random.randint(1, 28)  # Simplified, adjust for month lengths/leap years as needed

                invoices = [generate_invoice(article_name, random.choice(entitlements), country_name, is_actual, year, claim_month, claim_day) for _ in range(random.randint(5, 10))]
                invoice_stats = calculate_invoice_stats(invoices)
                claim_amounts = calculate_claim_amounts(invoices, is_actual)

                country_claims[year]["articles"][article_type][article_name] = {
                    "claimReference": generate_claim_reference(country_name, article_name, year, claim_month, claim_day),
                    "articleType": article_name,
                    "claimType": random.choice(["Supplementary", "Main"]),
                    "status": random.choice(["Not started", "Active", "Contested", "Letter sent"]),
                    "targetDate": (received_date + timedelta(days=180)).strftime('%d/%m/%Y'),
                    "deadline": (received_date + timedelta(days=540)).strftime('%d/%m/%Y'),
                    "received": received_date.strftime('%d/%m/%Y'),
                    "invoicesNumber": invoice_stats,
                    "claimAmount": claim_amounts,
                    "invoices": invoices
                }

    return country_claims



# Define each country's details including articles and entitlements with specific adjustments
countries_details = {
     "Austria": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Bulgaria": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Belgium": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
     "Croatia": {
        "country_name": "Croatia",
        "start_year": 2013, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
           "Article 62": [{"type": "EHIC", "holder": "Main"}],
            "AW03": [{"type": "DA1", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}]
        }
    },
    "Cyprus": {
        "country_name": "Cyprus",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}],
            "AW03": [{"type": "DA1", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}]
        }
    },
    "Czech Republic": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Denmark": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Estonia":{
        "country_name": "Estonia",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Finland": {
        "country_name": "Finland",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62", "start_year": 2017}, {"name": "AW03", "end_year": 2016}],
        "average_articles": [{"name": "Article 63(2a)", "end_year": 2016}, {"name": "Article 65(2b)", "end_year": 2016}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
     "France": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Germany": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Greece": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
     "Hungary": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Iceland": {
        "country_name": "Iceland",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Italy": {
        "country_name": "Italy",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [
            {"name": "Article 62", "start_year": 2013},
            {"name": "AW03"}
        ],
        "average_articles": [
            {"name": "Article 63(2a)", "end_year": 2012},
            {"name": "Article 63(2b)", "end_year": 2012}
        ],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Latvia": {
        "country_name": "Latvia",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Liechtenstein": {
        "country_name": "Liechtenstein",    
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"},
            {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Lithuania": {
        "country_name": "Lithuania",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Luxembourg": {
        "country_name": "Luxembourg",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
     "Malta": {
        "country_name": "Malta",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Netherlands": {
        "country_name": "Netherlands",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
     "Norway": {
        "country_name": "Norway",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
         "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
     "Poland": {
        "country_name": "Poland",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Portugal": {
        "country_name": "Portugal",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Republic of Ireland": {
        "country_name": "Republic of Ireland",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Romania": {
        "country_name": "Romania",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Slovakia": {
        "country_name": "Slovakia",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Slovenia": {
        "country_name": "Slovenia",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Spain": {
        "country_name": "Spain",
        "start_year": 2010, "end_year": 2024,
       "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Sweden": {
        "country_name": "Sweden",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
      "Switzerland": {
        "country_name": "Switzerland",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "UK": {
        "country_name": "United Kingdom",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [{"name": "Article 63(2a)"}, {"name": "Article 63(2b)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63(2a)": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 63(2b)": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],           
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    }
  
}

# Generate claims data
all_claims = {country: generate_claims_for_country(country, details) for country, details in countries_details.items()}

# Save to JSON
with open('claims_data.json', 'w') as file:
    json.dump({"claims": {"countries": all_claims}}, file, indent=4)

print("Claims records have been generated and saved to 'claims_data.json'.")

