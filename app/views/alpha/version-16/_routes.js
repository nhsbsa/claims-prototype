const express = require('express')
const router = express.Router()

const fs = require('fs');
const path = require('path');

const axios = require('axios');

///////CREATE A NEW CLAIM ITERATIONS NOVEMBER 2025///////

//// How did you receive the claim?  ////
router.post('/route-create-contact', function(req,res){
    var received = req.session.data['received']
    if (received == "RINA" ||  received == "Paper") {
        res.redirect('/alpha/version-16/submissions/initial-claim/01-create/rina/01-type')
        }
    else {
        res.redirect('/alpha/version-16/submissions/initial-claim/01-create/index')
    }
})

//// Which type of claim is it?  ////
router.post('/route-create-type', function(req,res){
    var received = req.session.data['received']
    var claimType = req.session.data['claim-type']
    var articleType = req.session.data['article-type']
        if (claimType == "Actual cost - Sickness" || claimType == "Actual cost - Accident at work") {
            res.redirect('/alpha/version-16/submissions/initial-claim/01-create/rina/02a-actual')
            }

        else if (claimType == "Average cost - Sickness") {
            if (articleType == "Article 63 (2a)" || articleType == "Article 63 (2b)") {
                res.redirect('/alpha/version-16/submissions/initial-claim/01-create/rina/02b-average-63')
                }
            else if (articleType == "Article 94" || articleType == "Article 95") {
                res.redirect('/alpha/version-16/submissions/initial-claim/01-create/rina/02c-average-94-95')
                }
            else {
                    res.redirect('/alpha/version-16/submissions/initial-claim/01-create/rina/01-type')
                }
        }

        else {
                res.redirect('/alpha/version-16/submissions/initial-claim/01-create/rina/01-type')
            }
})


//////CREDIT NOTE PROCESSING//////

//// Decision - 1003912 - Non-RINA  ////
router.post('/route_decision_1003912', function(req,res){
    var decision1003912 = req.session.data['decision']
    if (decision1003912 == "partial") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/10c-20001542-months')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/10b-20001542-decision')
    }
})


//// Where do you want to withdrawn the credit amount from - 1003911 - Non-RINA  ////
router.post('/route_credit_amount_1003911', function(req,res){
    var withdraw1003911 = req.session.data['withdraw']
    if (withdraw1003911 == "both") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/04c-20001563-months')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/04b-20001563-withdraw')
    }
})

//// Decision - 1003911 - Non-RINA  ////
router.post('/route_decision_1003911', function(req,res){
    var decision1003911 = req.session.data['decision']
    if (decision1003911 == "accept") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/04b-20001563-withdraw')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/04b-20001563-decision')
    }
})

//// Are you sure you want to open the credit note - Non-RINA  ////
router.post('/route_non_rina_open', function(req,res){
    var open = req.session.data['open']
    if (open == "yes") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/03-active-average')
        }
    else if (open == "no") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/01c-pending-average')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/02-open-confirmation')
    }
})

//// Are you sure you have finished adding individual credit notes - Non-RINA  ////
router.post('/route_adding_complete', function(req,res){
    var complete = req.session.data['adding']
    if (complete == "yes") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/01c-pending-average')
        }
    else if (complete == "no") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/01-pending-average')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/non-rina/01b-adding-confirmation')
    }
})

//// Decision - 1003844 - RINA  ////
router.post('/route_decision_1003844', function(req,res){
    var decision1003842 = req.session.data['decision']
    if (decision1003842 == "accept") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/11c-003-cya')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/11b-003-decision')
    }
})

//// Decision - 1003842 - RINA  ////
router.post('/route_decision_1003842', function(req,res){
    var decision1003842 = req.session.data['decision']
    if (decision1003842 == "accept") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/04c-001-cya')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/04b-001-decision')
    }
})

//// Are you sure you want to open the credit note - RINA  ////
router.post('/route_rina_open', function(req,res){
    var open = req.session.data['open']
    if (open == "yes") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/03a-active-actual-processing')
        }
    else if (open == "no") {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/01b-pending-actual')
        }
    else {
        res.redirect('/alpha/version-16/submissions/credit-note/03-process/rina/02-open-confirmation')
    }
})


//////CREATE A NEW SUBMISSION//////

