DROP DATABASE garden_test;
CREATE DATABASE garden_test;
\connect garden_test;

\i db-schema.sql;