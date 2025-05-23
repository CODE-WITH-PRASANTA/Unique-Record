const URU = require("../Model/uruModel");
const cloudinary = require("../Config/cloudinary");
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();
const { createHmac } = require('crypto');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports = {
  createUru: async (req, res) => {
    try {
      const {
        position ,
        applicantName,
        sex,
        dateOfBirth,
        address,
        district,
        country,
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
        witness1Name,
        witness1Designation,
        witness1Address,
        witness1MobileNumber,
        witness1EmailId,
        witness2Name,
        witness2Designation,
        witness2Address,
        witness2MobileNumber,
        witness2EmailId,
      } = req.body;

      const userId = req.user.id;

      const photo = req.files.photo;
      const video = req.files.video;
      const document = req.files.document;

      const photoResult = await cloudinary.uploader.upload(photo[0].path);
      const videoResult = video ? await cloudinary.uploader.upload(video[0].path, { resource_type: "video" }) : null;
      const documentResult = document ? await cloudinary.uploader.upload(document[0].path) : null;

      let applicationNumber;
      let isUnique = false;

      while (!isUnique) {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        applicationNumber = `URU${randomNumber}`;
        const existingUru = await URU.findOne({ applicationNumber });
        if (!existingUru) {
          isUnique = true;
        }
      }

      const uru = new URU({
        position: req.body.position,
        userId,
        applicationNumber,
        applicantName,
        sex,
        dateOfBirth,
        address,
        district,
        country,
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
        photoUrl: photoResult.secure_url,
        videoUrl: videoResult ? videoResult.secure_url : null,
        documentUrl: documentResult ? documentResult.secure_url : null,
        witness1: {
          name: witness1Name,
          designation: witness1Designation,
          address: witness1Address,
          mobileNumber: witness1MobileNumber,
          emailId: witness1EmailId,
        },
        witness2: {
          name: witness2Name,
          designation: witness2Designation,
          address: witness2Address,
          mobileNumber: witness2MobileNumber,
          emailId: witness2EmailId,
        },
      });

      await uru.save();

      res.status(201).json({
        message: "URU application created successfully",
        applicationNumber: uru.applicationNumber,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllUru: async (req, res) => {
    try {
      const urus = await URU.find().populate("userId", "name email");
      res.status(200).json(urus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUruById: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id).populate("userId", "name email");
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }
      res.status(200).json(uru);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUru: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id);
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }
      const updatedUru = await URU.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(updatedUru);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUru: async (req, res) => {
  try {
    const uru = await URU.findById(req.params.id);
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }

    // Delete files from Cloudinary
    if (uru.photoUrl) {
      const photoPublicId = uru.photoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(photoPublicId);
    }

    if (uru.videoUrl) {
      const videoPublicId = uru.videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
    }

    if (uru.documentUrl) {
      const documentPublicId = uru.documentUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(documentPublicId);
    }

    if (uru.certificateUrl) {
      const certificatePublicId = uru.certificateUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(certificatePublicId);
    }

    // Delete the URU application from the database
    await URU.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "URU application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} ,

 approveUru: async (req, res) => {
  try {
    const uru = await URU.findById(req.params.id);
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }
    uru.status = "Approved";
    uru.approvedDate = new Date();
    await uru.save({ validateBeforeSave: false });
    res.status(200).json({ message: "URU application approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  },

  fetchApprovedUru: async (req, res) => {
    try {
      const approvedUrus = await URU.find({ status: "Approved" });
      if (!approvedUrus.length) {
        return res.status(200).json([]); // Return empty array if no approved URUs
      }
      res.status(200).json(approvedUrus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePrice: async (req, res) => {
    try {
      const { applicationNumber, price } = req.body;
      if (!applicationNumber || !price) {
        return res.status(400).json({ message: "Application number and price are required" });
      }

      const uru = await URU.findOne({ applicationNumber });
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      if (uru.priceUpdated) {
        return res.status(400).json({ message: "Price has already been updated for this application" });
      }

      const updatedUru = await URU.findOneAndUpdate(
        { applicationNumber },
        {
          $set: {
            price,
            priceUpdated: true,
            priceUpdatedDate: new Date().toISOString(),
          },
        },
        { new: true }
      );

      res.status(200).json({ message: "Price updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUruByApplicationNumber: async (req, res) => {
  try {
    const applicationNumber = req.params.applicationNumber;
    const uru = await URU.findOne({ applicationNumber });
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }
    res.status(200).json(uru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  createRazorpayOrder: async (req, res) => {
    try {
      const { applicationNumber } = req.body;

      const uru = await URU.findOne({ applicationNumber });
      if (!uru || !uru.price) return res.status(404).json({ message: "Application not found or price missing" });

      const options = {
        amount: uru.price * 100, // ₹ to paise
        currency: "INR",
        receipt: `receipt_${applicationNumber}`,
      };

      const order = await razorpay.orders.create(options);

      uru.razorpayOrderId = order.id;
      await uru.save();

      res.status(200).json({ orderId: order.id, amount: options.amount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyRazorpayPayment: async (req, res) => {
    try {
      const { applicationNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      const hmac = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }

     await URU.findOneAndUpdate(
  { applicationNumber },
  {
    paymentStatus: "Success",
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: "Approved",
  }
);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

   fetchPaidUru: async (req, res) => {
    try {
      const paidUrus = await URU.find({ paymentStatus: "Success" });
      res.status(200).json(paidUrus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

    uploadCertificate: async (req, res) => {
    try {
      const applicationNumber = req.params.applicationNumber;
      const uru = await URU.findOne({ applicationNumber });
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const certificate = req.file;
      const result = await cloudinary.uploader.upload(certificate.path);
      uru.certificateUrl = result.secure_url;
      await uru.save();

      res.status(200).json({ message: "Certificate uploaded successfully" });
    } catch (error) {
      console.error(error); // Log the error for more insights
      res.status(500).json({ message: error.message });
    }
  },

  downloadCertificate: async (req, res) => {
    try {
      const applicationNumber = req.params.applicationNumber;
      const uru = await URU.findOne({ applicationNumber });
      if (!uru || !uru.certificateUrl) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      const certificateUrl = uru.certificateUrl;
      res.redirect(certificateUrl);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  fetchAppliedUruByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const urus = await URU.find({ userId });
      res.status(200).json(urus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

};
