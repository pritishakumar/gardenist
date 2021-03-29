DROP DATABASE garden;
CREATE DATABASE garden;
\connect garden;

\i db-schema.sql;
\i db-seed.sql;