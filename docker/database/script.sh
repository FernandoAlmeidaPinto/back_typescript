#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$PG_USER" <<-EOSQL
    CREATE DATABASE vcnafacul;
    GRANT ALL PRIVILEGES ON DATABASE vcnafacul TO adonis;
EOSQL
