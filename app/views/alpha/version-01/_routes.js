const express = require('express')
const router = express.Router()

const axios = require('axios');


// Claims - Screen per question - With navigation
// ----------------------------

//What type of claim is it? 
router.post('/route-with-nav-claim-type', function(req,res){
    var type = req.session.data['type']
    if (type == "Main"){
        res.redirect('/alpha/version-01/claims/screen-per-question/with-navigation/create/target-date')
    }
    else if (type == "Supplementary"){
        res.redirect('/alpha/version-01/claims/screen-per-question/with-navigation/create/sub-reference')
    }
    else {
        res.redirect('/alpha/version-01/claims/screen-per-question/with-navigation/create/claim-type')
    }

})

// Claims - Screen per question - Without navigation
// ----------------------------

//What type of claim is it? 
router.post('/route-without-nav-claim-type', function(req,res){
    var type = req.session.data['type']
    if (type == "Main"){
        res.redirect('/alpha/version-01/claims/screen-per-question/without-navigation/create/target-date')
    }
    else if (type == "Supplementary"){
        res.redirect('/alpha/version-01/claims/screen-per-question/without-navigation/create/sub-reference')
    }
    else {
        res.redirect('/alpha/version-01/claims/screen-per-question/without-navigation/create/claim-type')
    }

})

module.exports = router