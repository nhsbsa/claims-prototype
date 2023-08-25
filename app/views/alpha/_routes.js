const express = require('express')
const router = express.Router()

const axios = require('axios');


// Claims
// ----------------------------

//What type of claim is it? 
router.post('/route-claim-type', function(req,res){
    var source = req.session.data['type']
    if (type == "Main - first half year"){
        res.redirect('/alpha/version-01/claims/screen-per-question/with-navigation/create/target-date')
    }
    else if (type == "Supplemental - second half year"){
        res.redirect('/alpha/version-01/claims/screen-per-question/with-navigation/create/sub-reference')
    }
    else {
        res.redirect('/alpha/version-01/claims/screen-per-question/with-navigation/create/claim-type')
    }

})

module.exports = router