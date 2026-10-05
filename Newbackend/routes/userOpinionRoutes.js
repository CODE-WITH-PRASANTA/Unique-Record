const express = require('express');
const router = express.Router();
const {
  createOpinion,
  getAllOpinions,
  getApprovedOpinions,
  getOpinionById,
  updateOpinionStatus,
  updateOpinion,
  deleteOpinion,
} = require('../controllers/userOpinionController');

// Submit opinion / contact form
router.post('/create', createOpinion);
router.post('/submit', createOpinion);
router.post('/', createOpinion);

// Public approved opinions
router.get('/approved', getApprovedOpinions);

// Admin all opinions
router.get('/all', getAllOpinions);
router.get('/', getAllOpinions);

// Specific ID routes
router.put('/:id/publish', updateOpinionStatus);
router.patch('/:id/toggle', updateOpinionStatus);
router.patch('/:id/status', updateOpinionStatus);

router
  .route('/:id')
  .get(getOpinionById)
  .put(updateOpinion)
  .patch(updateOpinionStatus)
  .delete(deleteOpinion);

module.exports = router;
