import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sugar } from "react-preloaders";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import FaqPage from "./Pages/FaqPage/FaqPage";
import Media from "./Pages/Media/Media";
import Blog from "./Pages/Blog/Blog";
import BlogDetails from "./Components/BlogDetails/BlogDetails";
import { useState, useEffect } from "react";
import Vision from "./Pages/Vision/Vision";
import OurAchivments from "./Pages/OurAchivments/OurAchivments";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Sugar customLoading={loading} background="#04171a" color="#ffffff" />
      {!loading && (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/media" element={<Media />} />
            <Route path="/vision" element={<Vision />}/>
            <Route path="/achivments" element={<OurAchivments />}/>
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
          </Routes>
          <Footer />
        </Router>
      )}
    </>
  );
}

export default App;
