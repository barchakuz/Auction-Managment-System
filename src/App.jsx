import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/context";
import Authentication from "./features/Authentication/Authentication";
import AppRoutes from "./features/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/app/*" element={<AppRoutes />} />
          <Route path="/*" element={<Authentication />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
