const User = require('../model/UserSchema');
const jwt = require('jsonwebtoken');

// Foydalanuvchilarni olish funksiyasi
const getUser = async (req, res) => {
  try {
    const data = await User.find();
    res.json({
      success: true,
      message: "All users retrieved successfully",
      innerData: data
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// loginUser funksiyasi
const loginUser = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }


    // Generate a JWT token
    const token = jwt.sign({ username: user.username, userType: user.type }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: `Welcome, ${username}!`,
      token: token,
      userType: user.type
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Ro'yxatdan o'tish funksiyasi
const createUser = async (req, res) => {
  try {
    const { fname, lname, username, password, birthday } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }



    // Create a new user
    const newUser = new User({
      fname,
      lname,
      username,
      birthday,
    });

    // Save the new user
    await newUser.save();

    // Success message
    return res.status(201).json({
      success: true,
      message: "Registration successful!"
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  getUser,
  loginUser,
  createUser,
};

