.PHONY: hello deploy
m ?= "Default commit message"

hello:
	@echo "Hello, World"
deploy:
	@echo "Deploying..."
	cd main && bun run deploy
	@echo "Deployed"