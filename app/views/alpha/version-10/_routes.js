const express = require('express')
const router = express.Router()

const fs = require('fs');
const path = require('path');

const axios = require('axios');

//// CREATE CLAIM ////

//// How did you receive the claim?  ////
router.post('/route-contact-method', function(req,res){
    var received = req.session.data['received']
    if (received == "RINA" ||  received == "Paper") {
        res.redirect('/alpha/version-10/claims/create/article-type')
        }
    else {
        res.redirect('/alpha/version-10/claims/create/index')
    }
})


//// Which article covers this claim?  ////
router.post('/route-create-claim', function(req,res){
    var received = req.session.data['received']
    var article = req.session.data['article']
    var averageType = req.session.data['average-type']

    if (received == 'RINA') {
        if (article == "Article 62 - actual cost" || article == "AW05 - DA1") {
            res.redirect('/alpha/version-10/claims/create/details-rina-actual')
            }
        else if (averageType == "Article 63 (2a)" || averageType == "Article 63 (2b)") {
                res.redirect('/alpha/version-10/claims/create/details-rina-average-63')
                }
        else if (averageType == "Article 94" || averageType == "Article 95") {
                res.redirect('/alpha/version-10/claims/create/details-rina-average-94-95')
                }
        else {
                res.redirect('/alpha/version-10/claims/create/article-type')
            }
            }

    else if (received == 'Paper') {
        if (article == "Article 62 - actual cost" || article == "AW05 - DA1") {
            res.redirect('/alpha/version-10/claims/create/details-paper-actual')
            }
        else if (averageType == "Article 63 (2a)" || averageType == "Article 63 (2b)") {
            res.redirect('/alpha/version-10/claims/create/details-paper-average-63')
            }
        else if (averageType == "Article 94" || averageType == "Article 95") {
            res.redirect('/alpha/version-10/claims/create/details-paper-average-94-95')
            }
        else {
                res.redirect('/alpha/version-10/claims/create/article-type')
            }
        }

    else {
            res.redirect('/alpha/version-10/claims/create/article-type')
        }
})


//Are you sure you want to cancel
router.get("/claims/create/cancel-confirmation", (req, res)=> {
    res.render("alpha/version-10/claims/create/cancel-confirmation", {referer: req.headers.referer});
});

router.post('/route-cancel-create-claim', function(req,res){
    var cancel = req.session.data['cancel']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-10/claims/index')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-10/claims/create/cancel-confirmation')
    }

})


//// UPLOAD INVOICES INITIAL JOURNEY ////

//Contact method - how was the claim submitted
router.post('/route-upload-method', function(req,res){
    var method = req.session.data['contact-method']
    if (method == "RINA" ) {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/index')
        }
    else {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/index')
    }

})


//Are you sure you want to cancel the journey
router.get("/claims/invoices/upload/cancel-confirmation", (req, res)=> {
    res.render("alpha/version-10/claims/invoices/upload/cancel-confirmation", {referer: req.headers.referer});
});

router.post('/route-cancel-upload-invoices', function(req,res){
    var cancel = req.session.data['cancel']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/summary/not-started')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/cancel-confirmation')
    }

})

//Are you sure you want to delete an uploaded invoice file
router.get("/claims/invoices/upload/delete-confirmation", (req, res)=> {
    res.render("alpha/version-10/claims/invoices/upload/delete-confirmation", {referer: req.headers.referer});
});

router.post('/route-delete-invoice-file', function(req,res){
    var cancel = req.session.data['delete']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/index?show-back=No')
    } else if (cancel == "no"){
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/cya')
    } else {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/delete-confirmation')
    }

})

//Are you sure you want to delete the additional uploaded invoice file
router.get("/claims/invoices/upload/xml/additional-delete-confirmation", (req, res)=> {
    res.render("alpha/version-10/claims/invoices/upload/xml/additional-delete-confirmation", {referer: req.headers.referer});
});

router.post('/route-delete-invoice-additional-file', function(req,res){
    var cancel = req.session.data['delete']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-10/claims/invoices/upload/xml/additional-bulk-upload')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-10/claims/invoices/upload/delete-confirmation')
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
    res.render('alpha/version-10/claims/create/cya', {fullSubmissionMonth: fullSubmissionMonth, fullTargetMonth: fullTargetMonth});
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
        res.redirect('/alpha/version-10/claims/create/error')
        }
    else {
        res.redirect('/alpha/version-10/claims/create/cya')
    }

})


//Delete claim (post MVP)
router.post('/route_delete_claim', function(req,res){
    var confirmation = req.session.data['delete-claim']
    if (confirmation == "yes" ) {
        res.redirect('/alpha/version-10/post-mvp/claim-summary/delete-confirmation')
        }
    else if (confirmation == "no"){
            res.redirect('/alpha/version-10/post-mvp/claim-summary/not-started')
            }
    else {
        res.redirect('/alpha/version-10/post-mvp/claim-summary/delete-check')
    }

})

//Upload additional invoices - initial journey
router.post('/route-additional-upload', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/index-additional-file')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/cya')
            }
    else {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/additional-file')
    }

})

//Upload additional invoices
router.post('/route-additional-invoice', function(req,res){
    var type = req.session.data['additional-invoice']
    if (type == "bulk" ) {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/xml/additional-bulk-upload')
        }
    else if (type == "single"){
            res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/create/index')
            }
    else {
        res.redirect('/alpha/version-10/claims/rina/actual-cost/6784-france/invoices/upload/options')
    }

})

//Upload additional treatments
router.post('/route-additional-upload-2', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-10/claims/invoices/upload/xml/additional-bulk-upload')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-10/claims/invoices/upload/xml/additional-bulk-cya')
            }
    else {
        res.redirect('/alpha/version-10/claims/invoices/upload/xml/additional-file-2')
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

    res.render('alpha/version-10/claims/summary/not-started', { targetDateEditFormatted: targetDateEditFormatted, targetDateFormatted: targetDateFormatted });
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
      
      res.render('version-10/claims/invoices/details/person-not-found/s1-default-search-results', { searchResults: filteredResults });
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