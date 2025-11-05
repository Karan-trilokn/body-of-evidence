import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Listing from "./pages/Listing/Listing";
import Details from "./pages/Details/Details";
import { ThemeProvider } from "./context/ThemeContext";
import Search from "./pages/Search/Search";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndCondition from "./pages/Terms&Condition/Terms&Condition";
import CustomerSupport from "./pages/CustomerSupport/CustomerSupport";
 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:name" element={<Listing />} />
          <Route path="/blog/:name" element={<Details />} />
          <Route path="*" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
          <Route path="/about" element={<CustomerSupport />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
