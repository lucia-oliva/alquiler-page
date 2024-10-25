import { useState, useEffect } from 'react';

function Reserva() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCancha, setSelectedCancha] = useState('');
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [email, setEmail] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);  // Nuevo estado para el archivo PDF

  useEffect(() => {
    fetch('http://localhost:3000/available-slots')
      .then(response => response.json())
      .then(data => setSlots(data))
      .catch(error => console.error('Error fetching available slots:', error));
  }, []);

  // Filtrar los slots disponibles cuando el usuario selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      setFilteredSlots(slots.filter(slot => slot.fecha === selectedDate));
    }
  }, [selectedDate, slots]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Crear FormData para enviar tanto los campos como el archivo PDF
    const formData = new FormData();
    formData.append('email', email);
    formData.append('cancha_id', selectedCancha);
    formData.append('horario_id', selectedHorario);

    if (pdfFile) {
      formData.append('comprobante', pdfFile);  // Añadir el archivo PDF al formData
    }

    // Realizar el fetch utilizando FormData en lugar de JSON
    fetch('http://localhost:3000/reserve', {
      method: 'POST',
      body: formData,  // Enviar FormData en lugar de JSON
    })
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error('Error creating reservation:', error);
      });
  };


  // Obtener una lista de fechas únicas de los horarios disponibles
  const uniqueDates = [...new Set(slots.map(slot => slot.fecha))];

  return (
    <div>
      <h1>Registrar reserva</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha:</label>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required>
            <option value="" disabled>Select Date</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cancha:</label>
          <select value={selectedCancha} onChange={(e) => setSelectedCancha(e.target.value)} required>
            <option value="" disabled>Select Cancha</option>
            {filteredSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {`Cancha ${slot.tipo}`}
              </option>
            ))}                                  
          </select>
        </div>
        <div>
          <label>Horario:</label>
          <select value={selectedHorario} onChange={(e) => setSelectedHorario(e.target.value)} required>
            <option value="" disabled>Select Horario</option>
            {filteredSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {`${slot.hora_inicio} - ${slot.hora_final}`}
              </option>
            ))}
          </select>
          </div>
        <div>
          <label>Subir PDF (opcional):</label>
          <input
            type="file"
            accept="application/pdf"  // Asegura que solo se puedan seleccionar archivos PDF
            onChange={(e) => setPdfFile(e.target.files[0])}  // Guardar el archivo PDF seleccionado
          />
        </div>
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
}

export default Reserva;