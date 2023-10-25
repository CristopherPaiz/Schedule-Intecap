import React, { useState, useEffect, useContext } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { useNavigate, Navigate } from "react-router-dom";
import { contexto } from "../context/ContextProvider";
import API_URL from "../config";

const AdminDocenteCursos = () => {
  const [cursosDocente, setcursosDocenteDocente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [changeDocente, setChangeDocente] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [inicial, setInicial] = useState(false);

  const { docentes, usuario } = useContext(contexto);

  const obtenercursosDocente = async () => {
    setChangeDocente(true);
    try {
      const response = await fetch(`${API_URL}/user/getbyid/${docenteSeleccionado.currentKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Error al obtener los cursosDocente");
        throw new Error("Error al filtrar los cursosDocente", {});
      }

      const data = await response.json();
      setcursosDocenteDocente(data);
      setChangeDocente(false);
    } catch (error) {}
  };

  const obtenerDocentesDos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/getallLabel`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Error al obtener los docentes");
        throw new Error("Error al filtrar los docentes", {});
      }

      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDocentesDos();
  }, [docentes]);

  useEffect(() => {
    if (docenteSeleccionado) {
      setInicial(true);
      obtenercursosDocente();
    }
  }, [docenteSeleccionado]);

  const courses = cursosDocente;

  courses.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  const months = [
    { name: "Enero", days: 31 },
    { name: "Febrero", days: 28 },
    { name: "Marzo", days: 31 },
    { name: "Abril", days: 30 },
    { name: "Mayo", days: 31 },
    { name: "Junio", days: 30 },
    { name: "Julio", days: 31 },
    { name: "Agosto", days: 31 },
    { name: "Septiembre", days: 30 },
    { name: "Octubre", days: 31 },
    { name: "Noviembre", days: 30 },
    { name: "Diciembre", days: 31 },
  ];

  const totalDaysInYear = months.reduce((acc, month) => acc + month.days, 0);

  const colores = ["#50c2fa", "#51c6fb"];

  const getRandomColor = () => {
    return colores[Math.floor(Math.random() * colores.length)];
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const diasColores = {
    Lunes: "bg-[#FFD700] text-black",
    Martes: "bg-[#87CEEB] text-black",
    Miércoles: "bg-[#98FB98] text-black",
    Jueves: "bg-[#FFA07A] text-black",
    Viernes: "bg-[#AFB6F1] text-black",
    Sábado: "bg-[#D8BFD8] text-black",
    Domingo: "bg-[#BFE4B5] text-black",
  };

  if (usuario) {
    if (usuario.rol == "admin") {
      return (
        <>
          <div className="sm:w-11/12 mx-auto my-5 justify-center">
            <h1 className="text-3xl font-black mx-auto text-center my-5 text-primary">Ver cursos por Docente</h1>
            <div className="justify-center mx-auto w-full text-center">
              <Select
                label="Usuarios"
                variant="bordered"
                placeholder="Seleccione un Docente"
                className="w-7/12"
                onSelectionChange={setDocenteSeleccionado}
              >
                {data.length > 0 ? (
                  data.map((usuario) => (
                    <SelectItem key={usuario?.value} value={usuario?.value} s>
                      {usuario?.label ?? ""}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="cargando" text="Cargando Cargando decentes..." disabled />
                )}
              </Select>
            </div>
          </div>
          {inicial === false ? null : changeDocente ? (
            <div className="h-full w-full flex flex-col justify-center align-middle">
              <h1 className="font-black text-primary text-center text-2xl">Cargando...</h1>
            </div>
          ) : (
            <>
              <div className="h-[1px] w-11/12 mx-auto bg-primary my-8"></div>
              <div className="mx-auto w-11/12 relative border-1 shadow-md p-4 rounded-2xl mb-8">
                <h1 className="text-3xl font-bold text-center mb-3 -mt-1 text-primary">
                  Proyección de cursos en el año en curso
                </h1>
                <div className="flex justify-between">
                  {months.map((month) => (
                    <div key={month.name} className="text-center w-1/12 border-1 border-blue-600 overflow-hidden px-1">
                      {month.name}
                    </div>
                  ))}
                </div>
                <div className="relative border-1 border-blue-600 rounded-b-lg overflow-hidden">
                  {courses.map((course) => {
                    const startDate = new Date(course.fechaInicio);
                    const endDate = new Date(course.fechaFinal);

                    const daysFromStart =
                      months.slice(0, startDate.getMonth()).reduce((acc, month) => acc + month.days, 0) +
                      startDate.getDate() -
                      1;

                    const courseWidth = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

                    const randomColor = getRandomColor();

                    const courseStyle = {
                      backgroundColor: randomColor,
                      border: "1px solid #000", // Agrega un borde de 1px a los elementos de curso
                      borderRadius: "4px",
                      width: `${(courseWidth / totalDaysInYear) * 100}%`,
                      height: "30px", // Aumenta la altura para el texto
                      marginBottom: "1px",
                      marginLeft: "0.35rem",
                      marginBottom: "3px",
                      marginTop: "3px",
                      position: "relative",
                      left: `${(daysFromStart / totalDaysInYear) * 100}%`,
                    };

                    const lineStyle = {
                      position: "absolute",
                      width: "2px", // Ancho de la línea
                      background: "black", // Color de la línea
                      height: "100%", // Ocupa todo el alto del contenedor
                      left: "0",
                      top: "0",
                    };

                    const textStyle = {
                      position: "absolute",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      margin: "3px",
                      marginLeft: "5px",
                      paddingTop: "2px",
                      fontSize: "13px",
                      maxWidth: `${(courseWidth / totalDaysInYear) * 1100 - 1}%`,
                    };

                    return (
                      <div key={course.nombre} style={courseStyle}>
                        <div style={lineStyle} />
                        <div style={textStyle} className="overflow-hidden hover:overflow-visible cursor-pointer">
                          {course.nombre}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mx-auto w-11/12 border-1 shadow-md p-4 rounded-2xl mb-8 flex flex-col">
                <h1 className="text-3xl font-bold text-center mb-3 -mt-1 text-primary">Lista de cursos</h1>
                <div className="flex flex-row flex-wrap gap-4 justify-center">
                  {/*Tarjeta*/}
                  {cursosDocente.map((curso, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate flex flex-col border-2 px-5 py-8 max-w-[260px] min-w-[260px] justify-between"
                    >
                      <div>
                        <h1 className="text-xl font-bold whitespace-pre-wrap text-center">{curso?.nombre ?? ""}</h1>
                      </div>
                      <div>
                        <h2 className="text-center text-neutral-500">{curso?.descripcion ?? ""}</h2>
                        <div className="h-0 w-full border-1 border-neutral-200 my-2"></div>
                        <div className="flex gap-y-1 flex-col mb-3">
                          <h3 className="text-sm flex gap-x-1">
                            <svg className="mt-1" viewBox="0 0 1024 1024" fill="currentColor" height="1em" width="1em">
                              <path d="M112 880c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V460H112v420zm768-696H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v176h800V216c0-17.7-14.3-32-32-32z" />
                            </svg>
                            {curso?.fechaInicio.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1") ?? ""} -{" "}
                            {curso?.fechaFinal.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1") ?? ""}
                          </h3>
                          <h3 className="text-sm flex gap-x-1">
                            <svg viewBox="0 0 1024 1024" fill="currentColor" height="1em" width="1em" className="mt-1">
                              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm176.5 585.7l-28.6 39a7.99 7.99 0 01-11.2 1.7L483.3 569.8a7.92 7.92 0 01-3.3-6.5V288c0-4.4 3.6-8 8-8h48.1c4.4 0 8 3.6 8 8v247.5l142.6 103.1c3.6 2.5 4.4 7.5 1.8 11.1z" />
                            </svg>
                            {curso?.horario[0] ?? ""} - {curso?.horario[curso.horario.length - 1] ?? ""}
                          </h3>
                          <h3 className="text-sm flex gap-x-1">
                            <svg className="mt-1" viewBox="0 0 640 512" fill="currentColor" height="1em" width="1em">
                              <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0l267.9 107.1c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24h-48c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32v264c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24H152c-13.3 0-24-10.7-24-24v-56h384v56c0 13.3-10.7 24-24 24zM128 400v-64h384v64H128zm0-96v-80h384v80H128z" />
                            </svg>
                            {curso?.taller ?? ""}
                          </h3>
                        </div>
                      </div>
                      <div className="flex flex-row flex-nowrap">
                        {diasSemana.map((dia, index) => {
                          const estaEnArray = curso.dias.includes(dia);
                          const clase = estaEnArray ? diasColores[dia] : "bg-neutral-100 text-neutral-300";

                          return (
                            <div
                              key={index}
                              className={`h-full w-full flex align-middle border-1 border-neutral-400 justify-center place-content-center ${clase}`}
                            >
                              <p>{dia.charAt(0)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      );
    } else if (usuario.rol == "docente") {
      navigate("/home");
    }
  } else {
    return <Navigate to={"/"} />;
  }
};

export default AdminDocenteCursos;
