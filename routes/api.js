const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const db = "mongodb+srv://interview:12stdmark789@interviewtaskcluster.dines.mongodb.net/InterviewTaskCluster?retryWrites=true&w=majority";
var http = require("http");
const Employee = require('../models/employee');
const Slot = require("../models/slot")
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

router.get('/getEmployees', (req, res) => {
    Employee.aggregate([{ "$group": {
        "_id": {
            "empName": "$empName",
            "_id": "$_id"
        }
    }}], (error, user) => {
      if (error) {
        console.log(error)
      } else {
        res.status(200).send({ status: true,statusCode:200, msg: "Employee Names fetched Successfully!", data: user })
      }
    }).sort({ _id: -1 });
  });

  router.post('/saveSlot',  async(req, res) => {
    let checkStartDateandTime = await Slot.find({
            '$and':[
               {empId:{$exists:true, $eq:req.body.empId}},
               {startDate:{$exists:true, $eq:req.body.startDate}},
               {startTime:{$exists:true, $eq:req.body.startTime}}
            ]               
            }).exec();

    let checkEndDateandTime = await Slot.find({
        '$and':[
            {empId:{$exists:true, $eq:req.body.empId}},
            {endDate:{$exists:true, $eq:req.body.endDate}},
            {endTime:{$exists:true, $eq:req.body.endTime}}
         ] 
    }).exec();
      if(checkStartDateandTime.length>0)
      {
        res.status(200).send({ status: true,statusCode:400, msg: "Slot Already Alloted!" })
      }
      else if(checkEndDateandTime.length>0)
      {
        res.status(200).send({ status: true,statusCode:400, msg: "Slot Already Alloted!" })
    }
     else
      {
        let slotData = req.body;
        let slot = new Slot(slotData);
        await slot.save((error, slotData) => {
          if (error) {
          } else {
            res.status(200).send({ status: true,statusCode:200, msg: "Slot data Saved!", device: slotData });
          }
        })
      }
  });


module.exports = router;
