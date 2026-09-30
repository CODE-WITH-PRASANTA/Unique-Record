// =====================================================
// DNS CONFIGURATION — MUST BE FIRST
// =====================================================
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

console.log("DNS servers configured:", dns.getServers());

// =====================================================
// IMPORTS
// =====================================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// IMPORTANT:
// connectDB is required AFTER DNS configuration
const connectDB = require("./Config/db");

const noticeRoutes = require("./Routes/noticeRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const eventGalleryRoutes = require("./Routes/eventGalleryRoutes");
const authRoutes = require("./Routes/authRoutes");
const forgotPasswordRoutes = require("./Routes/forgotPasswordRoutes");
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
const achievementRoutes = require("./Routes/achievementRoutes");
const achivmentCommentRoutes = require("./Routes/achivmentCommentRoutes");
const blogFeedbackRoutes = require("./Routes/blogFeedbackRoutes");
const freeQuoteRoutes = require("./Routes/freeQuoteRoutes");
const newsletterRoutes = require("./Routes/newsletterRoutes");

// =====================================================
// ENVIRONMENT
// =====================================================
dotenv.config();

// =====================================================
// APP
// =====================================================
const app = express();

// =====================================================
// CORS CONFIGURATION
// =====================================================
const allowedOrigins = [
  "https://backend.ouruniverse.in",
  "https://ouruniverse.in",

  // React/Vite development
  "http://localhost:5173",

  // Older React development port
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin
      // such as Postman, curl, mobile apps, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";

      return callback(new Error(msg), false);
    },

    credentials: true,
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(express.json({ limit: "100mb" }));

app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

app.use(cookieParser());

// =====================================================
// API ROUTES
// =====================================================
app.use("/api/notices", noticeRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/eventsgalary", eventGalleryRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/forgot-password", forgotPasswordRoutes);

app.use("/api/team", teamMemberRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/registerevent", registerForEventRoutes);

app.use("/api/donation", donationRoutes);

app.use("/api/home-media", homeMediaRoutes);

app.use("/api/youtube", youtubeRoutes);

app.use("/api/photos", photoRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/uru", uruRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/achievements", achievementRoutes);

app.use("/api/comment", achivmentCommentRoutes);

app.use("/api/blogcmt", blogFeedbackRoutes);

app.use("/api/freequotes", freeQuoteRoutes);

app.use("/api/newsletter", newsletterRoutes);

// =====================================================
// ROOT ROUTE
// =====================================================
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// =====================================================
// PORT
// =====================================================
const PORT = process.env.PORT || 5007;

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

// =====================================================
// CONNECT DATABASE
// =====================================================
connectDB();