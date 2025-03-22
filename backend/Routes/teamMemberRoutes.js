const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const { 
    addTeamMember, 
    getAllTeamMembers, 
    getTeamMemberById, 
    updateTeamMember, 
    deleteTeamMember 
} = require("../Controllers/teamMemberController");

// Add Team Member with Image Upload
router.post("/add", upload.single("profilePic"), addTeamMember);

// Get All Team Members
router.get("/all", getAllTeamMembers);

// Get Single Team Member by ID
router.get("/:id", getTeamMemberById);

// Update Team Member with Image Replacement
router.put("/update/:id", upload.single("profilePic"), updateTeamMember);

// Delete Team Member from Database & Cloudinary
router.delete("/delete/:id", deleteTeamMember);

module.exports = router;
