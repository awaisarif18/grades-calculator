"use client";
import Chat from "../../components/chat";
export default function chatbot(){
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-pink-200 min-h-screen py-12">
      <main className="max-w-xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">
          Study Helper Chatbot
        </h1>
        <Chat />
      </main>
    </div>
  );
}