//// What type of submission would you like to add?  ////
router.post('/route_create_new_submission_6799', function(req,res){
    var submissionType = req.session.data['type']
    if (submissionType == "Contestation") {
        res.redirect('/alpha/version-16/claims/non-rina/actual-cost/france/6799/submissions/create/reply-to-contestation/01-details')
        }
        else if (submissionType == "Credit note") {
            res.redirect('/alpha/version-16/claims/non-rina/actual-cost/france/6799/submissions/create/credit-notes/01-details')
            }
    else {
        res.redirect('/alpha/version-16/claims/non-rina/actual-cost/france/6799/submissions/create/index')
    }
})

//// What type of submission would you like to add?  ////
router.post('/route_create_new_submission_6784', function(req,res){
    var submissionType = req.session.data['type']
    if (submissionType == "Contestation") {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/submissions/create/02a-contestation-actual')
        }
        else if (submissionType == "Credit note") {
            res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/submissions/create/02b-credit-note-actual')
            }
    else {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/submissions/create/01-submission-type')
    }
})



//////MANUAL PROCESSING OF INVOICES//////
// Mark invoice 20001288 as complete - age bracket check
router.post('/route-20001288-mark-complete', function(req,res){
    var ageBracket = req.session.data['age-bracket']
    var accepted = req.session.data['accepted']
    if (ageBracket == "0 to 19 years" || ageBracket == "20 to 64 years" || ageBracket == "65 years and over") {
        res.redirect('/alpha//version-16/claims/rina/average-cost/spain/5422/invoices/20001288/02-confirmation')
        }
    else {


        if (accepted == "0") {
            res.redirect('/alpha//version-16/claims/rina/average-cost/spain/5422/invoices/20001288/02-confirmation')
            }
        else {
            res.redirect('/alpha//version-16/claims/rina/average-cost/spain/5422/invoices/20001288/01b-to-check-error')
        }
    }

})

//////CLAIM SEARCH///////

router.post('/route-claim-search', function(req,res){
    var claimId = req.session.data['claim-id']
    if (claimId == "6784" || claimId == "7399") {
        res.redirect('/alpha/version-16/claims/search/individual-claim')
        }
    else {
        res.redirect('/alpha/version-16/claims/search/no-results')
    }
})



//// CREATE CLAIM ////

//// How did you receive the claim?  ////
router.post('/route-contact-method', function(req,res){
    var received = req.session.data['received']
    if (received == "RINA" ||  received == "Paper") {
        res.redirect('/alpha/version-16/claims/create/type')
        }
    else {
        res.redirect('/alpha/version-16/claims/create/index')
    }
})

//// Which type of claim is it?  ////
router.post('/route-create-claim', function(req,res){
    var received = req.session.data['received']
    var claimType = req.session.data['claim-type']
    var articleType = req.session.data['article-type']

    if (received == 'RINA') {

        if (claimType == "Actual cost - Sickness" || claimType == "Actual cost - Accident at work") {
            res.redirect('/alpha/version-16/claims/create/details-rina-actual')
            }

        else if (claimType == "Average cost - Sickness") {
            if (articleType == "Article 63 (2a)" || articleType == "Article 63 (2b)") {
                res.redirect('/alpha/version-16/claims/create/details-rina-average-63')
                }
            else if (articleType == "Article 94" || articleType == "Article 95") {
                res.redirect('/alpha/version-16/claims/create/details-rina-average-94-95')
                }
            else {
                    res.redirect('/alpha/version-16/claims/create/type')
                }
        }

        else {
                res.redirect('/alpha/version-16/claims/create/type')
            }
            }

    else if (received == 'Paper') {

        if (claimType == "Actual cost - Sickness" || claimType == "Actual cost - Accident at work") {
            res.redirect('/alpha/version-16/claims/create/details-paper-actual')
            }

        else if (claimType == "Average cost - Sickness") {
            if (articleType == "Article 63 (2a)" || articleType == "Article 63 (2b)") {
                res.redirect('/alpha/version-16/claims/create/details-paper-average-63')
                }
            else if (articleType == "Article 94" || articleType == "Article 95") {
            res.redirect('/alpha/version-16/claims/create/details-paper-average-94-95')
            }
            else {
                res.redirect('/alpha/version-16/claims/create/type')
            }

        }

        else {
                res.redirect('/alpha/version-16/claims/create/type')
            }
        }
        
    else {
            res.redirect('/alpha/version-16/claims/create/type')
        }
})



