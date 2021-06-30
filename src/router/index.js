const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const handlers = require("../handlers");
// const fileParser = require("./middlewares/file-parser"); 
const cors = require("cors");


// == middlewares
router.use(cors())

router.use(express.urlencoded({ extended: true }));

router.use(express.json());

router.use(morgan('dev'))

// router.use(fileParser) // TODO implement file upload

// == routes
router.post('/register', handlers.register);

router.post('/login', handlers.login);

router.post('/add-vehicle', handlers.add_vehicle);

router.get('/vehicles', handlers.get_vehicles);


// == admin routes
router.post('/admin/register', handlers.add_admin);

router.post('/admin/login', handlers.admin_login);

router.get('/admin/customer-report', handlers.get_customers);

module.exports = router;