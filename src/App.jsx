import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Catalog from "./components/Catalog.jsx";
import Rental from "./components/Rental.jsx";
import { useState } from "react";

function App() {
  const [view, setView] = useState("catalog"); // 'catalog' or 'rental'

  function toggleView() {
    setView((v) => (v === "catalog" ? "rental" : "catalog"));
  }

  return (
    <>
      <Header />
      <div className="page">
        <button className="toggle-view" onClick={toggleView}>
          {view === "catalog" ? "Book Rental" : "Back"}
        </button>
        {view === "catalog" ? <Catalog /> : <Rental />}
      </div>
      <Footer />
    </>
  );
}

export default App;
