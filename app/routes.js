// External dependencies
const express = require('express');

const router = express.Router();



// Alpha
router.use('/alpha', require('./views/alpha/_routes'));

module.exports = router;
