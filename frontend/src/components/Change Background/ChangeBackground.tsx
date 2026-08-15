import React from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
];

const ChangeBackground = () => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string>("");

    const validateFile = (file: File) => {
        setError("");

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only PNG, JPG, JPEG, and WebP images are allowed.");
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Image size must be less than 5 MB.");
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (!validateFile(file)) {
            return;
        }

        setSelectedFile(file);

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
    };

    const handleFileInput = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (
        event: React.DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (
        event: React.DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];

        if (file) {
            handleFile(file);
        }
    };

    const removeImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setSelectedFile(null);
        setPreview(null);
        setError("");
    };

    const handleSave = () => {
        if (!selectedFile) {
            setError("Please select a background image first.");
            return;
        }

        // Upload API will be implemented here
        console.log("Selected file:", selectedFile);
    };

    return (
        <div className="w-full min-h-[500px] flex items-start justify-center p-6">

            <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/75 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-700">
                    <h2 className="text-2xl font-semibold text-white">
                        Change Background
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Upload a custom background for your dashboard.
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">

                    {!preview ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                relative
                                flex
                                min-h-[260px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                border-2
                                border-dashed
                                transition-all
                                duration-200
                                cursor-pointer
                                ${
                                    isDragging
                                        ? "border-white bg-slate-800"
                                        : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                                }
                            `}
                        >
                            {/* Upload Icon */}
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-7 w-7 text-slate-300"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M12 3v12m0-12l-4 4m4-4l4 4"
                                    />
                                </svg>
                            </div>

                            <p className="text-base font-medium text-white">
                                {isDragging
                                    ? "Drop your image here"
                                    : "Drag & drop your image here"}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                or click to browse from your device
                            </p>

                            <p className="mt-4 text-xs text-slate-500">
                                PNG, JPG, JPEG or WebP · Maximum 5 MB
                            </p>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFileInput}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </div>
                    ) : (
                        /* Preview */
                        <div className="space-y-4">

                            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-800">

                                <img
                                    src={preview}
                                    alt="Background preview"
                                    className="h-[280px] w-full object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20" />

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="
                                        absolute
                                        right-3
                                        top-3
                                        rounded-lg
                                        bg-black/60
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        backdrop-blur-sm
                                        transition
                                        hover:bg-black/80
                                    "
                                >
                                    Remove
                                </button>
                            </div>

                            {/* File information */}
                            {selectedFile && (
                                <div className="rounded-lg bg-slate-800 px-4 py-3">
                                    <p className="truncate text-sm font-medium text-white">
                                        {selectedFile.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={removeImage}
                            disabled={!selectedFile}
                            className="
                                rounded-lg
                                border border-slate-700
                                px-6 py-3
                                text-sm
                                font-medium
                                text-slate-300
                                transition
                                hover:bg-slate-800
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!selectedFile}
                            className="
                                rounded-lg
                                bg-white
                                px-6 py-3
                                text-sm
                                font-semibold
                                text-slate-900
                                transition
                                hover:bg-slate-200
                                active:scale-[0.98]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Save Background
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChangeBackground;