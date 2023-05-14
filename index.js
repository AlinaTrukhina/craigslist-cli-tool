#!/usr/bin/env node

import { searchCraigslist, sendEmailorText } from './scrapeSelenium.js';

searchCraigslist('dirt').then(results => console.log(results));

searchCraigslist('table').then(results => sendEmailorText(results));
