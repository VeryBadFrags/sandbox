# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make build   - Run build"
	@echo "  make dev     - Run dev"
	@echo "  make format  - Format project with Prettier"
	@echo "  make clean   - Clean up output folder"
	@echo "  make help    - Display this help message"

.PHONY: build
build: node_modules
	pnpm run build

.PHONY: dev
dev: node_modules
	pnpm run dev

.PHONY: clean
clean:
	pnpm run clean

.PHONY: format
format:
	pnpm run format

# Install dependencies if 'node_modules' is missing
node_modules: pnpm-lock.yaml
	pnpm install
