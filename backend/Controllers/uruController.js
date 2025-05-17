const URU = require("../Model/uruModel");
const cloudinary = require("../Config/cloudinary");
const Razorpay = require("razorpay");
const crypto = require("crypto");


// Create URU
// Create URU
const createURU = async (req, res) => {
  try {
    const existingURU = await URU.findOne({ userId: req.user.id });
    if (existingURU && existingURU.status !== "Rejected" && existingURU.status !== "Deleted") {
      return res.status(400).json({ message: "You already have a pending or approved URU" });
    }

    if (existingURU && existingURU.status === "Deleted") {
      await URU.findByIdAndDelete(existingURU._id);
    }

    const {
      applicantName,
      sex,
      dateOfBirth,
      address,
      district,
      state,
      pinCode,
      educationalQualification,
      whatsappMobileNumber,
      emailId,
      occupation,
      recordCategory,
      recordTitle,
      recordDescription,
      purposeOfRecordAttempt,
      dateOfAttempt,
      recordVenue,
      organisationName,
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,
    } = req.body;

    let photoUrl, videoUrl, documentUrl;

    if (req.files.photo) {
      const photoResult = await cloudinary.uploader.upload(req.files.photo[0].path, {
        folder: "URU_Photos",
      });
      photoUrl = photoResult.secure_url;
    }

    if (req.files.video) {
      const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
        folder: "URU_Videos",
        resource_type: "video",
      });
      videoUrl = videoResult.secure_url;
    }

    if (req.files.document) {
      const documentResult = await cloudinary.uploader.upload(req.files.document[0].path, {
        folder: "URU_Documents",
        resource_type: "raw",
      });
      documentUrl = documentResult.secure_url;
    }

    const newURU = new URU({
      userId: req.user.id,
      applicantName,
      sex,
      dateOfBirth,
      address,
      district,
      state,
      pinCode,
      educationalQualification,
      whatsappMobileNumber,
      emailId,
      occupation,
      recordCategory,
      recordTitle,
      recordDescription,
      purposeOfRecordAttempt,
      dateOfAttempt,
      recordVenue,
      organisationName,
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,
      photoUrl,
      videoUrl,
      documentUrl,
    });

    await newURU.save();

    res.status(201).json({ message: "URU created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating URU" });
  }
};

// Get all URUs
const getAllURUs = async (req, res) => {
  try {
    const urus = await URU.find();
    res.json(urus);
  } catch (error) {
    res.status(500).json({ message: "Error getting URUs" });
  }
};
const createURU = async (req, res) => {
  try {
    const {
      applicantName,
      sex,
      dateOfBirth,
      address,
      district,
      state,
      pinCode,
      educationalQualification,
      whatsappMobileNumber,
      emailId,
      occupation,
      recordCategory,
      recordTitle,
      recordDescription,
      purposeOfRecordAttempt,
      dateOfAttempt,
      recordVenue,
      organisationName,
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,
    } = req.body;

    // Validate required fields
    if (!applicantName || !sex || !dateOfBirth || !address || !district || !state || !pinCode || !educationalQualification || !whatsappMobileNumber || !emailId || !occupation || !recordCategory || !recordTitle || !recordDescription || !purposeOfRecordAttempt || !dateOfAttempt || !recordVenue) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingURU = await URU.findOne({ userId: req.user.id });
    if (existingURU && existingURU.status !== "Rejected" && existingURU.status !== "Deleted") {
      return res.status(400).json({ message: "You already have a pending or approved URU" });
    }

    if (existingURU && existingURU.status === "Deleted") {
      await URU.findByIdAndDelete(existingURU._id);
    }

    let photoUrl, videoUrl, documentUrl;

    if (req.files.photo) {
      const photoResult = await cloudinary.uploader.upload(req.files.photo[0].path, {
        folder: "URU_Photos",
      });
      photoUrl = photoResult.secure_url;
    }

    if (req.files.video) {
      const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
        folder: "URU_Videos",
        resource_type: "video",
      });
      videoUrl = videoResult.secure_url;
    }

    if (req.files.document) {
      const documentResult = await cloudinary.uploader.upload(req.files.document[0].path, {
        folder: "URU_Documents",
        resource_type: "raw",
      });
      documentUrl = documentResult.secure_url;
    }

    const newURU = new URU({
      userId: req.user.id,
      applicantName,
      sex,
      dateOfBirth,
      address,
      district,
      state,
      pinCode,
      educationalQualification,
      whatsappMobileNumber,
      emailId,
      occupation,
      recordCategory,
      recordTitle,
      recordDescription,
      purposeOfRecordAttempt,
      dateOfAttempt,
      recordVenue,
      organisationName,
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,
      photoUrl,
      videoUrl,
      documentUrl,
    });

    await newURU.save();

    res.status(201).json({ message: "URU created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating URU" });
  }
};


