const HttpError = require('../models/http-error')
const {validationResult} = require("express-validator")

const db = require('../index');

const getAllCompaniesList = async (req, res, next) => {
    try {
        const [results] = await db.query('SELECT * FROM companies');
        if (results.length === 0) {
            return next(new HttpError('No Data found', 404));
        }
        res.json(results);
    } catch (error) {
        console.error(error);
        return next(new HttpError('Something went wrong. Please try again', 500));
    }
};

const createCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Required field is missing', 422));
    }

    const { name, representatives, designation, department, email, phoneNo } = req.body;

    // Check if the company already exists
    const [existingCompanies] = await db.query('SELECT * FROM companies WHERE email = ?', [email]);
    if (existingCompanies.length > 0) {
        return next(new HttpError("Company already exists", 422));
    }

    const category = 'Active';
    const clientCode = 'CL001';
    const totalCandidateReceived = 10;
    const totalCandidateVerificationComplete = 20;
    const totalCandidateVerificationInProcess = 1;
    const totalCandidateVerificationInsufficient = 3;
    const totalReceivedData = 2;
    const totalPendingData = 0;

    const sql = 'INSERT INTO companies (name, representatives, designation, department, email, phoneNo, category, clientCode, totalCandidateReceived, totalCandidateVerificationComplete, totalCandidateVerificationInProcess, totalCandidateVerificationInsufficient, totalReceivedData, totalPendingData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    try {
        const [result] = await db.execute(sql, [name, representatives, designation, department, email, phoneNo, category, clientCode, totalCandidateReceived, totalCandidateVerificationComplete, totalCandidateVerificationInProcess, totalCandidateVerificationInsufficient, totalReceivedData, totalPendingData]);
        res.status(201).json({
            id: result.insertId,
            name,
            representatives,
            designation,
            department,
            email,
            phoneNo,
            category,
            clientCode,
            totalCandidateReceived,
            totalCandidateVerificationComplete,
            totalCandidateVerificationInProcess,
            totalCandidateVerificationInsufficient,
            totalReceivedData,
            totalPendingData
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError('Something went wrong. Please try again', 500));
    }
};

exports.getAllCompaniesList = getAllCompaniesList;
exports.createCompany = createCompany;
