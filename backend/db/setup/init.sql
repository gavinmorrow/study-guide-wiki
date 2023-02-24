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
  display_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TYPE permission_levels AS ENUM ('read', 'suggest', 'edit', 'manage');

CREATE TABLE IF NOT EXISTS guide_access (
  -- The user who is a part of the guide. 
  -- To get all the users who are a part of the guide, query the 
  -- `userId` column for the `guideId` of the guide you want.
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,

  -- The permissions the user has for the guide.
  -- If you have one, you have all the permissions below it (with a lower value)
  permission_level permission_levels NOT NULL,

  PRIMARY KEY (user_id, guide_id)
);

CREATE TABLE IF NOT EXISTS guide_sections (
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,

  PRIMARY KEY (guide_id, title)
);

COMMIT;
