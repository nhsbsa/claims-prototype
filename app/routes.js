// External dependencies
const express = require('express');

const router = express.Router();

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Alpha
// router.use('/alpha', require('./views/alpha/_routes'));
router.use('/alpha/version-01', require('./views/alpha/version-01/_routes'));
router.use('/alpha/version-02', require('./views/alpha/version-02/_routes'));
router.use('/alpha/version-03', require('./views/alpha/version-03/_routes'));
router.use('/alpha/version-04', require('./views/alpha/version-04/_routes'));
router.use('/alpha/version-05', require('./views/alpha/version-05/_routes'));
router.use('/alpha/version-06', require('./views/alpha/version-06/_routes'));
router.use('/alpha/version-07', require('./views/alpha/version-07/_routes'));
router.use('/alpha/version-08', require('./views/alpha/version-08/_routes'));
router.use('/alpha/version-09', require('./views/alpha/version-09/_routes'));

// clear session data - link in footer
router.post('/clear-session-data/', (req, res) => {
    req.session.data = {}
    res.render('index')
})

module.exports = router;
