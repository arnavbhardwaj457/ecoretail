import React, { useState, useRef, useEffect } from 'react';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I am your AI assistant. Ask me about produce freshness, waste reduction, or sustainability.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI error');
      setMessages(msgs => [...msgs, { from: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'Sorry, I could not process your request.' }]);
      setError(err.message);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-green text-black rounded-full shadow-lg p-4 hover:bg-green-light transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chatbot"
      >
        <span role="img" aria-label="chat">💬</span>
      </button>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-30">
          <div className="bg-black w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-lg flex flex-col h-[70vh] md:h-[32rem]">
            <div className="flex items-center justify-between p-4 border-b border-green-light">
              <span className="font-bold text-black">AI Chatbot</span>
              <button onClick={() => setOpen(false)} className="text-black text-xl font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.from === 'user' ? 'bg-green-light text-black' : 'bg-green text-black'}`}>{msg.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="p-4 border-t border-green-light flex gap-2" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                className="flex-1 input-field text-black"
                placeholder="Type your question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoFocus
              />
              <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>Send</button>
            </form>
            {error && <div className="text-red-600 text-sm px-4 pb-2">{error}</div>}
          </div>
        </div>
      )}
    </>
  );
} 