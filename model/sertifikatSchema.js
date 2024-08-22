const { Schema, model } = require('mongoose');

const sertificatSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    date: { type: Date, required: true },
    markazNomi: { type: String, required: true },
    fanNomi: { type: String, required: true },
    userId: { type: Number, required: true },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Sertificat = model('Sertificat', sertificatSchema);
module.exports = Sertificat;