# fastify-nodejs-application

## Setup

```bash
make setup
```

## Run

```bash
$ make start
# Open localhost:5000
```

## docker

```
docker build -t backendLvl4 .

docker run -p 3000:3000 -e SESSION_KEY=<your_key> -v /path/to/project/database.sqlite:/app/database.sqlite backendLvl4

You can are watching your db on "DB Browser for SQLite"

docker-compose up
```