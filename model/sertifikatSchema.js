const { Schema, model } = require('mongoose')

const sertificatSchema = new Schema({
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    date: { type: Date, require: true },
    markazNomi: { type: String, require: true },
    fanNomi: { type: String, require: true },
    userId: { type: Number, require: true },

})

const Sertificat = model('sertificat', sertificatSchema);
module.exports = Sertificat;