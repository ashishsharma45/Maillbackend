var express = require('express');
var router = express.Router();
const app = express();
var mailController=require('../Contollers/MailControllers');
var uploadHandler  = require('../Contollers/helper')


router.post('/register',mailController.registerCandidate);
router.post('/login',mailController.login);
router.post('/changepassword', mailController.changePassword);
router.post('/submitForm', mailController.submitForm);
router.get('/getFormData', mailController.getFormData);
router.post('/submitCityPrefer', mailController.submitCityPrefer);
router.get('/getCityPrefer', mailController.getCityPrefer);
router.get('/getBioData', mailController.getBioData);
router.post('/candidateBio' , uploadHandler.uploadImages,mailController.uploadBio);
router.get('/logout', mailController.logout);



module.exports = router;