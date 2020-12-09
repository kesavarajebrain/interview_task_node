const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    empAge: String,
    empDob: String,
    empEmail: String,
    empGender: String,
    empName: String,
    empPhone: String
});

module.exports = mongoose.model('employee', employeeSchema, 'employee');