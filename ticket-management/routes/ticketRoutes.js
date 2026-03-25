const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', ticketController.listTickets);
router.get('/add', ticketController.showAddForm);
router.post('/add', upload.single('image'), ticketController.addTicket);
router.get('/edit/:id', ticketController.showEditForm);
router.post('/edit/:id', upload.single('image'), ticketController.updateTicket);
router.post('/delete/:id', ticketController.deleteTicket);
router.get('/detail/:id', ticketController.showDetail);

module.exports = router;
