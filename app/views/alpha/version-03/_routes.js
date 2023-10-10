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
        res.redirect('/alpha/version-03/claims/create/error')
        }
    else {
        res.redirect('/alpha/version-03/claims/create/cya')
    }

})

//Treatment forms
router.post('/search-treatments-filter', function(req,res){
    var status = req.session.data['filter-status']
    if (status == "all treatments" ) {
        res.redirect('/alpha/version-03/claims/treatment-forms/with-treatments')
        }
    else if (status == "to check"){
            res.redirect('/alpha/version-03/claims/treatment-forms/to-be-checked')
            }
    else if (status == "in progress"){
        res.redirect('/alpha/version-03/claims/treatment-forms/in-progress')
        }
    else if (status == "accepted" ) {
        res.redirect('/alpha/version-03/claims/treatment-forms/accepted')
        }
    else if (status == "contested"){
        res.redirect('/alpha/version-03/claims/treatment-forms/contested')
        }
    else if (status == "withdrawn"){
            res.redirect('/alpha/version-03/claims/treatment-forms/withdrawn')
        }
    else {
        res.redirect('/alpha/version-03/claims/treatment-forms/with-treatments')
    }

})

//Delete claim
router.post('/route_delete_claim', function(req,res){
    var confirmation = req.session.data['delete-claim']
    if (confirmation == "yes" ) {
        res.redirect('/alpha/version-03/claims/summary/delete-confirmation')
        }
    else if (confirmation == "no"){
            res.redirect('/alpha/version-03/claims/summary/no-treatments')
            }
    else {
        res.redirect('/alpha/version-03/claims/summary/delete-check')
    }

})








module.exports = router