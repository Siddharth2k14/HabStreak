import React from "react";
import { CreateModal, type CreateModalHandle } from "../Create Modal/CreateModal";
import { SearchModal } from "../Search Modal/SearchModal";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const createModal = React.useRef<CreateModalHandle>(null);
    const [searchModalOpen, setSearchModalOpen] = React.useState(false);
    const navigate = useNavigate();

    return (
        <>
            <aside className="border-2 border-slate-600 rounded-lg flex justify-center w-[200px] h-[calc(100vh-50px)] mt-1 ml-1 bg-navbar text-white text-xl">
                <ul className="flex flex-col items-center gap-3 mt-2 list-none">
                    <li>
                        <button onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </button>
                    </li>

                    <li>
                        <button onClick={() => createModal.current?.open()}>
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

            <CreateModal ref={createModal} />
            {searchModalOpen && <SearchModal onClose={() => setSearchModalOpen(!searchModalOpen)} />}
        </>
    );
};

export default SideBar;