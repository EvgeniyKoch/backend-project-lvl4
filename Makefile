setup: prepare-env install db-migrate

install:
	npm install

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare-env:
	cp -n .env.example .env || true

start:
	heroku local -f Procfile.dev

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

lint:
	npx eslint .

test:
	npm test -s

compose:
	docker-compose up  --remove-orphans

ci:
	docker-compose -f docker-compose.yml up --abort-on-container-exit --exit-code-from

stop:
	docker-compose stop

remove:
	docker-compose down
