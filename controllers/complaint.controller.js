const complaintModel = require('../models/complaint.models.js');
const userModel = require('../models/user.models.js');

module.exports.registerComplaint = async (req, res, next) => {
    const {subject, description} = req.body;
    try {
        const userRecord = await userModel.findById(req.user.id);
        if (!userRecord) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await complaintModel.create({
            subject,
            description,
            name: `${userRecord.firstName} ${userRecord.lastName}`,
            email: userRecord.email,
            user: userRecord._id
        });

        return res.status(200).json({
            message: "Submitted successfully."
        });
    } catch (error) {
        console.error("Error creating complaint:", error);
        return res.status(500).json({
            message: "An error occurred while submitting your complaint. Please try again later."
        });
    }
}