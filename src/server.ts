// src/server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createConnection, Connection } from 'mysql2/promise';
import { parseString } from 'xml2js';
import { readFileSync } from 'fs';

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Database Connection
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
const connection: Promise<Connection> = createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

// Read XML File and Parse Queries
const xmlData = readFileSync('./src/queries.xml', 'utf-8');
let queries: { [key: string]: string } = {};
parseString(xmlData, (err:any, result:any) => {
  if (!err) {
    queries = result.queries.query.reduce((acc: any, query: any) => {
      acc[query.$.queryId] = query._;
      return acc;
    }, {});
  } else {
    console.error('Error parsing XML:', err);
  }
});

// API Endpoints
app.get('/api/query', async (req: Request, res: Response) => {
  const queryId = req.query.queryId as string;
  const sqlQuery = queries[queryId];

  if (!sqlQuery) {
    return res.status(404).json({ message: 'QueryId not found' });
  }

  // Extract additional parameters from the request
  const queryParams = req.query;
  delete queryParams.queryId;

  // Check if the SQL query contains placeholders before attempting to replace them
  const hasPlaceholders = /\{(\w+)\}/.test(sqlQuery);
  let processedQuery = sqlQuery;

  if (hasPlaceholders) {
    // Replace placeholders in the SQL query with the values from the additional parameters
    processedQuery = sqlQuery.replace(/\{(\w+)\}/g, (_, paramName) => {
      const paramValue = queryParams[paramName];

      if (Array.isArray(paramValue)) {
        return paramValue.join(', ');
      }

      return String(paramValue) || '';
    });
  }

  try {
    const conn = await connection;
    const [rows] = await conn.query(processedQuery);
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
