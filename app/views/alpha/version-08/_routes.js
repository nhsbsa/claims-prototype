const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
require('pg');
const moment = require('moment');
const pool = require('../../../../configs/db'); // Corrected import path

//// CREATE CLAIM ////

//Are you sure you want to cancel
router.get("/claims/create/cancel-confirmation", (req, res)=> {
    res.render("alpha/version-08/claims/create/cancel-confirmation", {referer: req.headers.referer});
});

router.post('/route-cancel-create-claim', function(req,res){
    var cancel = req.session.data['cancel']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-08/claims/index')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-08/claims/create/cancel-confirmation')
    }

})


//// UPLOAD INVOICES INITIAL JOURNEY ////

//Contact method - how was the claim submitted
router.post('/route-upload-method', function(req,res){
    var method = req.session.data['contact-method']
    if (method == "RINA" ) {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/index')
        }
    else {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/index')
    }

})


//Are you sure you want to cancel the journey
router.get("/claims/invoices/upload/cancel-confirmation", (req, res)=> {
    res.render("alpha/version-08/claims/invoices/upload/cancel-confirmation", {referer: req.headers.referer});
});

router.post('/route-cancel-upload-invoices', function(req,res){
    var cancel = req.session.data['cancel']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/summary/not-started')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/cancel-confirmation')
    }

})

//Are you sure you want to delete an uploaded invoice file
router.get("/claims/invoices/upload/delete-confirmation", (req, res)=> {
    res.render("alpha/version-08/claims/invoices/upload/delete-confirmation", {referer: req.headers.referer});
});

router.post('/route-delete-invoice-file', function(req,res){
    var cancel = req.session.data['delete']

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/index?show-back=No')
    } else if (cancel == "no"){
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/cya')
    } else {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/delete-confirmation')
    }

})

//Are you sure you want to delete the additional uploaded invoice file
router.get("/claims/invoices/upload/xml/additional-delete-confirmation", (req, res)=> {
    res.render("alpha/version-08/claims/invoices/upload/xml/additional-delete-confirmation", {referer: req.headers.referer});
});

router.post('/route-delete-invoice-additional-file', function(req,res){
    var cancel = req.session.data['delete']
    var back = req.session.data['referer'] || "/";

    if (cancel == "yes" ) {
        res.redirect('/alpha/version-08/claims/invoices/upload/xml/additional-bulk-upload')
    } else if (cancel == "no"){
        return res.redirect(back)
    } else {
        res.redirect('/alpha/version-08/claims/invoices/upload/delete-confirmation')
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
    res.render('alpha/version-08/claims/create/cya', {fullSubmissionMonth: fullSubmissionMonth, fullTargetMonth: fullTargetMonth});
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
        res.redirect('/alpha/version-08/claims/create/error')
        }
    else {
        res.redirect('/alpha/version-08/claims/create/cya')
    }

})


//Delete claim (post MVP)
router.post('/route_delete_claim', function(req,res){
    var confirmation = req.session.data['delete-claim']
    if (confirmation == "yes" ) {
        res.redirect('/alpha/version-08/post-mvp/claim-summary/delete-confirmation')
        }
    else if (confirmation == "no"){
            res.redirect('/alpha/version-08/post-mvp/claim-summary/not-started')
            }
    else {
        res.redirect('/alpha/version-08/post-mvp/claim-summary/delete-check')
    }

})

//Upload additional invoices - initial journey
router.post('/route-additional-upload', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/index-additional-file')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/cya')
            }
    else {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/additional-file')
    }

})

//Upload additional invoices
router.post('/route-additional-invoice', function(req,res){
    var type = req.session.data['additional-invoice']
    if (type == "bulk" ) {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/xml/additional-bulk-upload')
        }
    else if (type == "single"){
            res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/create/index')
            }
    else {
        res.redirect('/alpha/version-08/claims/rina/actual-cost/6784-france/invoices/upload/options')
    }

})

