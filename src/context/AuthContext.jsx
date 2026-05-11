/* eslint react-refresh/only-export-components: "off" */
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getMe } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        const res = await getMe();
        setUser(res.data.data);
      } catch { localStorage.removeItem("token"); }
      finally { setLoading(false); }
    };
    loadUser();
  }, []);

  const login = async (formData) => {
    const res = await loginUser(formData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res;
  };

  const register = async (formData) => {
    const res = await registerUser(formData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await getMe();
    setUser(res.data.data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);