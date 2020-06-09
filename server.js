'use strict'
var express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const creds = require('./Config/config');
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const helpers = require('./Contollers/helper');
app.use('/images',express.static(__dirname + '/images'));

const multer = require('multer');
const path = require('path');





const port = 5000;


var mailRoutes = require('./Routes/mailRoutes')


// var transport = {
//   host: 'smtp.gmail.com',
//   auth: {
//     user: creds.USER,
//     pass: creds.PASS
//   }
// }

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET , POST , PUT , PATCH , DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With , Accept , Origin, authorization');
  res.setHeader('Access-Control-Expose-Headers', 'authorization');
  next();

});


app.use('/mail', mailRoutes);




/*transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('All works fine, congratz!');
  }
});*/









app.listen(port, (res) => {
  console.log(`Listening on ${port}`)
});
