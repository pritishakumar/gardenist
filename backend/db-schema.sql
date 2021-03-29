CREATE TABLE users (
    email VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(500) NOT NULL
);

CREATE TABLE plants (
    id INTEGER PRIMARY KEY,
    expiry DATE NOT NULL,
    common VARCHAR(1000) NOT NULL,
    imgs VARCHAR [],
    category VARCHAR [],
    water VARCHAR [],
    sun VARCHAR [],
    ph VARCHAR [],
    propagation VARCHAR [],
    height VARCHAR [],
    spacing VARCHAR [],
    hardiness VARCHAR [],
    location VARCHAR [],
    toxicity VARCHAR [],
    seed VARCHAR [],
    maturity VARCHAR [],
    foliage VARCHAR [],
    bloom VARCHAR []
);

CREATE TABLE lists (
    list_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL REFERENCES users ON DELETE CASCADE,
    list_name VARCHAR(50) NOT NULL
);
    CREATE INDEX email
        ON lists(email);

CREATE TABLE list_contents (
    list_id INTEGER NOT NULL REFERENCES lists ON DELETE CASCADE,
    plant_id INTEGER NOT NULL,
    common VARCHAR(500) NOT NULL,
    PRIMARY KEY (list_id, plant_id),
    custom VARCHAR(1000)  
);

