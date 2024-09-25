import "./home.css";
function HomePage() {
  return (
    <div className="Home-page">
      <header className="Hero-section">
        <div className="Hero-nav">
          <img id="logo" src="logo-base1.jpg" alt="Logotipo Pagina CPCE" />
          <nav>
            <ul id="menu">
              <li>
                <a href="#">Inicio</a>
              </li>
              <li>
                <a href="#">Otro Link</a>
              </li>
              <li>
                <a href="#">Otro Link</a>
              </li>
              <li>
                <a className="button-res" href="#">
                  Reservar
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="Hero-container">
          <div className="Hero-text">
            <h1>
              Reserva tu cancha <br /> al instante
            </h1>
            <a className="button-res" href="#">
              Reservar
            </a>
          </div>
          <div className="Hero-image">
            <img src="" alt="" />
          </div>
        </div>
      </header>

      <article>
        <div className="articleInfo">
          <h2>Encuentra tu ritmo, <br />mejora tu juego.</h2>
          <p>
            Bienvenidos, ofrecemos una cancha de alta calidad disponibles para
            jugadores de todos los niveles. Ya sea para un partido amistoso o
            para entrenamientos serios, nuestras instalaciones estan diseñadas
            para proporcionar la mejor experiencia de juego.
          </p>
        </div>

        <div>
          <div>
            <img src="" alt="" />
            <p>Superficies de juego profesionales</p>
          </div>
          <div>
            <img src="" alt="" />
            <p> Iluminacion optima para partidos nocturnos.</p>
          </div>
          <div>
            <img src="" alt="" />
            <p>Vestuarios comodos y equipados.</p>
          </div>
        </div>
      </article>

      <article className="Info">
        <div className="precioInfo">
          <h1>Reservar a solo <br /> $2000 por hora</h1>
        </div>
        <div className="reservaInformacion">
          <p>Reserva tu turno facilmente</p>
          <ol>
            <li>Completa el formulario con tus datos.</li>
            <li>Selecciona la fecha y hora deseada.</li>
            <li>Carga el comprobante de pago para <br /> confirmar tu turno.</li>
          </ol>
          <button>Reservar</button>
        </div>
      </article>

      <footer className="footerHome">
        <div>
          <p className="footer_p">Contacto</p>
          <p>380-4533470 | 380-4797455</p>
        </div>

        <div>
          <p  className="footer_p">Direccion</p>
          <p>Castro Barros 1102, F5300 La Rioja</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
