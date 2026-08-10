import React from "react";
import type { CreateTaskTypes } from "./CreateTaskType";

interface CreateModalProps {
    onClose: () => void;
}

export const CreateModal = ({ onClose }: CreateModalProps) => {
     const [createTask, setCreateTask] = React.useState<CreateTaskTypes>({
         task_name: "",
         due_date: null,
         priority: "LOW",
         link: "",
         description: "",
     });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-lg p-8 bg-navbar relative overflow-y-auto scrollbar-none">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition"
                >
                    ×
                </button>
                <h1 className="text-4xl font-bold text-white mb-6 text-center">
                    Create Task
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
                            value={createTask.task_name}
                            onChange={(e) => setCreateTask({ ...createTask, task_name: e.target.value })}
                            className="w-full px-2 py-2 bg-gray-300 text-black rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="Due Date" className="block text-white text-lg mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="Due Date"
                            id="Due Date"
                            value={createTask.due_date ? (new Date(createTask.due_date)).toISOString().slice(0, 10) : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setCreateTask({ ...createTask, due_date: e.target.value ? new Date(e.target.value) : null })
                            }
                            className="w-full px-2 py-2 bg-gray-300 text-black rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="Priority" className="block text-white text-lg mb-1">
                            Priority
                        </label>
                        <select
                            id="Priority"
                            value={createTask.priority}
                            onChange={(e) => setCreateTask({ ...createTask, priority: e.target.value as "LOW"|"MEDIUM"|"HIGH" })}
                            className="w-full px-2 py-2 bg-gray-300 text-black rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="Link" className="block text-white text-lg mb-1">
                            Link
                        </label>
                        <input 
                            type="text"
                            name="Link"
                            id="Link"
                            value={createTask.link}
                            onChange={(e) => setCreateTask({ ...createTask, link: e.target.value })}
                            className="w-full px-2 py-2 bg-gray-300 text-black rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="Description" className="block text-white text-lg mb-1">
                            Description
                        </label>
                        <textarea 
                            name="Description"
                            id="Description"
                            value={createTask.description}
                            onChange={(e) => setCreateTask({ ...createTask, description: e.target.value })}
                            className="w-full bg-gray-300 text-black rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                    </div>

                    <div className="flex justify-end pt-1">
                        <button 
                            type="submit"
                            className="px-12 py-3 bg-gray-400 text-black text-lg font-semibold rounded-full hover:bg-gray-500 transition duration-200"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};