//// Which article covers this claim?  ////
router.post('/route-create-claim', function(req,res){
    var received = req.session.data['received']
    var article = req.session.data['article']

    if (received == 'RINA') {
        if (article == "Article 62 - Sickness" || article == "Article 62 - Accident at work") {
            res.redirect('/alpha/version-16/claims/create/details-rina-actual')
            }
        else if (article == "Article 63 (2a)" || article == "Article 63 (2b)") {
                res.redirect('/alpha/version-16/claims/create/details-rina-average-63')
                }
        else if (article == "Article 94" || article == "Article 95") {
                res.redirect('/alpha/version-16/claims/create/details-rina-average-94-95')
                }
        else {
                res.redirect('/alpha/version-16/claims/create/article-type')
            }
            }

    else if (received == 'Paper') {
        if (article == "Article 62 - Sickness" || article == "Article 62 - Accident at work") {
            res.redirect('/alpha/version-16/claims/create/details-paper-actual')
            }
        else if (article == "Article 63 (2a)" || article == "Article 63 (2b)") {
            res.redirect('/alpha/version-16/claims/create/details-paper-average-63')
            }
        else if (article == "Article 94" || article == "Article 95") {
            res.redirect('/alpha/version-16/claims/create/details-paper-average-94-95')
            }
        else {
                res.redirect('/alpha/version-16/claims/create/article-type')
            }
        }

    else {
            res.redirect('/alpha/version-16/claims/create/article-type')
        }
})


//Are you sure you want to cancel
router.get("/claims/create/cancel-confirmation", (req, res)=> {
    res.render("alpha/version-16/claims/create/cancel-confirmation", {referer: req.headers.referer});
});

router.post('/route-cancel-create-claim', function(req,res){
    var cancel = req.session.data['cancel']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-16/claims/index')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-16/claims/create/cancel-confirmation')
    }

})


//// UPLOAD INVOICES INITIAL JOURNEY ////

//Contact method - how was the claim submitted
router.post('/route-upload-method', function(req,res){
    var method = req.session.data['contact-method']
    if (method == "RINA" ) {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/index')
        }
    else {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/index')
    }

})


//Are you sure you want to cancel the journey
router.get("/claims/invoices/upload/cancel-confirmation", (req, res)=> {
    res.render("alpha/version-16/claims/invoices/upload/cancel-confirmation", {referer: req.headers.referer});
});

router.post('/route-cancel-upload-invoices', function(req,res){
    var cancel = req.session.data['cancel']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/summary/not-started')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/cancel-confirmation')
    }

})

//Are you sure you want to delete an uploaded invoice file
router.get("/claims/invoices/upload/delete-confirmation", (req, res)=> {
    res.render("alpha/version-16/claims/invoices/upload/delete-confirmation", {referer: req.headers.referer});
});

router.post('/route-delete-invoice-file', function(req,res){
    var cancel = req.session.data['delete']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/index?show-back=No')
    } else if (cancel == "no"){
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/cya')
    } else {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/delete-confirmation')
    }

})

//Are you sure you want to delete the additional uploaded invoice file
router.get("/claims/invoices/upload/xml/additional-delete-confirmation", (req, res)=> {
    res.render("alpha/version-16/claims/invoices/upload/xml/additional-delete-confirmation", {referer: req.headers.referer});
});

router.post('/route-delete-invoice-additional-file', function(req,res){
    var cancel = req.session.data['delete']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-16/claims/invoices/upload/xml/additional-bulk-upload')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-16/claims/invoices/upload/delete-confirmation')
    }

})

router.get('/claims/create/cya', function(req, res) {

    let fullSubmissionMonth = req.session.data['submission-date-month'] ?? 'August';
    let fullTargetMonth = req.session.data['target-date-month'] ?? 'February';

    if(req.session.data['submission-date-month']) {
        fullSubmissionMonth = Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(req.session.data['submission-date-month']));
    }
    if(req.session.data['target-date-month']) {
        fullTargetMonth = Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(req.session.data['target-date-month']));
    }
    res.render('alpha/version-16/claims/create/cya', {fullSubmissionMonth: fullSubmissionMonth, fullTargetMonth: fullTargetMonth});
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
        res.redirect('/alpha/version-16/claims/create/error')
        }
    else {
        res.redirect('/alpha/version-16/claims/create/cya')
    }

})


//Delete claim (post MVP)
router.post('/route_delete_claim', function(req,res){
    var confirmation = req.session.data['delete-claim']
    if (confirmation == "yes" ) {
        res.redirect('/alpha/version-16/post-mvp/claim-summary/delete-confirmation')
        }
    else if (confirmation == "no"){
            res.redirect('/alpha/version-16/post-mvp/claim-summary/not-started')
            }
    else {
        res.redirect('/alpha/version-16/post-mvp/claim-summary/delete-check')
    }

})

