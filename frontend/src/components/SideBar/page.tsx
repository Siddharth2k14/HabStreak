import React from "react";
import { CreateModal, type CreateModalHandle } from "../Create Modal/CreateModal";
import { SearchModal } from "../Search Modal/SearchModal";
import { useNavigate } from "react-router-dom";

// const routeParams = {
//     "dashboard": {
//         "link": "/dashboard",
//         "title": "Dashboard",
//     },
//     "taskboard": {
//         "link": "/task-board",
//         "title": "Task Board",
//     },
//     "allTasks": {
//         "link": "/all-tasks",
//         "title": "All Tasks",
//     },
//     "analytics": {
//         "link": "/analytics",
//         "title": "Analytics",
//     }
// };

const routeParams = [
    {
        key: "dashboard",
        link: "dashboard",
        title: "Dashboard",
    },
    {
        key: "taskboard",
        link: "task-board",
        title: "Task Board",
    },
    {
        key: "allTasks",
        link: "all-tasks",
        title: "All Tasks",
    },
    {
        key: "analytics",
        link: "analytics",
        title: "Analytics",
    }
];

const SideBar = () => {
    const createModal = React.useRef<CreateModalHandle>(null);
    const [searchModalOpen, setSearchModalOpen] = React.useState(false);
    const navigate = useNavigate();

    return (
        <>
            <aside className="border-2 border-slate-600 rounded-lg flex justify-center w-[200px] h-[calc(100%-0.5rem)] my-1 ml-1 shrink-0 bg-navbar text-white text-xl">
                <ul className="flex flex-col items-center gap-3 mt-2 list-none">
                    {routeParams.map((item) => (
                        <li key={item.key} className="w-full text-center">
                            <button onClick={() => navigate(`/home-page/${item.link}`)}>
                                {item.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <CreateModal ref={createModal} />
            {searchModalOpen && <SearchModal onClose={() => setSearchModalOpen(!searchModalOpen)} />}
        </>
    );
};

export default SideBar;