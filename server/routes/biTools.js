const express = require('express');
const router = express.Router();
const biTools = require('../services/biTools');
const queueing = require('../services/queueing');

router.post('/addNewDashboard', biTools.addNewDashboard);
router.put('/updateSelectedDashboard', biTools.updateSelectedDashboard);
router.get('/getSelectedDashboard', biTools.getSelectedDashboard);
router.post('/queueBiReports', queueing.makeBiQueueing);
router.get('/getBiAttributes', biTools.getBiAttributes);
router.put('/setDefaultDashBoard', biTools.setDefaultDashboard)
router.put('/deleteSelectedDashboard', biTools.deleteDashboard)
router.post('/makeBiReport', biTools.makeBiReport);
router.post("/testBi", biTools.testBi);
router.get('/', biTools.getDashboardOption);
router.post('/deleteBiReport', biTools.deleteBiReport);
router.put('/changeDashboardName', biTools.changeDashboardName);
router.get('/searchAll', biTools.searchAll);
router.get('/workCodeCategories', biTools.getWorkCodesCategories);
router.get('/sip_interfaces', biTools.findAllSipInterfaces);
router.get('/getQueues', biTools.getQueues);

module.exports = router