//Upload additional invoices - initial journey
router.post('/route-additional-upload', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/index-additional-file')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/cya')
            }
    else {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/additional-file')
    }

})

//Upload additional invoices
router.post('/route-additional-invoice', function(req,res){
    var type = req.session.data['additional-invoice']
    if (type == "bulk" ) {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/xml/additional-bulk-upload')
        }
    else if (type == "single"){
            res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/create/index')
            }
    else {
        res.redirect('/alpha/version-16/claims/rina/actual-cost/6784-france/invoices/upload/options')
    }

})

//Upload additional treatments
router.post('/route-additional-upload-2', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-16/claims/invoices/upload/xml/additional-bulk-upload')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-16/claims/invoices/upload/xml/additional-bulk-cya')
            }
    else {
        res.redirect('/alpha/version-16/claims/invoices/upload/xml/additional-file-2')
    }

})




// Edit target date
router.post(['/claims/summary/edit-target-date', '/claims/summary/edit-target-date-past-error', '/claims/summary/edit-target-date-day-error', '/claims/summary/edit-target-date-month-error', '/claims/summary/edit-target-date-year-error', '/claims/summary/edit-target-date-day-month-error', '/claims/summary/edit-target-date-month-year-error', '/claims/summary/edit-target-date-day-year-error', '/claims/summary/edit-target-date-invalid-error', '/claims/summary/edit-target-date-error'], function(req,res){
    const targetDayEdit = req.session.data['edit-target-day'];
    const targetMonthEdit = req.session.data['edit-target-month'];
    const targetYearEdit = req.session.data['edit-target-year'];
    const formatTargetDateEdit = targetDayEdit + '/' + targetMonthEdit + '/' + targetYearEdit;

    var targetDateEdit = new Date(formatTargetDateEdit.split('/')[2], formatTargetDateEdit.split('/')[1] - 1, formatTargetDateEdit.split('/')[0]);
    console.log(targetDateEdit);

    //Today's date
    const now = new Date();
    const yyyy = now.getFullYear();
    let mm = now.getMonth() + 1; 
    const dd = now.getDate();
    const formatToday = dd + '/' + mm + '/' + yyyy;

    console.log(formatToday);

    var todayDate = new Date(formatToday.split('/')[2], formatToday.split('/')[1] - 1, formatToday.split('/')[0]);
    console.log(todayDate);

    ///// Validate date input values using regular expressions
    var yearReg = /^(202[4-9])$/;            ///< Allows a number between 2024 and 2029
    var monthReg = /^(0?[1-9]|1[0-2])$/;               ///< Allows a number between 00 and 12
    var dayReg = /^([1-9]|1[0-9]|2[0-9]|3[0-1])$/;   ///< Allows a number between 00 and 31

    if (dayReg.test(targetDayEdit) && monthReg.test(targetMonthEdit) && yearReg.test(targetYearEdit) && targetDateEdit >= todayDate) {
        res.redirect('not-started');
      } else if (dayReg.test(targetDayEdit) && monthReg.test(targetMonthEdit) && yearReg.test(targetYearEdit) && targetDateEdit < todayDate) {
          res.redirect('edit-target-date-past-error');
      } else if (targetDayEdit == '' && monthReg.test(targetMonthEdit) && yearReg.test(targetYearEdit)) {
          res.redirect('edit-target-date-day-error');
      } else if (dayReg.test(targetDayEdit) && targetMonthEdit == '' && yearReg.test(targetYearEdit)) {
          res.redirect('edit-target-date-month-error');
      } else if (dayReg.test(targetDayEdit) && monthReg.test(targetMonthEdit) && targetYearEdit == '') {
          res.redirect('edit-target-date-year-error');
      } else if (targetDayEdit == '' && targetMonthEdit == '' && yearReg.test(targetYearEdit)) {
          res.redirect('edit-target-date-day-month-error');
      } else if (dayReg.test(targetDayEdit) && targetMonthEdit == '' && targetYearEdit == '') {
          res.redirect('edit-target-date-month-year-error');
      } else if (targetDayEdit == '' && monthReg.test(targetMonthEdit) && targetYearEdit == '') {
          res.redirect('edit-target-date-day-year-error');
      } else if (targetDayEdit == '' && targetMonthEdit == '' && targetYearEdit == '') {
          res.redirect('edit-target-date-error');
      } else {
          res.redirect('edit-target-date-invalid-error');
      }

})


