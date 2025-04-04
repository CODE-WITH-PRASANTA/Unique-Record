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
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import CreateBlog from '../../Components/CreateBlog/CreateBlog';
import AdminManageNotice from '../../Components/AdminManageNotice/AdminManageNotice';
import AdminAddNotice from '../../Components/AdminAddNotice/AdminAddNotice';
import AdminAddEvent from '../../Components/AdminAddEvent/AdminAddEvent';
import AdminEditEvent from '../../Components/AdminEditEvent/AdminEditEvent';
import EventGallery from '../../Components/EventGallery/EventGallery'; // New Component
import HomeGallery from '../../Components/HomeGallery/HomeGallery'; // New Component
import AdminAddTeamMember from '../../Components/AdminAddTeamMember/AdminAddTeamMember';
import AdminManageTeamMembers from '../../Components/AdminManageTeamMembers/AdminManageTeamMembers';
import './AdminNavbar.css';

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
            {router.pathname === '/blog/create' && <CreateBlog />}
            {router.pathname === '/notice/add' && <AdminAddNotice />} 
            {router.pathname === '/notice/manage' && <AdminManageNotice />}
            {router.pathname === '/event/add' && <AdminAddEvent />}
            {router.pathname === '/event/edit' && <AdminEditEvent />}
            {router.pathname === '/gallery/event-gallery' && <EventGallery />}
            {router.pathname === '/gallery/home-gallery' && <HomeGallery />}
            {router.pathname === '/team/add' && <AdminAddTeamMember />}
            {router.pathname === '/team/manage' && <AdminManageTeamMembers />}

          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}
