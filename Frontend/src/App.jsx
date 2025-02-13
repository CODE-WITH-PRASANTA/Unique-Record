import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import "./App.css";
import AboutUs from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import FaqPage from "./Pages/FaqPage/FaqPage";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/faq" element={<FaqPage />}/>
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
