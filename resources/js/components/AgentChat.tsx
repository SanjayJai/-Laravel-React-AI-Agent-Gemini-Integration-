import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trash2, MessageCircle, XIcon } from 'lucide-react';

type Message = {
  id?: string;
  role: 'user' | 'agent' | 'assistant';
  content: string;
  created_at?: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
};

export default function AgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load history when open
  useEffect(() => {
    if (!open) return;

    setHistoryLoading(true);

    fetch('/agent/chat/history')
      .then(res => res.json())
      .then(data => {
        const conversations = data.conversations || [];
        setHistory(conversations);

        if (conversations.length > 0) {
          setActiveConv(conversations[0].id);
          setMessages(conversations[0].messages || []);
        }
      })
      .finally(() => setHistoryLoading(false));
  }, [open]);

  // Change conversation
  useEffect(() => {
    if (!activeConv) return;
    const conv = history.find(c => c.id === activeConv);
    setMessages(conv?.messages || []);
  }, [activeConv, history]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

      const res = await fetch('/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const textData = await res.text();

      setMessages(prev => [
        ...prev,
        { role: 'agent', content: textData },
      ]);

      // Refresh history silently
      fetch('/agent/chat/history')
        .then(res => res.json())
        .then(data => setHistory(data.conversations || []));
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'agent', content: 'Something went wrong. Try again.' },
      ]);
    }

    setLoading(false);
  };

  const handleDeleteConversation = async (id: string) => {
    if (!window.confirm('Delete this conversation?')) return;

    await fetch(`/agent/chat/history/${id}`, { method: 'DELETE' });

    setHistory(prev => prev.filter(c => c.id !== id));

    if (activeConv === id) {
      setActiveConv(null);
      setMessages([]);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveConv(null);
  };

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;

      const target = e.target as Node;

      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(v => !v)}
        className="w-14 h-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
      >
        <MessageCircle className="text-white w-6 h-6" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute bottom-20 right-0 
                     w-[420px] md:w-[480px] 
                     h-[600px] 
                     bg-white rounded-2xl shadow-2xl border 
                     flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
              <span className="font-semibold">AI Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startNewChat}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                New Chat
              </button>

              <button onClick={() => setOpen(false)}>
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* History Sidebar */}
            <aside className="w-40 border-r bg-gray-50 hidden sm:flex flex-col">
              <div className="p-2 text-xs font-semibold text-gray-500">
                History
              </div>

              <div className="flex-1 overflow-y-auto">
                {historyLoading ? (
                  <div className="p-3 text-xs text-gray-400">
                    Loading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="p-3 text-xs text-gray-400">
                    No conversations
                  </div>
                ) : (
                  history.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConv(conv.id)}
                      className={`flex items-center px-2 py-2 text-xs cursor-pointer hover:bg-blue-50 ${
                        activeConv === conv.id ? 'bg-blue-100' : ''
                      }`}
                    >
                      <span className="flex-1 truncate">
                        {conv.title || 'Conversation'}
                      </span>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col bg-white">
                {messages.map((msg, index) => {
                  let structured: any = null;

                  if (msg.role !== 'user') {
                    try {
                      const parsed = JSON.parse(msg.content);
                      if (typeof parsed === 'object' && parsed !== null) {
                        structured = parsed;
                      }
                    } catch {
                      structured = null;
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === 'agent' || msg.role === 'assistant'
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      {structured && structured.type ? (
                        <div className="bg-white border rounded-xl shadow-md p-4 max-w-[80%]">
                          <h3 className="font-bold text-lg text-blue-700">
                            {structured.title || 'Details'}
                          </h3>

                          {structured.price && (
                            <div className="text-green-600 font-semibold mt-1">
                              {structured.price}
                            </div>
                          )}

                          {structured.specs && (
                            <div className="mt-3 space-y-1 text-sm text-gray-600">
                              {Object.entries(structured.specs).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <strong>{key}:</strong> {value as string}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`px-4 py-2 text-sm rounded-2xl max-w-[75%] whitespace-pre-wrap ${
                            msg.role === 'agent' ||
                            msg.role === 'assistant'
                              ? 'bg-blue-100 text-blue-900 rounded-bl-none'
                              : 'bg-gray-200 text-gray-900 rounded-br-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex space-x-2 pl-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={sendMessage}
                className="flex items-center border-t p-3 gap-2 bg-gray-50"
              >
                <input
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}