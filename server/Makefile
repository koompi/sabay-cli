# Makefile for setting up the project environment

.PHONY: all check-python venv install activate

# Default target
all: check-python venv install activate

# Check if Python is installed
check-python:
	@command -v python3 >/dev/null 2>&1 || { echo >&2 "Python 3 is required but it's not installed. Please install Python 3 and try again."; exit 1; }
	@echo "Python 3 is installed."

# Create a virtual environment if it doesn't exist
venv:
	@if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	else \
		echo "Virtual environment already exists."; \
	fi

# Install required dependencies
install:
	@echo "Installing dependencies..."
	@venv/bin/pip install -r requirements.txt

# Activate the virtual environment
activate:
	@echo "Activating virtual environment. To deactivate, run 'deactivate'."
	@echo "Run the following command to activate the virtual environment:"
	@echo "source venv/bin/activate"

# Clean the environment (optional)
clean:
	@echo "Cleaning up..."
	rm -rf venv
