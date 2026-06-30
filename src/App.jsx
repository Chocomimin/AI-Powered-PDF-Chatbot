import { useState, useEffect } from "react";

import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

import { extractTextFromPDF } from "./utils/pdfExtractor";
import { askGemini } from "./services/gemini";

const loadPersistedState = () => {
  if (typeof window === "undefined") {
    return { chats: [], activeChatId: null, pdfText: "", selectedFileName: "" };
  }

  try {
    const stored = localStorage.getItem("chatData");
    if (!stored) {
      return { chats: [], activeChatId: null, pdfText: "", selectedFileName: "" };
    }

    const parsed = JSON.parse(stored);
    return {
      chats: Array.isArray(parsed.chats) ? parsed.chats : [],
      activeChatId: parsed.activeChatId ?? null,
      pdfText: typeof parsed.pdfText === "string" ? parsed.pdfText : "",
      selectedFileName: typeof parsed.selectedFileName === "string" ? parsed.selectedFileName : "",
    };
  } catch (error) {
    console.error("Failed to parse chatData from localStorage", error);
    return { chats: [], activeChatId: null, pdfText: "", selectedFileName: "" };
  }
};

function App() {
  const persistedState = loadPersistedState();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(persistedState.selectedFileName);
  const [pdfText, setPdfText] = useState(persistedState.pdfText);

  const [loading, setLoading] = useState(false);

  // 🧠 MULTI CHAT STATE
  const [chats, setChats] = useState(persistedState.chats);
  const [activeChatId, setActiveChatId] = useState(persistedState.activeChatId);

  // Persist chats and uploaded PDF context to localStorage whenever they change
  useEffect(() => {
    const data = JSON.stringify({ chats, activeChatId, pdfText, selectedFileName });
    localStorage.setItem("chatData", data);
  }, [chats, activeChatId, pdfText, selectedFileName]);

  // Get active chat
  const activeChat = chats.find((c) => c.id === activeChatId);

  // Create new chat
  const createNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
  };

  // Delete chat
  const deleteChat = (id) => {
    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);

    if (activeChatId === id) {
      setActiveChatId(updated.length ? updated[0].id : null);
    }
  };

  // Handle PDF upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedFileName(file.name);
    setLoading(true);

    const extractedText = await extractTextFromPDF(file);
    setPdfText(extractedText);

    setLoading(false);
  };

  // Send message
  const handleSend = async (question) => {
    if (!pdfText) {
      alert("Upload PDF first.");
      return;
    }

    // create chat if none exists
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createNewChat();
    }

    const userMessage = {
      sender: "user",
      text: question,
    };

    // add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
            ...chat,
            messages: [...chat.messages, userMessage],
          }
          : chat
      )
    );

    setLoading(true);

    const aiReply = await askGemini(pdfText, question);

    const aiMessage = {
      sender: "ai",
      text: aiReply,
    };

    // add AI message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
            ...chat,
            messages: [...chat.messages, aiMessage],
          }
          : chat
      )
    );

    setLoading(false);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      {/* SIDEBAR */}
      <div className="w-1/4 min-w-[250px] bg-white shadow-lg p-4 flex flex-col">

        <h2 className="text-xl font-bold text-indigo-600 mb-4">
          💬 My Chats
        </h2>

        <button
          onClick={createNewChat}
          className="bg-indigo-600 text-white py-2 rounded-lg mb-4 hover:bg-indigo-700"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">

          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${activeChatId === chat.id
                ? "bg-indigo-100"
                : "hover:bg-gray-100"
                }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="truncate">{chat.title}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 p-6 flex flex-col overflow-y-auto">

        <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl p-6 flex flex-col flex-1 overflow-y-auto">

          <Header />

          <UploadBox
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
          />

          {selectedFileName && (
            <p className="mt-3 text-green-600">
              PDF ready: {selectedFileName}
            </p>
          )}

          <ChatBox
            messages={activeChat?.messages || []}
            loading={loading}
            onSend={handleSend}
            clearChat={() => {
              if (!activeChatId) return;
              setChats((prev) =>
                prev.map((chat) =>
                  chat.id === activeChatId
                    ? { ...chat, messages: [] }
                    : chat
                )
              );
            }}
          />

        </div>
      </div>
    </div>
  );
}

export default App;