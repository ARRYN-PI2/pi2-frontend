// Chatbot.jsx
import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    //  Carga historial desde sessionStorage
    const saved = sessionStorage.getItem("chat:global");
    return saved ? JSON.parse(saved) : [
      { from: "bot", text: "Hola 👋 ¿Cómo te puedo ayudar el día de hoy? " }
    ];
  });
  const [input, setInput] = useState("");
  const chatboxRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("show-chatbot", !isOpen);
    //  Guardar estado en sessionStorage (solo mientras dure la pestaña)
    sessionStorage.setItem("chat:isOpen", JSON.stringify(!isOpen));
  };

  const handleChat = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "outgoing", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulación de respuesta
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "incoming", text: "Estoy procesando tu consulta... 🚀" }
      ]);
    }, 800);
  };

  // Guardar historial en sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chat:global", JSON.stringify(messages));
  }, [messages]);

  // Cargar estado abierto/cerrado desde sessionStorage
  useEffect(() => {
    const open = JSON.parse(sessionStorage.getItem("chat:isOpen"));
    if (open) {
      setIsOpen(true);
      document.body.classList.add("show-chatbot");
    }
  }, []);

  // Scroll automático
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Botón flotante */}
      <button className="chatbot-toggler" onClick={toggleChatbot}>
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Caja del chatbot */}
      <div className="chatbot">
        <header>
          <h2>ChatBot</h2>
          <span
            className="material-symbols-outlined"
            onClick={toggleChatbot}
          >
            close
          </span>
        </header>

        <ul className="chatbox" ref={chatboxRef}>
          {messages.map((msg, i) => (
            <li key={i} className={`chat ${msg.from}`}>
              {msg.from === "incoming" && (
                <span className="material-symbols-outlined">smart_toy</span>
              )}
              <p>{msg.text}</p>
            </li>
          ))}
        </ul>

        <div className="chat-input">
          <textarea
            placeholder="Ingresa mensaje..."
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
              }
            }}
          ></textarea>
          <span
            id="send-btn"
            className="material-symbols-outlined"
            onClick={handleChat}
          >
            send
          </span>
        </div>
      </div>
    </>
  );
}
