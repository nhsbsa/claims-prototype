
import json
from faker import Faker
import random

fake = Faker()

def generate_person(entitlement):
    age = random.randint(60, 90) if entitlement['holder'] == 'Main' else random.randint(18, 59)
    birth_year = fake.date_of_birth(minimum_age=age, maximum_age=age).year
    person = {
        "lastName": fake.last_name(),
        "firstName": fake.first_name(),
        "dob": {"day": random.randint(1, 28), "month": random.randint(1, 12), "year": birth_year},
        "uniqueID": {
            "ohs": fake.bothify('OHS####'),
            "nino": fake.bothify('??######?'),
            "nhs": fake.bothify('##########')
        },
        "entitlements": [entitlement]
    }
    # Include PIN or issue number based on entitlement type
    if entitlement['type'] in ['GHIC', 'EHIC']:
        person['entitlements'][0]['pin'] = fake.numerify('UK######')
    elif entitlement['type'] == 'PRC':
        person['entitlements'][0]['issueNumber'] = fake.numerify('########')
    return person

def generate_invoice_id():
    return fake.numerify(text="#####")

def generate_invoice(article, entitlement, country, is_actual):
    person = generate_person(entitlement)
    invoice_id = generate_invoice_id()
    status_choices = ["To Check", "Accepted", "Contested", "Withdrawn"] if is_actual else ["To Check", "Accepted", "Contested", "Partial", "Withdrawn"]
    amount = round(random.uniform(1000, 5000), 2) if is_actual else random.randint(1, 12)  # Months for average claims
    return {
        "invoiceID": invoice_id,
        "amount": amount,
        "date": fake.date_this_year().strftime('%d/%m/%Y'),
        "status": random.choice(status_choices),
        "person": person
    }

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

# Example usage of the script to generate claims data for all defined countries
countries_details = {
    # Details for each country need to be properly defined here
    "Croatia": {
        "start_year": 2013, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "Article 20(2)"}],
        "average_articles": [{"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Cyprus": {
        "country_name": "Cyprus",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}]
        }
    }, 
    # Include additional countries with specific adjustments if necessary
    "Finland": {
        "country_name": "Finland",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62", "start_year": 2017}],
        "average_articles": [{"name": "Article 63", "end_year": 2016}, {"name": "Article 65", "end_year": 2016}, {"name": "Article 62(36)", "end_year": 2016}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Iceland": {
        "country_name": "Iceland",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "Article 20(2)"}],
        "average_articles": [{"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}, 
                        {"type": "S1", "form": "Dependant", "holder": "Dependant"}, {"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    # Ensure Italy also integrates year-specific logic
    "Italy": {
        "country_name": "Italy",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62", "start_year": 2013}],
        "average_articles": [{"name": "Article 63", "end_year": 2012}, {"name": "Article 65", "end_year": 2012}, {"name": "Article 20(2)", "end_year": 2012}, {"name": "Article 62(36)", "end_year": 2012}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Liechtenstein": {
        "country_name": "Liechtenstein",    
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "Article 20(2)"}],
        "average_articles": [{"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"},
                       {"type": "S1", "form": "Dependant", "holder": "Dependant"}, {"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Malta": {
        "country_name": "Malta",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Netherlands": {
        "country_name": "Netherlands",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Norway": {
        "country_name": "Norway",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Portugal": {
        "country_name": "Portugal",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Republic of Ireland": {
        "country_name": "Republic of Ireland",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Spain": {
        "country_name": "Spain",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Sweden": {
        "country_name": "Sweden",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "Switzerland": {
        "country_name": "Switzerland",
        "start_year": 2012, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}, {"name": "Article 20(2)"}],
        "average_articles": [{"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}, 
                        {"type": "S1", "form": "Dependant", "holder": "Dependant"}, {"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    },
    "UK": {
        "country_name": "United Kingdom",
        "start_year": 2010, "end_year": 2024,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [{"name": "Article 63"}, {"name": "Article 65"}, {"name": "Article 20(2)"}, {"name": "Article 62(36)"}],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Tourist"}, {"type": "S1", "form": "Worker", "holder": "Main"}],
            "Article 63": [{"type": "S1", "form": "Dependant", "holder": "Dependant"}],
            "Article 65": [{"type": "S1", "form": "Pensioner", "holder": "Main"}],
            "Article 20(2)": [{"type": "S2", "form": "Scheduled treatment", "holder": "Main"}],
            "Article 62(36)": [{"type": "DA1", "form": "IIDB", "holder": "Main"}]
        }
    }

}

# Generate and save the claims data
all_claims = {country: generate_claims_for_country(country, details) for country, details in countries_details.items()}
with open('claims_data.json', 'w') as file:
    json.dump({"claims": {"countries": all_claims}}, file, indent=4)

print("Claims records have been generated and saved to 'claims_data.json'.")