//Upload additional treatments
router.post('/route-additional-upload-2', function(req,res){
    var upload = req.session.data['additional-upload']
    if (upload == "yes" ) {
        res.redirect('/alpha/version-08/claims/invoices/upload/xml/additional-bulk-upload')
        }
    else if (upload == "no"){
            res.redirect('/alpha/version-08/claims/invoices/upload/xml/additional-bulk-cya')
            }
    else {
        res.redirect('/alpha/version-08/claims/invoices/upload/xml/additional-file-2')
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

    res.render('alpha/version-08/claims/summary/not-started', { targetDateEditFormatted: targetDateEditFormatted, targetDateFormatted: targetDateFormatted });
})

// DYNAMIC SEARCH

// Claim Search
router.post('/claimSearch', async (req, res) => {
    const { claimID, claimReference, country, financialYear } = req.body;

    try {
        const query = `
            SELECT * FROM claims
            WHERE
            ($1::int IS NULL OR claimid = $1) AND
            ($2::text IS NULL OR claimreference ILIKE $2) AND
            ($3::text IS NULL OR country ILIKE $3) AND
            ($4::int IS NULL OR financialyear = $4);
        `;
        const params = [
            claimID ? parseInt(claimID) : null,
            claimReference ? `%${claimReference}%` : null,
            country ? `%${country}%` : null,
            financialYear ? parseInt(financialYear) : null
        ];
        const result = await pool.query(query, params);
        res.render('alpha/version-08/claims/search-results', {
            searchResults: result.rows,
            searchQuery: req.body,
            claimID, // Pass claimID to the view
            country // Pass country to the view
        });
    } catch (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Function to round numbers to two decimal places if necessary
function roundNumber(num) {
    if (num % 1 !== 0) {
        return parseFloat(num.toFixed(2));
    }
    return num;
}

// API endpoint to fetch claim details by claimid
router.get('/claims/claim/:claimid', async (req, res) => {
    const id = parseInt(req.params.claimid);

    try {
        const result = await pool.query('SELECT * FROM claims WHERE claimid = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Claim not found');
            return;
        }

        const claim = result.rows[0];

        // Format dates
        try {
            claim.targetdate = moment(claim.targetdate).format('DD MMMM YYYY');
            claim.deadline = moment(claim.deadline).format('DD MMMM YYYY');
            claim.datereceived = moment(claim.datereceived).format('DD MMMM YYYY');
        } catch (dateError) {
            console.error('Error formatting dates:', dateError);
            res.status(500).send('Internal Server Error - Date Formatting');
            return;
        }

        // Round numbers to two decimal places if necessary
        try {
            if (claim.claimamount) {
                claim.claimamount = {
                    total: roundNumber(claim.claimamount.total),
                    toCheck: roundNumber(claim.claimamount.toCheck),
                    accepted: roundNumber(claim.claimamount.accepted),
                    contested: roundNumber(claim.claimamount.contested),
                    withdrawn: roundNumber(claim.claimamount.withdrawn)
                };
            }
            if (claim.invoicesnumber) {
                claim.invoicesnumber = {
                    total: claim.invoicesnumber.total,
                    toCheck: claim.invoicesnumber.toCheck,
                    accepted: claim.invoicesnumber.accepted,
                    contested: claim.invoicesnumber.contested,
                    withdrawn: claim.invoicesnumber.withdrawn
                };
            }
        } catch (numberError) {
            console.error('Error rounding numbers:', numberError);
            res.status(500).send('Internal Server Error - Number Rounding');
            return;
        }

        res.render('alpha/version-08/claims/rina/default/summary/active-invoices-uploaded', { claim });
    } catch (err) {
        console.error('Error fetching claim details:', err);
        res.status(500).send('Internal Server Error - Fetching Claim');
    }
});


// Route to render the full-invoice-list page with claimid
router.get('/claims/invoices/:claimid', async (req, res) => {
    const { claimid } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const invoicesQuery = `
        SELECT
            invoices.invoiceid,
            invoices.invoicereference,
            invoices.person->>'lastname' AS lastname,
            invoices.person->>'firstname' AS firstname,
            CASE
                WHEN invoices.person->'entitlements'->0->>'type' ~* '(S1|S2|DA1|GHIC|EHIC|PRC)' THEN
                    regexp_replace(invoices.person->'entitlements'->0->>'type', '.*(S1|S2|DA1|GHIC|EHIC|PRC).*', '\\1')
                ELSE
                    'Unknown'
            END AS entitlement,
            invoices.status
        FROM invoices
        WHERE invoices.claimid = $1
        ORDER BY invoices.invoiceid
        LIMIT $2 OFFSET $3
    `;

    try {
        const invoices = await pool.query(invoicesQuery, [claimid, limit, offset]);

        const totalQuery = `
            SELECT COUNT(*) as total
            FROM invoices
            WHERE claimid = $1
        `;
        const totalResult = await pool.query(totalQuery, [claimid]);
        const totalInvoices = totalResult.rows[0].total;

        const claimQuery = 'SELECT country FROM claims WHERE claimid = $1';
        const claimResult = await pool.query(claimQuery, [claimid]);
        const claimCountry = claimResult.rows[0]?.country || '';

        res.render('alpha/version-08/claims/rina/default/invoices/full-invoice-list', {
            claimid,
            country: claimCountry,
            searchResults: invoices.rows,
            totalInvoices,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(totalInvoices / limit)
        });
    } catch (err) {
        console.error('Error in /claims/invoices/:claimid route:', err);
        res.status(500).send('Server Error');
    }
});

// Invoice
router.post('/invoiceSearch', async (req, res) => {
    const { claimid, country, invoiceID, invoiceReference, lastName, firstName } = req.body;

    if (!claimid) {
        return res.status(400).send('Bad Request: claimid is required');
    }

    try {
        const query = `
            SELECT
                invoices.invoiceid,
                invoices.invoicereference,
                invoices.person->>'lastname' AS lastname,
                invoices.person->>'firstname' AS firstname,
                CASE
                    WHEN invoices.person->'entitlements'->0->>'type' ~* '(S1|S2|DA1|GHIC|EHIC|PRC)' THEN
                        regexp_replace(invoices.person->'entitlements'->0->>'type', '.*(S1|S2|DA1|GHIC|EHIC|PRC).*', '\\1')
                    ELSE
                        'Unknown'
                END AS entitlement,
                invoices.status
            FROM invoices
            WHERE invoices.claimid = $1
            AND ($2::int IS NULL OR invoices.invoiceid = $2)
            AND ($3::text IS NULL OR invoices.invoicereference ILIKE $3)
            AND ($4::text IS NULL OR invoices.person->>'lastname' ILIKE $4)
            AND ($5::text IS NULL OR invoices.person->>'firstname' ILIKE $5);
        `;
        const params = [
            claimid ? parseInt(claimid) : null,
            invoiceID ? parseInt(invoiceID) : null,
            invoiceReference ? `%${invoiceReference}%` : null,
            lastName ? `%${lastName}%` : null,
            firstName ? `%${firstName}%` : null
        ];
        const result = await pool.query(query, params);
        const totalInvoicesQuery = `
            SELECT COUNT(*) as total
            FROM invoices
            WHERE claimid = $1
        `;
        const totalInvoicesResult = await pool.query(totalInvoicesQuery, [claimid]);
        const totalInvoices = totalInvoicesResult.rows[0].total;

        res.render('alpha/version-08/claims/rina/default/invoices/full-invoice-list-search-results', {
            searchResults: result.rows,
            claimid,
            country,
            totalInvoices
        });
    } catch (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to render the invoice details page
router.get('/claims/invoice/:invoiceid', async (req, res) => {
    const { invoiceid } = req.params;

    console.log(`Fetching details for invoice ID: ${invoiceid}`);

    try {
        const invoiceQuery = `
            SELECT
                invoiceid,
                claimid,
                country,
                invoicereference,
                amount,
                startdate,
                enddate,
                status,
                person,
                contestationreason,
                amounts,
                recorded,
                foreigninstitutionname,
                foreigninstitutionid,
                CASE
                    WHEN person->'entitlements'->0->>'type' ~* '(S1|S2|DA1|GHIC|EHIC|PRC)' THEN
                        regexp_replace(person->'entitlements'->0->>'type', '.*(S1|S2|DA1|GHIC|EHIC|PRC).*', '\\1')
                    ELSE
                        'Unknown'
                END AS entitlement
            FROM invoices
            WHERE invoiceid = $1
        `;

        const invoiceResult = await pool.query(invoiceQuery, [invoiceid]);

        if (invoiceResult.rows.length === 0) {
            console.log(`Invoice not found for ID: ${invoiceid}`);
            res.status(404).send('Invoice not found');
            return;
        }

        const invoice = invoiceResult.rows[0];
        console.log(`Fetched invoice: ${JSON.stringify(invoice)}`);

        invoice.amounts.accepted = parseFloat(invoice.amounts.accepted).toFixed(2);
        invoice.amounts.contested = parseFloat(invoice.amounts.contested).toFixed(2);
        invoice.amounts.withdrawn = parseFloat(invoice.amounts.withdrawn).toFixed(2);
        invoice.amount = parseFloat(invoice.amount).toFixed(2);

        try {
            invoice.startdate = moment(invoice.startdate).format('DD MMMM YYYY');
            invoice.enddate = moment(invoice.enddate).format('DD MMMM YYYY');
            invoice.recorded = moment(invoice.recorded).format('DD MMMM YYYY');
        } catch (dateError) {
            console.error('Error formatting dates:', dateError);
            res.status(500).send('Internal Server Error - Date Formatting');
            return;
        }

        const claimQuery = `
            SELECT claimreference, TO_CHAR(datereceived, 'DD Mon YYYY') as datereceived
            FROM claims
            WHERE claimid = $1
        `;
        const claimResult = await pool.query(claimQuery, [invoice.claimid]);

        if (claimResult.rows.length === 0) {
            console.log(`Claim not found for ID: ${invoice.claimid}`);
            res.status(404).send('Claim not found');
            return;
        }

        const claim = claimResult.rows[0];

        const contestationReasons = getContestationReasons();

        if (invoice.status === 'Accepted') {
            invoice.contestationreason = "None - invoice accepted";
        }

        // Store invoice and claim data in the session
        req.session.invoice = invoice;
        req.session.claim = claim;

        res.render('alpha/version-08/claims/rina/default/invoices/details/01-to-check', {
            invoice,
            claim,
            contestationReasons
        });
    } catch (err) {
        console.error('Error fetching invoice details:', err);
        res.status(500).send('Internal Server Error - Fetching Invoice');
    }
});

const getContestationReasons = () => {
    return [
        "None - invoice accepted",
        "This document does not concern us",
        "Institution code is incorrect. Please provide correct institution code.",
        "Unable to identify the person from the information provided. Please check.",
        "Entitlement document is unknown or not found. Please provide copy.",
        "Scheduled treatment may be suspected. Please check.",
        "There is an overlapping in hospitalisation periods. Please adjust the claim.",
        "Person was not insured during benefits period. Please provide copy of entitlement document.",
        "The period of benefits in kind is not covered by the entitlement period",
        "The period of benefits in kind is partially covered by the entitlement period. Please adjust the claim.",
        "The costs are to be settled by lump-sum as from [date should be filled in].",
        "The costs are to be settled by lump-sum until [date should be filled in].",
        "The person is not registered on the entitlement document",
        "The entitlement document has not been registered.",
        "Double invoice [duplicated invoice number should be filled in]",
        "The entitlement in the state of residence started on [date should be filled in].",
        "The benefits seem to concern an accident at work that happened on [date should be filled in].",
        "The person died on [date should be filled in]",
        "Lack of information about the other benefits provided. Please specify",
        "Total amount of claim different to the sum of individual claims",
        "Total amount of individual claim different to the sum of benefits",
        "Cost of benefits have been refunded in full or partially to the insured person",
        "Claim introduced after deadline [date should be filled in]",
        "Contestation reply received after deadline [date should be filled in].",
        "Other"
    ];
};

// Route to render person search results
router.post('/personSearch', async (req, res) => {
    const {
        lastName, firstName, day, month, year,
        residenceCountry, ohs, nino, nhs, pin, issueNumber,
        page = 1, limit = 10, sortBy = 'lastname', orderBy = 'asc'
    } = req.body;

    const offset = (page - 1) * limit;

    // Store invoice data in session
    if (req.body.invoice) {
        req.session.invoice = req.body.invoice;
    }

    const invoice = req.session.invoice;

    console.log('Received search parameters:', {
        lastName, firstName, day, month, year,
        residenceCountry, ohs, nino, nhs, pin, issueNumber,
        page, limit, sortBy, orderBy
    });

    try {
        const personQuery = `
            SELECT 
                personid, 
                lastname, 
                firstname, 
                dob_day, 
                dob_month, 
                dob_year,
                dob_formatted,
                uniqueid->>'ohs' AS ohs, 
                uniqueid->>'nino' AS nino, 
                uniqueid->>'nhs' AS nhs,
                address->>'residencecountry' AS residencecountry,
                entitlements,
                CASE
                    WHEN entitlements->0->>'type' ~* '(S1|S2|DA1|GHIC|EHIC|PRC)' THEN
                        regexp_replace(entitlements->0->>'type', '.*(S1|S2|DA1|GHIC|EHIC|PRC).*', '\\1')
                    ELSE
                        'Unknown'
                END AS entitlement
            FROM persons
            WHERE 
            ($1::text IS NULL OR lastname ILIKE $1) AND
            ($2::text IS NULL OR firstname ILIKE $2) AND
            ($3::int IS NULL OR dob_day = $3::int) AND
            ($4::int IS NULL OR dob_month = $4::int) AND
            ($5::int IS NULL OR dob_year = $5::int) AND
            ($6::text IS NULL OR address->>'residencecountry' ILIKE $6) AND
            ($7::text IS NULL OR uniqueid->>'ohs' = $7) AND
            ($8::text IS NULL OR uniqueid->>'nino' ILIKE $8) AND
            ($9::text IS NULL OR uniqueid->>'nhs' = $9) AND
            ($10::text IS NULL OR uniqueid->>'pin' ILIKE $10) AND
            ($11::text IS NULL OR uniqueid->>'issueNumber' ILIKE $11)
            ORDER BY ${sortBy} ${orderBy}
            LIMIT $12 OFFSET $13;
        `;

        const personParams = [
            lastName ? `${lastName}%` : null,
            firstName ? `${firstName}%` : null,
            day ? parseInt(day) : null,
            month ? parseInt(month) : null,
            year ? parseInt(year) : null,
            residenceCountry ? `%${residenceCountry}%` : null,
            ohs || null,
            nino ? `${nino.substring(0, 8)}%` : null,
            nhs || null,
            pin ? `${pin}%` : null,
            issueNumber ? `${issueNumber}%` : null,
            limit,
            offset
        ];

        console.log('Executing personQuery with params:', personParams);

        const personResult = await pool.query(personQuery, personParams);

        console.log('Query result:', personResult.rows);

        // Ensure entitlements are parsed correctly
        personResult.rows.forEach(person => {
            if (typeof person.entitlements === 'string') {
                try {
                    person.entitlements = JSON.parse(person.entitlements);
                } catch (error) {
                    console.error('Error parsing entitlements:', error);
                    person.entitlements = [];
                }
            }
        });

        const totalQuery = `
            SELECT COUNT(*) AS total
            FROM persons
            WHERE 
            ($1::text IS NULL OR lastname ILIKE $1) AND
            ($2::text IS NULL OR firstname ILIKE $2) AND
            ($3::int IS NULL OR dob_day = $3::int) AND
            ($4::int IS NULL OR dob_month = $4::int) AND
            ($5::int IS NULL OR dob_year = $5::int) AND
            ($6::text IS NULL OR address->>'residencecountry' ILIKE $6) AND
            ($7::text IS NULL OR uniqueid->>'ohs' = $7) AND
            ($8::text IS NULL OR uniqueid->>'nino' ILIKE $8) AND
            ($9::text IS NULL OR uniqueid->>'nhs' = $9) AND
            ($10::text IS NULL OR uniqueid->>'pin' ILIKE $10) AND
            ($11::text IS NULL OR uniqueid->>'issueNumber' ILIKE $11);
        `;
        const totalResult = await pool.query(totalQuery, personParams.slice(0, 11));

        const totalPersons = totalResult.rows[0].total;
        const totalPages = Math.ceil(totalPersons / limit);

        console.log('Rendering with invoice data:', invoice);

        res.render('alpha/version-08/claims/rina/default/invoices/details/02-person-search-results', { 
            searchResults: personResult.rows, 
            invoice,
            totalPersons,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages,
            queryParams: {
                lastName, firstName, day, month, year,
                residenceCountry, ohs, nino, nhs, pin, issueNumber
            }
        });
    } catch (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle GET requests with pagination
router.get('/03-accepted', async (req, res) => {
    const { invoiceid, lastname, firstname, dob } = req.query;

    // Parse dob if provided
    let dob_day = null, dob_month = null, dob_year = null;
    if (dob) {
        const [day, month, year] = dob.split(' ');
        dob_day = parseInt(day, 10) || null;
        dob_month = new Date(Date.parse(`${month} 1, 2023`)).getMonth() + 1 || null; // Convert month name to month number
        dob_year = parseInt(year, 10) || null;
    }

    try {
        // Fetch invoice details
        const invoiceQuery = `
            SELECT * FROM invoices WHERE invoiceid = $1;
        `;
        const invoiceResult = await pool.query(invoiceQuery, [invoiceid]);

        if (invoiceResult.rows.length === 0) {
            console.log(`Invoice not found for ID: ${invoiceid}`);
            res.status(404).send('Invoice not found');
            return;
        }

        const invoice = invoiceResult.rows[0];

        // Format dates for invoice
        invoice.startdate = moment(invoice.startdate).format('DD MMMM YYYY');
        invoice.enddate = moment(invoice.enddate).format('DD MMMM YYYY');
        invoice.recorded = moment(invoice.recorded).format('DD MMMM YYYY');

        // Fetch person details
        const personQuery = `
            SELECT 
                lastname, firstname, dob_day, dob_month, dob_year, dob_formatted,
                uniqueid, address, entitlements
            FROM persons
            WHERE lastname = $1 AND firstname = $2
              AND ($3::int IS NULL OR dob_day = $3)
              AND ($4::int IS NULL OR dob_month = $4)
              AND ($5::int IS NULL OR dob_year = $5);
        `;
        const personParams = [
            lastname,
            firstname,
            dob_day,
            dob_month,
            dob_year,
        ];

        console.log('Executing personQuery with params:', personParams);

        const personResult = await pool.query(personQuery, personParams);

        if (personResult.rows.length === 0) {
            console.log(`Person not found for provided details.`);
            res.status(404).send('Person not found');
            return;
        }

        const person = personResult.rows[0];

        // Check if uniqueid and entitlements are objects already
        let uniqueid = typeof person.uniqueid === 'string' ? JSON.parse(person.uniqueid) : person.uniqueid;
        let entitlements = typeof person.entitlements === 'string' ? JSON.parse(person.entitlements) : person.entitlements;

        console.log('UniqueID after check:', uniqueid);
        console.log('Entitlements after check:', entitlements);

        // Fetch claim details
        const claimQuery = `
            SELECT claimreference, TO_CHAR(datereceived, 'DD Mon YYYY') as datereceived
            FROM claims
            WHERE claimid = $1
        `;
        const claimResult = await pool.query(claimQuery, [invoice.claimid]);

        if (claimResult.rows.length === 0) {
            console.log(`Claim not found for ID: ${invoice.claimid}`);
            res.status(404).send('Claim not found');
            return;
        }

        const claim = claimResult.rows[0];

        console.log('Rendering with data:', {
            invoice,
            person: {
                lastname: person.lastname,
                firstname: person.firstname,
                dob: person.dob_formatted,
                uniqueid: uniqueid,
                entitlements: entitlements
            },
            claim
        });

        res.render('alpha/version-08/claims/rina/default/invoices/details/03-accepted', {
            invoice,
            person: {
                lastname: person.lastname,
                firstname: person.firstname,
                dob: person.dob_formatted,
                uniqueid: uniqueid,
                entitlements: entitlements
            },
            claim
        });
    } catch (err) {
        console.error('Error fetching invoice or person details:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;