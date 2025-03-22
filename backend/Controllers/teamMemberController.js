const TeamMember = require("../Model/TeamMember");
const cloudinary = require("../Config/cloudinary");
const upload = require("../Middleware/multer");

// Add Team Member
exports.addTeamMember = async (req, res) => {
    try {
        const { memberName, designation, phoneNumber, email, facebook, instagram, twitter, linkedin } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image upload failed" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "team_members",
            use_filename: true,
            unique_filename: false,
        });

        // Save data in MongoDB
        const newTeamMember = new TeamMember({
            profilePic: result.secure_url, // Cloudinary image URL
            memberName,
            designation,
            phoneNumber,
            email,
            facebook,
            instagram,
            twitter,
            linkedin,
        });

        await newTeamMember.save();
        res.status(201).json({ message: "Team Member Added Successfully", teamMember: newTeamMember });
    } catch (error) {
        console.error("Error Adding Team Member:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Team Members
exports.getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find();
        res.status(200).json(teamMembers);
    } catch (error) {
        console.error("Error Fetching Team Members:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Single Team Member by ID
exports.getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findById(id);
        if (!teamMember) {
            return res.status(404).json({ message: "Team Member Not Found" });
        }
        res.status(200).json(teamMember);
    } catch (error) {
        console.error("Error Fetching Team Member:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Team Member with Cloudinary Image Replacement
exports.updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberName, designation, phoneNumber, email, facebook, instagram, twitter, linkedin } = req.body;
        let updatedData = { memberName, designation, phoneNumber, email, facebook, instagram, twitter, linkedin };

        const teamMember = await TeamMember.findById(id);
        if (!teamMember) {
            return res.status(404).json({ message: "Team Member Not Found" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            const oldImagePublicId = teamMember.profilePic.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`team_members/${oldImagePublicId}`);

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "team_members",
                use_filename: true,
                unique_filename: false,
            });

            updatedData.profilePic = result.secure_url;
        }

        // Update team member in the database
        const updatedTeamMember = await TeamMember.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: "Team Member Updated Successfully", teamMember: updatedTeamMember });
    } catch (error) {
        console.error("Error Updating Team Member:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Team Member Permanently from Database and Cloudinary
exports.deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findById(id);
        if (!teamMember) {
            return res.status(404).json({ message: "Team Member Not Found" });
        }

        // Extract public ID from Cloudinary URL
        const imagePublicId = teamMember.profilePic.split('/').pop().split('.')[0];

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(`team_members/${imagePublicId}`);

        // Delete from MongoDB
        await TeamMember.findByIdAndDelete(id);

        res.status(200).json({ message: "Team Member Permanently Deleted" });
    } catch (error) {
        console.error("Error Deleting Team Member:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
