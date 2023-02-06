\set APP_DB_USER 'app'
\set APP_DB_NAME 'app_db'

CREATE USER :APP_DB_USER WITH PASSWORD 'password';
CREATE DATABASE :APP_DB_NAME;
ALTER DATABASE :APP_DB_NAME OWNER TO :APP_DB_USER;
GRANT ALL PRIVILEGES ON DATABASE :APP_DB_NAME TO :APP_DB_USER;

\connect :APP_DB_NAME :APP_DB_USER
BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password VARCHAR(255) NOT NULL,
  displayName VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT '',
  authorId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  year INT NOT NULL
);

CREATE TYPE permissions AS ENUM ('read', 'suggest', 'edit', 'manage');

CREATE TABLE IF NOT EXISTS guideAccess (
  -- The user who is a part of the guide. 
  -- To get all the users who are a part of the guide, query the 
  -- `userId` column for the `guideId` of the guide you want.
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guideId UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,

  -- The permissions the user has for the guide.
  -- If you have one, you have all the permissions below it (with a lower value)
  permissions permissions NOT NULL,

  PRIMARY KEY (userId, guideId)
);

COMMIT;
