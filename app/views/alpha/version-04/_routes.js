const express = require('express')
const router = express.Router()

const axios = require('axios');

//CREATE CLAIM

router.get('/claims/create/cya', function(req, res) {

    let fullSubmissionMonth = req.session.data['submission-date-month'] ?? 'August';
    let fullTargetMonth = req.session.data['target-date-month'] ?? 'February';

    if(req.session.data['submission-date-month']) {
        fullSubmissionMonth = Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(req.session.data['submission-date-month']));
    }
    if(req.session.data['target-date-month']) {
        fullTargetMonth = Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(req.session.data['target-date-month']));
    }
    res.render('alpha/version-04/claims/create/cya', {fullSubmissionMonth: fullSubmissionMonth, fullTargetMonth: fullTargetMonth});
})

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
        res.redirect('/alpha/version-04/claims/create/error')
        }
    else {
        res.redirect('/alpha/version-04/claims/create/cya')
    }

})

//Treatment forms
router.post('/search-treatments-filter', function(req,res){
    var status = req.session.data['filter-status']
    if (status == "all treatments" ) {
        res.redirect('/alpha/version-04/claims/invoices/no-invoices')
        }
    else if (status == "to check"){
            res.redirect('/alpha/version-04/claims/invoices/to-be-checked')
            }
    else if (status == "in progress"){
        res.redirect('/alpha/version-04/claims/invoices/in-progress')
        }
    else if (status == "accepted" ) {
        res.redirect('/alpha/version-04/claims/invoices/accepted')
        }
    else if (status == "contested"){
        res.redirect('/alpha/version-04/claims/invoices/contested')
        }
    else if (status == "withdrawn"){
            res.redirect('/alpha/version-04/claims/invoices/withdrawn')
        }
    else {
        res.redirect('/alpha/version-04/claims/invoices/no-invoices')
    }

})

//Delete claim (post MVP)
router.post('/route_delete_claim', function(req,res){
    var confirmation = req.session.data['delete-claim']
    if (confirmation == "yes" ) {
        res.redirect('/alpha/version-04/post-mvp/claim-summary/delete-confirmation')
        }
    else if (confirmation == "no"){
            res.redirect('/alpha/version-04/post-mvp/claim-summary/not-started')
            }
    else {
        res.redirect('/alpha/version-04/post-mvp/claim-summary/delete-check')
    }

})

//Upload additional treatments
router.post('/route-additional-upload', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-04/claims/invoices/upload/xml/index')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-04/claims/invoices/upload/xml/cya')
            }
    else {
        res.redirect('/alpha/version-04/claims/invoices/upload/xml/additional-file')
    }

})

//Upload additional invoices
router.post('/route-additional-invoice', function(req,res){
    var type = req.session.data['additional-invoice']
    if (type == "bulk" ) {
        res.redirect('/alpha/version-04/claims/invoices/upload/xml/additional-bulk-upload')
        }
    else if (type == "single"){
            res.redirect('/alpha/version-04/claims/invoices/create/index')
            }
    else {
        res.redirect('/alpha/version-04/claims/invoices/upload/options')
    }

})

//Upload additional treatments
router.post('/route-additional-upload-2', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-04/claims/invoices/upload/xml/additional-bulk-upload')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-04/claims/invoices/upload/xml/additional-bulk-cya')
            }
    else {
        res.redirect('/alpha/version-04/claims/invoices/upload/xml/additional-file-2')
    }

})








module.exports = router