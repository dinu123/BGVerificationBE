const express = require('express');
const {check} = require('express-validator');

const companiesController = require('../controllers/companies-controller')

const router = express.Router();

router.get('/', companiesController.getAllCompaniesList)
router.post('/',[check('name').not().isEmpty(), check('email').not().isEmpty()], companiesController.createCompany)

module.exports = router;