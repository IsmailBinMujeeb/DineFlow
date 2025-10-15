import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Protected from "@/components/protected";
import CreateOrder from "./pages/CreateOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/order/create" element={<Protected><CreateOrder /></Protected>} />
        <Route path="*" element={<Navigate to={'/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;