import React, { useState, useContext } from "react";
import { format, addDays } from "date-fns";
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
  Chip,
  PopoverContent,
  Textarea,
} from "@nextui-org/react";
import API_URL from "../../config.js";
import toast, { Toaster } from "react-hot-toast";
import { contexto } from "../../context/ContextProvider.jsx";

const ListaCurso = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cursoSeleccionado, setCursoseleccionado] = useState(null);

  const [popOver, setPopOver] = useState(false);

  const { cursos, setCursos } = useContext(contexto);

  const handleEliminar = async (id) => {
    try {
      const datosParaBorrar = {
        nombre: cursoSeleccionado?.nombre,
        descripcion: cursoSeleccionado?.descripcion,
        taller: cursoSeleccionado?.taller,
        docente: cursoSeleccionado?.docente,
      };

      const responseDel = await fetch(`${API_URL}/user/deleteCursoEspecifico`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosParaBorrar),
        credentials: "include",
      });

      if (!responseDel.ok) {
        throw new Error("Error al eliminar de los docentes el curso", {});
      }

      const response = await fetch(`${API_URL}/curso/delete/${cursoSeleccionado?._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el curso", {});
      }
      await response.json();
      toast.success("Curso eliminado correctamente");
      setCursos(!cursos);
      onOpenChange();
    } catch (error) {
      toast.error("Error al eliminar el curso" + error);
    }
  };

  return (
    <div className="w-full mx-auto">
      <Toaster />
      <Table isStriped>
        <TableHeader>
          <TableColumn className="font-bold text-lg" width={3}>
            Código
          </TableColumn>
          <TableColumn className="font-bold text-lg">Nombre Curso</TableColumn>
          <TableColumn className="font-bold text-lg" width={100}>
            Duración
          </TableColumn>
          <TableColumn className="font-bold text-lg" width={120}>
            Horario
          </TableColumn>
          <TableColumn className="font-bold text-lg text-center" width="200">
            Días
          </TableColumn>
          <TableColumn className="font-bold text-lg" width={150}>
            Laboratorio
          </TableColumn>
          <TableColumn className="font-bold text-lg" width={150}>
            Docente
          </TableColumn>
          <TableColumn className="font-bold text-lg text-center" align="center" width={3}>
            Ver
          </TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>
                <div className=" w-24 justify-center rounded-md">
                  <p className="overflow-hidden text-ellipsis font-bold whitespace-nowrap">{row?.codigoCurso}</p>
                </div>
              </TableCell>
              <TableCell>{row?.nombre ?? ""}</TableCell>
              <TableCell>
                <div>
                  {format(addDays(new Date(row?.fechaInicio), 1), "dd-MM-yyyy") ?? ""} <br />
                  {format(addDays(new Date(row?.fechaFinal), 1), "dd-MM-yyyy") ?? ""}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  De: {row?.horario[0] ?? ""} <br />
                  A: &nbsp;&nbsp;{row?.horario[row?.horario.length - 1] ?? ""}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {row?.dias.map((dia, idx) => (
                    <Chip
                      key={idx}
                      classNames={{
                        base: `${
                          dia === "Lunes"
                            ? "bg-[#FFD700]"
                            : dia === "Martes"
                            ? "bg-[#87CEEB]"
                            : dia === "Miércoles"
                            ? "bg-[#98FB98]"
                            : dia === "Jueves"
                            ? "bg-[#FFA07A]"
                            : dia === "Viernes"
                            ? "bg-[#AFB6F1]"
                            : dia === "Sábado"
                            ? "bg-[#D8BFD8]"
                            : dia === "Domingo"
                            ? "bg-[#BFE4B5]"
                            : "bg-neutral-300"
                        }`,
                        content: "w-[75px] text-center",
                      }}
                    >
                      {dia}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>{row?.taller ?? ""}</TableCell>
              <TableCell>{row?.docente ?? ""}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    onOpen();
                    setCursoseleccionado(row);
                  }}
                  color="success"
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
              <ModalHeader className="flex flex-col gap-1">{cursoSeleccionado?.nombre ?? ""}</ModalHeader>
              <ModalBody>
                <h1 className="font-bold text-center text-xl text-gray-500">
                  {"Información sobre " + cursoSeleccionado?.nombre}
                </h1>
                <div className="flex flex-col gap-2 mt-4 w-full mx-auto">
                  <Input
                    label="Nombre"
                    type="text"
                    isDisabled
                    placeholder="Nombre"
                    defaultValue={cursoSeleccionado?.nombre ?? ""}
                  />
                  <Input
                    label="Código"
                    type="text"
                    isDisabled
                    placeholder="Código"
                    defaultValue={cursoSeleccionado?.codigoCurso ?? ""}
                  />
                  <Textarea
                    label="Descripción"
                    isDisabled
                    type="text"
                    placeholder="Descripción"
                    defaultValue={cursoSeleccionado?.descripcion ?? ""}
                  />
                  <Input
                    label="Fecha Inicio"
                    isDisabled
                    type="text"
                    placeholder="Fecha Inicio"
                    defaultValue={format(addDays(new Date(cursoSeleccionado?.fechaInicio), 1), "dd-MM-yyyy") ?? ""}
                  />
                  <Input
                    label="Fecha Final"
                    isDisabled
                    type="text"
                    placeholder="Fecha Final"
                    defaultValue={format(addDays(new Date(cursoSeleccionado?.fechaFinal), 1), "dd-MM-yyyy") ?? ""}
                  />
                  <Input
                    label="Hora Inicio"
                    isDisabled
                    type="text"
                    placeholder="Hora Inicio"
                    defaultValue={cursoSeleccionado?.horario[0] ?? ""}
                  />
                  <Input
                    label="Hora Final"
                    isDisabled
                    type="text"
                    placeholder="Hora Final"
                    defaultValue={cursoSeleccionado?.horario[cursoSeleccionado?.horario.length - 1] ?? ""}
                  />
                  <Input
                    label="Taller/laboratorio"
                    isDisabled
                    type="text"
                    placeholder="Taller/Laboratorio"
                    defaultValue={cursoSeleccionado?.taller ?? ""}
                  />
                  <Input
                    label="Docente a cargo"
                    isDisabled
                    type="text"
                    placeholder="Docente a cargo"
                    defaultValue={cursoSeleccionado?.docente ?? ""}
                  />
                  <Input
                    label="Días de la semana"
                    isDisabled
                    type="text"
                    placeholder="Días de la semana"
                    defaultValue={cursoSeleccionado?.dias ? cursoSeleccionado?.dias.join(", ") : ""}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="pt-2">
                <Popover placement="top" color="danger" isOpen={popOver}>
                  <PopoverTrigger>
                    <Button fullWidth color="danger" onClick={() => setPopOver(true)}>
                      Eliminar curso
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-2xl text-center font-black">¡ATENCIÓN!</div>
                      <div className="text-small font-semibold">
                        Si existen docentes que estén asignados a este curso, el curso será eliminado de su lista de
                        cursos.
                      </div>
                      <div className="text-small font-semibold">
                        Esto se hace con el propósito de evitar colisiones de horarios futuras
                      </div>
                      <div className="text-small font-black text-center">¿Está seguro que desea continuar?</div>
                      <div className="text-small font-black text-center">
                        ¡¡Esta acción no se puede deshacer y no se podrá recuperar!!
                      </div>
                      <div className="mx-auto m-2 text-center">
                        <Button
                          color="warning"
                          className="mr-2"
                          onClick={() => {
                            handleEliminar();
                            setPopOver(false);
                          }}
                        >
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
                  fullWidth
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

export default ListaCurso; // Cambiamos el nombre del componente
