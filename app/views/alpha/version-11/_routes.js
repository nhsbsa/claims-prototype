const express = require('express');
const router = express.Router();
const moment = require('moment');
const { Pool } = require('pg');

// Determine if the environment is production or development
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction 
    ? process.env.DATABASE_URL 
    : 'postgres://postgres:CrystalClearQuartz9785@localhost:5432/my_new_database';

// Create a new instance of Pool with the appropriate connection string and SSL configuration
const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});


//// CREATE CLAIM ////

//// How did you receive the claim?  ////
router.post('/route-contact-method', function(req,res){
    var received = req.session.data['received']
    if (received == "RINA" ||  received == "Paper") {
        res.redirect('/alpha/version-10/claims/create/type')
        }
    else {
        res.redirect('/alpha/version-10/claims/create/index')
    }
})

//// Which type of claim is it?  ////
router.post('/route-create-claim', function(req,res){
    var received = req.session.data['received']
    var claimType = req.session.data['claim-type']
    var articleType = req.session.data['article-type']

    if (received == 'RINA') {

        if (claimType == "Actual cost - Sickness" || claimType == "Actual cost - Accident at work") {
            res.redirect('/alpha/version-10/claims/create/details-rina-actual')
            }

        else if (claimType == "Average cost - Sickness") {
            if (articleType == "Article 63 (2a)" || articleType == "Article 63 (2b)") {
                res.redirect('/alpha/version-10/claims/create/details-rina-average-63')
                }
            else if (articleType == "Article 94" || articleType == "Article 95") {
                res.redirect('/alpha/version-10/claims/create/details-rina-average-94-95')
                }
            else {
                    res.redirect('/alpha/version-10/claims/create/type')
                }
        }

        else {
                res.redirect('/alpha/version-10/claims/create/type')
            }
            }

    else if (received == 'Paper') {

        if (claimType == "Actual cost - Sickness" || claimType == "Actual cost - Accident at work") {
            res.redirect('/alpha/version-10/claims/create/details-paper-actual')
            }

        else if (claimType == "Average cost - Sickness") {
            if (articleType == "Article 63 (2a)" || articleType == "Article 63 (2b)") {
                res.redirect('/alpha/version-10/claims/create/details-paper-average-63')
                }
            else if (articleType == "Article 94" || articleType == "Article 95") {
            res.redirect('/alpha/version-10/claims/create/details-paper-average-94-95')
            }
            else {
                res.redirect('/alpha/version-10/claims/create/type')
            }

        }

        else {
                res.redirect('/alpha/version-10/claims/create/type')
            }
        }
        
    else {
            res.redirect('/alpha/version-10/claims/create/type')
        }
})



