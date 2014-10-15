RANDOM := $(shell bash -c 'echo $$RANDOM')
REVISION := $(shell git rev-parse HEAD)

.PHONY: lint

default: lint

lint:
	pep8 dashboard.py config.py utils/
	pyflakes dashboard.py config.py utils/
