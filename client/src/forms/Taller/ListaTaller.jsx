import React, { useState, useContext } from "react";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
} from "@nextui-org/react";
import API_URL from "../../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../../context/ContextProvider.jsx";

const ListaTaller = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState(null);

  const [popOver, setPopOver] = useState(false);

  const { setTaller, taller } = useContext(contexto);

  ///////////////// USESTATE DE TODOS LOS CAMPOS //////////////////////////
  const [nombre, setNombre] = useState("");
  const [salon, setSalon] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const ActualizarDatos = (datos) => {
    setNombre(datos?.nombre ?? "");
    setSalon(datos?.salon ?? "");
    setCapacidad(datos?.capacidad ?? "");
    setObservaciones(datos?.observaciones ?? "");
  };

  const ActualizarDatosServer = async () => {
    const data = {
      nombre: nombre,
      salon: salon,
      capacidad: capacidad,
      observaciones: observaciones,
    };
    try {
      const response = await fetch(`${API_URL}/taller/update/${tallerSeleccionado?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el taller", {});
      }
      await response.json();
      toast.success("Taller actualizado correctamente");
      setTaller(!taller);
      onOpenChange();
    } catch (error) {
      toast.error("Error al actualizar el taller" + error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`${API_URL}/taller/delete/${tallerSeleccionado?._id ?? id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: false }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el taller", {});
      }
      await response.json();
      toast.success("Taller eliminado correctamente");
      setTaller(!taller);
      onOpenChange();
    } catch (error) {
      toast.error("Error al eliminar el taller" + error);
    }
  };

  return (
    <div className="w-full mx-auto">
      <Toaster />
      <Table isStriped>
        <TableHeader>
          <TableColumn className="font-bold text-lg">Ícono</TableColumn>
          <TableColumn className="font-bold text-lg">ID</TableColumn>
          <TableColumn className="font-bold text-lg">Nombre Taller</TableColumn>
          <TableColumn className="font-bold text-lg">Salón</TableColumn>
          <TableColumn className="font-bold text-lg">Ver</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>
                <Avatar
                  showFallback
                  color="secondary"
                  fallback={(row?.nombre.replace(/^\s+|\s+$/g, "").trim() ?? "")
                    .split(" ")
                    .map((palabra) => palabra[0].toUpperCase())
                    .join("")}
                />
              </TableCell>
              <TableCell>{row._id.slice(-6)}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.salon}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setTallerSeleccionado(row);
                    ActualizarDatos(row);
                    onOpen();
                  }}
                  color="secondary"
                >
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{tallerSeleccionado?.nombre ?? ""}</ModalHeader>
              <ModalBody>
                <h1 className="font-bold text-center text-xl text-gray-500">
                  {"Información sobre " + tallerSeleccionado?.nombre ?? ""}
                </h1>
                <div className="flex flex-col gap-2 mt-4 w-full mx-auto">
                  <Input
                    label="Nombre"
                    type="text"
                    placeholder="Nombre"
                    defaultValue={tallerSeleccionado?.nombre ?? ""}
                    value={nombre}
                    onValueChange={setNombre}
                  />
                  <Input
                    label="Salón"
                    type="text"
                    placeholder="Salón"
                    defaultValue={tallerSeleccionado?.salon ?? ""}
                    value={salon}
                    onValueChange={setSalon}
                  />
                  <Input
                    label="Capacidad"
                    type="number"
                    placeholder="Capacidad"
                    defaultValue={tallerSeleccionado?.capacidad ?? ""}
                    value={capacidad}
                    onValueChange={setCapacidad}
                  />
                  <Textarea
                    label="Observaciones"
                    type="text"
                    placeholder="Observarciones"
                    defaultValue={tallerSeleccionado?.observaciones ?? ""}
                    value={observaciones}
                    onValueChange={setObservaciones}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={ActualizarDatosServer}>
                  Actualizar datos
                </Button>
                <Popover placement="top" color="danger" isOpen={popOver}>
                  <PopoverTrigger>
                    <Button color="danger" onClick={() => setPopOver(true)}>
                      Eliminar taller
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">¿Está seguro de querer eliminar al taller?</div>
                      <div className="text-tiny">¡Esta acción no se puede deshacer!, ¿Desea continuar?</div>
                      <div className="mx-auto m-2 text-center">
                        <Button color="warning" className="mr-2" onClick={handleEliminar}>
                          Sí, deseo eliminarlo
                        </Button>
                        <Button color="primary" onClick={() => setPopOver(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                  }}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListaTaller;
