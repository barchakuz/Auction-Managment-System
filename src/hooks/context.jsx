import React, { createContext, useContext } from "react";
import useLocalStorage from "./useLocalStorage";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);

  return <Auth.Provider value={{ user, setUser }}>{children}</Auth.Provider>;
};

export const useAuth = () => useContext(Auth);
