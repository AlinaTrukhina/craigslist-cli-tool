#!/usr/bin/env node

import { searchCraigslist, sendEmailorText } from './scrapeSelenium.js';

// requires Selenium webdriver for you browser of choice
// install webdriver, then can run either in node or from terminal
// currently set up to search 'free stuff' section of Minneapolis craigslist for 'dirt'
// update const searchQuery to search for something else
// update URL to search a different section of craigslist

searchCraigslist('dirt').then(results => console.log(results));

searchCraigslist('table').then(results => sendEmailorText(results));
