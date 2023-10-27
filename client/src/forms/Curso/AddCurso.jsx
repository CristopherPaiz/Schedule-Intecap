import React, { useEffect, useState, useContext } from "react";
import {
  Input,
  Button,
  CheckboxGroup,
  Checkbox,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Textarea,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { contexto } from "../../context/ContextProvider";
import API_URL from "../../config";
import { format, addDays } from "date-fns";

const AddCurso = () => {
  //UseState de todos los campos del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigoCurso, setCodigoCurso] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFinal, setHorarioFinal] = useState("");
  const [dias, setDias] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //Contexto para recargar la lista de cursos
  const { setCursos, cursos } = useContext(contexto);

  //para los select de talleres
  const [valueTaller, setValueTaller] = useState(new Set([]));
  const [talleres, setTalleres] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");

  //para los select de docentes
  const [valueDocente, setValueDocente] = useState(new Set([]));
  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState("");

  //validadores
  const [validado, setValidado] = useState(false);
  const [tallerValidado, setTallerValidado] = useState(true);
  const [docenteValidado, setDocenteValidado] = useState(true);

  //validador final
  const [validadoDocente, setValidadoDocente] = useState(true);
  const [validadoTaller, setValidadoTaller] = useState(true);
  const [loading, setLoading] = useState(false);
  const [texto, setTexto] = useState("Verificar disponibilidad de horario");
  const [mensajeError, setMensajeError] = useState("");

  //fetch para cargar los talleres
  const buscarTalleres = async () => {
    try {
      const response = await fetch(`${API_URL}/taller/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Error al obtener la lista de talleres");
        throw new Error("Error al filtrar los talleres", {});
      }

      const data = await response.json();
      setTalleres(data);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch para cargar los docentes
  const buscarDocentes = async () => {
    try {
      const response = await fetch(`${API_URL}/user/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Error al obtener la lista de Docentes");
        throw new Error("Error al filtrar los docentes", {});
      }

      const data = await response.json();
      setDocentes(data);
    } catch (error) {
      console.log(error);
    }
  };

  //UseEffect que dispara las funcinoes de fetch para los talleres y docentes existentes
  useEffect(() => {
    buscarTalleres();
    buscarDocentes();
  }, []);

  //Función final que manda a la base de datos los datos recolectados y validadados con anterioridad
  const handleSubmit = async (e) => {
    if (docenteValidado) {
      toast.error("Docente está deshabilitado hasta que ingrese los campos anteriores");
      return;
    }

    if (tallerValidado) {
      toast.error("Taller está deshabilitado hasta que ingrese los campos anteriores");
      return;
    }

    if (
      nombre === "" ||
      fechaInicio === "" ||
      fechaFinal === "" ||
      horarioInicio === "" ||
      horarioFinal === "" ||
      dias.length === 0
    ) {
      toast.error("Debe llenar todos los campos");
      return;
    }

    function calcularHorasIntermedias(horaInicial, horaFinal) {
      const horasIntermedias = [];

      // Expresión regular para validar el formato HH:MM
      const regexHora = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

      if (regexHora.test(horaInicial) && regexHora.test(horaFinal)) {
        // Crear objetos Date a partir de las cadenas de hora
        const horaActual = new Date(`2023-01-01T${horaInicial}`);
        const horaFin = new Date(`2023-01-01T${horaFinal}`);

        while (horaActual <= horaFin) {
          horasIntermedias.push(horaActual.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
          horaActual.setMinutes(horaActual.getMinutes() + 15);
        }
      } else {
        console.log("Formato de hora no válido");
      }

      return horasIntermedias;
    }
    const horas = calcularHorasIntermedias(horarioInicio, horarioFinal);

    const datos = {
      nombre,
      codigoCurso: codigoCurso,
      descripcion,
      fechaInicio,
      fechaFinal,
      horario: horas,
      taller: tallerSeleccionado.nombre,
      docente: docenteSeleccionado.nombre + " " + docenteSeleccionado.apellido,
      dias,
    };

    try {
      const response = await fetch(`${API_URL}/curso/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al añadir el curso", {});
      }
      const cursosFinal = docenteSeleccionado.cursos;
      cursosFinal.push(datos);

      const response2 = await fetch(`${API_URL}/user/update/${docenteSeleccionado._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cursos: cursosFinal }),
        credentials: "include",
      });

      if (!response2.ok) {
        throw new Error("Error al añadir el curso al docente", {});
      }

      await response.json();
      toast.success("Curso añadido correctamente");
      setTexto("Verificar disponibilidad de horario");
      setCursos(!cursos);
      //resetear los valores de los inputs
      setNombre("");
      setDescripcion("");
      setFechaInicio("");
      setFechaFinal("");
      setHorarioInicio("");
      setHorarioFinal("");
      setDias([]);
      setValueTaller(new Set([]));
      setValueDocente(new Set([]));
      setTallerSeleccionado("");
      setDocenteSeleccionado("");
      setCodigoCurso("");
    } catch (error) {
      toast.error("Error al añadir el curso" + error);
    }
  };

  //UseEffect para validar que todos los campos estén llenos y así habilitar el Select de docentes
  useEffect(() => {
    setValidadoDocente(true);
    setValidadoTaller(true);
    setTexto("Verificar disponibilidad de horario");

    if (horarioFinal && horarioInicio && fechaFinal && fechaInicio && dias.length > 0) {
      setDocenteValidado(false);
    } else {
      setDocenteValidado(true);
    }
  }, [fechaFinal, fechaInicio, horarioFinal, horarioInicio, dias, docenteSeleccionado, tallerSeleccionado]);

  //UseEffect que se habilita hasta que se haya seleccionado por lo menos algún docente
  useEffect(() => {
    if (docenteSeleccionado !== "") {
      setTallerValidado(false);
    } else {
      setTallerValidado(true);
    }
  }, [docenteSeleccionado]);

  const verificarDisponibilidad = async () => {
    if (
      fechaInicio === "" ||
      fechaFinal === "" ||
      horarioInicio === "" ||
      horarioFinal === "" ||
      dias.length === 0 ||
      docenteSeleccionado === "" ||
      tallerSeleccionado === ""
    ) {
      toast.error("Debe llenar todos los campos");
      return;
    }

    setLoading(true);
    setTexto("Verificando disponibilidad...");

    function convertirFormato12Horas(horario24H) {
      const [horas, minutos] = horario24H.split(":");
      let amPm = "AM";
      let horas12 = parseInt(horas);

      if (horas12 >= 12) {
        amPm = "PM";
        if (horas12 > 12) {
          horas12 -= 12;
        }
      }

      // Agregar un cero a la izquierda si es necesario
      const horasConCero = horas12 < 10 ? `0${horas12}` : `${horas12}`;
      const minutosConCero = parseInt(minutos) < 10 ? `0${minutos}` : `${minutos}`;

      return `${horasConCero}:${minutosConCero} ${amPm}`;
    }

    const datos = {
      fechaInicio,
      fechaFinal,
      horarioInicio: convertirFormato12Horas(horarioInicio),
      horarioFinal: convertirFormato12Horas(horarioFinal),
      IDdocente: docenteSeleccionado._id,
      nombreTaller: tallerSeleccionado.nombre,
      dias,
    };

    try {
      // DISPONIBILIDAD DOCENTE
      const response = await fetch(`${API_URL}/user/comprobarDisponibilidad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
        credentials: "include",
      });
      //recibir los mensajes de error del servidor
      const data = await response.json();
      if (!data.disponible) {
        setMensajeError(data);
        onOpen();
        setLoading(false);
        setTexto("Verificar disponibilidad de horario");
        setValidadoDocente(false);
        throw new Error(data.message);
      }

      if (datos.nombreTaller === "No Aplica (Virtual, Externo, Otros)") {
        setValidadoDocente(false);
        setValidadoTaller(false);
        setLoading(false);
        setTexto("¡Disponible");
      } else {
        // DISPONIBILIDAD TALLER
        const responseTaller = await fetch(`${API_URL}/user/comprobarDisponibilidadPorTaller`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
          credentials: "include",
        });

        const dataTaller = await responseTaller.json();
        //recibir los mensajes de error del servidor
        if (!dataTaller.disponible) {
          setMensajeError(dataTaller);
          onOpen();
          setLoading(false);
          setTexto("Verificar disponibilidad de horario");
          setValidadoDocente(false);
          throw new Error(dataTaller.message);
        }
        setValidadoDocente(false);
        setValidadoTaller(false);
        setLoading(false);
        setTexto("¡Disponible");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Toaster />
      <div className="grid gap-6 mb-6 md:grid-cols-2 w-11/12 m-auto sm:w-3/5 ">
        <Input
          type="text"
          label="Nombre del curso"
          isRequired
          placeholder="Ingrese el nombre curso"
          value={nombre}
          onValueChange={setNombre}
        />
        <Input
          label="Código del curso"
          isRequired
          placeholder="Ingrese el código del curso"
          value={codigoCurso}
          onValueChange={setCodigoCurso}
        />
        <Textarea
          label="Descripción"
          placeholder="Ingrese una descripción"
          value={descripcion}
          onValueChange={setDescripcion}
        />
        <div className="hidden sm:flex"></div>
        <Input
          type="date"
          placeholder="Fecha Inicio"
          label="Fecha de inicio"
          isRequired
          value={fechaInicio}
          onValueChange={setFechaInicio}
        />
        <Input
          type="date"
          placeholder="Fecha finalización"
          label="Fecha de finalización"
          isRequired
          value={fechaFinal}
          onValueChange={setFechaFinal}
        />
      </div>
      <div className="flex flex-col w-11/12 sm:w-3/5 m-auto">
        <div className="w-full flex row gap-4 mb-4">
          <Input
            type="time"
            label="Horario empieza"
            placeholder="Horario empieza"
            isRequired
            value={horarioInicio}
            onValueChange={setHorarioInicio}
          />
          <Input
            type="time"
            label="Horario finaliza"
            placeholder="Horario finaliza"
            isRequired
            value={horarioFinal}
            onValueChange={setHorarioFinal}
          />
        </div>
        <CheckboxGroup label="Días" value={dias} onChange={setDias} className="text-xl font-bold">
          <div className="flex gap-2 flex-wrap mb-4 p-3 text-lg font-normal">
            <Checkbox value="Lunes">Lunes</Checkbox>
            <Checkbox value="Martes">Martes</Checkbox>
            <Checkbox value="Miércoles">Miércoles</Checkbox>
            <Checkbox value="Jueves">Jueves</Checkbox>
            <Checkbox value="Viernes">Viernes</Checkbox>
            <Checkbox value="Sábado">Sábado</Checkbox>
            <Checkbox value="Domingo">Domingo</Checkbox>
          </div>
        </CheckboxGroup>
        <div className="flex flex-row gap-4 mb-8 flex-wrap">
          <Select
            label="Docente"
            variant="bordered"
            placeholder="Seleccione un docente"
            selectedKeys={valueDocente}
            isDisabled={docenteValidado}
            className="max-w-xs mx-auto"
            onSelectionChange={setValueDocente}
          >
            {docentes.length > 0 ? (
              docentes.map((docente) => (
                <SelectItem key={docente?._id} value={docente?.nombre} onPress={() => setDocenteSeleccionado(docente)}>
                  {docente?.nombre + " " + docente?.apellido}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="cargando" text="Cargando docentes..." disabled />
            )}
          </Select>
          <Select
            label="Taller"
            variant="bordered"
            placeholder="Seleccione un taller o laboratorio"
            selectedKeys={valueTaller}
            className="max-w-xs mx-auto"
            isDisabled={tallerValidado}
            onSelectionChange={setValueTaller}
          >
            {talleres.length > 0 ? (
              talleres.map((taller) => (
                <SelectItem key={taller?._id} value={taller?.nombre} onPress={() => setTallerSeleccionado(taller)}>
                  {taller?.nombre ?? ""}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="cargando" text="Cargando talleres..." disabled />
            )}
          </Select>
        </div>
      </div>
      <Button
        color={!validadoDocente && !validadoTaller ? "primary" : "warning"}
        isDisabled={!validadoDocente && !validadoTaller ? true : false}
        isLoading={loading}
        onClick={verificarDisponibilidad}
        className="w-11/12 m-auto sm:w-3/12 text-white"
      >
        {texto}
      </Button>
      <Button
        color={!validadoDocente && !validadoTaller ? "success" : "danger"}
        isDisabled={!validadoDocente && !validadoTaller ? false : true}
        onClick={handleSubmit}
        className="w-11/12 m-auto sm:w-3/5 text-white my-4"
      >
        Guardar nuevo curso
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Colisión de horario</ModalHeader>
              <ModalBody>
                {mensajeError?.mensaje ? (
                  <div>
                    <h1 className="text-center font-black text-xl text-red-500">{mensajeError.mensaje}</h1>
                  </div>
                ) : null}
                <Table isStriped color="danger">
                  <TableHeader>
                    <TableColumn className="font-bold text-lg">Dato</TableColumn>
                    <TableColumn className="font-bold text-lg">Información</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="curso">
                      <TableCell>Nombre del curso</TableCell>
                      <TableCell>{mensajeError?.curso ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="fechaInicio">
                      <TableCell>Fecha de Inicio</TableCell>
                      <TableCell>
                        {format(addDays(new Date(mensajeError?.fechaInicio), 1), "dd-MM-yyyy") ?? ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="fechaFinal">
                      <TableCell>Fecha final</TableCell>
                      <TableCell>
                        {format(addDays(new Date(mensajeError?.fechaFinal), 1), "dd-MM-yyyy") ?? ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="horarioInicio">
                      <TableCell>Horario de inicio</TableCell>
                      <TableCell>{mensajeError?.horarioInicio ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="horarioFinal">
                      <TableCell>Horario final</TableCell>
                      <TableCell>{mensajeError?.horarioFinal ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="dias">
                      <TableCell>Días</TableCell>
                      <TableCell>{mensajeError?.dias ? mensajeError?.dias.join(", ") : ""}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
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

export default AddCurso;
