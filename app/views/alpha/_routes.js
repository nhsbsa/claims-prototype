const express = require('express')
const router = express.Router()

const axios = require('axios');


// Claims
// ----------------------------

//What type of claim do you want to create? 
router.post('/claim-source', function(req,res){
    var source = req.session.data['source']
    if (source == "rina"){
        res.redirect('claims/rina/country')
    }
    else if (source == "paper"){
        res.redirect('claims/data-source')
    }
    else if (source == "edi"){
        res.redirect('claims/data-source')
    }
    else {
        res.redirect('claims/data-source')
    }

})

module.exports = router