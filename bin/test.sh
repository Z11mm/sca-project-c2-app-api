#!/bin/bash

# On any errors, abort script
set -e 

# Run the postgres container only
docker-compose up -d postgres

# use builtin pg utitity to set timeout until db is up and ready to receive connections
WAIT_FOR_PG_ISREADY='while ! pg_isready --quiet; do sleep 5; done;'

# access db terminal and run command
docker exec scacloudschool-project-api_postgres_1 bash -c '$WAIT_FOR_PG_ISREADY'

# run tests
echo 'running all tests'
jest --timeout 10000 --exit

echo 'tearing down db'
docker compose down -v --remove-orphans