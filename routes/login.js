const { Router } = require('express');
const { getUser, loginUser, createUser } = require('../controllers/login');

const login = Router();

login.get('/getUser', getUser);
login.post('/login', loginUser);
login.post('/createUser', createUser);

module.exports = login;