// import AnalyticsFooter from "../Analytics/AnalyticsFooter";
// import { CurrentStreak, LongestStreak } from "../Analytics/AnalyticsHeader";
import { TaskBoard } from "../TaskBoard/page";

const Dashboard = () => {
    return (
        <div className="flex-1 min-w-0 text-white p-4 md:p-6 flex flex-col gap-6 h-full overflow-hidden">
            {/* Middle: Task Table */}
            <div className="flex-1 overflow-hidden min-h-0">
                <TaskBoard />
            </div>

            {/* Bottom: Analytics Footer */}

        </div>
    );
};

export default Dashboard;