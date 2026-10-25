import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import type { SetStateAction } from "react";
import type React from "react";
import { dateRanges, type DateRange } from "../constants";

interface HeaderProps {
    dateRange: DateRange;
    setDateRange: React.Dispatch<SetStateAction<DateRange>>;
}

const Header = ({ dateRange, setDateRange }: HeaderProps) => {
    return (
        <Box className="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/25 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <Typography variant="h4" className="text-lg font-semibold tracking-wide text-white">
            Analytics
          </Typography>
          <FormControl size="small" className="min-w-36">
            <Select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value as DateRange)
              }
              aria-label="Analytics date range"
              className="rounded-full border border-slate-700 bg-slate-800 text-xs font-medium text-slate-100 shadow-sm"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiSelect-select": { py: 1, px: 1.5, color: "#e2e8f0" },
                "& .MuiSvgIcon-root": { color: "#cbd5e1" },
                "& .MuiPaper-root": { backgroundColor: "#0f172a" },
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      bgcolor: "#0f172a",
                      color: "#e2e8f0",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.4)",
                      mt: 1,
                    },
                  },
                },
              }}
            >
              {dateRanges.map((range) => (
                <MenuItem
                  key={range.value}
                  value={range.value}
                  sx={{
                    fontSize: "0.75rem",
                    py: 1,
                    color: "#e2e8f0",
                    "&.Mui-selected": { backgroundColor: "rgba(148, 163, 184, 0.14)" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(148, 163, 184, 0.2)" },
                  }}
                >
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
    )
}

export default Header;