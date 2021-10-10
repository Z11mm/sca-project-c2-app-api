# syntax=docker/dockerfile:1

FROM postgres:11.13

COPY /tables/ /docker-entrypoint-initdb.d/tables/
COPY /seed/ /docker-entrypoint-initdb.d/seed/
COPY deploy_schemas.sql /docker-entrypoint-initdb.d/
