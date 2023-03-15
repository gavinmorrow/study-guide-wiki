# Studypedia

A web app to make studying easier. It helps make study guides in a wiki format.

It uses Docker with NodeJS and PostgreSQL containers.

# API

| Endpoint | Method | Description                         |
| -------- | ------ | ----------------------------------- |
| /signup  | POST   | Creates a new user                  |
| /login   | POST   | Logs in a user                      |
| /refresh | POST   | Refreshes a user's access token     |
| /user    | GET    | Gets the current user's information |

## Reading the API docs

-   The `Params` table lists the parameters that you have to send in the request body.
-   The `Response` table lists the response that you will get from the server, in JSON.
-   The `Type` column lists the type of the parameter or response.
    -   `string` is a string of text.
    -   `uuid` is a [version 4 universally unique identifier][uuidv4], stored as a string.
    -   `jwt` is a JSON Web Token, stored as a string.
    -   `PermissionLevel` is a string that can be one of the following:
        -   `manage`
        -   `edit`
        -   `suggest`
        -   `read`

[uuidv4]: https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)

## POST /signup

Creates a new user.

### Params

| Name        | Type   | Description             |
| ----------- | ------ | ----------------------- |
| password    | string | The user's password     |
| displayName | string | The user's display name |

### Response

| Name | Type | Description   |
| ---- | ---- | ------------- |
| id   | uuid | The user's id |

## POST /login

Logs in a user.

### Params

| Name     | Type   | Description         |
| -------- | ------ | ------------------- |
| id       | uuid   | The user's UUID     |
| password | string | The user's password |

### Response

| Name         | Type | Description              |
| ------------ | ---- | ------------------------ |
| accessToken  | jwt  | The user's access token  |
| refreshToken | jwt  | The user's refresh token |

## POST /refresh

Refreshes a user's access token.

### Params

| Name         | Type | Description                  |
| ------------ | ---- | ---------------------------- |
| refreshToken | jwt  | The user's old refresh token |

### Response

| Name         | Type | Description                  |
| ------------ | ---- | ---------------------------- |
| accessToken  | jwt  | The user's new access token  |
| refreshToken | jwt  | The user's new refresh token |

## GET /user

Gets the current user's information. Requires authentication.

### Response

| Name        | Type   | Description             |
| ----------- | ------ | ----------------------- |
| id          | uuid   | The user's id           |
| displayName | string | The user's display name |

## GET /guide/:id

Gets a guide. Requires authentication.

### Response

| Name        | Type   | Description             |
| ----------- | ------ | ----------------------- |
| id          | uuid   | The guide's id          |
| title       | string | The guide's title       |
| description | string | The guide's description |
| authorId    | uuid   | The guide's author's id |
| grade       | number | The guide's grade       |
| subject     | string | The guide's subject     |
| teacher     | string | The guide's teacher     |
| year        | number | The guide's year        |
| people      | (1)    | The guide's people      |

(1) `array<{ id: uuid, permissionString: PermissionLevel }>`.

## POST /guide

Creates a new guide. Requires authentication.

### Params

| Name        | Type   | Description             |
| ----------- | ------ | ----------------------- |
| title       | string | The guide's title       |
| description | string | The guide's description |
| grade       | number | The guide's grade       |
| subject     | string | The guide's subject     |
| teacher     | string | The guide's teacher     |
| year        | number | The guide's year        |
| people      | (1)    | The guide's people      |

(1) `array<{ id: uuid, permissionString: PermissionLevel }>`.

### Response

| Name | Type | Description    |
| ---- | ---- | -------------- |
| id   | uuid | The guide's id |

## DELETE /guide/:id

Deletes a guide. Requires authentication. Requires the authenticated user to be the guide's author.

## Response

The response is empty. The status code will be `204 No Content`.

# Setup

1. Install [Docker][install-docker].
2. Clone this repository and run `docker compose up`.
    - The first time you run it (or after clearing the volumes) you have to wait
      for the database to be initialized and npm to install the dependencies.

# Making changes

-   It will automatically restart whenever you make changes to a `.js` file.
-   If you make changes to any other file, press `CTRL+C` in the terminal and then run `docker compose up`.
-   If you make any changes to the database, you have to run `docker compose down -v` to stop it, then run `docker compose up`.

# Resources

| Name                                                             | URL                                                                                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Docker website                                                   | https://www.docker.com                                                                                      |
| Docker compose documentation                                     | https://docs.docker.com/compose/                                                                            |
| pg-promise documentation                                         | http://vitaly-t.github.io/pg-promise/index.html                                                             |
| pg-promise quick reference                                       | https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example                                                |
| Using Docker Compose to Launch a PostgreSQL Database             | https://graspingtech.com/docker-compose-postgresql/                                                         |
| Node.js REST API setup with Docker Compose, Express and Postgres | https://kundan-9343.medium.com/node-js-rest-api-setup-with-docker-compose-express-and-postgres-d53fb0c77da7 |
| ECONNREFUSED for Postgres on nodeJS with dockers                 | https://stackoverflow.com/questions/33357567/econnrefused-for-postgres-on-nodejs-with-dockers               |
| docker-entrypoint-initdb.d bad interpreter: Permission denied    | https://stackoverflow.com/questions/68476734/docker-entrypoint-initdb-d-bad-interpreter-permission-denied   |
| What Are Refresh Tokens and How to Use Them Securely             | https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/                                   |

[install-docker]: https://docs.docker.com/get-docker/
