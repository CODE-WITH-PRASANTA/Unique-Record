const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
    profilePic: { type: String, required: true },
    memberName: { type: String, required: true },
    designation: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember; // Ensure correct export
