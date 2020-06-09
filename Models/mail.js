var db = require('../DB/db');

db.query("create table if not exists candidates(candidateid serial primary key,name varchar(50) not null, fname varchar(50) not null , mothername varchar(50) , nationality varchar(30) , scrques varchar(150) not null , answer varchar(50) not null , mobile varchar(10) unique not null , email varchar(50) unique not null , password varchar(100) not null , formstatus boolean not null , newpassstatus boolean not null)").then(()=>{
console.log("Candidates Table Created");


db.query("create table if not exists candidateform(formid serial primary key,candidateid int unique not null REFERENCES candidates(candidateid) ON DELETE CASCADE, email2 varchar(50) unique not null,bodymark varchar(255) unique not null,gender varchar(50) unique not null,marriedStatus varchar(50) not null,dob date not null,graduationDetail varchar(255) not null,graduationStream varchar(255) not null,gradCourseDuration int  not null,gradCollege varchar(50) not null,gradUniversity varchar(50) not null,gradAggregate int not null,dateOfGraduation date not null , backlogStatus varchar(10) not null,hssAggregate int  not null,hssPhysicsMarks int not null,hssMathsMark int not null,appliedCourses text [] not null,ektType varchar(10) not null,aboutOpening varchar(255) not null,ssbStatus varchar(10) not null,gateStatus varchar(10) not null,gateYear date not null,gateAggregate int not null,prmntAddress varchar(255) not null,prmntState varchar(50) not null,prmntCity varchar(50)  not null,prmntPincode bigint not null,prmntStation varchar(50) not null,prmntLandline bigint not null,aadhar bigint not null,corspAddress varchar(255)  not null,corspState varchar(50)  not null,corspCity varchar(50) not null,corspPincode bigint not null,corspStation varchar(50) unique not null)").then((resp)=>{
    console.log("table created  Candiadte Forms");
}).catch((err)=>{
    console.log(err);        
});

db.query("create table if not exists candidatesbiodata(id serial primary key,candidateid int unique not null REFERENCES candidates(candidateid) ON DELETE CASCADE,images text [])").then(()=>{
    console.log("Candidates Bio-Data Table Created");
}).catch((err)=>{
    console.log(err);
});

db.query("create table if not exists candidatescitypreference(id serial primary key,candidateid int unique not null REFERENCES candidates(candidateid) ON DELETE CASCADE,city1 varchar(100) not null , city2 varchar(100) not null , city3 varchar(100) not null , city4 varchar(100) not null , city5 varchar(100) not null)").then(()=>{
    console.log("Candidates city-preference Table Created");
}).catch((err)=>{
    console.log(err);
});




}).catch((err)=>{
    console.log(err);
});





// email2 varchar(50) unique not null,bodymark varchar(50) unique not null,gender varchar(6) unique not null,marriedStatus varchar(6) not null,dob date not null,graduationDetail varchar(25) not null,graduationStream varchar(25) not null,gradCourseDuration int  not null,gradCollege varchar(50) not null,gradUniversity varchar(50) not null,gradAggregate int not null,dateOfGraduation date not null ,backlogStatus varchar(10) not null,hssAggregate int  not null,hssPhysicsMarks int not null,hssMathsMark int not null,appliedCourses text [] not null,ektType varchar(10) not null,aboutOpening varchar(20) not null,ssbStatus varchar(10) not null,gateStatus varchar(10) not null,gateYear date not null,gateAggregate int not null,prmntAddress varchar(255) not null,prmntState varchar(50) not null,prmntCity varchar(50)  not null,prmntPincode int not null,prmntStation varchar(50) not null,prmntLandline int not null,aadhar int not null,corspAddress varchar(255)  not null,corspState varchar(50)  not null,corspCity varchar(50) not null,corspPincode int not null,corspStation varchar(50) unique not null,


