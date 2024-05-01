const userCtrl = require('../controllers/cl_group')
const express = require("express");
const router = express.Router();

router.get('/:uid', userCtrl.getGroup)
router.post('/', userCtrl.postGroup)

module.exports = router;
