import { Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import { AuthProvider } from "./utils/useAuth";
import { LoginPage } from "./pages/login";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import HomePage from "./pages/home";
import Reserva from "./pages/reservas";
import { Rent } from "./pages/rent/rent";
import { Layout } from "./pages/components/Layout";
import  AdminPage  from "./pages/admin";
import Reports from "./pages/reports";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/reservation"
            element={
              <ProtectedRoute>
                {" "}
                <Rent />{" "}
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


          <Route
            path="/admin"
            element={
              <ProtectedRoute adminRoute={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute adminRoute={true}>
                <Reports/> {" "}
              </ProtectedRoute>
            }
          />
        
        </Route>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
