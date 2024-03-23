## Node.js Server for Executing SQL Queries

This Node.js application defines a server that can execute SQL queries based on request parameters. 

### Features

* Accepts GET requests to `/api/query` endpoint.
* Retrieves SQL queries from a pre-defined XML file (`queries.xml`).
* Maps query IDs to their corresponding SQL statements.
* Allows for parameterized queries using placeholders (`{paramName}`).
* Establishes an asynchronous connection to a MySQL database.
* Executes the requested SQL query with optional parameter replacements.
* Returns the query results as JSON on successful execution.
* Handles errors and returns appropriate error responses.

### Prerequisites

* Node.js and npm installed ([https://nodejs.org/en](https://nodejs.org/en))
* MySQL database server

### Setup

1.  Create a `.env` file in the project root directory and add your MySQL connection details:

```
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
```

2.  Ensure the `queries.xml` file is located in the `src` directory with your defined SQL queries.

### Running the Server

1.  Open a terminal in the project directory.
2.  Run `npm install` to install dependencies.
3.  Run `node src/server.ts` to start the server.

The server will listen on port `3000` by default. You can access it at `http://localhost:3000`.

### API Endpoint

**`/api/query` (GET)**

This endpoint accepts a GET request with a `queryId` parameter to specify the desired SQL query. It also accepts additional parameters that can be used as replacements for placeholders within the SQL query.

**Request Parameters:**

* `queryId` (required): The unique identifier for the SQL query defined in `queries.xml`.

**Response:**

* On success, returns a JSON object containing the results of the executed query.
* On error, returns a JSON object with an error message and appropriate HTTP status code (e.g., 404 Not Found, 500 Internal Server Error).

**Example Usage:**

```
curl http://localhost:3000/api/query?queryId=get_users
```

This request would attempt to execute the SQL query associated with `queryId=get_users` in `queries.xml` and return the results as JSON.
