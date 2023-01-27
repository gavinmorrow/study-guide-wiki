# study-guide-wiki

A web app to make studying easier. It helps make study guides in a wiki format.

## Setup

1. Install [Docker][install-docker].
2. Clone this repository and run `docker compose up`.
    - The first time you run it (or after clearing the volumes) you have to wait
      for the database to be initialized and npm to install the dependencies.

## Making changes

-   It will automatically restart whenever you make changes to a `.js` file.
-   If you make changes to any other file, press `CTRL+C` in the terminal and then run `docker compose up`.
-   If you make any changes to the database, you have to run `docker compose down -v` to stop it, then run `docker compose up`.

## Resources

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
