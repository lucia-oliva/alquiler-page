import { useEffect, useState } from "react";

export const Hours = () => {
//Creamos un user State, inicializamos la fecha en el dia de hoy. 
const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); 
const [horariosBD, setHorariosBD] = useState([]);

const horariosFijos = ['08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
    '21:00', '22:00', '23:00'];


useEffect(() => {
async function hora_inicio (fecha){
    try {
        const response = await fetch("http://localhost:4000/getHorarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        fecha,  
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
hora_inicio(fecha); //pasamos como argumento la fecha de hoy para traer horarios segun fecha.
},[fecha]);

//Funcion para verificar la disponibiliad de un horario
const verificarDisponibilidad = (hora) => {
    for (let horario of horariosBD) {
      if (hora >= horario.hora_inicio && hora < horario.hora_fin) {
        return horario.disponible ? 'green' : 'red';
      }
    }
    return 'white'; // Si no hay información, color de fondo por defecto
  };


  return(
    
    <div>
    <h2>Horarios para {fecha}</h2>
    <ul>
      {horariosFijos.map((hora, index) => (
        <li 
          key={index} 
          style={{ 
            backgroundColor: verificarDisponibilidad(hora), 
            color: 'black', 
            padding: '10px', 
            margin: '5px 0' 
          }}
        >
          {hora}
        </li>
      ))}
    </ul>
  </div>
);

} 
