import React, { useState, useEffect, useContext } from "react";
import { Input, Button, Textarea, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../../config.js";
import { contexto } from "../../context/ContextProvider.jsx";

const AddDocente = () => {
  //useState para todas las variables de ingreso
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [rol, setRol] = useState("docente");
  const { setDocentes, docentes } = useContext(contexto);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const roles = [
    {
      value: "admin",
      label: "Administrador",
    },
    {
      value: "docente",
      label: "Docente",
    },
  ];

  const [valueUsuario, setValueUsuario] = useState(roles);
  const [usuarios, setUsuarios] = useState(null);

  function generarPassword() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!";
    let password = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      password += caracteres.charAt(randomIndex);
    }

    return password;
  }

  const [password, setPassword] = useState(generarPassword());
  //useEffect para generar el username
  useEffect(() => {
    const removeAccentsAndPunctuation = (str) => {
      // Reemplaza tildes y caracteres especiales con sus equivalentes en el alfabeto inglés
      const withoutAccents = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "");

      return withoutAccents;
    };

    const usernameValue = (nombre + " " + apellido)
      .split(" ")
      .map((palabra) => {
        const letras = palabra.slice(0, 3); // Tomar las primeras tres letras
        const sinTildesYPuntuacion = removeAccentsAndPunctuation(letras);
        return sinTildesYPuntuacion.toLowerCase();
      })
      .join("");

    setUsername(usernameValue);
  }, [nombre, apellido]);

  const handleSubmit = async () => {
    if (nombre === "" || apellido === "") {
      toast.error("El nombre y el apellido son obligatorios");
      return;
    } else if (username === "" || password === "") {
      toast.error("El nombre de usuario y/o la contraseña son obligatorios");
      return;
    }
    const datos = {
      nombre,
      apellido,
      correo: email,
      username,
      contrasenia: password,
      rol: rol?.currentKey ?? rol,
    };

    try {
      const response = await fetch(`${API_URL}/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al añadir el usuario", {});
      }
      await response.json();
      toast.success("Usuario añadido correctamente");
      setDocentes(!docentes);
      //resetear los valores de los inputs
      setNombre("");
      setApellido("");
      setEmail("");
      setUsername("");
      setPassword(generarPassword());
    } catch (error) {
      toast.error("Error al eliminar el usuario" + error);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Toaster />
      <div className="grid gap-6 mb-6 md:grid-cols-2 w-11/12 m-auto sm:w-3/5 ">
        <Input
          type="text"
          label="Nombres"
          isRequired
          placeholder="Ingrese el nombre o los nombres"
          value={nombre}
          onValueChange={setNombre}
          autoComplete="nope"
        />
        <Input
          type="text"
          label="Apellidos"
          isRequired
          placeholder="Ingrese el apellido o los apellidos"
          value={apellido}
          onValueChange={setApellido}
          autoComplete="nope"
        />
        <Input
          type="email"
          label="Correo"
          placeholder="Ingrese un correo electrónico"
          value={email}
          onValueChange={setEmail}
          autoComplete="nope"
        />
        <Input
          type="text"
          label="Nombre de usuario"
          placeholder="Ingrese un nombre de Usuario"
          value={username}
          onValueChange={setUsername}
          autoComplete="nope"
        />
        <Input
          type="text"
          label="Contraseña"
          placeholder="Ingrese una contraseña"
          value={password}
          onValueChange={setPassword}
          autoComplete="nope"
        />
        <p className="font-bold text-[17px] sm:hidden -mb-2 ">Seleccione el rol:</p>
        <Select
          label="Roles de usuario"
          variant="bordered"
          placeholder={usuarioSeleccionado?.rol}
          selectedKeys={usuarios}
          className="w-full"
          onSelectionChange={setRol}
        >
          {valueUsuario.length > 0 ? (
            valueUsuario.map((usuario) => (
              <SelectItem key={usuario?.value} value={usuario?.value} s>
                {usuario?.label ?? ""}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="cargando" text="Cargando roles..." disabled />
          )}
        </Select>
      </div>
      <Button color="primary" onClick={handleSubmit} className="w-11/12 m-auto sm:w-3/5 text-white">
        Guardar
      </Button>
    </div>
  );
};

export default AddDocente;
