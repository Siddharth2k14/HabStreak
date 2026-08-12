const TaskTable = () => {
    const today = new Date().getDate();

    const dates = Array.from(
        { length: today+20 },
        (_, index) => index + 1
    );

    const tasks = [
        {
            id: 1,
            task_name: "Complete React project",
            due_date: new Date().getDate() + 2,
            priority: "HIGH",
            link: null,
            description: "Finish the remaining components and integrate them with the backend.",
        },
        {
            id: 2,
            task_name: "Study PostgreSQL",
            due_date: new Date().getDate() + 5,
            priority: "MEDIUM",
            link: null,
            description: "Study PostgreSQL joins, indexes, transactions, and query optimization.",
        },
        {
            id: 3,
            task_name: "Push code to GitHub",
            due_date: new Date().getDate() + 1,
            priority: "LOW",
            link: "https://github.com/",
            description: "Commit the latest changes and push the project to the GitHub repository.",
        },
        {
            id: 4,
            task_name: "Prepare project documentation",
            due_date: new Date().getDate() + 7,
            priority: "MEDIUM",
            link: null,
            description: "Write documentation covering project setup, architecture, APIs, and database structure.",
        },
        {
            id: 5,
            task_name: "Fix authentication bug",
            due_date: new Date().getDate() + 3,
            priority: "HIGH",
            link: null,
            description: "Investigate and fix the authentication issue occurring during user login.",
        },
        {
            id: 6,
            task_name: "Complete assignment",
            due_date: new Date().getDate() + 4,
            priority: "HIGH",
            link: null,
            description: "Complete the pending college assignment and submit it before the deadline.",
        },
        {
            id: 7,
            task_name: "Read system design chapter",
            due_date: new Date().getDate() + 6,
            priority: "LOW",
            link: null,
            description: "Study database replication, load balancing, caching, and fault tolerance.",
        },
        {
            id: 8,
            task_name: "Review HabStreak UI",
            due_date: new Date().getDate() + 8,
            priority: "MEDIUM",
            link: null,
            description: "Review the dashboard layout and improve the task table and sidebar design.",
        },
    ]

    return (
        <div className="flex-1 h-full overflow-hidden">
            <div className="border-2 border-slate-600 rounded-lg h-full overflow-auto scrollbar-none bg-slate-950/50">
                <table className="border-collapse text-white text-sm md:text-base w-full">
                <thead className="bg-slate-900/50 sticky top-0">
                    <tr>
                        <th className="border-2 border-slate-600 px-3 md:px-4 py-2 text-left min-w-[150px]">
                            Task
                        </th>
                        {dates.map((date) => (
                            <th
                                key={date}
                                className="border-2 border-slate-600 px-2 md:px-3 py-2 text-center min-w-[40px]"
                            >
                                {date}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td className="border-2 border-slate-600 px-3 md:px-4 py-2 font-medium min-w-[150px] hover:bg-slate-900/50 transition">
                                {task.task_name}
                            </td>
                            {dates.map((date) => (
                                <td
                                    key={date}
                                    className="border-2 border-slate-600 px-2 md:px-3 py-2 text-center min-w-[40px] hover:bg-slate-900/50 transition"
                                >
                                    <input type="checkbox" className="cursor-pointer" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
};

export default TaskTable;