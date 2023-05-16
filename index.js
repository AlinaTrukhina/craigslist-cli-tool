#!/usr/bin/env node

import { searchCraigslist, sendEmailorText } from './scrapeSelenium.js';
import cron from 'node-cron';

// requires Selenium webdriver for you browser of choice
// install webdriver, then can run either in node or from terminal
// currently set up to search 'free stuff' section of Minneapolis craigslist for 'dirt'
// update const searchQuery to search for something else
// update URL to search a different section of craigslist

cron.schedule('0 7,13 * * *', () => {
  console.log('running task at minute 0 past hour 7 and 13');
  searchCraigslist('table').then(results => sendEmailorText(results));
});