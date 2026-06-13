// ============================================================
//  COMPONENT: ChatBox — Floating chat widget for users
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ChatBox = () => {
  const { isLoggedIn, user } = useAuth();
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [sending,  setSending]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && isLoggedIn) fetchMessages();
  }, [open, isLoggedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/api/chat/my");
      setMessages(data.messages || []);
    } catch {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post("/api/chat/send", { message: input.trim() });
      setMessages((prev) => [...prev, data.message]);
      setInput("");
    } catch {}
    finally { setSending(false); }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 1200,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--crimson), var(--crimson-dark))",
          color: "var(--white)", fontSize: "1.5rem",
          boxShadow: "0 4px 20px rgba(139,26,26,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "3px solid var(--gold)",
        }}
      >
        {open ? "✕" : "💬"}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed", bottom: 96, right: 28, zIndex: 1200,
              width: 320, background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--gray-light)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, var(--crimson), var(--crimson-dark))", padding: "14px 16px", color: "var(--white)" }}>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>💬 Chat with SR Fashions</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>Hi {user?.name?.split(" ")[0]}! Ask us anything.</div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 12, maxHeight: 280, display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--gray)", fontSize: "0.85rem", padding: 20 }}>
                  👋 Welcome! How can we help you today?
                </div>
              )}
              {messages.map((m) => (
                <div key={m._id} style={{ display: "flex", justifyContent: m.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%", padding: "8px 12px",
                    borderRadius: m.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: m.sender === "user" ? "var(--crimson)" : "var(--ivory-dark)",
                    color: m.sender === "user" ? "var(--white)" : "var(--charcoal)",
                    fontSize: "0.88rem",
                  }}>
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{ display: "flex", borderTop: "1px solid var(--gray-light)", padding: 8, gap: 6 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
                style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", outline: "none", fontSize: "0.88rem", fontFamily: "'Times New Roman', Times, serif" }}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                style={{ background: "var(--crimson)", color: "var(--white)", padding: "8px 14px", borderRadius: "var(--radius)", fontWeight: 700, opacity: sending ? 0.6 : 1 }}
              >
                {sending ? "…" : "➤"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
