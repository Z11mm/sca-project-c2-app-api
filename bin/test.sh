#!/bin/bash

# On any errors, abort script
set -e 

# Run the postgres container only
docker-compose -f docker-compose-test.yml up -d

echo 'postgres not yet ready to accept connections...'
# use builtin pg utitity to set timeout until db is up and ready to receive connections
WAIT_FOR_PG_ISREADY='while ! pg_isready --quiet; do sleep 10; done;'

# access db terminal and run command
docker exec sca-project-backend_postgres_1 bash -c '$WAIT_FOR_PG_ISREADY'
echo 'postgres ready to accept connections'

# run tests
echo 'running all tests'
jest --testTimeout=10000

echo 'tearing down db and any other running container'
docker-compose -f docker-compose-test.yml down -v --remove-orphans