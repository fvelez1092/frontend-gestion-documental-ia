import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { UploadPage } from "./pages/UploadPage";
import DocumentViewerPage from "./components/DocumentViewerPage";

function App() {
  return (
    <Router>
      <Sidebar />
      <div className="ml-0 md:ml-64 transition-all p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/viewer" element={<DocumentViewerPage />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App