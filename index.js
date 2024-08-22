const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { connect } = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json()); 

const token = process.env.TELEGRAM_TOKEN;
const webUrl = 'https://certificate-1.vercel.app/'; // Web saytingiz URL manzili

const bot = new TelegramBot(token, { polling: true });

async function connectToDB() {
    try {
        await connect(process.env.MONGO_URI);
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("MongoDB is not connected", error);
    }
}
connectToDB();

app.get('/', (req, res) => {
    res.json("Hi NodeJs!");
});

// ----Routers--------
const { login } = require('./routes/login');
const { sertificat } = require('./routes/sertifikat');

app.use('/login', login);
app.use('/sertifikat', sertificat);

app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const filePath = `${__dirname}/${file.name}`;

    file.mv(filePath, async (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        try {
            const formData = new FormData();
            formData.append('document', fs.createReadStream(filePath));

            const response = await axios.post(`https://api.telegram.org/bot${token}/sendDocument`, formData, {
                headers: formData.getHeaders(),
                params: {
                    chat_id: 6039225297 // O'zingizning chat_id ni qo'shing
                },
            });

            console.log(response.data);
            res.send('File uploaded and sent to telegram bot successfully!');
        } catch (error) {
            console.error('Error sending file to Telegram bot:', error);
            res.status(500).send('Error sending file to Telegram bot.');
        } finally {
            fs.unlinkSync(filePath);
        }
    });
});

// Bot ishga tushganda
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Hello! I am a simple Telegram bot that can respond to commands.', {
            reply_markup: {
                keyboard: [
                    [{ text: "Menu", web_app: { url: webUrl } }]
                ]
            }
        });
    }
});

// ------PORT---------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} portda ishga tushdi`);
});
