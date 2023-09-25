
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import Server from './class/server';
import { CONFIG_CORS, SERVER_PORT } from './global/environment';
import router from './routes/router';
import invoices from './routes/superhero';
import cache from './utils/cache';
import { load } from './utils/data-loader';

const server = Server.instance;

// Load data asynchronously
async function loadData() {
  try {
    await load(fs, cache);
    console.log(`..cache ready including ${Object.keys(cache.keys()).length} object keys.\n`);
  } catch (err) {
    console.error('Error loading data:', err);
    process.exit(1);
  }
}

// Set up middleware
server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());
server.app.use(cors(CONFIG_CORS));

// Set up routes
server.app.use('/', router);
server.app.use('/invoices', invoices);

// Start the server after loading data
loadData().then(() => {
  server.start(() => {
    console.log(`server run on port ${SERVER_PORT}`);
  });
});
