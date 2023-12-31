import React, { createContext, useState, useEffect } from "react";
import API_URL from "../config.js";

export const contexto = createContext();

const ContextProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // setear el tipo de usuario activo
  const [loggedIn, setLoggedIn] = useState(false); // indicar si el usuario ha iniciado sesión
  const [docentes, setDocentes] = useState(false);
  const [taller, setTaller] = useState(false);
  const [cursos, setCursos] = useState(false);

  const verificarExpiracionToken = () => {
    const expirationDate = localStorage.getItem("miTokenExpiration");
    if (expirationDate) {
      const now = new Date();
      const expired = now >= new Date(expirationDate);
      if (expired) {
        // El token ha expirado, borrarlo del LocalStorage
        localStorage.removeItem("usuarioINTECAP");
        localStorage.removeItem("loggedINTECAP");
        localStorage.removeItem("demasdatosINTECAP");
        localStorage.removeItem("miTokenExpiration");
      }
    }
  };

  useEffect(() => {
    verificarExpiracionToken();
    const usuarioINTECAP = localStorage.getItem("usuarioINTECAP");
    const loggedINTECAP = localStorage.getItem("loggedINTECAP");
    const demasDatosINTECAP = localStorage.getItem("demasdatosINTECAP");
    if (usuarioINTECAP && loggedINTECAP) {
      setLoggedIn(true);
      setUsuario(JSON.parse(demasDatosINTECAP));
    } else {
      null;
    }
  }, []);

  const fetchUser = async (username, contrasenia) => {
    try {
      const response = await fetch(`${API_URL}/user/getbyusername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, contrasenia }),
        credentials: "include", // Asegúrate de incluir esta opción
      });

      if (!response.ok) {
        // Si la respuesta no es exitosa, obtenemos el mensaje de error del servidor
        setUsuario({ rol: "Public" });
        setLoggedIn(false);
        const errorData = await response.json();
        return errorData.message;
      } else {
        const user = await response.json();

        if (!user) {
          //añadir al localstorage un usuario publico como default
          localStorage.setItem("usuarioINTECAP", JSON.stringify({ rol: "Public" }));
          //seteamos los useState
          setUsuario({ rol: "Public" });
          setLoggedIn(false);
          return "Public";
        } else {
          localStorage.setItem("usuarioINTECAP", JSON.stringify({ rol: user.rol }));
          localStorage.setItem("demasdatosINTECAP", JSON.stringify(user));
          localStorage.setItem("loggedINTECAP", true);
          // Obtener la fecha y hora de expiración (30 minutos a partir del momento actual)
          const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5); // 5 días
          localStorage.setItem("miTokenExpiration", expirationDate.toISOString());
          setLoggedIn(true);
          setUsuario(user);
          return user.rol;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const USER_TYPES = {
    ADMIN_USER: "admin",
    MODERATOR_USER: "docente",
    PUBLIC: "Public",
  };

  return (
    <contexto.Provider
      value={{
        ...USER_TYPES,
        usuario,
        fetchUser,
        loggedIn,
        setLoggedIn,
        setUsuario,
        docentes,
        setDocentes,
        taller,
        setTaller,
        cursos,
        setCursos,
      }}
    >
      {children}
    </contexto.Provider>
  );
};

export default ContextProvider;
