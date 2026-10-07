const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded static files
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/uploads', express.static(path.join(__dirname, 'upload')));

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Unique Record API is running' });
});

// API Routes
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/eventsgalary', require('./routes/galleryRoutes'));
app.use('/api/eventsgallery', require('./routes/galleryRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/achievement', require('./routes/achievementRoutes'));
app.use('/api/achivments', require('./routes/achievementRoutes'));
app.use('/api/achievement-categories', require('./routes/achievementCategoryRoutes'));
app.use('/api/achievement-category', require('./routes/achievementCategoryRoutes'));
app.use('/api/comment', require('./routes/commentRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/blogcmt', require('./routes/blogCommentRoutes'));
app.use('/api/blog-comments', require('./routes/blogCommentRoutes'));
app.use('/api/blogcomments', require('./routes/blogCommentRoutes'));
app.use('/api/user-opinions', require('./routes/userOpinionRoutes'));
app.use('/api/opinions', require('./routes/userOpinionRoutes'));
app.use('/api/freequotes', require('./routes/userOpinionRoutes'));
app.use('/api/contact', require('./routes/userOpinionRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/newsletters', require('./routes/newsletterRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/event-categories', require('./routes/eventCategoryRoutes'));
app.use('/api/event-category', require('./routes/eventCategoryRoutes'));
// Auth Routes
app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
app.use('/api/auth', require('./routes/userAuthRoutes'));
app.use('/api/user', require('./routes/userAuthRoutes'));
app.use('/api/users', require('./routes/userAuthRoutes'));
app.use('/api/forgot-password', require('./routes/userAuthRoutes'));

// Dashboard Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));

// URU Application & Management Routes
app.use('/api/uru', require('./routes/uruRoutes'));
app.use('/api/manage-uru', require('./routes/uruRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
