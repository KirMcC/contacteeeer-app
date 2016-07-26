'use strict';

var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser'); // Body parser for fetch posted data
var data = require('./data.json');
var path = require('path');

//Creating Router() object

var router = express.Router();

app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); //Body parser use JSON data

app.use('/', router);

// Handler for all requests. Responses are given CORS headers.
router.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
    next();
});

//Deliver each route to the index file
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});

router.get('/add', function(req, res) {
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});

router.get('/edit/:id', function(req, res) {
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});

router.get('/view/:id', function(req, res) {
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});

router.get('/:type/:value', function(req, res) {
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});

//Serving static files, CSS and JS files.
app.use('/static', express.static(__dirname + '/../dist/'));

//Serving the web manifest
app.use('', express.static(__dirname + '/../'));

//Get the list of contacts
router.get('/contacts', function(req, res) {
    if (!data) {
        res.statusCode = 404;
        res.send('No JSON data found');
    } else {

            res.send(data);
            res.statusCode = 200;
        }
});

//Get the list of contacts
router.get('/contacts.js', function(req, res) {
    res.send('contactsData = ' + JSON.stringify(data));
    res.statusCode = 200;
});

//Get contact by id
router.get('/contacts/:id', function(req, res) {
    var key = 'id';
    var ID = parseInt(req.params.id, 10);
    var obj = {};
    obj[key] = ID;
    var contact = _.findWhere(data, obj);

    if (contact === 'undefined') {
        res.statusCode = 404;
        res.send('No contact found');
    } else {
        res.send(contact);
    }

});

router.get('/contacts/:type/:value', function(req, res) {
    var type = req.params.type;
    var value = req.params.value;
    var filterObj = {};
    filterObj[type] = value;
    
     var filter = _.where(data, filterObj);
    
    if (filter === 'undefined') {
        res.statusCode = 404;
        res.send('No filter found');
    } else {
        res.send(filter);
    }
    
});


//Edit Contacts
router.put('/contacts/:id', function(req, res) {
    //Converts url id to object for _.findWhere
    var key = 'id';
    var ID = parseInt(req.params.id, 10);
    var obj = {};
    obj[key] = ID;
    var contact = _.findWhere(data, obj);

    if (contact === 'undefined') {
        res.statusCode = 404;
        res.send('No contact found');
    } else {
        //Update the contact list
        contact.firstName = req.body.firstName;
        contact.lastName = req.body.lastName;
        contact.gender = req.body.gender;
        contact.jobTitle = req.body.jobTitle;
        contact.email = req.body.email;
        contact.image = req.body.image;

        //Send Ok status code
        res.statusCode = 201;
        res.send(JSON.stringify(contact));
    }
});

//Create new contact
router.post('/contacts/', function(req, res) {
    if (!req.body.hasOwnProperty('firstName') ||
            !req.body.hasOwnProperty('lastName') ||
            !req.body.hasOwnProperty('jobTitle') ||
            !req.body.hasOwnProperty('gender') ||
            !req.body.hasOwnProperty('email')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    } else {
        var lastIndex = data.length - 1;
        var newID = data[lastIndex].id + 1;

        var newContact = {
            id: newID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            jobTitle: req.body.jobTitle,
            gender: req.body.gender,
            email: req.body.email,
            image: req.body.image
        };

        data.push(newContact);
        res.statusCode = 201;
        res.send(JSON.stringify(newContact));
    }
});

//Delete Contacts
router.delete('/contacts/:id', function(req, res) {
    //Converts url id to object for _.findWhere
    var key = 'id';
    var ID = parseInt(req.params.id);
    var obj = {};
    obj[key] = ID;
    var contact = _.findWhere(data, obj);
    var lastIndex = _.indexOf(data, contact);

    if (contact === 'undefined') {
        res.statusCode = 404;
        res.send('No contact found');
    } else {
        res.statusCode = 200;
        data.splice(lastIndex, 1);
        res.json('Contact deleted!');
    }
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server running on ' + port);
});
