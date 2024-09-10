# Sabay CLI & API Server Documentation

Welcome to the Sabay CLI tool and API server documentation. This repository consists of two main components:

* <b>Sabay CLI</b> - A Node.js-based command-line interface for managing stacks and services.

* <b>Sabay API Server</b> - A Flask-based server handling authentication and stack operations.


## Table of Contents

1. [Overview](#overwiew)
2. [Installation](#installation)
3. [Usage](#usage)
    * [CLI Usage](#cli-usage)
    * [API Endpoints](#server-api-endpoints)
4. [Folder Structure](#folder-structure)
5. [Troubleshooting](#troubleshooting)


# Overview
### Sabay CLI

The <b>Sabay CLI</b> is a command-line interface designed to manage various Sabay services and stacks. With it, you can:

* Fetch an authentication token.
* Update a stack for a specified service.
* List all available stacks.
* List services for a given stack by stack name or stack ID.

### Sabay API Server

The <b>API Server</b> is a Flask-based REST API that:

* Handles token management.
* Provides endpoints for listing and updating stacks.
* Authenticates users via an external login system.


# Installation
### Prerequisites

* Node.js (v14.x or above)
* Python (v3.8 or above)
* pip (Python package manager)
* Flask and required Python modules (for API server)
* dotenv for environment variables
* Selenium and ChromeDriver (for token fetching)

### Clone the Repository

```bash
git clone https://github.com/koompi/sabay-cli
cd sabay-cli
```

### Install Dependencies

#### For the CLI:

```bash
cd cli
make
```

#### For the server-backend:

```bash
cd server
source venv/bin/activate
python main.py
```

### Environment variable `.env`
```.env
DB_URI="mongodb://localhost:27017/
USERNAME=koompi
PASSWORD=koompidummypassword
```


# Usage

### CLI Usage

The Sabay CLI can be accessed using the `sabay` command after installation. Below are the available commands and their descriptions:

```bash
Usage:
  sabay --token
    Fetch a new authentication token.

  sabay --updatestack <serviceName>
    Update the stack for the specified service.

  sabay --liststack
    List all available stacks.

  sabay --listservice <stackIdentifier>
    List services for a stack identified by name or ID.

```

### Server API Endpoints

The Flask API server provides the following endpoints:

* `/api/getAuth` (GET): Fetches an authentication token, checking if it’s older than 1 hour and retrieves a new one if necessary.
    Example:

    ```bash
    curl http://localhost:8084/api/getAuth
    ```

* `/api/updateStack` (POST): Updates a stack using the provided token.
    Example:

    ```bash
    curl -X POST -H "Authorization: Bearer <TOKEN>" -d '{"stackId": "123"}' http://localhost:8084/api/updateStack
    ```
* `/api/listStack` (GET): Lists all available stacks.
    Example:

    ```bash
    curl http://localhost:8084/api/listStack
    ```

* `/api/listservices` (POST): Retrieves the services for a stack by `stackId`.
    Example:

    ```bash
    curl -X POST -d '{"stackId": "123"}' http://localhost:8084/api/listservices
    ```

### Folder Structure

The project is divided into two main directories:

```grahpql
sabay-cli/
│
├── cli/                     # CLI tool written in Node.js
│   ├── commands/            # Contains individual command implementations
│   ├── index.js             # Main CLI entry point
│   └── package.json         # CLI dependencies
│
└── server/                  # Flask API Server
    ├── main.py              # Main Flask application
    ├── utils/               # Contains utility functions
    └── requirements.txt     # Python dependencies
```

### Troubleshooting

#### Common Issues:

1. Selenium Token Fetching Issues: If token fetching fails:
    * Ensure your credentials are correct.
    * Make sure you’re not blocked due to multiple failed login attempts.
    * Check the login URL for any updates.

2. Token Not Found in Local Storage:
    * The token might not be stored or available due to incorrect login or session issues. You may need to manually check if the site has changed its storage methods.



# `WIP (FULL DOCUMENT COMING SOON)`