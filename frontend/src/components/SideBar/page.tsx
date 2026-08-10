import React from "react";
import { CreateModal } from "../Create Modal/CreateModal";

const SideBar = () => {
    const [createModalOpen, setCreateModalOpen] = React.useState(false)

    return (
        <>
            <div className="flex justify-center w-[350px] mt-1 h-[660px] bg-navbar text-white ml-1 text-xl">
                <ul className="flex flex-col gap-3 items-center mt-2 list-none">
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
                        <button>
                            Search Task
                        </button>
                    </li>
                </ul>
            </div>

            {createModalOpen && (
                <CreateModal onClose={() => setCreateModalOpen(false)} />
            )}
        </>
    );
};

export default SideBar;