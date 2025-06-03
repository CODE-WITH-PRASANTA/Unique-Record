import React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListIcon from '@mui/icons-material/List';
import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'; // Gallery Icon
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import a nice 'approval' icon
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminManageNotice from '../../Components/AdminManageNotice/AdminManageNotice';
import AdminAddNotice from '../../Components/AdminAddNotice/AdminAddNotice';
import AdminAddEvent from '../../Components/AdminAddEvent/AdminAddEvent';
import AdminEditEvent from '../../Components/AdminEditEvent/AdminEditEvent';
import EventGallery from '../../Components/EventGallery/EventGallery'; // New Component
import HomeGallery from '../../Components/HomeGallery/HomeGallery'; // New Component
import AdminAddTeamMember from '../../Components/AdminAddTeamMember/AdminAddTeamMember';
import AdminManageRegisteredPeople from '../../Components/AdminManageRegisteredPeople/AdminManageRegisteredPeople';
import './AdminNavbar.css';
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

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon style={{ color: '#1976d2' }} />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Blog Section',
  },
  {
    segment: 'blog',
    title: 'Blog',
    icon: <ArticleIcon style={{ color: '#ff5722' }} />,
    children: [
      {
        segment: 'create',
        title: 'Create Blog',
        icon: <CreateIcon style={{ color: '#4caf50' }} />,
      },
      {
        segment: 'edit',
        title: 'Delete Blog',  // <-- Added this
        icon: <EditIcon style={{ color: '#ff9800' }} />,
      },
    ],
  },
  {
  kind: 'header',
  title: 'URU Management',
},
{
  segment: 'uru',
  title: 'URU',
  icon: <DashboardIcon style={{ color: '#009688' }} />, 
  children: [
    {
      segment: 'manage-uru',
      title: 'Manage URU',
      icon: <ListIcon style={{ color: '#2196f3' }} />,
    },
    {
      segment: 'approve-uru',
      title: 'Approve URU',
      icon: <CheckCircleIcon style={{ color: '#4caf50' }} />,
    },
     {
        segment: 'final-uru',
        title: 'Final URU',
        icon: <CheckCircleIcon style={{ color: '#8bc34a' }} />, // You can use a different icon
      },
  ],
},

 {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Achievements',
  },
  {
    segment: 'achievements',
    title: 'Achievements',
    icon: <DashboardIcon style={{ color: '#8bc34a' }} />, 
    children: [
      {
        segment: 'post',
        title: 'Post Achievement',
        icon: <AddCircleIcon style={{ color: '#4caf50' }} />,
      },
      {
        segment: 'manage',
        title: 'Manage Achievements',
        icon: <ListIcon style={{ color: '#2196f3' }} />,
      },
    ],
  },

  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Manage Notice',
  },
  {
    segment: 'notice',
    title: 'Notices',
    icon: <AnnouncementIcon style={{ color: '#ff9800' }} />,
    children: [
      {
        segment: 'add',
        title: 'Add Notice',
        icon: <AddCircleIcon style={{ color: '#4caf50' }} />,
      },
      {
        segment: 'manage',
        title: 'Manage Notice',
        icon: <ListIcon style={{ color: '#2196f3' }} />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Manage Event',
  },
  {
    segment: 'event',
    title: 'Events',
    icon: <EventIcon style={{ color: '#673ab7' }} />, 
    children: [
      {
        segment: 'add',
        title: 'Add Event',
        icon: <AddCircleIcon style={{ color: '#4caf50' }} />,
      },
      {
        segment: 'edit',
        title: 'Edit Event',
        icon: <EditIcon style={{ color: '#ff9800' }} />,
      },
      {
        segment: 'manage-registered',
        title: 'Manage Registered People',
        icon: <ListIcon style={{ color: '#3f51b5' }} />, // Icon for managing registered users
      },
    ],
  },
  
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Gallery Manage',
  },
  {
    segment: 'gallery',
    title: 'Gallery',
    icon: <PhotoLibraryIcon style={{ color: '#9c27b0' }} />, 
    children: [
      {
        segment: 'event-gallery',
        title: "Event's Gallery",
        icon: <PhotoLibraryIcon style={{ color: '#3f51b5' }} />,
      },
      {
        segment: 'home-gallery',
        title: 'Home Gallery',
        icon: <PhotoLibraryIcon style={{ color: '#e91e63' }} />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Manage Team',
  },
  {
    segment: 'team',
    title: 'Team Members',
    icon: <DashboardIcon style={{ color: '#009688' }} />, 
    children: [
      {
        segment: 'add',
        title: 'Add Team Member',
        icon: <AddCircleIcon style={{ color: '#4caf50' }} />,
      },
      {
        segment: 'manage',
        title: 'Manage Team Members',
        icon: <ListIcon style={{ color: '#2196f3' }} />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Category Manage',
  },
  {
    segment: 'category',
    title: 'Manage Categories',
    icon: <ListIcon style={{ color: '#2196f3' }} />, 
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Donation Manage',
  },
  {
    segment: 'donation',
    title: 'Donations',
    icon: <AddCircleIcon style={{ color: '#f44336' }} />, // You can use a different icon if you like
    children: [
      {
        segment: 'manage',
        title: 'Manage Donations',
        icon: <ListIcon style={{ color: '#2196f3' }} />,
      },
    ],
  },

  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Home Media',
  },
  {
    segment: 'homemedia',
    title: 'Manage Home Media',
    icon: <PhotoLibraryIcon style={{ color: '#ff5722' }} />, // or another relevant icon
  },
  {
    kind: 'header',
    title: 'Manage Media',
  },
  {
    segment: 'media',
    title: 'Media',
    icon: <PhotoLibraryIcon style={{ color: '#00bcd4' }} />,
    children: [
      {
        segment: 'youtube',
        title: 'YouTube Manage',
        icon: <PhotoLibraryIcon style={{ color: '#f44336' }} />,
      },
      {
        segment: 'photos',
        title: 'Photo Manage',
        icon: <PhotoLibraryIcon style={{ color: '#3f51b5' }} />,
      },


    ],
  },

  

];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100% !important',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        .css-t3xolk {
          width: auto !important;
        }
      `,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
      matches: (path) => pathname.startsWith(path),
    }),
    [pathname]
  );

  return router;
}

export default function DashboardLayoutBasic({ window }) {
  const router = useDemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;

  return (
    <div className="dashboard-wrapper">
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <PageContainer>
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
            {router.pathname === '/homemedia' && <AdminManageHomeMedia />}
            {router.pathname === '/media/youtube' && <YoutubeManage />}
            {router.pathname === '/media/photos' && <PhotoManage />}
            {router.pathname === '/approve-blogs' && <AproveBlogs />}
            {router.pathname === '/uru/manage-uru' && <ManageURU />}
            {router.pathname === '/uru/approve-uru' && <ApproveURU />}
            {router.pathname === '/uru/final-uru' && <FinalURU />} 
            {router.pathname === '/achievements/post' && <AdminPostAchievement />}
            {router.pathname === '/achievements/manage' && <AdminManageAchievements />}
            {router.pathname === '/category' && <AdminManageCategories />}

          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}
