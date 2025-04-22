"use client";

import { useState, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageClick = () => {
    if (inputValue.trim() && formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      content: "How Can I Get My Affordability Score in the Green?",
    },
  ]);
  const [history, setHistory] = useState<string[]>([
    "Get Property Suggestions for...",
  ]);

  const handleNewChat = () => {
    // Save current messages to backend here
    setHistory((prev) => [`Chat on ${new Date().toLocaleString()}`, ...prev]);
    setMessages([]);
  };

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const input = (e.currentTarget as HTMLFormElement).elements.namedItem(
      "message"
    ) as HTMLInputElement;
    const userInput = input.value.trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    input.value = "";
    setInputValue("");

    // Here you'll call Strapi endpoint (we'll wire it later)
  };

  return (
    <div className="flex min-h-full space-x-3   ">
      {/* Sidebar */}
      <div className="w-64  flex flex-col rounded-xl bg-white">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-xl text-[#2A2A33] font-semibold">History</h2>
          <button
            onClick={handleNewChat}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="New Chat"
          >
            <img src="./chat-edit.png" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {history.map((item, index) => (
            <button
              key={index}
              className="text-left text-sm text-gray-600 hover:text-black w-full"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between rounded-xl bg-white">
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-md px-4 py-2 rounded-2xl text-black ${
                msg.role === "user"
                  ? "bg-[#EFF6FD] self-end ml-auto text-right"
                  : "bg-gray-100 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex justify-center items-center">
          <form ref={formRef} className="p-4 w-5/8 " onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                name="message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Anything"
                className="w-full h-[63px] text-[14px] text-[#2A2A33] rounded-2xl bg-[#F5F5F5] px-6 py-2 pr-10 text-sm shadow-sm focus:outline-none placeholder:text-gray-500"
                autoComplete="off"
              />

              <img
                src={
                  inputValue.trim()
                    ? "/dashboard/chat-start.png" // active icon
                    : "/dashboard/chat-pre-button.png" // default icon
                }
                alt="Send"
                onClick={handleImageClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
              />
            </div>
            <p className="text-center text-[14px] text-[#2A2A33] mt-5">
              Home Affordability AI chat can make mistakes, and this is not
              financial advice
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
