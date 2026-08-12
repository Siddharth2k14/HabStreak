import React from "react";
import { CreateModal } from "../Create Modal/CreateModal";
import { SearchModal } from "../Search Modal/SearchModal";

const SideBar = () => {
    const [createModalOpen, setCreateModalOpen] = React.useState(false);
    const [searchModalOpen, setSearchModalOpen] = React.useState(false);

    return (
        <>
            <aside className="border-2 border-slate-600 rounded-lg flex justify-center w-[200px] h-[calc(100vh-50px)] mt-1 ml-1 bg-navbar text-white text-xl">
                <ul className="flex flex-col items-center gap-3 mt-2 list-none">
                    <li>
                        <button>
                            Dashboard
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setCreateModalOpen(!createModalOpen)}
                        >
                            Create Task
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setSearchModalOpen(!searchModalOpen)}
                        >
                            Search Task
                        </button>
                    </li>
                </ul>
            </aside>

            {createModalOpen && <CreateModal onClose={() => setCreateModalOpen(!createModalOpen)} />}
            {searchModalOpen && <SearchModal onClose={() => setSearchModalOpen(!searchModalOpen)} />}
        </>
    );
};

export default SideBar;