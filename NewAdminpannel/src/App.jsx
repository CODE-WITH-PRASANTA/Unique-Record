import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// Layout
import MainLayout from "./Layout/MainLayout/MainLayout";

// Pages
import DashBoard from "./Pages/DashBoard/DashBoard";
import Blog from "./Pages/Blog/Blog"; // Make sure to adjust this path if your Blog page is stored in a different folder
import BlogManage from "./Pages/BlogManage/BlogManage";
import Notice from "./Pages/Notice/Notice";
import Event from "./Pages/Event/Event";
import Team from "./Pages/Team/Team";
import ManageDonate from "./Pages/ManageDonate/ManageDonate";
import Gallery from "./Pages/Gallery/Gallery";
import Youtube from "./Pages/Youtube/Youtube";
import MedieaPhoto from "./Pages/MedieaPhoto/MedieaPhoto";
import ManageUru from "./Pages/ManageUru/ManageUru";
import ApproveUru from "./Pages/ApproveUru/ApproveUru";
import FinallUru from "./Pages/FinallUru/FinallUru";
import ArchivementPost from "./Pages/ArchivementPost/ArchivementPost";
import AchievementCategory from "./Pages/AchievementCategory/AchievementCategory";
import Managecatgory from "./Pages/Managecatgory/Managecatgory";
import BlogCommentes from "./Pages/BlogCommentes/BlogCommentes";
import ArchivementComment from "./Pages/ArchivementComment/ArchivementComment";
import UserOpinion from "./Pages/UserOpinion/UserOpinion";
import Subscribe from "./Pages/Subscribe/Subscribe";
import EventCategory from "./Pages/EventCategory/EventCategory";
// Auth & Protection
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Login/Login";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Main Layout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >

            {/* Root */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<DashBoard />}
            />

            {/* Blog Create & Edit Routes */}
            <Route
              path="/blogs/create"
              element={<Blog />}
            />
            <Route
              path="/blogs/edit/:id"
              element={<Blog />}
            />
            <Route path="/blogs/manage" element={<BlogManage />} />
            <Route path="/notices/add" element={<Notice />} />
            <Route path="/events/add" element={<Event />} />
            <Route path="/events/category" element={<EventCategory />} />
            <Route path="/events/categories" element={<EventCategory />} />
            <Route path="/team/add" element={<Team />} />
            <Route path="/donations/manage" element={<ManageDonate />} />
            <Route path="/gallery/events" element={<Gallery />} />
            <Route path="/media/youtube" element={<Youtube />} />
            <Route path="/media/photos" element={<MedieaPhoto />} />
            <Route path="/uru/manage" element={<ManageUru />} />
            <Route path="/uru/approve" element={<ApproveUru />} />
            <Route path="/uru/final" element={<FinallUru />} />
            <Route path="/achievements/post" element={<ArchivementPost />} />
            <Route path="/achievements/category" element={<AchievementCategory />} />
            <Route path="/categories/manage" element={<Managecatgory />} />
            <Route path="/comments/blogs" element={<BlogCommentes />} />
            <Route path="/comments/achievements" element={<ArchivementComment />} />
            <Route path="users/opinions" element={<UserOpinion />} />
            <Route path="/users/newsletter" element={<Subscribe />} />

          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;