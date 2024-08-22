const User = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Foydalanuvchilarni olish funksiyasi
const getUser = async (req, res) => {
  try {
    const data = await User.find();
    res.json({
      success: true,
      message: "All user",
      innerData: data
    });
  } catch (error) {
    console.error("Error>>>", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Login funksiyasi
const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
      });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      console.log("Password does not match for username:", username);
      return res.status(401).send({
        success: false,
        message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username, userType: user.type }, 'your_jwt_secret_key', { expiresIn: '1h' });

    return res.status(200).send({
      success: true,
      message: `Xush kelibsiz, ${username}!`,
      token: token,
      userType: user.type
    });

  } catch (error) {
    console.error("Login xatosi:", error);
    res.status(500).send({
      success: false,
      message: "Server xatosi yuz berdi"
    });
  }
};


// Ro'yxatdan o'tish funksiyasi
const createUser = async (req, res) => {
  try {
    const {
      fname,
      lname,
      username,
      password,
      birthday
    } = req.body;
    console.log(req.body);

    // Foydalanuvchi nomini mavjudligini tekshirish
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu foydalanuvchi nomi allaqachon mavjud!"
      });
    }

    // Parolni hash qilish
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Yangi foydalanuvchi yaratish
    const newUser = new User({
      fname,
      lname,
      username,
      password,
      birthday,
    });

    // Yangi foydalanuvchini saqlash
    await newUser.save();

    // Muvaffaqiyatli ro'yxatdan o'tkazilganlik xabari
    return res.status(201).json({
      success: true,
      message: "Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi!"
    });
  } catch (error) {
    console.error("Xatolik:", error);
    return res.status(500).json({
      success: false,
      message: "Server xatosi!"
    });
  }
};

module.exports = {
  getUser,
  Login,
  createUser,
};
