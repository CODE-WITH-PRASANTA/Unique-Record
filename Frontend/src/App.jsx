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
import "./App.css" ;
import LearnMore from "./Pages/LearnMore/LearnMore";
import TermandCondition from "./Pages/TermandCondition/TermandCondition";
import Notice from "./Pages/Notice/Notice";
import Login from "./Components/Login/Login";

function Layout() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learnmore" element={<LearnMore />}/>
        <Route path="/termandcondition" element={<TermandCondition />}/>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/media" element={<Media />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/achivments" element={<OurAchivments />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/admin/*" element={<AdminNavbar />} />
        <Route path="/login" element={<Login />}/>
      </Routes>
      {!hideNavbarFooter && <Footer />}
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
