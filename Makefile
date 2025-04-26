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
	pnpm run build

.PHONY: dev
dev:
	pnpm run dev

.PHONY: format
format:
	pnpm run format

.PHONY: lint
lint:
	pnpm run lint

.PHONY: clean
clean:
	rm -rf dist/
