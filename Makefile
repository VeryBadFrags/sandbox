# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make build   - Run build"
	@echo "  make dev     - Run dev"
	@echo "  make format  - Format project with Prettier"
	@echo "  make lint    - Run eslint"
	@echo "  make clean   - Clean up output folder"
	@echo "  make help    - Display this help message"

.PHONY: build
build: node_modules
	pnpm run build

.PHONY: dev
dev:
	deno run dev

.PHONY: format
format: node_modules
	pnpm run format

.PHONY: lint
lint: node_modules
	pnpm run lint

.PHONY: clean
clean:
	pnpm run clean

# Install dependencies if 'node_modules' is missing or outdated
node_modules: pnpm-lock.yaml package.json
	pnpm install
	@touch node_modules
