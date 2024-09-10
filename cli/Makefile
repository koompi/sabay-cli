# Makefile

# Variables
BIN_NAME = sabay
JS_FILE = index.mjs
NPM_BIN = $(shell npm bin -g)

# Targets
.PHONY: all install link uninstall clean

all: install link

# Install dependencies
install:
	npm install

# Link the CLI globally
link:
	@echo "Linking the CLI globally..."
	npm link

# Unlink the CLI globally
uninstall:
	@echo "Unlinking the CLI globally..."
	npm unlink

# Clean up
clean:
	@echo "Cleaning up..."
	rm -f $(NPM_BIN)/$(BIN_NAME)

# Run the CLI tool (for testing)
run:
	node $(JS_FILE)
