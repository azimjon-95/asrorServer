const Sertificat = require('../model/sertifikatSchema');

// Foydalanuvchilarni olish funksiyasi
const getSertificat = async (req, res) => {
    try {
        const data = await Sertificat.find();
        res.json({
            success: true,
            message: "All certificates retrieved successfully",
            innerData: data
        });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Sertificat yaratish funksiyasi
const createSertificat = async (req, res) => {
    try {
        const {
            fname,
            lname,
            date,
            markazNomi,
            fanNomi,
            userId
        } = req.body;

        // Optional: Validate date format if necessary
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            });
        }

        // Yangi Sertifikat yaratish
        const newSertificat = new Sertificat({
            fname,
            lname,
            date: parsedDate, // Ensure date is stored correctly
            markazNomi,
            fanNomi,
            userId
        });

        // Sertifikatni saqlash
        await newSertificat.save();

        // Muvaffaqiyatli ro'yxatdan o'tkazilganlik xabari
        return res.status(201).json({
            success: true,
            message: "Certificate created successfully!"
        });
    } catch (error) {
        console.error("Error creating certificate:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getSertificat,
    createSertificat,
};
