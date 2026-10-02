const Blog = require('../models/blogModel');
const Event = require('../models/eventModel');
const Achievement = require('../models/achievementModel');
const UserOpinion = require('../models/userOpinionModel');
const Newsletter = require('../models/newsletterModel');
const BlogComment = require('../models/blogCommentModel');
const AchievementComment = require('../models/achievementCommentModel');
const Record = require('../models/recordModel');
const Team = require('../models/teamModel');
const Gallery = require('../models/galleryModel');
const Notice = require('../models/noticeModel');
const EventCategory = require('../models/eventCategoryModel');
const AchievementCategory = require('../models/achievementCategoryModel');
const Category = require('../models/categoryModel');

// @desc    Get aggregated project analytics for Admin Dashboard
// @route   GET /api/dashboard/stats
// @access  Public / Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalBlogs,
      totalEvents,
      totalAchievements,
      totalOpinions,
      totalSubscribers,
      totalBlogComments,
      totalAchievementComments,
      totalRecords,
      totalTeam,
      totalGallery,
      totalNotices,
      totalEventCategories,
      totalAchievementCategories,
      totalBlogCategories,
    ] = await Promise.all([
      Blog.countDocuments().catch(() => 0),
      Event.countDocuments().catch(() => 0),
      Achievement.countDocuments().catch(() => 0),
      UserOpinion.countDocuments().catch(() => 0),
      Newsletter.countDocuments().catch(() => 0),
      BlogComment.countDocuments().catch(() => 0),
      AchievementComment.countDocuments().catch(() => 0),
      Record.countDocuments().catch(() => 0),
      Team.countDocuments().catch(() => 0),
      Gallery.countDocuments().catch(() => 0),
      Notice.countDocuments().catch(() => 0),
      EventCategory.countDocuments().catch(() => 0),
      AchievementCategory.countDocuments().catch(() => 0),
      Category.countDocuments().catch(() => 0),
    ]);

    // Sub-status counts
    const [
      pendingOpinions,
      approvedOpinions,
      pendingBlogComments,
      approvedBlogComments,
      recentBlogs,
      recentEvents,
      recentAchievements,
      recentOpinions,
      recentSubscribers,
      recentComments,
    ] = await Promise.all([
      UserOpinion.countDocuments({ status: 'Draft' }).catch(() => 0),
      UserOpinion.countDocuments({ status: 'Approved' }).catch(() => 0),
      BlogComment.countDocuments({ status: 'Draft' }).catch(() => 0),
      BlogComment.countDocuments({ status: 'Approved' }).catch(() => 0),
      Blog.find().sort({ createdAt: -1 }).limit(5).select('title slug category author createdAt views status').catch(() => []),
      Event.find().sort({ createdAt: -1 }).limit(5).select('title category date venue createdAt status').catch(() => []),
      Achievement.find().sort({ createdAt: -1 }).limit(5).select('title heading category awardYear createdAt status').catch(() => []),
      UserOpinion.find().sort({ createdAt: -1 }).limit(6).select('name email subject message status createdAt').catch(() => []),
      Newsletter.find().sort({ createdAt: -1 }).limit(6).select('email subscribedAt createdAt').catch(() => []),
      BlogComment.find().sort({ createdAt: -1 }).limit(6).select('name email comment blogTitle status createdAt').catch(() => []),
    ]);

    // Calculate monthly activity trend (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = months[d.getMonth()];

      const [blogsCount, eventsCount, opinionsCount, subscribersCount] = await Promise.all([
        Blog.countDocuments({ createdAt: { $gte: d, $lt: nextD } }).catch(() => 0),
        Event.countDocuments({ createdAt: { $gte: d, $lt: nextD } }).catch(() => 0),
        UserOpinion.countDocuments({ createdAt: { $gte: d, $lt: nextD } }).catch(() => 0),
        Newsletter.countDocuments({ createdAt: { $gte: d, $lt: nextD } }).catch(() => 0),
      ]);

      monthlyTrends.push({
        month: monthLabel,
        blogs: blogsCount,
        events: eventsCount,
        inquiries: opinionsCount,
        subscribers: subscribersCount,
        total: blogsCount + eventsCount + opinionsCount + subscribersCount,
      });
    }

    // Content distribution breakdown for donut chart
    const distribution = [
      { key: 'blogs', label: 'Blogs & Articles', value: totalBlogs || 1, color: '#3b82f6' },
      { key: 'events', label: 'Events & Programs', value: totalEvents || 1, color: '#10b981' },
      { key: 'achievements', label: 'Achievements & Awards', value: totalAchievements || 1, color: '#8b5cf6' },
      { key: 'opinions', label: 'User Inquiries', value: totalOpinions || 1, color: '#f59e0b' },
      { key: 'gallery', label: 'Media & Photos', value: totalGallery || 1, color: '#ec4899' },
    ];

    // Total content items
    const totalContent = totalBlogs + totalEvents + totalAchievements + totalOpinions + totalGallery + totalSubscribers;

    // Compile recent combined activity feed
    const combinedActivity = [
      ...recentBlogs.map(b => ({
        id: `blog-${b._id}`,
        type: 'blog',
        title: `New Blog Published: ${b.title || 'Untitled'}`,
        meta: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
        date: b.createdAt || new Date(),
        badge: 'Blog',
        color: '#3b82f6',
      })),
      ...recentEvents.map(e => ({
        id: `evt-${e._id}`,
        type: 'event',
        title: `Event Scheduled: ${e.title || 'Untitled Event'}`,
        meta: e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
        date: e.createdAt || new Date(),
        badge: 'Event',
        color: '#10b981',
      })),
      ...recentOpinions.map(o => ({
        id: `opn-${o._id}`,
        type: 'opinion',
        title: `Contact Inquiry from ${o.name || o.email || 'Visitor'}`,
        meta: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
        date: o.createdAt || new Date(),
        badge: o.status || 'Draft',
        color: '#f59e0b',
      })),
      ...recentSubscribers.map(s => ({
        id: `sub-${s._id}`,
        type: 'subscriber',
        title: `Newsletter Subscription: ${s.email}`,
        meta: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
        date: s.createdAt || new Date(),
        badge: 'Subscriber',
        color: '#8b5cf6',
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    // Recent interactive table items (Inquiries / Feedback / Registrations)
    const recentSubmissions = [
      ...recentOpinions.map(o => ({
        id: `INQ-${String(o._id).slice(-4).toUpperCase()}`,
        user: o.name || 'Anonymous Visitor',
        category: 'Contact & Inquiry',
        date: o.createdAt,
        message: o.message || o.subject || 'No message provided',
        email: o.email || 'N/A',
        status: o.status === 'Approved' ? 'approved' : 'pending',
      })),
      ...recentComments.map(c => ({
        id: `CMT-${String(c._id).slice(-4).toUpperCase()}`,
        user: c.name || 'Blog Reader',
        category: 'Blog Feedback',
        date: c.createdAt,
        message: c.comment || 'Feedback submitted',
        email: c.email || 'N/A',
        status: c.status === 'Approved' ? 'approved' : 'pending',
      })),
      ...recentSubscribers.map(s => ({
        id: `SUB-${String(s._id).slice(-4).toUpperCase()}`,
        user: s.email ? s.email.split('@')[0] : 'Subscriber',
        category: 'Newsletter Subscription',
        date: s.createdAt,
        message: `Subscribed with email: ${s.email}`,
        email: s.email || 'N/A',
        status: 'approved',
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        totalEvents,
        totalAchievements,
        totalOpinions,
        totalSubscribers,
        totalBlogComments,
        totalAchievementComments,
        totalRecords,
        totalTeam,
        totalGallery,
        totalNotices,
        totalEventCategories,
        totalAchievementCategories,
        totalBlogCategories,
        pendingOpinions,
        approvedOpinions,
        pendingBlogComments,
        approvedBlogComments,
        totalContent,
      },
      distribution,
      monthlyTrends,
      recentActivity: combinedActivity,
      recentSubmissions,
      recentBlogs,
      recentEvents,
      recentAchievements,
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