// Update URU status
const updateURUStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status === "Rejected") {
      const uru = await URU.findById(id);
      if (uru.photoUrl) {
        const publicId = uru.photoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`URU_Photos/${publicId}`);
      }
      if (uru.videoUrl) {
        const publicId = uru.videoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`URU_Videos/${publicId}`, {
          resource_type: "video",
        });
      }
      if (uru.documentUrl) {
        const publicId = uru.documentUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`URU_Documents/${publicId}`, {
          resource_type: "raw",
        });
      }
      await URU.findByIdAndDelete(id);
      res.json({ message: "URU rejected and deleted successfully" });
    } else {
      const uru = await URU.findByIdAndUpdate(id, { status }, { new: true });
      res.json(uru);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating URU status" });
  }
};

// Delete URU
const deleteURU = async (req, res) => {
  try {
    const { id } = req.params;
    await URU.findByIdAndDelete(id);
    res.json({ message: "URU deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting URU" });
  }
};

// Get all approved URUs
const getAllApprovedURUs = async (req, res) => {
  try {
    const urus = await URU.find({ status: "Approved" });
    res.json(urus);
  } catch (error) {
    res.status(500).json({ message: "Error getting approved URUs" });
  }
};

// Update URU price with validation
const updateURUPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }
    const uru = await URU.findByIdAndUpdate(id, { 
      price, 
      priceUpdated: true, 
      priceUpdatedDate: new Date().toLocaleString() 
    }, { new: true });
    if (!uru) {
      return res.status(404).json({ message: "URU not found" });
    }
    res.json(uru);
  } catch (error) {
    res.status(500).json({ message: "Error updating URU price" });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get application status
const getApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const uru = await URU.findOne({ userId });
    if (!uru) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ status: uru.status });
  } catch (error) {
    res.status(500).json({ message: "Error getting application status" });
  }
};

// Create Razorpay order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const uru = await URU.findOne({ userId });
    if (!uru) {
      return res.status(404).json({ message: "Application not found" });
    }
    const amount = uru.price * 100; // Convert to paise
    const options = {
      amount,
      currency: "INR",
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    const uru = await URU.findOne({ userId });
    if (!uru) {
      return res.status(404).json({ message: "Application not found" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Update application with payment details
      uru.paymentStatus = "Success";
      uru.razorpayOrderId = razorpay_order_id;
      uru.razorpayPaymentId = razorpay_payment_id;
      uru.razorpaySignature = razorpay_signature;
      await uru.save();

      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      uru.paymentStatus = "Failed";
      await uru.save();

      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};

const uploadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const uru = await URU.findById(id);
    if (!uru) {
      return res.status(404).json({ message: "URU not found" });
    }

    if (req.file) {
      const certificateResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "URU_Certificates",
      });
      const certificateUrl = certificateResult.secure_url;
      uru.certificateUrl = certificateUrl;
      await uru.save();
      res.json({ message: "Certificate uploaded successfully" });
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading certificate" });
  }
};

const downloadCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const uru = await URU.findOne({ userId });
    if (!uru) {
      return res.status(404).json({ message: "URU not found" });
    }

    if (!uru.certificateUrl) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ certificateUrl: uru.certificateUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error downloading certificate" });
  }
};

module.exports = {
  createURU,
  getAllURUs,
  updateURU,
  updateURUStatus,
  updateURUPrice,
  deleteURU,
  getAllApprovedURUs ,
  getApplicationStatus,
  createOrder,
  verifyPayment,
uploadCertificate , 
downloadCertificate
};