.PHONY: test lint build helm-lint helm-template helm-validate ci-checks

test:
	npm run test:run

lint:
	npm run lint

build:
	npm run build

helm-lint:
	helm lint charts/ckconflux-react

helm-template:
	helm template ckconflux-react charts/ckconflux-react > /tmp/ckconflux-react-rendered.yaml

helm-validate:
	./scripts/validate-helm.sh

ci-checks: test build lint helm-validate
