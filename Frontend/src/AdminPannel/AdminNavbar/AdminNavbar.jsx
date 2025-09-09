import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventIcon from '@mui/icons-material/Event';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CategoryIcon from '@mui/icons-material/Category';
import CommentIcon from '@mui/icons-material/Comment';
import ForumIcon from '@mui/icons-material/Forum';
import EmailIcon from '@mui/icons-material/Email';
import './AdminNavbar.css'

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import { useDemoRouter } from '@toolpad/core/internal';


// ✅ Import all your admin components
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminManageNotice from '../../Components/AdminManageNotice/AdminManageNotice';
import AdminAddNotice from '../../Components/AdminAddNotice/AdminAddNotice';
import AdminAddEvent from '../../Components/AdminAddEvent/AdminAddEvent';
import AdminEditEvent from '../../Components/AdminEditEvent/AdminEditEvent';
import EventGallery from '../../Components/EventGallery/EventGallery';
import HomeGallery from '../../Components/HomeGallery/HomeGallery';
import AdminAddTeamMember from '../../Components/AdminAddTeamMember/AdminAddTeamMember';
import AdminManageRegisteredPeople from '../../Components/AdminManageRegisteredPeople/AdminManageRegisteredPeople';
import AdminManageDonations from '../../Components/AdminManageDonations/AdminManageDonations';
import AdminManageHomeMedia from '../../Components/AdminManageHomeMedia/AdminManageHomeMedia';
import YoutubeManage from '../../Components/YoutubeManage/YoutubeManage';
import PhotoManage from '../../Components/PhotoManage/PhotoManage';
import AdminEditBlogs from '../../Components/AdminEditBlogs/AdminEditBlogs';
import AdminManageTeamMembers from '../../Components/AdminManageTeamMembers/AdminManageTeamMembers';
import AproveBlogs from '../../Components/AproveBlogs/AproveBlogs';
import ManageURU from '../../Components/ManageURU/ManageURU';
import ApproveURU from '../../Components/ApproveURU/ApproveURU';
import FinalURU from '../../Components/FinalURU/FinalURU';
import AdminPostAchievement from '../../Components/AdminPostAchievement/AdminPostAchievement';
import AdminManageAchievements from '../../Components/AdminManageAchievements/AdminManageAchievements';
import AdminManageCategories from '../../Components/AdminManageCategories/AdminManageCategories';
import CreateBlogs from '../../Components/CreateBlogs/CreateBlogs';
import AdminManageBlogComment from '../../Components/AdminManageBlogComment/AdminManageBlogComment';
import AdminAchivmentComment from '../../Components/AdminAchivmentComment/AdminAchivmentComment';
import UserOpinion from '../../Components/UserOpinion/UserOpinion';
import SubscribedNewsletter from '../../Components/SubscribedNewsletter/SubscribedNewsletter';

