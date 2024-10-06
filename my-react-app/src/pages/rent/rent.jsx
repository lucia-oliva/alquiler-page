import { useAuth } from "../../utils/useAuth";
import { RentForm } from "./components/RentForm";
import { useState } from "react";
import "./rent.css";
export const Rent = () => {
  const { logout } = useAuth();
  const [cancha, setCancha] = useState(0);

  return (
    <div className="Rent-page">
      <div className="body">
        <button onClick={logout}>Logout</button>
      </div>
      <div className="Form-container">
        <RentForm cancha={cancha} setCancha={setCancha} />
      </div>
    </div>
  );
};
