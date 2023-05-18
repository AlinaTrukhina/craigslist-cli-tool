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
        const data = await searchCraigslist();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
        console.error(error);
    }
});

// const searchQuery = 'dirt';

async function searchCraigslist(searchQuery) {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // const URL = `https://minneapolis.craigslist.org/search/ela?query=nikon#search=1~list~0~0`;
    const URL = `https://minneapolis.craigslist.org/search/zip?query=${searchQuery}&sort=date#search=1~list~0~100`;
    await driver.get(URL);

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
            let location = await posts[i].findElement(By.className('meta')).getText()
            .then(result => {let array = result.match(/·(.*?)·/); return array[1];});
            
            postDetails.push({
            title: title ?? '',
            url: url ?? '',
            location: location ?? '',
        });
        }
    } catch (error) {
        console.log(error);
    }
    return postDetails;
}

// use Nodemailer to create transporter to the gmail address
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.NODE_MAILER_USER}`,
        pass: `${process.env.NODE_MAILER_USER_KEY}`
    },
})

function sendEmailorText(message, phoneNumber) {
        let textToSend = 'text';
        let htmlToSend = convertToHtml(message);
        let emailList;

        if (!phoneNumber) {
            emailList = ['alina.trukhina@gmail.com'];
        } else {
            emailList = [
                `${phoneNumber}@txt.att.net`,
                `${phoneNumber}@sms.myboostmobile.com`,
                `${phoneNumber}@msg.fi.google.com`,
                `${phoneNumber}@messaging.sprintpcs.com`,
                `${phoneNumber}@tmomail.net`,
                `${phoneNumber}@message.ting.com`,
                `${phoneNumber}@vtext.com`,
                `${phoneNumber}@txt.voice.google.com`,
            ]
            textToSend = convertToText(message);
        }

        // define options for the newsletter email
        const options = {
            from: `"${process.env.NODE_MAILER_USER}@gmail.com" <alina.trukhina@gmail.com>`, // sender address
            bcc: emailList, // list of receivers
            subject: "Your Craiglist results", // Subject line
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
        <p><a href='${message[i].url}'>${message[i].title}</a> ${message[i].location}</p>
        `
    }
    return convertedMessage;
}

// searchCraigslist('dirt').then(results => console.log(results));

const num = process.env.MY_PHONE;

searchCraigslist('dirt').then(results => sendEmailorText(results));

export { searchCraigslist, sendEmailorText }