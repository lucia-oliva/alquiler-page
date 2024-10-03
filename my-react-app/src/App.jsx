import { Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import { AuthProvider } from "./utils/useAuth";
import { LoginPage } from "./pages/login";
import { Secret } from "./pages/secret";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import HomePage from "./pages/home";
import Reserva from "./pages/reservas";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              {" "}
              <Secret />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserva"
          element={
            <ProtectedRoute>
              {" "}
              <Reserva />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </AuthProvider>
  );
}

export default App;
