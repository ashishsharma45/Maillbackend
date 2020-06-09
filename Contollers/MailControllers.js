
"use strict";
var db = require('../DB/db');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const creds = require('../Config/config');
var mymsgs = require('../Config/msgs')








exports.registerCandidate = (req, res) => {
  console.log(req.body.email)
  console.log(req.body)
  var otp = Math.random().toString(36).slice(-8);
  console.log(otp);
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err)
      return res.status(403).send(err);
    }
    bcrypt.hash(`${otp}`, salt, (err, hash) => {
      if (err) {
        console.log(err)
        return res.status(403).send(err);
      }
      db.query("select * from candidates where mobile = $1 or email = $2 ", [req.body.mobile, req.body.email]).then((result) => {

        if (result.rows.length === 0) {
          var transport = {
            host: 'smtp.gmail.com',
            auth: {
              user: creds.USER,
              pass: creds.PASS
            }
          }
          var transporter = nodemailer.createTransport(transport)
          var mail =
          {
            from: req.body.name,
            to: req.body.email,
            subject: 'Wecome From OES ',
            html: `<p >${"hi"+ "  " +req.body.name}
                  <p>${"Your System Generated PAssword is  : " + otp}</p>
                   <p>${'We Recommand you to change password after first time login'}</p>`,
          }
          transporter.sendMail(mail, (err, data) => {
            if (err) {
              console.log(err)
              return res.status(403).send(err);
            }
          })
          db.query('insert into candidates(name, fname, mothername,nationality,scrques , answer , mobile,email,password,formstatus , newpassstatus) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING candidateid,name', [req.body.name, req.body.fname, req.body.mothername, req.body.nationality, req.body.scrques, req.body.answer, req.body.mobile, req.body.email, hash, req.body.formstatus, req.body.newpassstatus]).then((result) => {
            return res.status(200).send(result.rows[0]);
          }).catch((err) => {
            console.log(err)
            res.status(403).send(mymsgs.err(err));
          });
        }
        else {
          return res.status(400).send(mymsgs.err("Already registered"));
        }
      }).catch((err) => {
        console.log(err)
        res.status(403).send(mymsgs.err(err));
      });
    });
  });
}






exports.login = (req, res) => {

  console.log(req.body)

  if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(req.body.email).toLowerCase())) {
      res.status(400).send(mymsgs.err("Incorrect Email"));
    }
    db.query("select * from candidates where email = $1", [req.body.email]).then((result) => {
      //console.log(result);
      if (result.rows.length === 0) {
        res.status(400).send(mymsgs.err("Candidate does not exist"));
      }
      // if(result.rows[0].newpassstatus === 1 || result.rows[0].newpassstatus === 't' || result.rows[0].newpassstatus === true){                
      if (bcrypt.compare(req.body.password, result.rows[0].password, (err, resul) => {
        if (err) {
          res.status(403).send(mymsgs.err(err));
        }
        if (resul) {
          let token = jwt.sign({ _candidateid: result.rows[0].candidateid }, 'afcat567jklm').toString();
          // let token = gentoken(req.body.email);
          db.query("update candidates set token = $1 where email = $2", [token, req.body.email]).then((subresult) => {
            if (subresult.rowCount === 1) {

              delete result.rows[0]['token'];
              delete result.rows[0]['password'];
              return res.status(200).header("authorization", token).send(mymsgs.customMsg(200, "login Successful", result.rows[0]));
            }
            else {
              return res.status(400).send(mymsgs.clienterr("Something Went Wrong"));
            }
          })
            .catch((err) => {
              res.status(400).send(mymsgs.err(err));
            });
        }
        else {
          res.status(400).send(mymsgs.err("Incorrect password"))
        }
      }));

      // }else{
      //     res.status(400).send(mymsgs.err("Vendor Not Verified"));
      // }
    }).catch((err) => {
      console.log(err)
      res.status(403).send(mymsgs.err(err));
    });
  }


}




exports.changePassword = (req, res) => {

  //console.log(req);
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      //console.log(err);
      return res.status(403).send(err);
    }
    bcrypt.hash(`${req.body.password}`, salt, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(403).send(err);
      }
      //console.log(hash);
      db.query("update candidates set password  = $1 where candidateid = $2 ", [hash, req.body.canid]).then((result) => {
        if (result.rowCount > 0) {
          return res.status(200).send(mymsgs.ok("Updated Successfully"));
        } else {
          return res.status(200).send("No Update");
        }
      }).catch((err) => {
        return res.status(400).send(mymsgs.err("Incorrect password"));
      });
    });
  });

}



exports.logout = (req, res) => {
  console.log(req.query.canid)
  if (req.query.canid === '') {

    return res.status(400).send(mymsgs.err("Invalid Session"));
  }
  else {
    db.query("update candidates set token = null where candidateid = $1", [req.query.canid]).then((result) => {

      if (result.rowCount === 1) {
        res.status(200).send(mymsgs.ok("Logout Successfully"));
      }

    })
      .catch((err) => {
        res.status(403).send(mymsgs.err(err));
      })
  }
};





