const { WebhookClient, EmbedBuilder } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

// Load environment variables
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a new webhook client using WEBHOOK_URL from .env
const webhookClient = new WebhookClient({ url: process.env["WEBHOOK_URL"] });

// If the server receive a post request in the /ko-fi endpoint
app.post('/ko-fi', async (req, res) => {

    // Get the data from the request
    const data = req.body['data'];

    // Check the verification token
    if (data.verification_token != process.env["VERIFICATION_TOKEN"]) return;

    // Separate the data into its parts
    const { message_id, timestamp, type, is_public, from_name, message, amount, url, email, currency, 
        is_subscription_payment, is_first_subscription_payment, kofi_transaction_id, tier_name } = data;

    // Create Date using MomentJS library (Because IDK why the Date object returns 52025 years)
    const date = moment(timestamp).unix();
    
    // Check if the webhook is public
    if(process.env["PUBLIC"] === 'true') {
        // Check if the user did a public donation
        if(is_public) {
            // Send the embed into the webhook
            webhookClient.send({
                embeds: [new EmbedBuilder()
                    .setTitle('New Ko-fi Donation!')
                    .setDescription('You just got a new donation in Ko-fi! Below are the details')
                    .addFields([
                        {
                            name: 'Type',
                            value: type,
                            inline: true
                        },
                        {
                            name: 'Public?',
                            value: is_public ? 'Yes' : 'No',
                            inline: true
                        },
                        {
                            name: 'Date',
                            value: `<t:${date}:F>`,
                            inline: true
                        },
                        {
                            name: 'Donator',
                            value: from_name,
                            inline: true
                        },
                        {
                            name: 'Message',
                            value: message ?? 'None',
                            inline: true
                        },
                        {
                            name: `Amount (${currency})`,
                            value: amount,
                            inline: true
                        },
                        {
                            name: 'Subscription Payment?',
                            value: is_subscription_payment ? 'Yes' : 'No',
                            inline: true
                        },
                        {
                            name: 'First Subscription Payment?',
                            value: is_first_subscription_payment ? 'Yes' : 'No',
                            inline: true
                        },
                        {
                            name: 'Tier Name',
                            value: tier_name ?? 'None',
                            inline: true
                        }
                    ])
                    .setColor('#00b0f4')
                    .setTimestamp()
            ]});
        } else {
            // Send the embed into the webhook
            webhookClient.send({
                embeds: [new EmbedBuilder()
                    .setTitle('New Ko-fi Donation!')
                    .setDescription('You just got a new donation in Ko-fi! Below are the details')
                    .addFields([
                        {
                            name: 'Type',
                            value: type,
                            inline: true
                        },
                        {
                            name: 'Public?',
                            value: is_public ? 'Yes' : 'No',
                            inline: true
                        },
                        {
                            name: 'Date',
                            value: `<t:${date}:F>`,
                            inline: true
                        },
                        {
                            name: 'Donator',
                            value: from_name,
                            inline: true,
                        },
                        {
                            name: 'Message',
                            value: message != null ? "Redacted" : "None",
                            inline: true
                        },
                        {
                            name: `Amount (${currency})`,
                            value: amount,
                            inline: true
                        },
                        {
                            name: 'Subscription Payment?',
                            value: is_subscription_payment ? "Yes" : "No",
                            inline: true
                        },
                        {
                            name: 'First Subscription Payment?',
                            value: is_first_subscription_payment ? "Yes" : "No",
                            inline: true
                        },
                        {
                            name: 'Tier Name',
                            value: tier_name ?? "None",
                            inline: true
                        }
                    ])
                    .setColor('#00b0f4')
                    .setTimestamp()
            ]})
        }
    } else {
        // Send the embed into the webhook
        webhookClient.send({
            embeds: [new EmbedBuilder()
                .setTitle('New Ko-fi Donation!')
                .setDescription('You just got a new donation in Ko-fi! Below are the details')
                .addFields([
                    {
                        name: 'Message ID',
                        value: `||${message_id}||`,
                        inline: true
                    },
                    {
                        name: 'Ko-fi Transaction ID',
                        value: `||${kofi_transaction_id}||`,
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    },
                    {
                        name: 'Type',
                        value: type,
                        inline: true
                    },
                    {
                        name: 'Date',
                        value: `<t:${date}:F>`,
                        inline: true
                    },
                    {
                        name: 'Donator',
                        value: from_name,
                        inline: true
                    },
                    {
                        name: 'Message',
                        value: message ?? "None",
                        inline: true
                    },
                    {
                        name: `Amount (${currency})`,
                        value: amount,
                        inline: true
                    },
                    {
                        name: 'URL',
                        value: `[Link](${url})`,
                        inline: true
                    },
                    {
                        name: 'Email',
                        value: email,
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    },
                    {
                        name: 'Subscription Payment?',
                        value: is_subscription_payment ? "Yes" : "No",
                        inline: true
                    },
                    {
                        name: 'First Subscription Payment?',
                        value: is_first_subscription_payment ? "Yes" : "No",
                        inline: true
                    },
                    {
                        name: 'Tier Name',
                        value: tier_name ?? "None",
                        inline: true
                    }])
                .setColor('#00b0f4')
                .setTimestamp()
        ]});
    }
    // If all fine, return the response with a 200 status code
    res.sendStatus(200);
})

// Start the server
const server = app.listen(process.env["PORT"] ?? 8080, () => {
    // Get current url using express
    const url = server.address();
    console.log(`Your webhook url is ${url.address}:${url.port}/ko-fi`);
})