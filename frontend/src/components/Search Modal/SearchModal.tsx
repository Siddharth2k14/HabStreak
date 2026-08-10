import React from "react"

interface SearchModalProps {
    onClose: () => void;
}

export const SearchModal = ({ onClose }: SearchModalProps) => {
    const [searchTask, setSearchTask] = React.useState({
        task_name: "",
    });

    return (
        <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center p-4 z-50 scrollbar-none">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-lg p-8 bg-navbar relative overflow-y-auto scrollbar-none">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition"
                >
                    ×
                </button>
                <h1 className="text-4xl font-bold text-white mb-6 text-center">
                    Search Task
                </h1>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                    <div>
                        <label htmlFor="Task Name" className="block text-white text-lg mb-1">
                            Task Name
                        </label>
                        <input
                            type="text"
                            name="Task Name"
                            id="Task Name"
                            value={searchTask.task_name}
                            onChange={(e) => setSearchTask({ ...searchTask, task_name: e.target.value })}
                            className="w-full px-2 py-2 bg-gray-300 text-black rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            className="px-12 py-3 bg-gray-400 text-black text-lg font-semibold rounded-full hover:bg-gray-500 transition duration-200"
                        >
                            Search Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}