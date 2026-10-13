const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getAllTeamMembersAdmin,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  toggleTeamStatus,
  deleteTeamMember,
} = require('../controllers/teamController');
const { uploadTeam, processTeamPhoto } = require('../middleware/teamUploadMiddleware');
const { adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTeamMembers)
  .post(adminOnly, uploadTeam.single('profilePic'), processTeamPhoto, createTeamMember);

router.get('/all', adminOnly, getAllTeamMembersAdmin);

router.route('/:id')
  .get(getTeamMemberById)
  .put(adminOnly, uploadTeam.single('profilePic'), processTeamPhoto, updateTeamMember)
  .delete(adminOnly, deleteTeamMember);

router.route('/:id/status')
  .patch(adminOnly, toggleTeamStatus);

module.exports = router;
