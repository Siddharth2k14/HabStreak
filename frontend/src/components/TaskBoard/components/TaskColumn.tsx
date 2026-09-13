import { Box, Typography } from "@mui/material";

import {
    useDroppable,
} from "@dnd-kit/core";

import type {
    Task,
    TaskStatus,
} from "../types/task.types";

import TaskCard from "./TaskCard";


interface TaskColumnProps {

    status: TaskStatus;

    tasks: Task[];
}


export const TaskColumn = ({
    status,
    tasks,
}: TaskColumnProps) => {

    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: status,
    });


    const columnTitle = {

        TODO: "TODO",

        DOING: "DOING",

        IN_REVIEW: "IN REVIEW",

        DONE: "DONE",
    };


    return (

        <Box
            className="
                flex
                flex-col
                min-w-[300px]
                w-full
                bg-slate-950
                rounded-xl
                p-4
            "
        >

            {/* COLUMN HEADER */}

            <Box
                className="
                    flex
                    justify-between
                    items-center
                    mb-4
                "
            >

                <Typography
                    className="
                        text-white
                        font-semibold
                    "
                >
                    {columnTitle[status]}
                </Typography>


                <Typography
                    className="
                        text-slate-400
                    "
                >
                    {tasks.length}
                </Typography>

            </Box>


            {/* TASK CONTAINER */}

            <Box
                ref={setNodeRef}
                className={`
                    flex
                    flex-col
                    gap-3
                    min-h-[500px]
                    rounded-lg
                    transition
                    ${
                        isOver
                            ? "bg-slate-800"
                            : ""
                    }
                `}
            >

                {tasks.length > 0 ? (

                    tasks.map((task) => (

                        <TaskCard
                            key={task.id}
                            task={task}
                        />

                    ))

                ) : (

                    <Box
                        className="
                            flex
                            items-center
                            justify-center
                            min-h-[150px]
                            border
                            border-dashed
                            border-slate-700
                            rounded-lg
                        "
                    >

                        <Typography
                            className="
                                text-slate-500
                            "
                        >
                            Drop task here
                        </Typography>

                    </Box>

                )}

            </Box>

        </Box>
    );
};