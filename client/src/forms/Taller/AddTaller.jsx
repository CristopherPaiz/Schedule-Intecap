import React, { useState, useContext } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../../config.js";
import { contexto } from "../../context/ContextProvider.jsx";

const AddTaller = () => {
  //useState para todas las variables de ingreso
  const [nombre, setNombre] = useState("");
  const [salon, setSalon] = useState("");
  const [capacidad, setCapacidad] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const { setTaller, taller } = useContext(contexto);

  const handleSubmit = async () => {
    if (nombre === "") {
      toast.error("El nombre del taller es obligatorio");
      return;
    }
    const datos = {
      nombre,
      salon,
      capacidad,
      observaciones,
    };

    try {
      const response = await fetch(`${API_URL}/taller/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al añadir el taller", {});
      }
      await response.json();
      toast.success("Taller añadido correctamente");
      setTaller(!taller);
      //resetear los valores de los inputs
      setNombre("");
      setSalon("");
      setCapacidad(0);
      setObservaciones("");
    } catch (error) {
      toast.error("Error al añadir el taller" + error);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Toaster />
      <div className="grid gap-6 mb-6 md:grid-cols-2 w-11/12 m-auto sm:w-3/5 ">
        <Input
          type="text"
          label="Nombre del taller o laboratorio"
          isRequired
          placeholder="Ingrese el nombre del taller"
          value={nombre}
          onValueChange={setNombre}
        />
        <Input
          type="text"
          label="Ingrese la ubicación del salón"
          placeholder="Ingrese el salón"
          value={salon}
          onValueChange={setSalon}
        />
        <Input
          type="number"
          label="Capacidad"
          placeholder="Ingrese la capacidad de estudiantes"
          value={capacidad}
          onValueChange={setCapacidad}
        />
        <Textarea
          type="text"
          label="Observaciones"
          placeholder="Observaciones"
          value={observaciones}
          onValueChange={setObservaciones}
        />
      </div>
      <Button onClick={handleSubmit} color="secondary" className="w-11/12 m-auto sm:w-3/5 text-white">
        Guardar
      </Button>
    </div>
  );
};

export default AddTaller;
