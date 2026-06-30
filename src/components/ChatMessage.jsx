const ChatMessage = ({ sender, text }) => {
    const isUser = sender === "user";

    return (
        <div
            className={`flex ${isUser ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`
                    max-w-[90%]
                    sm:max-w-[80%]
                    md:max-w-[70%]
                    px-4
                    py-3
                    rounded-2xl
                    shadow-sm
                    whitespace-pre-wrap
                    break-words
                    ${isUser
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }
                `}
            >
                {text}
            </div>
        </div>
    );
};

export default ChatMessage;