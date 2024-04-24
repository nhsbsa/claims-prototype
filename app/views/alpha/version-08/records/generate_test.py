import json
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

def generate_entitlements():
    types = ["S1", "EHIC", "GHIC", "PRC", "S2", "DA1"]
    statuses = ["Issued", "Pending", "Expired", "Cancelled"]
    entitlements = []
    for _ in range(random.randint(1, 2)):  # Generate 1 to 2 entitlements per person for testing
        type = random.choice(types)
        start_date = fake.date_between(start_date="-3y", end_date="today")
        end_date = start_date + timedelta(days=365 * random.randint(1, 5))
        entitlement = {
            "entitlementType": type,
            "startDate": start_date.strftime('%d/%m/%Y'),
            "endDate": end_date.strftime('%d/%m/%Y'),
            "entitlementFor": random.choice(["Main", "Dependant"]),
            "entitlementCountry": fake.country_code(),
            "entitlementStatus": random.choice(statuses)
        }
        entitlements.append(entitlement)
    return entitlements

def generate_person(id, entitlement, country_name):
    person = {
        "id": id,
        "type": entitlement['holder'],
        "lastName": fake.last_name(),
        "firstName": fake.first_name(),
        "dob": {
            "day": random.randint(1, 28),
            "month": random.randint(1, 12),
            "year": fake.date_of_birth(minimum_age=30, maximum_age=90).year
        },
        "residentialCountry": country_name,
        "nationalInsuranceNumber": fake.bothify('??######?'),
        "nhsNumber": fake.numerify('##########'),
        "ehicGhicPin": 'UK' + fake.numerify('######'),
        "issueNumber": fake.numerify('####################'),
        "reference": fake.numerify('########'),
        "entitlements": generate_entitlements()
    }
    return person

def generate_invoice(person, article, is_actual):
    invoice_id = fake.numerify('#####')
    amount = round(random.uniform(100, 1000), 2) if is_actual else random.randint(1, 12)  # Reduced amounts for testing
    invoice = {
        "invoiceID": invoice_id,
        "amount": amount,
        "date": fake.date_this_year().strftime('%d/%m/%Y'),
        "status": random.choice(["To Check", "Accepted", "Contested", "Withdrawn"]),
        "person": person
    }
    return invoice

def generate_claims_for_country(country_name, details):
    country_claims = {}
    person_id = 1
    for year in range(details['start_year'], details['end_year'] + 1):
        year_key = str(year)
        country_claims[year_key] = {"articles": {"actual": {}, "average": {}}}

        # Reduce the number of iterations for testing
        for article_info in details['actual_articles']:
            article_name = article_info['name']
            entitlements = details['entitlements'].get(article_name, [])
            country_claims[year_key]["articles"]["actual"][article_name] = []
            for _ in range(1, 3):  # Generate a very small number of invoices for testing
                person = generate_person(person_id, random.choice(entitlements), country_name)
                invoice = generate_invoice(person, article_name, True)
                country_claims[year_key]["articles"]["actual"][article_name].append(invoice)
                person_id += 1

        # Same for average claims
        for article_info in details['average_articles']:
            article_name = article_info['name']
            entitlements = details['entitlements'].get(article_name, [])
            country_claims[year_key]["articles"]["average"][article_name] = []
            for _ in range(1, 3):
                person = generate_person(person_id, random.choice(entitlements), country_name)
                invoice = generate_invoice(person, article_name, False)
                country_claims[year_key]["articles"]["average"][article_name].append(invoice)
                person_id += 1

    return country_claims

# Reduced details for test purposes
countries_details = {
    "UK": {
        "start_year": 2023, "end_year": 2023,
        "actual_articles": [{"name": "Article 62"}],
        "average_articles": [],
        "entitlements": {
            "Article 62": [{"type": "EHIC", "holder": "Main"}]
        }
    }
}

# Generate and save the claims data
all_claims = {country: generate_claims_for_country(country, details) for country, details in countries_details.items()}
with open('test_claims_data.json', 'w') as file:
    json.dump({"claims": {"countries": all_claims}}, file, indent=4)

print("Test claims records have been generated and saved to 'test_claims_data.json'.")
