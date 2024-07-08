
import json
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

def generate_person(entitlement, country_name):
    age = random.randint(60, 90) if entitlement['holder'] == 'Main' else random.randint(18, 59)
    birth_year = fake.date_of_birth(minimum_age=age, maximum_age=age).year
    nino_prefix = fake.random_element(elements=('AB', 'CD', 'EF', 'GH', 'JK', 'LM', 'NP', 'QR', 'ST', 'VW', 'XY', 'Z'))
    nino_suffix = fake.random_element(elements=('A', 'B', 'C', 'D'))
    person = {
        "lastName": fake.last_name(),
        "firstName": fake.first_name(),
        "dob": {"day": random.randint(1, 28), "month": random.randint(1, 12), "year": birth_year},
        "uniqueID": {
            "ohs": fake.numerify('########'),  # 8 digits
            "nino": f"{nino_prefix} {fake.numerify('######')} {nino_suffix}",
            "nhs": fake.numerify('### ### ####')  # Spaced for clarity
        },
        "residenceCountry": country_name if entitlement['type'] == 'S1' else random.choice(["UK", country_name] + [fake.country_code() for _ in range(3)]),
        "entitlements": [entitlement]
    }

    # Additional fields for GHIC and EHIC
    if entitlement['type'] in ['GHIC', 'EHIC']:
        person['entitlements'][0]['pin'] = 'UK' + fake.numerify('######')  # UK followed by 6 digits
        person['entitlements'][0]['issueNumber'] = fake.numerify('##')  # 1-2 digits
        issue_date = fake.date_between(start_date="-10y", end_date="today")
        person['entitlements'][0]['issueDate'] = issue_date.strftime('%d/%m/%Y')
        person['entitlements'][0]['endDate'] = (issue_date + timedelta(days=5*365)).strftime('%d/%m/%Y')

    # Field for PRC
    elif entitlement['type'] == 'PRC':
        person['entitlements'][0]['issueNumber'] = fake.numerify('##')  # 1-2 digits

    return person

def generate_invoice_id():
    return fake.numerify(text="#####")

def generate_invoice(article, entitlement, country, is_actual):
    person = generate_person(entitlement, country)
    invoice_id = generate_invoice_id()
    status_choices = ["To Check", "Accepted", "Contested", "Withdrawn"] if is_actual else ["To Check", "Accepted", "Contested", "Partial", "Withdrawn"]
    status = random.choice(status_choices)
    amount = round(random.uniform(1000, 5000), 2) if is_actual else random.randint(1, 12)  # Monetary value for actual, months for average

    invoice = {
        "invoiceID": invoice_id,
        "amount": amount,
        "date": fake.date_this_year().strftime('%d/%m/%Y'),
        "status": status,
        "person": person
    }

    # Include contestation reason if status is not "Accepted"
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

def generate_claims_for_country(country_name, details):
    country_claims = {}
    for year in range(details['start_year'], details['end_year'] + 1):
        country_claims[year] = {"articles": {"actual": {}, "average": {}}}

        # Process actual claims
        for article_info in details['actual_articles']:
            article_name = article_info['name']
            entitlements = details['entitlements'].get(article_name, [])
            country_claims[year]["articles"]["actual"][article_name] = {
                "invoices": [generate_invoice(article_name, random.choice(entitlements), country_name, True) for _ in range(random.randint(5, 10))] if entitlements else []
            }

        # Process average claims
        for article_info in details['average_articles']:
            article_name = article_info['name']
            entitlements = details['entitlements'].get(article_name, [])
            country_claims[year]["articles"]["average"][article_name] = {
                "invoices": [generate_invoice(article_name, random.choice(entitlements), country_name, False) for _ in range(random.randint(5, 10))] if entitlements else []
            }

    return country_claims

# Configuration of country-specific articles and entitlements
countries_details = {
    # Example configuration for Cyprus
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
    "France": {
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
    
    "Greece": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Austria": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
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
    "Poland": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Luxembourg": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
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
    "Slovakia": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },    # Adding more European countries with their configurations
    "Czech Republic": {
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "AW03"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S2", "form": "Scheduled treatment", "holder": "Main"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article AW03": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Latvia": {
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
    }
    
}

# Generate and save the claims data
all_claims = {country: generate_claims_for_country(country, details) for country, details in countries_details.items()}
with open('claims_data.json', 'w') as file:
    json.dump({"claims": {"countries": all_claims}}, file, indent=4)

print("Claims records have been generated and saved to 'claims_data.json'.")
