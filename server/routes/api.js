const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const Employee = require('../models/Employee');

// file upload destination folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    // file upload extension
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
// file upload variable
const upload = multer({
    storage: storage
});

// api function export
module.exports = function(app) {
    // Get all employees
    app.get('/employees', (req, res) => {
        Employee.find({}, function(err, users) {
            if (err) throw err;
            console.log(`***[GET]*** all employees`);
            res.status(200).json(users);
        });
    });
    // Get one employee with a specific id
    app.get('/employees/:id', (req, res) => {
        let id = String(req.params.id);
        Employee.findOne({_id: id}, function(err, user) {
            if (err) throw err;
            console.log(`***[GET]*** employee with id ${id}`);
            res.status(200).json(user);
        });
    });
    // Post a new employee
    app.post('/employees', upload.single('avatar'), (req, res) => {
        const employee = new Employee({
            name: req.body.name,
            title: req.body.title,
            gender: req.body.gender,
            cell: req.body.cell,
            email: req.body.email,
            manager: req.body.manager === "" ? "" :JSON.parse(req.body.manager),
            avatar: req.file === undefined ? "Icon" : req.file.filename,
        });
        employee.save((err, data) => {
            if (err) return res.send(err);
            console.log(`***[POST]*** a new employee with id ${data._id}`);
            // Push the new employee into his/her manager's DRs, if manager exists.
            if (data.manager.id !== undefined) {
                Employee.findOneAndUpdate({_id: data.manager.id}, {$push:{direct_reports:data._id}}, (err) => {
                    if (err) {
                        console.log(`Putting new employee ${data.name} whose id is ${data._id} into his manager ${data.manager.id}'s DR failed!\n` + err);
                        return res.send(err);
                    }
                    console.log(`Putting new employee ${data.name} whose id is ${data._id} into his manager ${data.manager.id}'s DR succeed!`);
                    console.log(`***[POST]*** a new employee id ${data._id} with DR handling finished.`);
                    res.send({ message: "Employee add success" });
                });
            } else {
                console.log(`***[POST]*** a new employee id ${data._id} without DR handling finished.`);
                res.send({ message: "Employee add success" });
            }
        });
    });
    // Update a new employee
    // 1. Save the employee's own information
    // 2. Handle the manager changes if need
    app.put('/employees/:id', upload.single('avatar'), (req, res) => {
        let id = String(req.body.id);
        Employee.findOne({_id: id}, function(err, user) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            const originalManagerId = user.manager.id;
            const originalAvatar = user.avatar;
            const employee = {
                title: req.body.title,
                gender: req.body.gender,
                cell: req.body.cell,
                email: req.body.email,
                manager: req.body.manager === "undefined" ? "" : JSON.parse(req.body.manager),
                avatar: req.file === undefined ? originalAvatar : req.file.filename,
            };
            Employee.findOneAndUpdate({_id: id}, employee, (err) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                console.log(`***[Update]*** employee ${id} own information.`);
                // Delete this guy from original place and add it to the new place
                const newMangerId = employee.manager.id;
                if (originalManagerId !== newMangerId) {
                    console.log(`***[Update]*** employee ${id}---- Manager changes!`);
                    Employee.findOneAndUpdate({direct_reports: id}, { $pull: { direct_reports: id}},(err)=>{
                        if (err) {
                            console.log(err);
                            return res.send(err);
                        }
                        if (originalManagerId !== undefined) {
                            console.log(`***[Update]*** employee ${id}---- Delete him from original manager's direct reports!`);
                        } else {
                            console.log(`***[Update]*** employee ${id}---- He has no manager before!`);
                        }
                        Employee.findOneAndUpdate({_id: newMangerId}, {$push:{direct_reports:id}}, (err) => {
                            if (err) {
                                console.log(err);
                                return res.send(err);
                            }
                            if (newMangerId !== undefined) {
                                console.log(`***[Update]*** employee ${id}---- ADD him to new manager's direct reports!`);
                            } else {
                                console.log(`***[Update]*** employee ${id}---- He has no manager now!`);
                            }
                            console.log(`***[Update]*** employee ${id} with manager changes finished!`);
                            return res.send(`***[Update]*** employee ${id} with manager changes finished!`);
                        });
                    });
                } else {
                    if (newMangerId !== undefined) {
                        console.log(`***[Update]*** employee ${id} without manager changes finished!`);
                    } else {
                        console.log(`***[Update]*** employee ${id} He has no manager before and now!`)
                    }
                    console.log(`***[Update]*** employee ${id} without manager changes finished!`);
                    return res.send(`***[Update]*** employee ${id} without manager changes finished!`);
                }
            });
        });
    });
    // Delete a new employee
    app.delete('/employees/:id', (req, res) => {
        let id = String(req.params.id);
        Employee.deleteOne({_id: id}, (err) =>{
            if (err) {
                console.log(err);
                return res.send(err);
            }
            console.log(`***[Delete]*** employee ${id}!`);
            // 1->M relationship, deleted the manager, the DRs have no manager anymore, update DRS
            Employee.updateMany({"manager.id": id}, { $set: { "manager" : "" } },(err, user) =>{
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                console.log(`***[Delete]*** employee ${id} as a manager!`);
                // 1->M relationship, delete this guy as one dr, update the manager
                Employee.findOneAndUpdate({direct_reports: id}, { $pull: { direct_reports: id}},(err)=>{
                    if (err) {
                        console.log(err);
                        return res.send(err);
                    }
                    console.log(`***[Delete]*** employee ${id} as a DR from his old manger!`);
                    console.log(`***[Delete]*** employee ${id} finished!`);
                    res.send("Delete finished!")
                });
            });
        });
    });
};

