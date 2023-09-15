const express = require('express')
const router = express.Router()

const axios = require('axios');

//CREATE CLAIM

//Error validation 
router.post('/create-claim-validation', function(req,res){

    if (
        req.session.data['submission-date-day'] == "" | 
        req.session.data['submission-date-month'] == "" |
        req.session.data['submission-date-year'] == "" |
        req.session.data['country'] == "" |
        req.session.data['ref'] == "" |
        req.session.data['financial-year'] == "" |
        req.session.data['article'] == "" |
        req.session.data['type'] == "" |
        req.session.data['target-date-day'] == "" |
        req.session.data['target-date-month'] == "" |
        req.session.data['target-date-year'] == ""
        ) 
        {
        res.redirect('/alpha/version-02/claims/create/error')
        }
    else {
        res.redirect('/alpha/version-02/claims/create/cya')
    }

})

//Treatment forms
router.post('/search-treatments-filter', function(req,res){
    var status = req.session.data['filter-status']
    if (status == "accepted" ) {
        res.redirect('/alpha/version-02/claims/treatment-forms/accepted')
        }
    else if (status == "contested"){
        res.redirect('/alpha/version-02/claims/treatment-forms/contested')
        }
    else if (status == "to be checked"){
        res.redirect('/alpha/version-02/claims/treatment-forms/to-be-checked')
        }
        else if (status == "withdrawn"){
            res.redirect('/alpha/version-02/claims/treatment-forms/withdrawn')
        }
    else {
        res.redirect('/alpha/version-02/claims/treatment-forms/with-treatments')
    }

})







module.exports = router