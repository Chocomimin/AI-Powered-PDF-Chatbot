import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import Loader from "./Loader";

const ChatBox = ({
    messages,
    loading,
    onSend,
    clearChat,
}) => {
    const [question, setQuestion] = useState("");

    // Reference for auto-scrolling
    const messagesEndRef = useRef(null);

    // Auto-scroll whenever messages or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sendQuestion = () => {
        if (!question.trim()) return;

        onSend(question);
        setQuestion("");
    };

    return (
        <div className="w-full mt-6 flex flex-col h-[80vh] md:h-[85vh]">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">

                {/* Chat Messages */}
                <div
                    className="
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-6
                        bg-gradient-to-b
                        from-gray-50
                        to-white
                        space-y-4
                    "
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <div className="text-5xl mb-4">
                                💬
                            </div>

                            <h2 className="text-lg sm:text-xl font-semibold">
                                Start a Conversation
                            </h2>

                            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-md">
                                Ask anything about your uploaded PDF and I'll
                                try to answer based on its content.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                sender={msg.sender}
                                text={msg.text}
                            />
                        ))
                    )}

                    {loading && <Loader />}

                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="border-t bg-white p-4">
                    <div className="flex flex-col sm:flex-row gap-3">

                        <input
                            type="text"
                            placeholder="Ask a question about your PDF..."
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !loading) {
                                    sendQuestion();
                                }
                            }}
                            disabled={loading}
                            className="
                                flex-1
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                py-3
                                text-sm
                                sm:text-base
                                outline-none
                                transition
                                duration-200
                                focus:ring-2
                                focus:ring-indigo-500
                                focus:border-indigo-500
                                disabled:bg-gray-100
                                disabled:cursor-not-allowed
                            "
                        />

                        <button
                            onClick={sendQuestion}
                            disabled={loading || !question.trim()}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-gradient-to-r
                                from-indigo-600
                                to-purple-600
                                text-white
                                font-semibold
                                transition-all
                                duration-300
                                hover:scale-105
                                hover:shadow-lg
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                whitespace-nowrap
                            "
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>

                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={clearChat}
                            disabled={loading}
                            className="
                                text-sm
                                text-red-500
                                hover:text-red-600
                                font-medium
                                transition
                                duration-200
                                hover:underline
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            🗑 Clear Chat
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatBox;