import { useEffect, useState } from "react";
import "./Nav.css";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { FaArrowLeftLong } from "react-icons/fa6";


export const Layout = () => {
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const currentTab = window.location.pathname;

  const { logout, user } = useAuth();

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      // if scroll down hide the navbar
      setShow(true);
    } else {
      // if scroll up show the navbar
      setShow(false);
    }

    // remember current page location to use in the next move
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <>
      <div className={`Hero-nav ${show && "hidden"}`}>
        {currentTab === "/" ? (
          <a id="logo-link" href="/">
            <img id="logo" src="logo-base1.jpg" alt="Logotipo Pagina CPCE" />
          </a>
        ) : (
          <a href="/">
            <FaArrowLeftLong id="arrow" />
          </a>
        )}

        <nav>
          <ul id="menu">
            {!user ? (
              <li>
                <a className="button-nav" href="/login">
                  Iniciar Sesion
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a className="button-nav" href="/reservation">
                    Reservar
                  </a>
                </li>
                {user.admin == true && (
                  <li>
                    <a className="button-nav blue" href="/admin">
                      Administrar
                    </a>
                  </li>
                )}
                <li>
                {user.admin == true && (
                  <li>
                    <a className="button-nav blue" href="/reports">
                      Dashboard
                    </a>
                  </li>
                )}
                </li>
                <li>
                  <a
                    className="button-nav red"
                    href="/"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Cerrar Sesion
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <main
        style={
          currentTab === "/" ? { marginTop: "5.5em" } : { marginTop: "3em" }
        }
      >
        <Outlet />
      </main>
    </>
  );
};
