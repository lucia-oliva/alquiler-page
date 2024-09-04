// src/pages/Secret.jsx
import { useAuth } from "../utils/useAuth";
import { Hours } from "../components/Hours";
export const Secret = () => {
  const { logout } = useAuth();

  return (
    <div>
      <Hours/>
      <button onClick={logout}>Logout</button>
    </div>

  );
};
