import { Box, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import React from "react";
import { CreateModal, type CreateModalHandle } from "../../Create Modal/CreateModal";

export const TaskBoardHeader = () => {
    const createModal = React.useRef<CreateModalHandle>(null);
    const handleOpen = () => {
        createModal.current?.open();
    };
    const handleRefreshTasks = () => {
        console.log("Reloading tasks...");
    }

  return (
    <Box className="flex flex-row justify-between m-1">
      <Box className="flex flex-col gap-1">
        <Typography variant="h4">
            Task Board
        </Typography>
        <Typography>
            Organize your tasks and track their progress
        </Typography>
      </Box>
      <Box className="w-fit h-fit">
        <Button onClick={handleOpen}>
            <Plus />
            <Typography>
                Create Task
            </Typography>
        </Button>
      </Box>
      <CreateModal ref={createModal} onSuccess={handleRefreshTasks} />
    </Box>
  );
};
