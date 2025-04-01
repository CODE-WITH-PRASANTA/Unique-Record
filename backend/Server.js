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




dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/notices", noticeRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/eventsgalary", eventGalleryRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/registerevent", registerForEventRoutes);



const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