exports.uploadBio = (req, res) => {
  let s = "{";
  req.files.forEach(element => {
    s += mymsgs.imghost + element.originalname + ",";
  });
  s = s.slice(0, -1) + "}";
  console.log(req.body)
  db.query("select * from candidatesbiodata where candidateid = $1", [req.body.id]).then((result) => {
    if (result.rows.length === 0) {
      console.log("zebra")
      console.log(s)

      db.query("insert into candidatesbiodata(candidateid,images) values ($1,$2)", [req.body.id, s]).then((result) => {
        res.status(200).send(mymsgs.ok("Successfully Uploaded"));
      }).catch((err) => {
        console.log("this")
        console.log(err)
        res.status(403).send(mymsgs.err(err));
      });
    }
    else {
      db.query("update candidatesbiodata set images = $1 where candidateid = $2", [s, req.body.id]).then((result) => {
        res.status(200).send(mymsgs.ok("Successfully Uploaded"));
      }).catch((err) => {
        console.log(err)
        res.status(403).send(mymsgs.err(err));
      });
    }
  }).catch((err) => {
    console.log(err)
    res.status(403).send(mymsgs.err(err));
  });
};




exports.submitForm = (req, res) => {
  // console.log(req.body)
  db.query("select * from candidateform where candidateid = $1", [req.body.id]).then((result) => {
    if (result.rows.length === 0) {
      db.query("insert into candidateform(email2 ,bodymark ,gender ,marriedStatus ,dob ,graduationDetail ,graduationStream ,gradCourseDuration ,gradCollege ,gradUniversity ,gradAggregate ,dateOfGraduation, backlogStatus,hssAggregate,hssPhysicsMarks,hssMathsMark,appliedCourses ,ektType ,aboutOpening ,ssbStatus ,gateStatus ,gateYear ,gateAggregate ,prmntAddress ,prmntState ,prmntCity ,prmntPincode ,prmntStation ,prmntLandline ,aadhar ,corspAddress ,corspState ,corspCity ,corspPincode ,corspStation , candidateid) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36 )", [req.body.email2 ,req.body.bodymark ,req.body.gender ,req.body.marriedStatus ,req.body.dob ,req.body.graduationDetail ,req.body.graduationStream ,req.body.gradCourseDuration ,req.body.gradCollege ,req.body.gradUniversity ,req.body.gradAggregate ,req.body.dateOfGraduation, req.body.backlogStatus,req.body.hssAggregate,req.body.hssPhysicsMarks,req.body.hssMathsMark,req.body.appliedCourses ,req.body.ektType ,req.body.aboutOpening ,req.body.ssbStatus ,req.body.gateStatus ,req.body.gateYear ,req.body.gateAggregate ,req.body.prmntAddress ,req.body.prmntState ,req.body.prmntCity ,req.body.prmntPincode ,req.body.prmntStation ,req.body.prmntLandline ,req.body.aadhar ,req.body.corspAddress ,req.body.corspState ,req.body.corspCity ,req.body.corspPincode ,req.body.corspStation , req.body.id]).then((result) => {
        res.status(200).send(mymsgs.ok("Successfully Submit form"));
      }).catch((err) => {
        console.log(err)
        res.status(403).send(mymsgs.err(err));
      });
    }
    else {
        res.status(403).send(mymsgs.err("Form Already Submitted"));
    }
    
  }).catch((err) => {
    console.log(err)
    res.status(403).send(mymsgs.err(err));
  });
};



exports.getFormData = (req, res) => {
  console.log(req.body)
  db.query("select * from candidateform where candidateid = $1", [req.query.id]).then((result) => {
    if (result.rowCount > 0) {
      return res.status(200).send(result.rows);
    }
    else {
        res.status(403).send(mymsgs.err("Form Not Submitted"));
    }
    
  }).catch((err) => {
    console.log(err)
    res.status(403).send(mymsgs.err(err));
  });
};



exports.getBioData = (req, res) => {
  db.query("select * from candidatesbiodata where candidateid = $1", [req.query.canid]).then((result) => {
    if (result.rowCount > 0) {
      return res.status(200).send(result.rows);
    }
    else 
    {
      return res.status(403).send(mymsgs.err("Documents  Not Submitted"));
    }
    
  }).catch((err) => {
    console.log(err)
    res.status(403).send(mymsgs.err(err));
  });
};


exports.submitCityPrefer = (req, res) => {
  // console.log(req.body)
  db.query("select * from candidatescitypreference where candidateid = $1", [req.body.id]).then((result) => {
    if (result.rows.length === 0) {
      db.query("insert into candidatescitypreference( candidateid , city1 , city2 , city3 , city4 , city5) values ($1,$2,$3,$4,$5,$6 )", [req.body.canid ,req.body.city1 ,req.body.city2 ,req.body.city3 ,req.body.city4 ,req.body.city5 ]).then((result) => {
        res.status(200).send(mymsgs.ok("Successfully Submit"));
      }).catch((err) => {
        console.log(err)
        res.status(403).send(mymsgs.err(err));
      });
    }
    else {
        res.status(403).send(mymsgs.err(" Already Submitted"));
    }
    
  }).catch((err) => {
    console.log(err)
    res.status(403).send(mymsgs.err(err));
  });
};


exports.getCityPrefer = (req, res) => {
  db.query("select * from candidatescitypreference where candidateid = $1", [req.query.canid]).then((result) => {
    if (result.rowCount > 0) {
      return res.status(200).send(result.rows);
    }
    else {
        res.status(403).send(mymsgs.err("Not selected City Preference"));
    }
    
  }).catch((err) => {
    console.log(err)
    res.status(403).send(mymsgs.err(err));
  });
};




