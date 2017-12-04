"use strict";
exports.__esModule = true;
var express = require("express");
var fs = require("fs");
var path = require("path");
var bodyparser = require("body-parser");
var http = require("http");
var serialnumber;
var file;
var app = express();
app.use(bodyparser.json());
app.post('/serialnumber', function (req, res) {
    serialnumber = parseInt(fs.readFileSync(path.join(__dirname, '../number')).toString());
    console.log(serialnumber);
    file = JSON.parse(fs.readFileSync(path.join(__dirname, '../serialnumbers.json')).toString());
    for (var i = 0; i < file.devices.length; i++) {
        if (file.devices[i].mac === req.body.mac) {
            return res.send(file.devices[i].number.toString() + '\n');
        }
    }
    serialnumber++;
    fs.writeFileSync(path.join(__dirname, '../number'), serialnumber);
    file.devices.push({ mac: req.body.mac, number: serialnumber });
    fs.writeFileSync(path.join(__dirname, '../serialnumbers.json'), JSON.stringify(file));
    return res.send(serialnumber.toString() + '\n');
});
var port = 2525;
var server = http.createServer(app).listen(port, function () {
    console.log('Server running on port ' + port);
    server.on('close', function () {
        console.log('Server stopped.');
    });
    server.on('err', function (err) {
        console.log(err);
    });
});

//# sourceMappingURL=main.js.map
