.PHONY: rundjango
rundjango:
	DEBUG=1 django-admin runserver 9090 --settings scam_sense.settings --pythonpath .


.PHONY: shell
shell:
	django-admin shell --settings scam_sense.settings --pythonpath .

.PHONY: jsdev
jsdev:
	npm run dev

.PHONY: migrate
migrate:
	python manage.py makemigrations --settings scam_sense.settings --pythonpath .
	python manage.py migrate --settings scam_sense.settings --pythonpath .

.PHONY: openapi
openapi:
	python manage.py spectacular --file scam_sense/api/openapi.yaml
	openapi-generator-cli generate -i scam_sense/api/openapi.yaml -g typescript-fetch -o openapi --additional-properties=modelPropertyNaming=original

.PHONY: migrate-app
migrate-app:
	python manage.py makemigrations $(APP)
	python manage.py migrate $(APP)

.PHONY: local-postgres-start
local-postgres-start:
	pg_ctl -D local_postgres -l logfile start
	psql postgres

.PHONY: cloud-sql-proxy
cloud-sql-proxy:
	./cloud-sql-proxy --address 0.0.0.0 -p 5633 scam-sense:us-central1:scam-sense

.PHONY: gcp-psql
gcp-psql:
	psql -d scam-sense-django -h 127.0.0.1 -p 5633 -U django-scam-sense

.PHONY: django-run
django-run:
	./manage.py shell < $(FILE)

.PHONY: build
build:
	gcloud builds submit . --region us-central1 --config cloudbuild.yaml --ignore-file .gcloudignore


.PHONY: runuwsgi
runuwsgi:
	DEBUG=1 uwsgi --http :9090 --wsgi-file wsgi/wsgi.py


.PHONY: rununicorn
rununicorn:
	DEBUG=1 GUNICORN_CMD_ARGS="--log-level debug" gunicorn -b :9090 wsgi.wsgi:application


.PHONY: deploy
deploy:
	poetry export -f requirements.txt --output requirements.txt
	npm run prod
	gcloud app deploy --quiet
