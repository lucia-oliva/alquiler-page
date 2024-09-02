// src/pages/Secret.jsx
import { useAuth } from "./useAuth";

export const Secret = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>This is a Secret Page</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
