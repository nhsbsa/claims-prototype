import json
import uuid
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from faker import Faker

fake = Faker()

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
        "lastName": fake.last_name(),
        "firstName": fake.first_name(),
        "dob": {
            "day": birth_day,
            "month": birth_month,
            "year": birth_year,
            "formatted": datetime(birth_year, birth_month, birth_day).strftime('%d %B %Y')  # Formatted DOB
        },
        "uniqueID": {
            "ohs": fake.numerify('########'),
            "nino": f"{fake.random_uppercase_letter()}{fake.random_uppercase_letter()} {fake.numerify('## ## ##')} {fake.random_uppercase_letter()}",
            "nhs": fake.numerify('##########')
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
                "currencyCode": country_currency_map.get(country_name, "EUR"),
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
        "ageBracket": "65+" if age >= 65 else "20-64" if age >= 20 else "0-19",
        "articleType": article_type
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
            "debtorName": debtor_info[ent_type][0],
            "debtorID": debtor_info[ent_type][1]
        }

        if ent_type in ['GHIC', 'EHIC']:
            ent["form"] = "Tourist"
            ent["pin"] = f"{country_name[:2].upper()}{fake.numerify('######')}"
            ent["issueNumber"] = fake.numerify('##')
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
            ent["issueNumber"] = fake.numerify('##')
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
                "day": (issue_date + timedelta(days=90)).day,
                "month": (issue_date + timedelta(days=90)).month,
                "year": (issue_date + timedelta(days=90)).year,
                "formatted": (issue_date + timedelta(days=90)).strftime('%d %B %Y')
            } if ent_type == 'S2' else {
                "day": (issue_date + timedelta(days=random.randint(365, 730))).day,
                "month": (issue_date + timedelta(days=random.randint(365, 730))).month,
                "year": (issue_date + timedelta(days=random.randint(365, 730))).year,
                "formatted": (issue_date + timedelta(days=random.randint(365, 730))).strftime('%d %B %Y')
            }

        if ent_type == 'DA1':
            ent["form"] = 'Industrial Injuries Disablement Benefit'
            ent["start"] = {
                "day": issue_date.day,
                "month": issue_date.month,
                "year": issue_date.year,
                "formatted": issue_date.strftime('%d %B %Y')
            }
            ent["end"] = {
                "day": (issue_date + timedelta(days=90)).day,
                "month": (issue_date + timedelta(days=90)).month,
                "year": (issue_date + timedelta(days=90)). year,
                "formatted": (issue_date + timedelta(days=90)).strftime('%d %B %Y')
            }

        person['entitlements'].append(ent)

    return person

def generate_claim_reference(country, article_type, claim_year, claim_month, claim_day):
    unique_id = str(uuid.uuid4())[:8]
    random_number = fake.numerify(text="######")
    year_full = claim_year
    year_short = claim_year % 100  # Extracts the last two digits for short year format
    month_full = f"{claim_month:02d}"  # Ensures month is two digits
    day_full = f"{claim_day:02d}"  # Ensures day is two digits

    ref_formats = {
        "Austria": f"AT-UK/{year_short}-{random_number}",
        "Belgium": f"{year_full}{random_number[:5]}BE{random_number[:3]}",
        "Bulgaria": f"BG{year_full}-{random_number[:4]}",
        "Croatia": f"HR{year_full}{random_number[:6]}",
        "Czech Republic": f"CZ{random_number[:6]}-{year_short}",
        "Estonia": f"EE{random_number[:5]}{year_short}",
        "Finland": f"FI-{random_number[:3]}-{year_full}",
        "France": f"FR{random_number[:5]}{year_short}{random_number[:3]}",
        "Germany": f"DE{year_short}-{random_number[:5]}",
        "Greece": f"GR-{year_short}{random_number[:5]}",
        "Hungary": f"HU-{year_full}{random_number[:4]}",
        "Iceland": f"IS-{random_number[:3]}-{year_short}",
        "Ireland": f"IE-{random_number[:4]}{year_full}",
        "Italy": f"IT-{random_number[:3]}-{year_full}",
        "Latvia": f"LV-{year_full}-{random_number[:5]}",
        "Liechtenstein": f"LI-{year_short}{random_number[:4]}",
        "Lithuania": f"LT-{random_number[:4]}-{year_full}",
        "Luxembourg": f"LU{year_short}-{random_number[:5]}",
        "Netherlands": f"NL-{random_number[:4]}-{year_full}",
        "Norway": f"NO{year_short}{random_number[:4]}",
        "Poland": f"PL{year_full}-{random_number[:4]}",
        "Portugal": f"PT-{year_short}{random_number[:4]}",
        "Republic of Ireland": f"IE-{random_number[:4]}{year_full}",
        "Romania": f"RO{year_short}-{random_number[:5]}",
        "Slovakia": f"SK-{random_number[:4]}{year_full}",
        "Slovenia": f"SI-{random_number[:3]}-{year_full}",
        "Spain": f"ES-{random_number[:4]}{year_short}",
        "Sweden": f"SE-{random_number[:5]}-{year_short}",
        "Switzerland": f"CH{year_short}-{random_number[:4]}"
    }

    default_format = f"{country[:2]}-{article_type[:3]}-{year_full}-{random_number}"

    return ref_formats.get(country, default_format)

