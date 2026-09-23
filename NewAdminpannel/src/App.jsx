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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Layout */}
        <Route element={<MainLayout />}>

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

          {/* Blog Create Route */}
          <Route 
            path="/blogs/create" 
            element={<Blog />} 
          />
          <Route path="/blogs/manage"element={<BlogManage/>}/>

        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;