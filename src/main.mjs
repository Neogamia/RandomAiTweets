import fs from "fs";
import { TwitterApi } from 'twitter-api-v2';
import { WebhookClient, EmbedBuilder } from "discord.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GemeniApiKey});

const webhookClient = new WebhookClient({ url: process.env.Hook});

const twitterClient = new TwitterApi({
    appKey: process.env.TwitterApiKey,
    appSecret: process.env.TwitterApiKeySecret,
    accessToken: process.env.TwitterAccessToken,
    accessSecret: process.env.TwitterAccessTokenSecret
});

//const user = await twitterClient.v2.userByUsername('Even7iv');

async function post() {
    fs.readFile('words.txt', 'utf-8', async (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        const lines = data.split('\n').filter(line => line.trim() !== '');
        
        var w1 = lines[Math.floor(Math.random() * lines.length)];
        var w2 = lines[Math.floor(Math.random() * lines.length)];
        var w3 = lines[Math.floor(Math.random() * lines.length)];
        var w4 = lines[Math.floor(Math.random() * lines.length)];
        var w5 = lines[Math.floor(Math.random() * lines.length)];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please generate a sentance with the following words included: ${w1}, ${w2}, ${w3}, ${w4}, ${w5} and make it sound british`,
        });
        
        console.log( `Words: ${w1} ${w2} ${w3} ${w4} ${w5} \n\n${response.text}`);

        /*try {
            await twitterClient.v2.tweet(`${w1} ${w2} ${w2} \n${response.text}`)
        } catch(err) {
            console.log(err)
        }*/

        webhookClient.send(`Words: ${w1} ${w2} ${w3} ${w4} ${w5} \n\n${response.text}`)
    });
}

//hour interval
//setInterval(post, 3600000);

//10 Minute interval
setInterval(post, 600000);