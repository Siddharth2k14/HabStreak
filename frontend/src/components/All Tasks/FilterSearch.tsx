import { Box, FormControl, MenuItem, Select } from "@mui/material";
import type { SetStateAction } from "react";
import type React from "react";
import { sortOptions } from "./types/allTasks.types.ts";
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
} from "./types/allTasks.types";

interface FilterSearchProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
  statusFilter: StatusFilter;
  setStatusFilter: React.Dispatch<SetStateAction<StatusFilter>>;
  priorityFilter: PriorityFilter;
  setPriorityFilter: React.Dispatch<SetStateAction<PriorityFilter>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<SetStateAction<SortOption>>;
}

const FilterSearch = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
}: FilterSearchProps) => {
  return (
    <Box className="mb-4 flex flex-col gap-3">
      <Box
        sx={{
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          border: "1px solid rgba(148, 163, 184, 0.8)",
          borderRadius: "10px",
          px: 2,
          py: 1.25,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <input
          placeholder="Search Tasks..."
          aria-label="Search tasks"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e2e8f0",
            fontSize: "1rem",
          }}
        />
      </Box>

      <Box className="flex flex-wrap gap-3">
        <FormControl size="small" sx={{ minWidth: 145 }}>
          <Select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            displayEmpty
            inputProps={{ "aria-label": "Filter by status" }}
            sx={{
              borderRadius: 999,
              color: "#e2e8f0",
              backgroundColor: "rgba(15, 23, 42, 0.2)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(148, 163, 184, 0.7)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cbd5e1",
              },
              "& .MuiSvgIcon-root": { color: "#e2e8f0" },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: {
                    bgcolor: "#0f172a",
                    color: "#e2e8f0",
                    "& .MuiMenuItem-root:hover": {
                      bgcolor: "rgba(148, 163, 184, 0.15)",
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="DOING">Doing</MenuItem>
            <MenuItem value="IN_REVIEW">In Review</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 145 }}>
          <Select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as PriorityFilter)
            }
            displayEmpty
            inputProps={{ "aria-label": "Filter by priority" }}
            sx={{
              borderRadius: 999,
              color: "#e2e8f0",
              backgroundColor: "rgba(15, 23, 42, 0.2)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(148, 163, 184, 0.7)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cbd5e1",
              },
              "& .MuiSvgIcon-root": { color: "#e2e8f0" },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: {
                    bgcolor: "#0f172a",
                    color: "#e2e8f0",
                    "& .MuiMenuItem-root:hover": {
                      bgcolor: "rgba(148, 163, 184, 0.15)",
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="ALL">All Priority</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            inputProps={{ "aria-label": "Sort tasks" }}
            sx={{
              borderRadius: 999,
              color: "#e2e8f0",
              backgroundColor: "rgba(15, 23, 42, 0.2)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(148, 163, 184, 0.7)",
              },
              "& .MuiSvgIcon-root": { color: "#e2e8f0" },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: { bgcolor: "#0f172a", color: "#e2e8f0" },
                },
              },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default FilterSearch;
