// src/pages/Secret.jsx
import { useAuth } from "../utils/useAuth";
import { Hours } from "../components/Hours";
import { useState } from "react";
export const Secret = () => {
  const { logout } = useAuth();
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [cancha, setCancha] = useState(0);

  //determinar fecha
  const handleChangeCncha = (event) => {
    setCancha(Number(event.target.value));
  };
  const handleChangeFecha = (event) => {
    setFecha(event.target.value);
  };

  return (
    <div>
      <select value={cancha} onChange={handleChangeCncha} style={{}}>
        <option value="0" hidden>
          Selecciona una cancha
        </option>
        <option value="1">Cancha de Padel</option>
        <option value="2">Cancha de Volley</option>
      </select>

      <input
        type="date"
        value={fecha}
        onChange={handleChangeFecha}
        style={{ marginBottom: "20px", paddingBottom: "10px" }}
      />
      {cancha && fecha ? (
        <Hours cancha={cancha} fecha={fecha} />
      ) : (
        <p>Por favor, seleccione la cancha y la fecha</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
