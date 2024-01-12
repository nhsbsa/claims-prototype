// External dependencies
const express = require('express');

const router = express.Router();



// Alpha
// router.use('/alpha', require('./views/alpha/_routes'));
router.use('/alpha/version-01', require('./views/alpha/version-01/_routes'));
router.use('/alpha/version-02', require('./views/alpha/version-02/_routes'));
router.use('/alpha/version-03', require('./views/alpha/version-03/_routes'));
router.use('/alpha/version-04', require('./views/alpha/version-04/_routes'));
router.use('/alpha/version-05', require('./views/alpha/version-05/_routes'));
module.exports = router;
