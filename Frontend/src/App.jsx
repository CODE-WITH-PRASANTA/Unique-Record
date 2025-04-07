import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import FaqPage from "./Pages/FaqPage/FaqPage";
import Media from "./Pages/Media/Media";
import Blog from "./Pages/Blog/Blog";
import BlogDetails from "./Components/BlogDetails/BlogDetails";
import Vision from "./Pages/Vision/Vision";
import OurAchivments from "./Pages/OurAchivments/OurAchivments";
import AdminNavbar from "./AdminPannel/AdminNavbar/AdminNavbar";
import "./App.css";
import LearnMore from "./Pages/LearnMore/LearnMore";
import TermandCondition from "./Pages/TermandCondition/TermandCondition";
import Notice from "./Pages/Notice/Notice";
import Login from "./Components/Login/Login";
import Event from "./Pages/Event/Event";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import Sidebar from "./Components/Sidebar/Sidebar";
import RegisterForEvent from "./Components/RegisterForEvent/RegisterForEvent";
import ProtectedRoute from "./Components/ProtectedRoute"; // ✅ Keep only this import
import Donate from "./Pages/Donate/Donate";
import PaymentSuccess from "./Components/PaymentSuccess/PaymentSuccess";
import DonationSuccess from "./Components/DonationSuccess/DonationSuccess";

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* Show Navbar only if not in Admin or User Dashboard */}
      {!isAdminPage && !isDashboardPage && <Navbar />}

      {/* Protected Dashboard Layout */}
      {isDashboardPage ? (
        <div className="dashboard-container">
          <Sidebar />
          <div className="dashboard-content">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/dashboard/event-registration" element={<RegisterForEvent />} />
              </Route>
            </Routes>
          </div>
        </div>
      ) : (
        // Main Website Layout
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learnmore" element={<LearnMore />} />
            <Route path="/termandcondition" element={<TermandCondition />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/media" element={<Media />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/achivments" element={<OurAchivments />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/event" element={<Event />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            

          
              <Route path="/admin/*" element={<AdminNavbar />} />
          </Routes>
        </div>
      )}

      {/* Show Footer only if not in Admin or User Dashboard */}
      {!isAdminPage && !isDashboardPage && <Footer />}
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
