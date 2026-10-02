const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber,
} = require('../controllers/newsletterController');

router.post('/subscribe', subscribeNewsletter);
router.post('/', subscribeNewsletter);

router.get('/all', getAllSubscribers);
router.get('/', getAllSubscribers);

router.delete('/:id', deleteSubscriber);

module.exports = router;
