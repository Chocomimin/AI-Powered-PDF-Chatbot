const Loader = () => {
    return (
        <div className="flex items-center gap-2 px-4 py-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>

            <span className="text-gray-500 text-sm ml-2">
                AI is thinking...
            </span>
        </div>
    );
};

export default Loader;