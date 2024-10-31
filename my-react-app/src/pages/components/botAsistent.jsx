import { useState } from 'react';
import './ChatbotWidget.css'; // Asegúrate de tener los estilos del widget
import { Alert } from '@mui/material'; // Si usas Material-UI para las alertas

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Función para manejar la generación de la respuesta del bot
  const handleGenerateResponse = async (action) => {
    setIsLoading(true);
    setMessage(''); // Limpiar mensajes anteriores

    try {
      // Ajustar el mensaje basado en la acción del botón
      let userMessage = '';
      if (action === 'reporte') {
        userMessage = 'Genera un reporte sobre las reservas que he proporcionado.';
      } else if (action === 'estrategia') {
        userMessage = 'Proporciona una estrategia para maximizar las reservas basado en los datos que te he pasado.';
      }

      const response = await fetch('http://localhost:3000/analisis_bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }), // Envío del mensaje correspondiente
      });

      const data = await response.json();
      if (response.ok) {
        setResponse(data.response); // Suponiendo que la respuesta del backend tenga esta estructura
      } else {
        setMessage('Error en la respuesta del servidor.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Hubo un error al procesar la solicitud: ' + error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-widget">
      <button className="float-button" onClick={toggleChat}>
        Chatbot
      </button>
      {isOpen && (
        <div className="chatbot-body">
          <div className="chat-response">
            <textarea
              readOnly
              value={response}
              placeholder="La respuesta del bot aparecerá aquí..."
            />
            {isLoading && <div className="loading">Procesando...</div>}
          </div>
          <div className="chat-buttons">
            <button onClick={() => handleGenerateResponse('reporte')}>Generar Reporte</button>
            <button onClick={() => handleGenerateResponse('estrategia')}>Generar Estrategia</button>
          </div>
          {message && (
            <Alert severity={messageType} onClose={() => setMessage('')}>
              {message}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
