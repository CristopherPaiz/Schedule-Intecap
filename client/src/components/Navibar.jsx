import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { contexto } from "../context/ContextProvider.jsx";
import LogoCompleto from "/logo-intecap-completo.svg";

const Navibar = () => {
  const USER_TYPES = useContext(contexto);
  const { usuario, setUsuario, loggedIn, setLoggedIn } = useContext(contexto);
  const navigate = useNavigate();

  const logout = async () => {
    navigate("/");
    setLoggedIn(false);
    setUsuario(null);
    localStorage.removeItem("usuarioINTECAP");
    localStorage.removeItem("loggedINTECAP");
    localStorage.removeItem("demasdatosINTECAP");
    localStorage.removeItem("miTokenExpiration");
  };

  if (usuario === null) {
    return null;
  }

  if (usuario.rol === USER_TYPES.PUBLIC) {
    navigate("/");
  } else if (usuario.rol === USER_TYPES.ADMIN_USER) {
    return (
      <div className="mt-[85px]">
        <Navbar
          className="mb-4 shadow-md rounded-2xl fixed mt-2 -mr-4 h-[54px] border-1 border-[#e6e6e6] w-11/12 mx-auto backdrop-filter backdrop-blur-md bg-opacity-30"
          isBlurred={false}
          maxWidth="full"
        >
          <NavbarContent>
            <NavbarBrand>
              <RouterLink to={"/"}>
                <img src={LogoCompleto} alt="logo Intecap Scheduler" className="h-9 w-full" />
              </RouterLink>
            </NavbarBrand>
          </NavbarContent>
          <NavbarContent className="hidden sm:flex gap-1 md:ml-6" justify="center">
            <NavbarItem>
              <Button className="bg-transparent hover:bg-secondary-100" variant="flat">
                <RouterLink to={"/cursosDocentes"} className="py-2 -mx-3 px-3 flex gap-1">
                  Cursos Docentes
                </RouterLink>
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button className="bg-transparent hover:bg-primary-100">
                <RouterLink to={"/docentes"} className="py-2 -mx-3 px-3 flex gap-1">
                  Docentes
                </RouterLink>
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button className="bg-transparent hover:bg-success-100" variant="flat">
                <RouterLink to={"/cursos"} className="py-2 -mx-3 px-3 flex gap-1">
                  Cursos
                </RouterLink>
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button className="bg-transparent hover:bg-purple-100">
                <RouterLink to={"/talleres"} className="py-2 -mx-3 px-3 flex gap-1">
                  Talleres
                </RouterLink>
              </Button>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden md:flex">
              <Button className="bg-red-600 text-white hover:bg-red-800">
                <RouterLink to={"/"} onClick={logout} className="py-2 -mx-3 px-3 flex gap-1">
                  Cerrar sesión
                </RouterLink>
              </Button>
            </NavbarItem>
          </NavbarContent>
          <Dropdown placement="bottom-end" className="sm:hidden">
            <DropdownTrigger className="sm:hidden">
              <Avatar as="button" className="transition-transform sm:hidden bg-transparent" size="md" alt="usuario" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu Actions" variant="flat">
              <DropdownItem key="comunidad">
                <Link to={"/home"} className="pr-28 pl-3 flex gap-2">
                  INTECAP
                </Link>
              </DropdownItem>
              <DropdownItem key="farmacia">
                <Link to={"/docentes"} className="pr-28 pl-3 flex gap-2">
                  Docentes
                </Link>
              </DropdownItem>
              <DropdownItem key="social">
                <Link to={"/cursos"} className="pr-28 pl-3 flex gap-2">
                  Cursos
                </Link>
              </DropdownItem>
              <DropdownItem key="usuarios">
                <Link to={"/talleres"} className="pr-28 pl-3 flex gap-2">
                  Talleres
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" className="text-danger" color="danger">
                <Link to={"/"} onClick={logout} className="pr-28 pl-3">
                  Cerrar Sesión
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Navbar>
      </div>
    );
  } else if (usuario.rol === USER_TYPES.MODERATOR_USER) {
    return (
      <div className="mt-[85px]">
        <Navbar
          className="mb-4 shadow-md rounded-2xl fixed mt-2 -mr-4 h-[54px] border-1 border-[#e6e6e6] w-11/12 mx-auto backdrop-filter backdrop-blur-md bg-opacity-30"
          isBlurred={false}
          maxWidth="full"
        >
          <NavbarContent>
            <RouterLink to={"/"}>
              <img src={LogoCompleto} alt="logo Intecap Scheduler" className="h-9 w-full" />
            </RouterLink>
          </NavbarContent>
          <NavbarContent className="hidden sm:flex gap-1 md:ml-6" justify="center">
            <NavbarItem>
              <Button className="bg-transparent hover:bg-success-100" variant="flat">
                <RouterLink to={"/miscursos"} className="py-2 -mx-3 px-3 flex gap-1">
                  Mis Cursos
                </RouterLink>
              </Button>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden md:flex">
              <Button className="bg-red-600 text-white hover:bg-red-800">
                <RouterLink to={"/"} onClick={logout} className="py-2 -mx-3 px-3 flex gap-1">
                  Cerrar sesión
                </RouterLink>
              </Button>
            </NavbarItem>
          </NavbarContent>
          <Dropdown placement="bottom-end" className="sm:hidden">
            <DropdownTrigger className="sm:hidden">
              <Avatar as="button" className="transition-transform sm:hidden bg-transparent" size="md" alt="usuario" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu Actions" variant="flat">
              <DropdownItem key="comunidad">
                <Link to={"/home"} className="pr-28 pl-3 flex gap-2">
                  INTECAP
                </Link>
              </DropdownItem>
              <DropdownItem key="social">
                <Link to={"/cursos"} className="pr-28 pl-3 flex gap-2">
                  Cursos
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" className="text-danger" color="danger">
                <Link to={"/"} onClick={logout} className="pr-28 pl-3">
                  Cerrar Sesión
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Navbar>
      </div>
    );
  }
};

export default Navibar;
