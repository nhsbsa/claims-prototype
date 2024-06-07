import json
import psycopg2

def insert_claim_data():
    with open('claims_data.json', 'r') as f:
        data = json.load(f)

    conn = psycopg2.connect(
        dbname="my_new_database",
        user="postgres",
        password="CrystalClearQuartz9785",
        host="localhost"
    )
    cur = conn.cursor()

    for country, years in data['claims']['countries'].items():
        for year, articles in years.items():
            for cost_type, articles_data in articles['articles'].items():
                for article, claim_types in articles_data.items():
                    for claim_type, claim in claim_types.items():
                        cur.execute(
                            """
                            INSERT INTO claims (claimReference, country, financialYear, articleType, claimType, claimStatus, targetDate, deadline, dateReceived, invoicesNumber, claimAmount)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING claimID;
                            """,
                            (
                                claim['claimReference'],
                                country,
                                int(year),
                                cost_type,
                                claim_type,
                                claim['status'],
                                claim['targetDate'],
                                claim['deadline'],
                                claim['received'],
                                json.dumps(claim['invoicesNumber']),
                                json.dumps(claim['claimAmount'])
                            )
                        )
                        claim_id = cur.fetchone()[0]

                        for invoice in claim['invoices']:
                            person = invoice['person']
                            cur.execute(
                                """
                                INSERT INTO persons (lastName, firstName, dob, uniqueID, address, entitlements)
                                VALUES (%s, %s, %s, %s, %s, %s) RETURNING personID;
                                """,
                                (
                                    person['lastName'],
                                    person['firstName'],
                                    f"{person['dob']['year']}-{person['dob']['month']:02d}-{person['dob']['day']:02d}",
                                    json.dumps(person['uniqueID']),
                                    json.dumps(person['address']),
                                    json.dumps(person['entitlements'])
                                )
                            )
                            person_id = cur.fetchone()[0]

                            cur.execute(
                                """
                                INSERT INTO invoices (claimID, invoiceReference, amount, date, status, person, contestationReason)
                                VALUES (%s, %s, %s, %s, %s, %s, %s);
                                """,
                                (
                                    claim_id,
                                    invoice['invoiceID'],
                                    invoice['amount'],
                                    invoice['date'],
                                    invoice['status'],
                                    json.dumps(invoice['person']),  # This should be person_id instead of json
                                    invoice.get('contestationReason', None)
                                )
                            )

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    insert_claim_data()
