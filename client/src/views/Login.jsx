import React, { useContext, useState, useEffect } from "react";
import comunidad from "/intecap.svg";
import { Button, Checkbox } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { contexto } from "../context/ContextProvider";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUser, loggedIn, setUsuario, setLoggedIn, usuario } = useContext(contexto);
  const navigate = useNavigate();

  const handleInputChangeUser = (event) => {
    setNombreUsuario(event.target.value);
  };

  const handleInputChangePassword = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const usuarioLS = localStorage.getItem("usuarioINTECAP");
    const loggedLS = localStorage.getItem("loggedINTECAP");
    const demasDatosLS = localStorage.getItem("demasdatosINTECAP");
    if (usuarioLS && loggedLS) {
      setLoggedIn(true);
      setUsuario(JSON.parse(demasDatosLS));
    }
  }, []);

  const obtenerTipoUsuario = async () => {
    const respuesta = await fetchUser(nombreUsuario, password);
    if (respuesta === "admin") {
      navigate("/home");
    } else if (respuesta === "docente") {
      navigate("/home");
    } else {
      toast.error(respuesta);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      if (usuario.rol === "admin") {
        navigate("/home");
      } else if (usuario.rol === "docente") {
        navigate("/home");
      } else {
        navigate("/");
      }
    }
  }, [loggedIn, usuario]);

  return (
    <>
      <Toaster />
      <section className="bg-gray-50 dark:bg-black px-6 min-h-screen flex items-center justify-center h-screen -mt-[50px] sm:-mt-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-neutral-900 dark:border-gray-700">
          <a className="flex items-center mb-6 text-2xl font-semibold dark:text-white">
            <img
              className="w-8/12 h-2/5 m-auto mt-[20px] -mb-[20px] sm:-mb-[60px] sm:w-[240px]"
              src={comunidad}
              alt="logo"
            />
          </a>
          <div className="p-6 space-y-4">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Iniciar Sesión
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="PedroPerez"
                  required=""
                  autoComplete="nope"
                  value={nombreUsuario}
                  onChange={handleInputChangeUser}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={handleInputChangePassword}
                  value={password}
                />
              </div>
              <Button
                onClick={obtenerTipoUsuario}
                type="submit"
                className="w-full text-white bg-[#0075bf] hover:bg-[#0075bf]/[0.7] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
