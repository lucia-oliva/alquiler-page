import { useEffect, useState } from "react";

export const Hours = () => {
//Creamos un user State, inicializamos la fecha en el dia de hoy. 
const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); 
const [horariosBD, setHorariosBD] = useState([]);
const [cancha, setCancha] = useState(1);


const horariosFijos = ['08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
    '21:00', '22:00', '23:00'];


useEffect(() => {
async function hora_inicio (fecha, cancha){
  console.log(fecha, cancha);
  
    try {
        const response = await fetch("http://localhost:4000/getHorarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        fecha, cancha,
        }),
                        }
                            );
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setHorariosBD(data);
            return data;
        }else{
            throw new Error('Error en la petición');
        }   
    }catch(err){
    console.error('Error:', err);
    }  
}
hora_inicio(fecha, cancha); //pasamos como argumento la fecha de hoy para traer horarios segun fecha.
},[fecha, cancha]);

//Funcion para verificar la disponibiliad de un horario
const verificarDisponibilidad = (hora) => {
    for (let horario of horariosBD) {
      const horaInicio = horario.hora_inicio.slice(0,5); //convierte 08:00:00 en -> 08:00 
      if (hora === horaInicio) {
        return horario.disponible ? 'white' : 'red';
      }
    }
    return 'white'; // Si no hay información, color de fondo por defecto
  };

  //determinar fecha

  const handleChangeFecha = (event) => {
    setFecha(event.target.value);
  }

  const handleChangeCncha = (event) => {
    setCancha(Number(event.target.value));
  };

  return(
    
    <div>
    <h2 style={{color: 'white'}}>Horarios para {fecha} - Cancha {cancha}</h2> 
      
    <input
      type="date"
      value={fecha}
      onChange={handleChangeFecha}
      style={{marginBottom: '20px', paddingBottom: '10px'}}
      />

      {/*Input para seleccionar cancha*/}
      <select
        value={cancha}
        onChange={handleChangeCncha}
        style={{}}
        >
          <option value="1">Cancha 1</option>
          <option value="2">Cancha 2</option>
        </select>

    <ul>
      {horariosFijos.map((hora, index) => (
        <li 
          key={index} 
          style={{ 
            backgroundColor: verificarDisponibilidad(hora), 
            color: 'black', 
            listStyle: 'none',
            padding: '10px', 
            margin: '5px 0', 
          }}
        >
          {hora}
        </li>
      ))}
    </ul>
  </div>
);

} 
