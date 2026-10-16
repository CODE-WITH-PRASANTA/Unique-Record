
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Topbar from "./Components/Topbar/Topbar";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import Sidebar from "./Components/Sidebar/Sidebar";

import "./App.css";

// Lazy-loaded public pages
const AboutUs = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const FaqPage = lazy(() => import("./Pages/FaqPage/FaqPage"));
const Media = lazy(() => import("./Pages/Media/Media"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const BlogDetails = lazy(
  () => import("./Components/BlogDetails/BlogDetails")
);
const Vision = lazy(() => import("./Pages/Vision/Vision"));
const OurAchivments = lazy(
  () => import("./Pages/OurAchivments/OurAchivments")
);
const LearnMore = lazy(() => import("./Pages/LearnMore/LearnMore"));
const TermandCondition = lazy(
  () => import("./Pages/TermandCondition/TermandCondition")
);
const Notice = lazy(() => import("./Pages/Notice/Notice"));

// Lazy-loaded authentication pages
const Login = lazy(() => import("./Components/Login/Login"));
const ForgotPassword = lazy(
  () => import("./Components/ForgotPassword/ForgotPassword")
);

// Lazy-loaded dashboard pages
const UserDashboard = lazy(
  () => import("./Components/UserDashboard/UserDashboard")
);
const MakeUserPost = lazy(
  () => import("./Components/MakeUserPost/MakeUserPost")
);
const ApplicationStatus = lazy(
  () => import("./Components/ApplicationStatus/ApplicationStatus")
);
const DownCertificate = lazy(
  () => import("./Components/DownCertificate/DownCertificate")
);
const RegisterForEvent = lazy(
  () => import("./Components/RegisterForEvent/RegisterForEvent")
);
const EventStatus = lazy(
  () => import("./Components/EventStatus/EventStatus")
);

// Lazy-loaded event and payment pages
const Event = lazy(() => import("./Pages/Event/Event"));
const Donate = lazy(() => import("./Pages/Donate/Donate"));
const PaymentSuccess = lazy(
  () => import("./Components/PaymentSuccess/PaymentSuccess")
);
const DonationSuccess = lazy(
  () => import("./Components/DonationSuccess/DonationSuccess")
);

// Lazy-loaded achievement pages
const AchivmentDetails = lazy(
  () => import("./Components/AchivmentDetails/AchivmentDetails")
);
const AchiverDetails = lazy(
  () => import("./Pages/AchiverDetails/AchiverDetails")
);
const AchiversAbout = lazy(
  () => import("./Components/AchiversAbout/AchiversAbout")
);

// Lazy-loaded admin page
const AdminLogin = lazy(
  () => import("./Components/AdminLogin/AdminLogin")
);

function PageFallback() {
  return (
    <div className="page-loading" role="status">
      Loading...
    </div>
  );
}

function Layout() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const isDashboardPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/uru") ||
    location.pathname.startsWith("/event/");

  const showPublicLayout = !isAdminPage && !isDashboardPage;

  return (
    <>
      {showPublicLayout && (
        <>
          <Topbar />
          <Navbar />
        </>
      )}

      <Suspense fallback={<PageFallback />}>
        {isDashboardPage ? (
          <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-content">
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/dashboard"
                    element={<UserDashboard />}
                  />

                  <Route
                    path="/uru/apply"
                    element={<UserDashboard />}
                  />

                  <Route
                    path="/uru/application-status"
                    element={<ApplicationStatus />}
                  />

                  <Route
                    path="/uru/download-certificate"
                    element={<DownCertificate />}
                  />

                  <Route
                    path="/event/register"
                    element={<RegisterForEvent />}
                  />

                  <Route
                    path="/event/registration-status"
                    element={<EventStatus />}
                  />
                </Route>
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/learnmore" element={<LearnMore />} />

            <Route
              path="/termandcondition"
              element={<TermandCondition />}
            />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/media" element={<Media />} />
            <Route path="/vision" element={<Vision />} />

            <Route
              path="/achivments"
              element={<OurAchivments />}
            />

            <Route
              path="/achievements"
              element={<OurAchivments />}
            />

            <Route
              path="/archivement/:name"
              element={<AchivmentDetails />}
            />

            <Route
              path="/achievement/:name"
              element={<AchivmentDetails />}
            />

            <Route
              path="/achievers"
              element={<AchiverDetails />}
            />

            <Route
              path="/achiever/:id"
              element={<AchiversAbout />}
            />

            <Route
              path="/achivment-details/:id"
              element={<AchivmentDetails />}
            />

            <Route path="/blog" element={<Blog />} />

            <Route
              path="/blog/:slug"
              element={<BlogDetails />}
            />

            <Route path="/login" element={<Login />} />
            <Route path="/event" element={<Event />} />
            <Route path="/donate" element={<Donate />} />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/payment-success"
              element={<PaymentSuccess />}
            />

            <Route
              path="/donation-success"
              element={<DonationSuccess />}
            />

            <Route
              path="/your-post"
              element={
                <ProtectedRoute>
                  <MakeUserPost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={<AdminLogin />}
            />
          </Routes>
        )}
      </Suspense>

      {showPublicLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;