// ✅ Your NAVIGATION config (directly included here, not imported)
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  { kind: 'divider' },
  {
    kind: 'header',
    title: 'Blog Section',
  },
  {
    segment: 'blog',
    title: 'Blogs',
    icon: <ArticleIcon />,
    children: [
      { segment: 'create', title: 'Create Blog', icon: <CreateIcon /> },
      { segment: 'edit', title: 'Manage Blogs', icon: <EditIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Notice Section',
  },
  {
    segment: 'notice',
    title: 'Notices',
    icon: <AnnouncementIcon />,
    children: [
      { segment: 'add', title: 'Add Notice', icon: <CreateIcon /> },
      { segment: 'manage', title: 'Manage Notices', icon: <EditIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Event Section',
  },
  {
    segment: 'event',
    title: 'Events',
    icon: <EventIcon />,
    children: [
      { segment: 'add', title: 'Add Event', icon: <CreateIcon /> },
      { segment: 'edit', title: 'Edit Event', icon: <EditIcon /> },
      { segment: 'manage-registered', title: 'Manage Registered', icon: <PeopleIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Team Section',
  },
  {
    segment: 'team',
    title: 'Team',
    icon: <GroupIcon />,
    children: [
      { segment: 'add', title: 'Add Member', icon: <GroupAddIcon /> },
      { segment: 'manage', title: 'Manage Members', icon: <EditIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Donations',
  },
  {
    segment: 'donation/manage',
    title: 'Manage Donations',
    icon: <VolunteerActivismIcon />,
  },
  {
    kind: 'header',
    title: 'Media',
  },
  {
    segment: 'gallery',
    title: 'Gallery',
    icon: <PhotoLibraryIcon />,
    children: [
      { segment: 'event-gallery', title: 'Event Gallery', icon: <PhotoLibraryIcon /> },
      { segment: 'home-gallery', title: 'Home Gallery', icon: <PhotoLibraryIcon /> },
    ],
  },
  {
    segment: 'media',
    title: 'Media Manage',
    icon: <VideoLibraryIcon />,
    children: [
      { segment: 'youtube', title: 'YouTube Videos', icon: <VideoLibraryIcon /> },
      { segment: 'photos', title: 'Photos', icon: <PhotoLibraryIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'URU Section',
  },
  {
    segment: 'uru/manage-uru',
    title: 'Manage URU',
    icon: <ThumbUpIcon />,
  },
  {
    segment: 'uru/approve-uru',
    title: 'Approve URU',
    icon: <CheckCircleIcon />,
  },
  {
    segment: 'uru/final-uru',
    title: 'Final URU',
    icon: <CheckCircleIcon />,
  },
  {
    kind: 'header',
    title: 'Achievements',
  },
  {
    segment: 'achievements',
    title: 'Achievements',
    icon: <WorkspacePremiumIcon />,
    children: [
      { segment: 'post', title: 'Post Achievement', icon: <CreateIcon /> },
      { segment: 'manage', title: 'Manage Achievements', icon: <EditIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Categories',
  },
  {
    segment: 'category',
    title: 'Manage Categories',
    icon: <CategoryIcon />,
  },
  {
    kind: 'header',
    title: 'Comments',
  },
  {
    segment: 'comments',
    title: 'Comments',
    icon: <CommentIcon />,
    children: [
      { segment: 'blog-comments', title: 'Blog Comments', icon: <ForumIcon /> },
      { segment: 'achievement-comments', title: 'Achievement Comments', icon: <ForumIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Users',
  },
  {
    segment: 'user-opinion',
    title: 'User Opinions',
    icon: <ForumIcon />,
  },
  {
    segment: 'newsletter',
    title: 'Subscribed Newsletter',
    icon: <EmailIcon />,
  },
];

// ✅ Theme
const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

// ✅ Toolbar actions (Search + ThemeSwitcher + Account)
function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: 'inline', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
      />
      <ThemeSwitcher />
      <Account />
    </Stack>
  );
}

// ✅ Sidebar footer
function SidebarFooter({ mini }) {
  return (
    <Typography variant="caption" sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
      {mini ? '© MUI' : `© ${new Date().getFullYear()} Made with ❤️ by Admin Panel`}
    </Typography>
  );
}
SidebarFooter.propTypes = { mini: PropTypes.bool.isRequired };

// ✅ Custom Title
function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">Admin Panel</Typography>
      <Chip size="small" label="BETA" color="info" />
      <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}

export default function AdminNavbar({ window }) {
  const router = useDemoRouter('/dashboard');

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: ToolbarActionsSearch,
          sidebarFooter: SidebarFooter,
        }}
      >
        <Box sx={{ p: 3 }}>
          {router.pathname === '/dashboard' && <AdminDashboard />}
          {router.pathname === '/blog/create' && <CreateBlogs />}
          {router.pathname === '/blog/edit' && <AdminEditBlogs />}
          {router.pathname === '/notice/add' && <AdminAddNotice />}
          {router.pathname === '/notice/manage' && <AdminManageNotice />}
          {router.pathname === '/event/add' && <AdminAddEvent />}
          {router.pathname === '/event/edit' && <AdminEditEvent />}
          {router.pathname === '/gallery/event-gallery' && <EventGallery />}
          {router.pathname === '/gallery/home-gallery' && <HomeGallery />}
          {router.pathname === '/team/add' && <AdminAddTeamMember />}
          {router.pathname === '/team/manage' && <AdminManageTeamMembers />}
          {router.pathname === '/event/manage-registered' && <AdminManageRegisteredPeople />}
          {router.pathname === '/donation/manage' && <AdminManageDonations />}
          {router.pathname === '/media/homemedia' && <AdminManageHomeMedia />}
          {router.pathname === '/media/youtube' && <YoutubeManage />}
          {router.pathname === '/media/photos' && <PhotoManage />}
          {router.pathname === '/approve-blogs' && <AproveBlogs />}
          {router.pathname === '/uru/manage-uru' && <ManageURU />}
          {router.pathname === '/uru/approve-uru' && <ApproveURU />}
          {router.pathname === '/uru/final-uru' && <FinalURU />}
          {router.pathname === '/achievements/post' && <AdminPostAchievement />}
          {router.pathname === '/achievements/manage' && <AdminManageAchievements />}
          {router.pathname === '/category' && <AdminManageCategories />}
          {router.pathname === '/comments/blog-comments' && <AdminManageBlogComment />}
          {router.pathname === '/comments/achievement-comments' && <AdminAchivmentComment />}
          {router.pathname === '/user-opinion' && <UserOpinion />}
          {router.pathname === '/newsletter' && <SubscribedNewsletter />}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

