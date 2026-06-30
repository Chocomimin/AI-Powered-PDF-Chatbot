const UploadBox = ({ selectedFile, onFileChange }) => {
    return (
        <div className="bg-gray-50 border-2 border-dashed border-indigo-300 rounded-xl p-8">

            <label className="flex flex-col items-center cursor-pointer">

                <span className="text-lg font-semibold text-indigo-600">
                    📄 Choose PDF File
                </span>

                <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={onFileChange}
                />

            </label>

            {selectedFile && (
                <div className="mt-6 text-center">
                    <p className="text-gray-700">
                        <strong>Selected File:</strong>
                    </p>

                    <p className="text-indigo-600 font-semibold mt-1">
                        {selectedFile.name}
                    </p>
                </div>
            )}

        </div>
    );
};

export default UploadBox;