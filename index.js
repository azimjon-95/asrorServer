const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { connect } = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// Environment Variables
const token = process.env.TELEGRAM_TOKEN;
const webUrl = process.env.WEB_URL || 'https://certificate-1.vercel.app/';
const chatId = process.env.CHAT_ID || '6039225297'; // Store your chat ID in .env for security

// Telegram Bot Setup
const bot = new TelegramBot(token, { polling: true });

// MongoDB Connection
async function connectToDB() {
    try {
        await connect(process.env.MONGO_URI);
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
connectToDB();

// Routes
app.get('/', (req, res) => {
    res.json("Hi NodeJs!");
});

const login = require('./routes/login');
const { sertificat } = require('./routes/sertifikat');
app.use('/login', login);
app.use('/sertifikat', sertificat);

// File Upload Route
app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const filePath = `${__dirname}/${file.name}`;

    try {
        // Save the file
        await file.mv(filePath);

        // Prepare and send the file to Telegram
        const formData = new FormData();
        formData.append('document', fs.createReadStream(filePath));

        const response = await axios.post(`https://api.telegram.org/bot${token}/sendDocument`, formData, {
            headers: formData.getHeaders(),
            params: { chat_id: chatId },
        });

        console.log(response.data);
        res.send('File uploaded and sent to Telegram bot successfully!');
    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).send('Error uploading or sending file to Telegram bot.');
    } finally {
        // Clean up file after sending
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting the file:', err);
        });
    }
});

// Telegram Bot Handler
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        await bot.sendMessage(chatId, 'Hello! I am a simple Telegram bot that can respond to commands.', {
            reply_markup: {
                keyboard: [
                    [{ text: "Menu", web_app: { url: webUrl } }]
                ]
            }
        });
    } catch (error) {
        console.error('Error sending message via bot:', error);
    }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
