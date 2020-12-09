const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const db = "mongodb+srv://interview:12stdmark789@interviewtaskcluster.dines.mongodb.net/InterviewTaskCluster?retryWrites=true&w=majority";
var http = require("http");
const Employee = require('../models/employee');
var nodemailer = require('nodemailer');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        console.log('Error !' + err);
    } else {
        console.log('connected to mongoDB');
    }
});

router.post('/registerEmployee', (req, res) => {
    let employeeData = req.body;
    let employee = new Employee(employeeData);

    Employee.find(
        {
            $or: [{
                empEmail: { $exists: true, $ne: null, $eq: employeeData.empEmail }
            },
            {
                empPhone: { $exists: true, $ne: null, $eq: employeeData.empPhone }
            }
            ]
        },
        async (err, result) => {
            if (result.length > 0) {
                res.status(200).send({ status: false, statusCode: 404, msg: 'Employee Already Exists!' });
            } else {
                employee.save((error, employee) => {
                    if (error) {
                        console.log(error);
                    } else {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'kesavarajtry@gmail.com',
                                pass: '10stdmark405'
                            }
                        });

                        var mailOptions = {
                            from: 'kesavarajtry@gmail.com',
                            to: employeeData.empEmail,
                            subject: 'Welcome Mail - Employee Management System!',
                            text: 'Hi '+ employeeData.empName +', This is a welcome email to you from us...!'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.status(200).send({ status: true, statusCode: 200, msg: "Employee Registered Successfully!", employee });
                    }
                })
            }
        }
    )
});




module.exports = router;
