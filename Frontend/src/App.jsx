import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
