#!/usr/bin/env node

// import { searchCraigslist, sendEmailorText, convertToText } from './scrapeSelenium.js';
import { searchCraigslist, sendEmailorText, convertToText } from './headlessSelenium.js';
import cron from 'node-cron';

const searchQuery = 'dirt';

// cron.schedule('0 7,13 * * *', () => {
//   console.log('running task at minute 0 past hour 7 and 13');
//   searchCraigslist(searchQuery).then(results => sendEmailorText(results));
// });

cron.schedule('* * * * *', () => {
  console.log('running task at minute 0 past hour 7 and 13');
  searchCraigslist(searchQuery).then(results => sendEmailorText(results));
});