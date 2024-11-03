import { useState } from 'react';
import './ChatbotWidget.css'; // Asegúrate de tener los estilos del widget
import { Alert } from '@mui/material'; // Si usas Material-UI para las alertas

// eslint-disable-next-line react/prop-types
const ChatbotWidget = ({datos}) => {
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
        userMessage = 'Genera un reporte sobre las reservas que te voy a proporcionar. Interpreta como esta yendo el negocio. No uses ** para resaltar texto. No me digas estrategias, solo interpreta los datos y explicalos de manera facil para el usuario. Las reservas q no aparecen mensualmente es porque ya se realizaron o son reservas futuras, ten en cuenta la fecha de reservas y el mes actual.' + datos;
      } else if (action === 'estrategia') {
        userMessage = 'NO  USES ** para resaltar texto de tu respuesta. Proporciona una estrategia para maximizar las reservas basado en los datos que te voy a pasar, siempre di cosas utiles y necesarias segun unicamnte los datos que te proporciono. La estrategia deberia ser bien especifica. LOS DATOS PROVIENEN DE UNA PAGINA DE RESERVAS DE CANCHAS ONLINE Ten en cuenta dias horas reservadas y el mes actual x el tema de aprovechar festividades(argentina)' + datos;
      }

      const response = await fetch('http://localhost:3000/analisis_bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage, datos}), // Envío del mensaje correspondiente
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
        Analista Virtual
      </button>
      {isOpen && (
        <div className="chatbot-body">
          <div className="chat-response">
          <div className="response-text" contentEditable={false}>
          {response || 'La respuesta del asistente virtual aparecerá aquí...'}
        </div>
          
          </div>
          {isLoading && <div className="loading">Analizando las estadísticas, por favor espere un momento...</div>}
          
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
