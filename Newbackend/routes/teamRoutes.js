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

router.route('/')
  .get(getTeamMembers)
  .post(uploadTeam.single('profilePic'), processTeamPhoto, createTeamMember);

router.get('/all', getAllTeamMembersAdmin);

router.route('/:id')
  .get(getTeamMemberById)
  .put(uploadTeam.single('profilePic'), processTeamPhoto, updateTeamMember)
  .delete(deleteTeamMember);

router.route('/:id/status')
  .patch(toggleTeamStatus);

module.exports = router;
