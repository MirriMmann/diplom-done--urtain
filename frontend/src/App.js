import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import Booked from "./pages/Booked";
import SearchResults from "./pages/SearchResults";
import ShowDetails from "./pages/ShowDetails";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/adminSicret" element={<AdminPanel />} />
        <Route path="/booked" element={<Booked />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/shows/:id" element={<ShowDetails />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
};

export default App;