def generate_invoice_id(country, article_type, claim_year):
    random_number = random.randint(100000, 999999)
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
        "Netherlands": "NL",
        "Norway": "NO",
        "Poland": "PL",
        "Portugal": "PT",
        "Republic of Ireland": "IE",
        "Romania": "RO",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Spain": "ES",
        "Sweden": "SE",
        "Switzerland": "CH"
    }

    return f"{country_codes.get(country, 'XX')}-{random_number}"

def generate_invoice(article_name, country_name, claim_date, is_actual):
    person = generate_person(country_name, claim_date, article_name)
    invoice_id = generate_invoice_id(country_name, article_name, claim_date.year)
    if is_actual:
        status_choices = ["To Check", "Accepted", "Contested", "Withdrawn"]
        amount = round(random.uniform(1000, 5000), 2)
    else:
        status_choices = ["To Check", "Accepted", "Contested", "Partial", "Withdrawn"]
        amount = round(random.uniform(1, 12), 2)

    status = random.choice(status_choices)
    invoice_date = claim_date + timedelta(days=random.randint(-30, 30))

    invoice = {
        "invoiceID": invoice_id,
        "amount": amount,
        "date": invoice_date.strftime('%d %B %Y'),
        "status": status,
        "person": person,
        "articleType": article_name
    }

    if status != "Accepted":
        contestation_reasons = [
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
            "total": round(sum(inv['amount'] for inv in invoices), 2),
            "toCheck": round(sum(inv['amount'] for inv in invoices if inv['status'] == "To Check"), 2),
            "accepted": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Accepted"), 2),
            "contested": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Contested"), 2),
            "withdrawn": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Withdrawn"), 2)
        }
    else:  # For average claims, amounts represent months
        return {
            "total": round(sum(inv['amount'] for inv in invoices), 2),
            "toCheck": round(sum(inv['amount'] for inv in invoices if inv['status'] == "To Check"), 2),
            "accepted": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Accepted"), 2),
            "contested": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Contested"), 2),
            "partial": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Partial"), 2),
            "withdrawn": round(sum(inv['amount'] for inv in invoices if inv['status'] == "Withdrawn"), 2)
        }

def generate_claims_for_country(country_name, details):
    country_claims = {}
    for year in range(details['start_year'], details['end_year'] + 1):
        received_date = datetime(year, 1, 1).strftime('%d %B %Y')  # Format and convert to string
        country_claims[year] = {"articles": {}}

        for article_info in details['articles']:
            article_name = article_info['name']
            is_actual = 'actual' in article_name.lower()
            claim_month = random.randint(1, 12)
            claim_day = random.randint(1, 28)  # Adjust based on actual month lengths

            # Generate target and deadline dates and format them
            claim_date = datetime(year, claim_month, claim_day)
            target_date = (claim_date + relativedelta(months=+6)).strftime('%d %B %Y')
            deadline_date = (claim_date + relativedelta(days=+360)).strftime('%d %B %Y')

            invoices = [generate_invoice(article_name, country_name, claim_date, is_actual) for _ in range(random.randint(1, 5))]
            invoice_stats = calculate_invoice_stats(invoices)
            claim_amounts = calculate_claim_amounts(invoices, is_actual)

            main_claim = {
                "claimReference": generate_claim_reference(country_name, article_name, year, claim_month, claim_day),
                "articleType": article_name,
                "claimType": "Main",
                "status": random.choice(["Not started", "Active", "Contested", "Letter sent"]),
                "targetDate": target_date,
                "deadline": deadline_date,
                "received": received_date,
                "invoicesNumber": invoice_stats,
                "claimAmount": claim_amounts,
                "claimCost": "actual" if is_actual else "average",
                "invoices": invoices
            }

            # Optionally generate supplementary claims similar to main claims
            supplementary_claim = main_claim.copy()
            supplementary_claim["claimType"] = "Supplementary"
            supplementary_claim["claimReference"] += "-SUPP"

            country_claims[year]["articles"][article_name] = {
                "main": main_claim,
                "supplementary": supplementary_claim
            }

    return country_claims

# Define each country's details including articles and entitlements with specific adjustments
countries_details = {
    "Austria": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Bulgaria": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Cyprus": {
        "start_year": 2012, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Denmark": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Estonia": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Finland": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62", "start_year": 2017}, {"name": "Article AW03", "end_year": 2016},
            {"name": "Article 63 (2a)", "end_year": 2016},
            {"name": "Article 63 (2b)", "end_year": 2016}
        ]
    },
    "France": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Germany": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Hungary": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Iceland": {
        "start_year": 2012, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Italy": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62", "start_year": 2013}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)", "end_year": 2012}, {"name": "Article 63 (2b)", "end_year": 2012}
        ]
    },
    "Latvia": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Liechtenstein": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Lithuania": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Malta": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Netherlands": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Norway": {
        "start_year": 2012, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Portugal": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Republic of Ireland": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    },
    "Slovakia": {
        "start_year": 2010, "end_year": 2024,
        "articles": [{"name": "Article 62"}, {"name": "Article AW03"}]
    },
    "Sweden": {
        "start_year": 2010, "end_year": 2024,
        "articles": [
            {"name": "Article 62"}, {"name": "Article AW03"},
            {"name": "Article 63 (2a)"}, {"name": "Article 63 (2b)"},
            {"name": "Article 63"}, {"name": "Article 65"}
        ]
    }
}

all_claims = {country: generate_claims_for_country(country, details) for country, details in countries_details.items()}

with open('claims_data.json', 'w') as file:
    json.dump({"claims": {"countries": all_claims}}, file, indent=4)

print("Claims records have been generated and saved to 'claims_data.json'.")
