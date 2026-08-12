import AnalyticsFooter from "../Analytics/AnalyticsFooter";
import { CurrentStreak, LongestStreak } from "../Analytics/AnalyticsHeader";
import TaskTable from "../Task Table/TaskTable";

const Dashboard = () => {
    return (
        <div className="flex-1 text-white p-4 md:p-6 flex flex-col gap-6 h-[calc(100vh-50px)] overflow-hidden">
            {/* Top: Streak Cards */}
            <div className="flex flex-row justify-evenly">
                <CurrentStreak />
                <div className="">
                    <AnalyticsFooter />
                </div>
                <LongestStreak />
            </div>

            {/* Middle: Task Table */}
            <div className="flex-1 overflow-hidden min-h-0">
                <TaskTable />
            </div>

            {/* Bottom: Analytics Footer */}

        </div>
    );
};

export default Dashboard;