// Render target date on summary in correct format
router.get('/claims/summary/not-started', function(req, res) {

    const targetDay = req.session.data['target-day'];
    const targetMonth = req.session.data['target-month'];
    const targetYear = req.session.data['target-year'];
    const formatTargetDate = targetDay + '/' + targetMonth + '/' + targetYear;

    const targetDayEdit = req.session.data['edit-target-day'];
    const targetMonthEdit = req.session.data['edit-target-month'];
    const targetYearEdit = req.session.data['edit-target-year'];
    const formatTargetDateEdit = targetDayEdit + '/' + targetMonthEdit + '/' + targetYearEdit;

    if (targetDayEdit) {

        var targetDateEdit = new Date(formatTargetDateEdit.split('/')[2], formatTargetDateEdit.split('/')[1] - 1, formatTargetDateEdit.split('/')[0]);
    
        // Convert format
        const targetDateEditOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const targetDateEditTimeFormat = new Intl.DateTimeFormat('en-GB', targetDateEditOptions);

        var targetDateEditFormatted = targetDateEditTimeFormat.format(targetDateEdit);

    } else if(!targetDayEdit && targetDay) {

        var targetDate = new Date(formatTargetDate.split('/')[2], formatTargetDate.split('/')[1] - 1, formatTargetDate.split('/')[0]);
    
        // Convert format
        const targetDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const targetDateTimeFormat = new Intl.DateTimeFormat('en-GB', targetDateOptions);

        var targetDateFormatted = targetDateTimeFormat.format(targetDate);

    } else {

        var targetDateFormatted = "9 February 2024";

    }

    res.render('alpha/version-16/claims/summary/not-started', { targetDateEditFormatted: targetDateEditFormatted, targetDateFormatted: targetDateFormatted });
})

// DYNAMIC SEARCH

router.post('/personSearch', (req, res) => {
    const formData = req.body; // Contains all the form data
    const jsonDataPath = path.join(__dirname, '/records/person_records.json');
  
    fs.readFile(jsonDataPath, (err, data) => {
      if (err) {
        console.error('Error reading person records file:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      const persons = JSON.parse(data).persons;
      const filteredResults = persons.filter(person => {
        // Check each field for a match. For fields not submitted, assume a match.
        const dobMatch = (!formData.dobDay || person.dob.day == formData.dobDay) &&
                         (!formData.dobMonth || person.dob.month == formData.dobMonth) &&
                         (!formData.dobYear || person.dob.year == formData.dobYear);
        return (!formData.type || person.type.toLowerCase().includes(formData.type.toLowerCase())) &&
               (!formData.lastName || person.lastName.toLowerCase().includes(formData.lastName.toLowerCase())) &&
               (!formData.firstName || person.firstName.toLowerCase().includes(formData.firstName.toLowerCase())) &&
               dobMatch &&
               (!formData.residentialCountry || person.residentialCountry.toLowerCase().includes(formData.residentialCountry.toLowerCase())) &&
               (!formData.nationalInsuranceNumber || person.nationalInsuranceNumber.toLowerCase().includes(formData.nationalInsuranceNumber.toLowerCase())) &&
               (!formData.nhsNumber || person.nhsNumber.includes(formData.nhsNumber)) &&
               (!formData.ehicGhicPin || person.ehicGhicPin.includes(formData.ehicGhicPin)) &&
               (!formData.issueNumber || person.issueNumber.includes(formData.issueNumber)) &&
               (!formData.reference || person.reference.includes(formData.reference));
      });

        // Assume 'filteredResults' is obtained after filtering the 'person_records.json'

        const dobOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const dobFormatter = new Intl.DateTimeFormat('en-GB', dobOptions);

        // Format DOB for each person in the results
        filteredResults.forEach(person => {
            const dob = new Date(person.dob.year, person.dob.month - 1, person.dob.day);
            person.dobFormatted = dobFormatter.format(dob);
        });
      
      res.render('version-16/claims/invoices/details/person-not-found/s1-default-search-results', { searchResults: filteredResults });
    });
  });

const notes = [];

router.post('/claims/createNote', function(req, res) {

    const currentDate = new Date();
    const formatDate = currentDate.toLocaleTimeString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'});

    res.locals.data.notes[0].date = formatDate;

    notes.push(res.locals.data.notes);
    req.session.data.notes = notes;
    res.redirect('rina/actual-cost/6752-lithuania/notes/index');
});




module.exports = router