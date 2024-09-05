import psycopg2
import os

# Database connection settings
local_db_params = {
    'dbname': 'my_new_database',
    'user': 'postgres',
    'password': 'CrystalClearQuartz9785',
    'host': 'localhost',
    'port': '5432'
}

heroku_db_url = 'postgres://ubobgqoqej653q:pde17990d6bbb88adeeb3f31594400217457e4d7879a67747a4affd69ccad2648@c6b7lkfdshud3i.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com:5432/d8nvfikconvdqf'

# Function to drop tables
def drop_tables(db_params):
    commands = (
        "DROP TABLE IF EXISTS invoices;",
        "DROP TABLE IF EXISTS claims;",
        "DROP TABLE IF EXISTS persons;"
    )
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        for command in commands:
            cursor.execute(command)
        conn.commit()
        cursor.close()
        conn.close()
        print("Tables dropped successfully")
    except Exception as e:
        print(f"Error dropping tables: {e}")

# Drop tables in local database
drop_tables(local_db_params)

# Drop tables in Heroku database
heroku_db_params = {
    'dbname': heroku_db_url.split('/')[-1],
    'user': heroku_db_url.split(':')[1][2:],
    'password': heroku_db_url.split(':')[2].split('@')[0],
    'host': heroku_db_url.split('@')[1].split(':')[0],
    'port': heroku_db_url.split(':')[-1].split('/')[0]
}

drop_tables(heroku_db_params)
