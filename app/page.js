"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  //hold the array of conversation history
  const [chatLog, setChatLog] = useState([]);
  //wait for API response
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);
    sendMessage(inputValue);
    setInputValue("");
  };
  
  const sendMessage = async (message) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    };
    const data = {
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    };
    setIsLoading(true);
    try {
      const response = await axios.post(url, data, { headers: headers });
      console.log(response.data);
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: "bot", message: response.data.choices[0].message.content },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="bg-gray-800 text-white py-4 px-8">
        <h1 className="text-2xl font-bold text-center">ChatGPT</h1>
      </header>
      <main className="flex-grow bg-gray-100 p-8">
        {chatLog.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`${
               message.type === "user" ? "bg-indigo-700" : "bg-sky-800"
              } rounded-lg p-4 text-white max-w-sm`}>
               {message.message}
            </div>
           
          </div>
        ))}
      </main>
      <footer className="bg-gray-800 text-white py-4 px-8">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Message ChatGPT..."
            className="flex-grow rounded-l-lg py-2 px-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-r-lg"
          >
            Send Message
          </button>
        </form>
      </footer>
    </div>
  );
}