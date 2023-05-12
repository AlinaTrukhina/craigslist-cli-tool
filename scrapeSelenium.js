

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import nodemailer from 'nodemailer';
import { Builder, By } from 'selenium-webdriver';

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    // web scraping goes here
    try {
        const data = await WebScrapingLocalTest();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
        console.error(error);
    }
});

const searchQuery = 'dirt';

async function searchCraigslist() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get(`https://minneapolis.craigslist.org/search/zip?query=${searchQuery}#search=1~list~0~0`);

    let searchForm = await driver.findElement(By.tagName('ol'));
    await driver.sleep(3000);
    let content = await driver.findElement(By.className('results'));
    const results = await driver.findElements(By.className('cl-search-result'));

    await driver.sleep(2000);
    return await getResults(results);

    } catch(err) {
        throw new Error(err);
    } finally {
    await driver.quit();
  }
};

async function getResults(posts) {
    let postDetails = [];
    try {
        for (let i=0; i < posts.length; i++) {
            const title = await posts[i].findElement(By.className('titlestring')).getText();
            const url = await posts[i].findElement(By.className('titlestring')).getAttribute('href');
            // const location = await post.findElement(By.css('.supertitle'));
            postDetails.push({
            title: title ?? '',
            url: url ?? '',
            // location: location ?? '',
        });
        }
    } catch (error) {
        console.log(error);
    }
    return postDetails;
}

// create transporter to the gmail address
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.NODE_MAILER_USER}`,
        pass: `${process.env.NODE_MAILER_USER_KEY}`
    },
})

function sendEmailorText(message, phoneNumber) {
        console.log(phoneNumber);
        let textToSend = 'text';
        let htmlToSend = convertToHtml(message);
        // console.log(htmlToSend);
        let emailList;

        if (!phoneNumber) {
            emailList = 'alina.trukhina@gmail.com';
        } else {
            emailList = [
                `${phoneNumber}@txt.att.net`,
                `${phoneNumber}@sms.myboostmobile.com`,
                `${phoneNumber}@msg.fi.google.com`,
                `${phoneNumber}@messaging.sprintpcs.com`,
                `${phoneNumber}@tmomail.net`,
                `${phoneNumber}@message.ting.com`,
                `${phoneNumber}@number@vtext.com`,
            ]
            textToSend = convertToText(message);
        }

        // define options for the newsletter email
        const options = {
            from: `"${process.env.NODE_MAILER_USER}@gmail.com" <alina.trukhina@gmail.com>`, // sender address
            bcc: emailList, // list of receivers
            subject: "I figured out the Craiglist scraper lol", // Subject line
            text: textToSend, // plain text body
            html: htmlToSend, // html body
        }
    
    // transporter sends the data to the email server based on options above
        transporter.sendMail(options, function (err, info) {
        if(err){
            console.error(err);
            return;
        }
        console.log('email sent!');
        });
}

function convertToText(message) {
    let convertedMessage = '';
    for (let i=0; i<message.length; i++) {
        convertedMessage += `
        ${message[i].title}: ${message[i].url} \n
        `
    }
    return convertedMessage;
}

function convertToHtml(message) {
    let convertedMessage = '';
    for (let i=0; i<message.length; i++) {
        convertedMessage += `
        <p><a href='${message[i].url}'>${message[i].title}</a></p>
        `
    }
    return convertedMessage;
}


// searchCraigslist().then(results => console.log(results));
searchCraigslist().then(results => sendEmailorText(results, '6127704491'));