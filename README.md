# Craigslist Searcher

## Description

_Duration: 4 days_

This is a simple tool for searching Craigslist, designed to be run from the command line. The tool is currently set up to search 'free stuff' section of Minneapolis craigslist for 'dirt' and email the search results to my personal email, every day at 7 am and 1 pm.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- Gmail with 2 factor authentication
- [Selenium WebDriver for Chrome](https://chromedriver.chromium.org/downloads)

## Installation

1. Install the latest version of [Selenium Webdriver for Chrome](https://chromedriver.chromium.org/downloads)
2. Set up an [app-specific password in your google account](https://support.google.com/accounts/answer/185833?hl=en)
3. Clone the GitHub repository to your computer.
4. Create a .env file in the repository, and set up the following environment variables:
⋅⋅1. NODE_MAILER_USER="your Gmail username"
⋅⋅2. NODE_MAILER_USER_KEY="app-specific password created in step 2"
⋅⋅3. MY_EMAIL="your email address"
5. Open the code in your editor of choice and run an `npm install`.
6. In your terminal, navigate to the repository directory, then run `npm start`.

## Usage

1. To search for a different item, update *searchQuery* variable 
2. To search a different city, update the *URL* in scrapeSelenium.js file.
3. To receive a text of results, update the code in index.js file from: 
```javascript 
  searchCraigslist(searchQuery).then(results => sendEmailorText(results));
  ```
  to: 
  ```javascript 
  searchCraigslist(searchQuery).then(results => sendEmailorText(results, 'PHONE NUMBER'));
  ```
4. To change the times when you receive emails, update the *cron.schedule* line. For example, to receive an email at 12:00 pm and 6:00 pm every day, update the code to
```javascript
cron.schedule('0 12,17 * * *', () => {
```
5. Run app in background with [PM2](https://pm2.keymetrics.io/):
⋅⋅1. In terminal, navigate to the repository directory.
⋅⋅2. Run `npm install pm2 -g`
⋅⋅3. Run `pm2 start index.js --name 'OPTIONAL_APP_NAME'`. PM2 will start te app, daemonize it, and run it in background.
⋅⋅4. To stop the tool, run `pm2 stop OPTIONAL_APP_NAME`.


## Built With
- JavaScript
- Express
- Selenium Webdriver
- Nodemailer
- [node-cron](https://www.npmjs.com/package/node-cron)

## Link to Code on GitHub:
https://github.com/AlinaTrukhina/craigslist-cli-tool