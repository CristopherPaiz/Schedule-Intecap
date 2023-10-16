import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ListaTaller from "../forms/Taller/ListaTaller";
import AddTaller from "../forms/Taller/AddTaller";
import { useNavigate, Navigate } from "react-router-dom";
import { contexto } from "../context/ContextProvider";
import API_URL from "../config";

const Taller = () => {
  const [data, setData] = useState([]);
  const { usuario, taller } = useContext(contexto);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerTaller();
  }, [taller]);

  const obtenerTaller = async () => {
    try {
      const response = await fetch(`${API_URL}/taller/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Error al obtener los medicamentos");
        throw new Error("Error al filtrar los medicamentos", {});
      }

      const data = await response.json();
      setData(data);
    } catch (error) {}
  };

  if (usuario) {
    return (
      <div className="flex w-11/12 flex-col mx-auto">
        <Tabs color="secondary">
          <Tab key="workshops" title="Lista de talleres">
            <Card>
              <CardBody>
                <h2 className="mb-4 text-3xl text-center font-extrabold md:text-5xl lg:text-3xl dark:text-white">
                  Listado de talleres o laboratorios
                </h2>
                <ListaTaller data={data} />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="addWorkshop" title="Añadir Taller">
            <Card>
              <CardBody>
                <h2 className="mb-4 text-3xl text-center font-extrabold md:text-5xl lg:text-3xl dark:text-white">
                  Añadir nuevo taller
                </h2>
                <AddTaller />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default Taller; // Cambiamos el nombre del componente
