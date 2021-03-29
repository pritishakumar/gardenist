-- seed data
-- test user => email: test@test.com
--              password: password
--              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjE2NDUwMDc3fQ.11KGzWWRbzah6Sxgu_oHihgiEDBG7tTuErWL5sAF3xg

INSERT INTO users (email, name, password)
VALUES ('test@test.com',
    'Test User',
    '$2b$12$SFanExcCi9BeVfxEmPFVB.Y21/EeT5Z/amqNA7naLvWuqDxpsroq6');

INSERT INTO lists (email, list_name)
VALUES ('test@test.com',
    'First Garden');

INSERT INTO list_contents (list_id, plant_id, common)
VALUES (1, 788,
    'Hibiscus, Rose of Sharon, Shrub Althea'),
    (1, 56220,
    'Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut');

