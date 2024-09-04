
export const Hours = () => {

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
            return data;
        } else {
            throw new Error('Error en la petición');
        }   
    }catch(err) {
    console.error('Error:', err);
}  
}

const myDate = new Date('2024-09-04');
const fechaFormateada = myDate.toISOString().split('T')[0];
hora_inicio(fechaFormateada);

    return(
        <ul>
          
        </ul>
    )
} 