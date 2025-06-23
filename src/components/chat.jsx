"use client";
import React, { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;

    const userMsg = { role: "user", content };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const json = await res.json();
      if (json.reply) {
        setHistory((h) => [
          ...h,
          { role: json.reply.role, content: json.reply.content },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-white bg-opacity-80 rounded-xl"
      >
        {history.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow-lg max-w-[75%] break-words ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-indigo-100 text-indigo-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 bg-white bg-opacity-90 rounded-l-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-r-2xl px-6"
        >
          Send
        </button>
      </div>
    </div>
  );
}
