const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const slotSchema = new Schema({
    empId: String,
    endDate: String,
    endTime: String,
    startDate: String,
    startTime: String
});

module.exports = mongoose.model('slot', slotSchema, 'slot');