const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db");
const noticeRoutes = require('./Routes/noticeRoutes');
const eventRoutes = require("./Routes/eventRoutes");
const eventGalleryRoutes = require("./Routes/eventGalleryRoutes");
const authRoutes = require("./Routes/authRoutes");
const forgotPasswordRoutes = require('./Routes/forgotPasswordRoutes');
const teamMemberRoutes = require("./Routes/teamMemberRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const registerForEventRoutes = require("./Routes/registerForEventRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
const donationRoutes = require("./Routes/donationRoutes");
const homeMediaRoutes = require("./Routes/homeMediaRoutes");
const youtubeRoutes = require("./Routes/youtubeRoutes");
const photoRoutes = require("./Routes/photoRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const uruRoutes = require("./Routes/uruRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const achievementRoutes = require('./Routes/achievementRoutes');
const achivmentCommentRoutes = require('./Routes/achivmentCommentRoutes');
const blogFeedbackRoutes = require('./Routes/blogFeedbackRoutes');
const freeQuoteRoutes = require('./Routes/freeQuoteRoutes');
const newsletterRoutes = require('./Routes/newsletterRoutes');

dotenv.config();
connectDB();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  "https://backend.ouruniverse.in",
  "https://ouruniverse.in",
  "http://localhost:3000" // Added for local development convenience
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Required if you are sending/receiving cookies or authorization headers
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/notices", noticeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/eventsgalary", eventGalleryRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/registerevent", registerForEventRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/home-media", homeMediaRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/uru", uruRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/comment', achivmentCommentRoutes);
app.use("/api/blogcmt", blogFeedbackRoutes);
app.use('/api/freequotes', freeQuoteRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get('/', (req, res) => {
    res.send('Server is running...');
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});