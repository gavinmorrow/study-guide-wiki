#!/bin/bash
echo "|----||> Initializing database..."
set -e
export PGPASSWORD=$POSTGRES_PASSWORD;
export PGUSER=$POSTGRES_USER;
export PGDATABASE=$POSTGRES_DB;
cat ./init.sql | psql # -U $POSTGRES_USER -d $POSTGRES_DB
echo "|----||> Finished initializing database..."