//// Which article covers this claim?  ////
router.post('/route-create-claim', function(req,res){
    var received = req.session.data['received']
    var article = req.session.data['article']

    if (received == 'RINA') {
        if (article == "Article 62 - Sickness" || article == "Article 62 - Accident at work") {
            res.redirect('/alpha/version-10/claims/create/details-rina-actual')
            }
        else if (article == "Article 63 (2a)" || article == "Article 63 (2b)") {
                res.redirect('/alpha/version-10/claims/create/details-rina-average-63')
                }
        else if (article == "Article 94" || article == "Article 95") {
                res.redirect('/alpha/version-10/claims/create/details-rina-average-94-95')
                }
        else {
                res.redirect('/alpha/version-10/claims/create/article-type')
            }
            }

    else if (received == 'Paper') {
        if (article == "Article 62 - Sickness" || article == "Article 62 - Accident at work") {
            res.redirect('/alpha/version-10/claims/create/details-paper-actual')
            }
        else if (article == "Article 63 (2a)" || article == "Article 63 (2b)") {
            res.redirect('/alpha/version-10/claims/create/details-paper-average-63')
            }
        else if (article == "Article 94" || article == "Article 95") {
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

// Debug route for search results
router.get('/debug-search-results', (req, res) => {
    const sampleData = {
        searchResults: [
            { lastname: 'Doe', firstname: 'John', dob_formatted: '1980-01-01', nino: 'AB123456C', ohs: 'OHS123', personid: '1' },
            { lastname: 'Smith', firstname: 'Jane', dob_formatted: '1985-05-05', nino: 'XY987654A', ohs: 'OHS456', personid: '2' }
        ],
        invoice: { invoiceid: '12345' },
        totalPersons: 2,
        queryParams: {}
    };
    res.render('alpha/version-11/claims/rina/invoices/details/_02-person-search-results', sampleData);
});
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


const notes = [];

router.post('/claims/createNote', function(req, res) {

    const currentDate = new Date();
    const formatDate = currentDate.toLocaleTimeString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'});

    res.locals.data.notes[0].date = formatDate;

    notes.push(res.locals.data.notes);
    req.session.data.notes = notes;
    res.redirect('rina/actual-cost/6752-lithuania/notes/index');
});

// DYNAMIC SEARCH

// Claim Search /alpha/version-11/claims/index.html
router.post('/claimSearch', async (req, res) => {
    const { claimID, claimReference, country, financialYear } = req.body;

    console.log({ claimID, claimReference, country, financialYear }); // Log the destructured variables

    try {
        let query = '';
        let params = [];

        // Check input restrictions
        if ((claimID || claimReference) && !(country && financialYear)) {
            // Search by claimID or claimReference
            query = `
                SELECT * FROM claims
                WHERE
                ($1::int IS NULL OR claimid = $1) AND
                ($2::text IS NULL OR claimreference ILIKE $2);
            `;
            params = [
                claimID ? parseInt(claimID) : null,
                claimReference ? `%${claimReference}%` : null,
            ];
        } else if (!claimID && !claimReference && (country && financialYear)) {
            // Search by country and financialYear
            query = `
                SELECT * FROM claims
                WHERE
                ($1::text IS NULL OR country ILIKE $1) AND
                ($2::int IS NULL OR financialyear = $2);
            `;
            params = [
                country ? `%${country}%` : null,
                financialYear ? parseInt(financialYear) : null
            ];
        } else {
            // Invalid input combination
            return res.render('alpha/version-11/claims/search-results', {
                searchResults: [],
                searchQuery: req.body,
                error: "Invalid search criteria. Please search by either Claim ID/Reference or by Country and Financial Year."
            });
        }

        const result = await pool.query(query, params);
        res.render('alpha/version-11/claims/search-results', {
            searchResults: result.rows,
            searchQuery: req.body,
            claimID,
            country
        });
    } catch (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Claim Short Search
router.post('/claimShortSearch', async (req, res) => {
    const { claimID, claimReference } = req.body;

    console.log({ claimID, claimReference }); // Log the destructured variables

    try {
        let query = '';
        let params = [];

        // Check input restrictions
        if (claimID || claimReference) {
            // Search by claimID or claimReference
            query = `
                SELECT * FROM claims
                WHERE
                ($1::int IS NULL OR claimid = $1) AND
                ($2::text IS NULL OR claimreference ILIKE $2);
            `;
            params = [
                claimID ? parseInt(claimID) : null,
                claimReference ? `%${claimReference}%` : null,
            ];
        } else {
            // Invalid input combination
            return res.render('alpha/version-11/claims/search-results', {
                searchResults: [],
                searchQuery: req.body,
                error: "Invalid search criteria. Please search by either Claim ID/Reference."
            });
        }

        const result = await pool.query(query, params);
        res.render('alpha/version-11/claims/search-results', {
            searchResults: result.rows,
            searchQuery: req.body,
            claimID,
            country
        });
    } catch (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Filter claim search /alpha/version-11/claims/search-results.html
router.post('/claimFilterSearch', async (req, res) => {
    const { claimID, claimReference, country, financialYear, articleFilter, statusFilter, sortBy, orderBy } = req.body;

    try {
        let query = '';
        let params = [];

        // Check input restrictions
        if ((claimID || claimReference) && !(country && financialYear)) {
            // Search by claimID or claimReference
            query = `
                SELECT * FROM claims
                WHERE
                ($1::int IS NULL OR claimid = $1) AND
                ($2::text IS NULL OR claimreference ILIKE $2)
            `;
            params = [
                claimID ? parseInt(claimID) : null,
                claimReference ? `%${claimReference}%` : null,
            ];
        } else if (!claimID && !claimReference && (country && financialYear)) {
            // Search by country and financialYear
            query = `
                SELECT * FROM claims
                WHERE
                ($1::text IS NULL OR country ILIKE $1) AND
                ($2::int IS NULL OR financialyear = $2)
            `;
            params = [
                country ? `%${country}%` : null,
                financialYear ? parseInt(financialYear) : null
            ];
        } else {
            // Invalid input combination
            return res.render('alpha/version-11/claims/search-results', {
                searchResults: [],
                searchQuery: req.body,
                error: "Invalid search criteria. Please search by either Claim ID/Reference or by Country and Financial Year."
            });
        }

        // Handle article type filter
        if (articleFilter && articleFilter.length > 0) {
            query += ` AND articletype IN (${articleFilter.map((_, i) => `$${params.length + i + 1}`).join(', ')})`;
            params = params.concat(articleFilter);
        }

        // Handle claim status filter
        if (statusFilter && statusFilter.length > 0) {
            query += ` AND claimstatus IN (${statusFilter.map((_, i) => `$${params.length + i + 1}`).join(', ')})`;
            params = params.concat(statusFilter);
        }

        // Add sorting options
        if (sortBy) {
            const sortColumn = sortBy.replace(' ', '').toLowerCase(); // Adjust based on the actual column names
            const sortOrder = orderBy === 'ascending' ? 'ASC' : 'DESC';
            query += ` ORDER BY ${sortColumn} ${sortOrder}`;
        }

        const result = await pool.query(query, params);
        res.render('alpha/version-11/claims/search-results', {
            searchResults: result.rows,
            searchQuery: req.body,
            claimID,
            country
        });
    } catch (err) {
        console.error('Error executing filtered search query:', err);
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

function formatDate(date) {
    return moment(date).format('DD MMMM YYYY');
}


// Invoice Short Search
router.post('/invoiceShortSearch', async (req, res) => {
    const { invoiceID, invoiceReference, lastName, firstName } = req.body;

    try {
        const query = `
            SELECT
                invoices.invoiceid,
                invoices.invoicereference
            FROM invoices
            WHERE
            ($1::int IS NULL OR invoices.invoiceid = $1) AND
            ($2::text IS NULL OR invoices.invoicereference ILIKE $2);
        `;
        const params = [
            invoiceID ? parseInt(invoiceID) : null,
            invoiceReference ? `%${invoiceReference}%` : null
        ];
        const result = await pool.query(query, params);
        
        res.render('alpha/version-11/claims/rina/invoices/invoice-list-search-results', {
            searchResults: result.rows
        });
    } catch (err) {
        console.error('Error executing search query:', err);
        res.status(500).send('Internal Server Error');
    }
});

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
        console.log('Claim object before processing:', claim);

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
                console.log('Claim amount before rounding:', claim.claimamount);
                claim.claimamount = {
                    total: roundNumber(claim.claimamount.total || 0),
                    toCheck: roundNumber(claim.claimamount.toCheck || 0),
                    accepted: roundNumber(claim.claimamount.accepted || 0),
                    contested: roundNumber(claim.claimamount.contested || 0),
                    withdrawn: roundNumber(claim.claimamount.withdrawn || 0)
                };
                console.log('Claim amount after rounding:', claim.claimamount);
            } else {
                console.log('Claim amount is not defined or is null.');
            }

            if (claim.invoicesnumber) {
                console.log('Invoices number before processing:', claim.invoicesnumber);
                claim.invoicesnumber = {
                    total: claim.invoicesnumber.total || 0,
                    toCheck: claim.invoicesnumber.toCheck || 0,
                    accepted: claim.invoicesnumber.accepted || 0,
                    contested: claim.invoicesnumber.contested || 0,
                    withdrawn: claim.invoicesnumber.withdrawn || 0
                };
                console.log('Invoices number after processing:', claim.invoicesnumber);
            } else {
                console.log('Invoices number is not defined or is null.');
            }
        } catch (numberError) {
            console.error('Error rounding numbers:', numberError);
            res.status(500).send('Internal Server Error - Number Rounding');
            return;
        }

        // Render the claim-summary page with the claim data
        res.render('alpha/version-11/claims/summary/claim-summary', { claim });

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

        res.render('alpha/version-11/claims/rina/invoices/full-invoice-list', {
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

        res.render('alpha/version-11/claims/rina/invoices/full-invoice-list-search-results', {
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
router.get('/claims/invoice/to-check/:invoiceid', async (req, res) => {
    const { invoiceid } = req.params;

    console.log(`Fetching details for invoice ID: ${invoiceid}`);

    if (!invoiceid || isNaN(invoiceid)) {
        console.error('Invalid invoice ID:', invoiceid);
        return res.status(400).send('Invalid invoice ID');
    } 

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
            return res.status(404).send('Invoice not found');
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

        res.render('alpha/version-11/claims/rina/invoices/details/_01-to-check', {
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

// // Middleware to check session data
// router.use((req, res, next) => {
//     console.log('Middleware check - Session invoice data:', req.session.invoice);
//     next();
// });


// Function to fetch invoice data from the database
async function fetchInvoiceData(invoiceid) {
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
            foreigninstitutionid
        FROM invoices
        WHERE invoiceid = $1
    `;

    try {
        const result = await pool.query(invoiceQuery, [invoiceid]);

        if (result.rows.length === 0) {
            return null; // Invoice not found
        }

        const invoice = result.rows[0];

        // Ensure "person" and "amounts" fields exist, or set defaults
        invoice.amounts = invoice.amounts || { accepted: 0, contested: 0, withdrawn: 0 };
        invoice.person = invoice.person || { entitlements: [], dob: {}, address: {}, uniqueid: {} };

        // Filter entitlements to only include specific types
        const allowedTypes = ['GHIC', 'EHIC', 'S1', 'S2', 'DA1'];
        invoice.person.entitlements = invoice.person.entitlements.filter(entitlement => allowedTypes.includes(entitlement.type));

        // Safely format the invoice dates
        invoice.startdate = invoice.startdate ? moment(invoice.startdate).format('DD MMMM YYYY') : 'N/A';
        invoice.enddate = invoice.enddate ? moment(invoice.enddate).format('DD MMMM YYYY') : 'N/A';
        invoice.recorded = invoice.recorded ? moment(invoice.recorded).format('DD MMMM YYYY') : 'N/A';

        // Process and format the person's entitlements
        if (Array.isArray(invoice.person.entitlements)) {
            invoice.person.entitlements = invoice.person.entitlements.map(entitlement => {
                entitlement.start = entitlement.start ? formatDate(entitlement.start.day, entitlement.start.month, entitlement.start.year) : 'N/A';
                entitlement.end = entitlement.end ? formatDate(entitlement.end.day, entitlement.end.month, entitlement.end.year) : 'N/A';
                entitlement.issued = entitlement.issued ? formatDate(entitlement.issued.day, entitlement.issued.month, entitlement.issued.year) : 'N/A';
                return entitlement;
            });
        }

        // Safely format the monetary amounts
        invoice.amounts.accepted = parseFloat(invoice.amounts.accepted || 0).toFixed(2);
        invoice.amounts.contested = parseFloat(invoice.amounts.contested || 0).toFixed(2);
        invoice.amounts.withdrawn = parseFloat(invoice.amounts.withdrawn || 0).toFixed(2);
        invoice.amount = parseFloat(invoice.amount || 0).toFixed(2);

        return invoice;

    } catch (error) {
        console.error('Error fetching invoice data:', error.stack);
        throw new Error('Failed to fetch invoice data');
    }
}

// Helper function to format dates from day, month, year
function formatDate(day, month, year) {
    if (!day || !month || !year) return 'Invalid Date';
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}



// // Helper function to format dates from day, month, year
// function formatDate(day, month, year) {
//     if (!day || !month || !year) return 'Invalid Date';
//     return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//     });
// }

// // Function to process person data and format dates
// async function processPersonData(person) {
//     if (person.dob) {
//         // Format the date of birth
//         person.dob.formatted = formatDate(person.dob.day, person.dob.month, person.dob.year);
//     }

//     // Format entitlements dates
//     if (person.entitlements && Array.isArray(person.entitlements)) {
//         person.entitlements = person.entitlements.map(entitlement => {
//             if (entitlement.start && entitlement.end) {
//                 entitlement.start.formatted = formatDate(entitlement.start.day, entitlement.start.month, entitlement.start.year);
//                 entitlement.end.formatted = formatDate(entitlement.end.day, entitlement.end.month, entitlement.end.year);
//                 if (entitlement.issued) {
//                     entitlement.issued.formatted = formatDate(entitlement.issued.day, entitlement.issued.month, entitlement.issued.year);
//                 }
//             }
//             return entitlement;
//         });
//     }

//     return person;
// }


// Route to render the person search page
router.get('/claims/invoice/person-search/:invoiceid', async (req, res) => {
    const { invoiceid } = req.params;

    console.log(`Fetching details for invoice ID: ${invoiceid}`);

    if (!invoiceid || isNaN(invoiceid)) {
        console.error('Invalid invoice ID:', invoiceid);
        return res.status(400).send('Invalid invoice ID');
    } 

    try {
        // Use fetchInvoiceData to get detailed invoice information
        const invoiceData = await fetchInvoiceData(invoiceid);
        
        if (!invoiceData) {
            console.error('Invoice not found for ID:', invoiceid);
            return res.status(404).send('Invoice not found');
        }

        res.render('alpha/version-11/claims/rina/invoices/details/_02-person-search', {
            invoice: invoiceData
        });
    } catch (err) {
        console.error('Error rendering person search page:', err.stack);  // Log stack trace
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle the initial person search (POST)
router.post('/personSearch', async (req, res) => {
    const {
        lastName, firstName, dobDay, dobMonth, dobYear,
        uniqueID, issueNumber, residenceCountry, invoiceid, claimid
    } = req.body;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // Step 1: Fetch invoice data
        let invoiceData = null;
        if (invoiceid) {
            invoiceData = await fetchInvoiceData(invoiceid);  // Fetch invoice data
            if (!invoiceData) {
                console.error(`Invoice with ID ${invoiceid} not found.`);
                return res.status(404).send('Invoice not found');
            }
        }

        // Step 2: Execute person search query
        const query = `
            SELECT invoices.invoiceid, 
                   invoices.claimid,
                   invoices.invoicereference,
                   invoices.person->>'lastname' AS lastname,
                   invoices.person->>'firstname' AS firstname,
                   invoices.person->'dob'->>'day' AS dob_day,
                   invoices.person->'dob'->>'month' AS dob_month,
                   invoices.person->'dob'->>'year' AS dob_year,
                   invoices.person->'uniqueid'->>'nino' AS nino,
                   invoices.person->'uniqueid'->>'ohs' AS ohs,
                   invoices.person->'uniqueid'->>'nhs' AS nhs,
                   invoices.person->'address'->>'residencecountry' AS residencecountry,
                   (SELECT ent->>'issuenumber'
                    FROM jsonb_array_elements(invoices.person->'entitlements') AS ent
                    WHERE ent->>'type' IN ('PRC', 'GHIC', 'EHIC')
                    LIMIT 1) AS issuenumber
            FROM invoices
            WHERE invoices.invoiceid = $1
            AND ($2::text IS NULL OR invoices.person->>'lastname' ILIKE $2)
            AND ($3::text IS NULL OR invoices.person->>'firstname' ILIKE $3)
            AND ($4::int IS NULL OR (invoices.person->'dob'->>'day')::int = $4)
            AND ($5::int IS NULL OR (invoices.person->'dob'->>'month')::int = $5)
            AND ($6::int IS NULL OR (invoices.person->'dob'->>'year')::int = $6)
            AND ($7::text IS NULL OR invoices.person->'address'->>'residencecountry' ILIKE $7)
            AND ($8::text IS NULL OR EXISTS (
                SELECT 1
                FROM jsonb_array_elements(invoices.person->'entitlements') AS ent
                WHERE ent->>'issuenumber' = $8))
            AND ($9::text IS NULL OR invoices.person->'uniqueid'->>'nhs' = $9 
                                    OR invoices.person->'uniqueid'->>'ohs' = $9 
                                    OR invoices.person->'uniqueid'->>'nino' = $9)
            AND ($12::int IS NULL OR invoices.claimid = $12)
            LIMIT $10 OFFSET $11;
        `;

        const params = [
            invoiceid ? parseInt(invoiceid) : null,  // Invoice ID
            lastName ? `%${lastName}%` : null,       // Last Name
            firstName ? `%${firstName}%` : null,     // First Name
            dobDay ? parseInt(dobDay) : null,        // Day of Birth
            dobMonth ? parseInt(dobMonth) : null,    // Month of Birth
            dobYear ? parseInt(dobYear) : null,      // Year of Birth
            residenceCountry ? `%${residenceCountry}%` : null,  // Residence Country
            issueNumber || null,                     // Entitlement Issue Number
            uniqueID || null,                        // Unique ID (NHS, OHS, NINO)
            limit,                                   // Pagination Limit
            offset,                                  // Pagination Offset
            claimid ? parseInt(claimid) : null       // Claim ID
        ];

        const result = await pool.query(query, params);
        let searchResults = result.rows;

        // Format date of birth for each result
        searchResults = searchResults.map(person => {
            const { dob_day, dob_month, dob_year } = person;
            person.dob_formatted = dob_day && dob_month && dob_year
                ? new Date(dob_year, dob_month - 1, dob_day).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })
                : 'N/A';
            return person;
        });

        // Step 3: Count total matching persons (for pagination)
        const totalCountQuery = `SELECT COUNT(*) AS total FROM invoices WHERE invoiceid = $1;`;
        const totalCountResult = await pool.query(totalCountQuery, [invoiceid]);
        const totalPersons = parseInt(totalCountResult.rows[0].total, 10);
        const totalPages = Math.ceil(totalPersons / limit);

        // Render the results with pagination
        res.render('alpha/version-11/claims/rina/invoices/details/_02-person-search-results', {
            searchResults,
            invoice: invoiceData,  // Pass invoiceData as `invoice` to template
            totalPersons,
            page,
            limit,
            totalPages,
            queryParams: req.body  // Preserve search filters
        });
    } catch (err) {
        console.error('Error executing search query:', err.message, err.stack);
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle GET requests for person search with pagination
router.get('/personSearch', async (req, res) => {
    const {
        lastName, firstName, dobDay, dobMonth, dobYear,
        uniqueID, issueNumber, residenceCountry, invoiceid, claimid,
        page = 1, limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    try {
        // Step 1: Fetch invoice data
        const invoiceData = await fetchInvoiceData(invoiceid);  // Fetch invoice data
        if (!invoiceData) {
            return res.status(404).send('Invoice not found');
        }

        // Step 2: Execute person search query (same as in POST route)
        const query = `
            SELECT invoices.invoiceid, 
                   invoices.claimid, 
                   invoices.invoicereference, 
                   invoices.person->>'lastname' AS lastname,
                   invoices.person->>'firstname' AS firstname,
                   invoices.person->'dob'->>'day' AS dob_day,
                   invoices.person->'dob'->>'month' AS dob_month,
                   invoices.person->'dob'->>'year' AS dob_year,
                   invoices.person->'uniqueid'->>'nino' AS nino,
                   invoices.person->'uniqueid'->>'ohs' AS ohs,
                   invoices.person->'uniqueid'->>'nhs' AS nhs,
                   invoices.person->'address'->>'residencecountry' AS residencecountry,
                   (SELECT ent->>'issuenumber'
                    FROM jsonb_array_elements(invoices.person->'entitlements') AS ent
                    WHERE ent->>'type' IN ('PRC', 'GHIC', 'EHIC')
                    LIMIT 1) AS issuenumber
            FROM invoices
            WHERE invoices.invoiceid = $1
            AND ($2::text IS NULL OR invoices.person->>'lastname' ILIKE $2)
            AND ($3::text IS NULL OR invoices.person->>'firstname' ILIKE $3)
            AND ($4::int IS NULL OR (invoices.person->'dob'->>'day')::int = $4)
            AND ($5::int IS NULL OR (invoices.person->'dob'->>'month')::int = $5)
            AND ($6::int IS NULL OR (invoices.person->'dob'->>'year')::int = $6)
            AND ($7::text IS NULL OR invoices.person->'address'->>'residencecountry' ILIKE $7)
            AND ($8::text IS NULL OR EXISTS (
                SELECT 1
                FROM jsonb_array_elements(invoices.person->'entitlements') AS ent
                WHERE ent->>'issuenumber' = $8))
            AND ($9::text IS NULL OR invoices.person->'uniqueid'->>'nhs' = $9 
                                 OR invoices.person->'uniqueid'->>'ohs' = $9 
                                 OR invoices.person->'uniqueid'->>'nino' = $9)
            AND ($12::int IS NULL OR invoices.claimid = $12)
            LIMIT $10 OFFSET $11;
        `;

        const params = [
            invoiceid ? parseInt(invoiceid) : null,  // Invoice ID
            lastName ? `%${lastName}%` : null,       // Last Name
            firstName ? `%${firstName}%` : null,     // First Name
            dobDay ? parseInt(dobDay) : null,        // Day of Birth
            dobMonth ? parseInt(dobMonth) : null,    // Month of Birth
            dobYear ? parseInt(dobYear) : null,      // Year of Birth
            residenceCountry ? `%${residenceCountry}%` : null,  // Residence Country
            issueNumber || null,                     // Entitlement Issue Number
            uniqueID || null,                        // Unique ID (NHS, OHS, NINO)
            limit,                                   // Pagination Limit
            offset,                                  // Pagination Offset
            claimid ? parseInt(claimid) : null       // Claim ID if provided
        ];

        const result = await pool.query(query, params);
        let searchResults = result.rows;

        // Format date of birth for each result
        searchResults = searchResults.map(person => {
            const { dob_day, dob_month, dob_year } = person;
            person.dob_formatted = dob_day && dob_month && dob_year
                ? new Date(dob_year, dob_month - 1, dob_day).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })
                : 'N/A';
            return person;
        });

        // Step 3: Count total matching persons
        const totalCountQuery = `SELECT COUNT(*) AS total FROM invoices WHERE invoiceid = $1;`;
        const totalCountResult = await pool.query(totalCountQuery, [invoiceid]);
        const totalPersons = parseInt(totalCountResult.rows[0].total, 10);
        const totalPages = Math.ceil(totalPersons / limit);

        // Step 4: Render the results
        res.render('alpha/version-11/claims/rina/invoices/details/_02-person-search-results', {
            searchResults,
            invoice: invoiceData,  // Pass `invoiceData` as `invoice`
            totalPersons,
            page,
            limit,
            totalPages,
            queryParams: req.query  // Preserve search filters
        });
    } catch (err) {
        console.error('Error executing search query:', err.message, err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch person details by matching fields from the invoices table
// Fetch person details by matching fields from the invoices table
const getPersonDetails = async (firstname, lastname, dob_day, dob_month, dob_year, nino) => {
    const query = `
        SELECT person 
        FROM invoices 
        WHERE invoices.person->>'firstname' = $1 
        AND invoices.person->>'lastname' = $2 
        AND invoices.person->'dob'->>'day' = $3 
        AND invoices.person->'dob'->>'month' = $4 
        AND invoices.person->'dob'->>'year' = $5 
        AND invoices.person->'uniqueid'->>'nino' = $6;
    `;

    const params = [firstname, lastname, dob_day, dob_month, dob_year, nino];
    const result = await pool.query(query, params);

    if (result.rows.length > 0) {
        const person = result.rows[0].person;

        // The 'dob' field has no need to be formatted again if it's already present
        if (person.dob && !person.dob.formatted) {
            person.dob.formatted = `${person.dob.day} ${new Date(person.dob.year, person.dob.month - 1).toLocaleString('default', { month: 'long' })} ${person.dob.year}`;
        }

        // Handle entitlements without additional formatting if formatted fields are already present
        if (Array.isArray(person.entitlements)) {
            person.entitlements = person.entitlements.map(entitlement => {
                entitlement.start = entitlement.start?.formatted || 'N/A';
                entitlement.end = entitlement.end?.formatted || 'N/A';
                entitlement.issued = entitlement.issued?.formatted || 'N/A';

                // Safeguard: Ensure country exists
                entitlement.country = entitlement.country || 'N/A';

                return entitlement;
            });
        }

        return person;
    }

    return null;
};

// Fetch related invoices by matching person details
const getInvoicesByPersonDetails = async (firstname, lastname, dob_day, dob_month, dob_year, nino, limit, offset) => {
    const query = `
        SELECT invoiceid, invoicereference, amount, startdate, enddate, status, claimid
        FROM invoices
        WHERE invoices.person->>'firstname' = $1
        AND invoices.person->>'lastname' = $2
        AND invoices.person->'dob'->>'day' = $3
        AND invoices.person->'dob'->>'month' = $4
        AND invoices.person->'dob'->>'year' = $5
        AND invoices.person->'uniqueid'->>'nino' = $6
        LIMIT $7 OFFSET $8;
    `;

    const params = [firstname, lastname, dob_day, dob_month, dob_year, nino, limit, offset];
    
    try {
        const result = await pool.query(query, params);
        
        // Ensure startdate and enddate are formatted
        const invoices = result.rows.map(invoice => {
            invoice.startdate = invoice.startdate ? new Date(invoice.startdate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) : 'N/A';

            invoice.enddate = invoice.enddate ? new Date(invoice.enddate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) : 'N/A';

            return invoice;
        });

        return invoices;  // Return all matching invoices for the person
    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw new Error('Failed to fetch invoices');
    }
};



// Route to handle fetching person details and associated invoices/entitlements
router.get('/claims/rina/invoices/details/_03-person-details', async (req, res) => {
    const { firstname, lastname, dob_day, dob_month, dob_year, nino, page = 1, limit = 10 } = req.query;

    // Ensure required parameters are present
    if (!firstname || !lastname || !dob_day || !dob_month || !dob_year || !nino) {
        console.error('Missing required query parameters:', req.query);
        return res.status(400).send('Missing required query parameters');
    }

    const decodedNino = decodeURIComponent(nino);
    const offset = (page - 1) * limit;

    try {
        // Fetch person details
        const person = await getPersonDetails(firstname, lastname, dob_day, dob_month, dob_year, decodedNino);
        if (!person) {
            console.error('Person not found with the provided details:', req.query);
            return res.status(404).send('Person not found');
        }

        // Fetch invoices related to the person with pagination
        const invoices = await getInvoicesByPersonDetails(firstname, lastname, dob_day, dob_month, dob_year, decodedNino, limit, offset);
        
        // Fetch the total number of invoices for pagination purposes
        const totalCountQuery = `
            SELECT COUNT(*) AS total 
            FROM invoices 
            WHERE person->>'firstname' = $1 
            AND person->>'lastname' = $2 
            AND person->'dob'->>'day' = $3 
            AND person->'dob'->>'month' = $4 
            AND person->'dob'->>'year' = $5 
            AND person->'uniqueid'->>'nino' = $6
        `;
        const totalCountResult = await pool.query(totalCountQuery, [firstname, lastname, dob_day, dob_month, dob_year, decodedNino]);
        const totalInvoices = parseInt(totalCountResult.rows[0].total, 10);
        const totalPages = Math.ceil(totalInvoices / limit);

        // Fetch the first invoice for the side card if available
        const invoiceid = invoices.length > 0 ? invoices[0].invoiceid : null;
        const invoice = invoiceid ? await fetchInvoiceData(invoiceid) : null;

        // Render the page with person details and invoices
        res.render('alpha/version-11/claims/rina/invoices/details/_03-person-details', {
            person,
            invoices,  // Invoices for the current page
            invoice,   // Specific invoice for the side card
            totalInvoices,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            queryParams: { firstname, lastname, dob_day, dob_month, dob_year, nino } // Pass query params
        });
    } catch (err) {
        console.error('Error fetching person or invoice data:', err.stack);
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

        res.render('alpha/version-11/claims/rina/invoices/details/_03-accepted', { 
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