.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make build   - Run build"
	@echo "  make dev     - Run dev"
	@echo "  make format  - Format code"
	@echo "  make lint    - Run eslint"
	@echo "  make clean   - Clean up output folder"
	@echo "  make help    - Display this help message"

.PHONY: build
build:
	deno run build

.PHONY: dev
dev:
	deno run dev

.PHONY: format
format:
	deno fmt

.PHONY: lint
lint:
	deno lint

.PHONY: clean
clean:
	rm -rf dist/
