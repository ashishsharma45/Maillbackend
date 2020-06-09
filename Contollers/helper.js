
const multer = require("multer");
// const imagemin = require('imagemin');
var path = require('path');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminPngquant = require('imagemin-pngquant');

var multerStorage = multer.diskStorage({
	destination: function(req, file, callback) {		
		callback(null, "./images");
		
				
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
	},
	
});



const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};



const upload = multer({
  storage: multerStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'&& ext !== '.HEIC' && ext !== '.JPG' && ext !== '.PNG' && ext !== '.JPEG') {
        return callback(new Error('Only images are allowed'))
    }
    // else if(req.url.toString().includes("candidateBio")){
    //     if(req.url.toString().split('/')[3] === undefined){			
    //         return callback(new Error('No candidate Id Provided'));
    //     }			
    // }
    callback(null, true)
}
});



const uploadFiles = upload.array("img", 5);

exports.uploadImages = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
         // Too many images exceeding the allowed limit
        console.log("error code" + err.code)
      }
    } else if (err) {
      console.log(err)
      
    }

    next();
  });
};




// const uploadFiles = upload.array("img", 5);

// exports.uploadImages = (req, res, next) => {
// //console.log(req.body);
//   uploadFiles(req, res, err => {
//     if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
//       if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
        
//       }
//     } else if (err) {
      
//     }

//     next();
//   });
// };

// const imageFilter = function(req, file, cb) {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//         req.fileValidationError = 'Only image files are allowed!';
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// exports.imageFilter = imageFilter;

