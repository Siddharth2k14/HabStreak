const ProfilePage = () => {
    return (
        <div className="w-full min-h-[calc(100vh-50px)] p-4 md:p-6 bg-slate-950 text-white flex flex-col gap-6 overflow-auto scrollbar-none">

            {/* User Detail and Stats Section */}
            <div className="w-full border-2 border-slate-600 rounded-lg bg-slate-950 p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

                    {/* Profile Picture and Info */}
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start flex-1">
                        <div className="w-40 h-40 rounded-full border-4 border-slate-600 flex-shrink-0 overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src="src/assets/ProfileImg.jpg"
                                alt="Profile"
                            />
                        </div>

                        <div className="flex flex-col text-center md:text-left gap-2 mt-8">
                            <div className="flex flex-row gap-10">
                                <p className="text-xl text-gray-400">USERNAME</p>
                                <h2 className="text-2xl font-bold">John Doe</h2>
                            </div>
                            <div className="flex flex-row gap-10">
                                <p className="text-xl text-gray-400">EMAIL</p>
                                <h2 className="text-xl">john@example.com</h2>
                            </div>
                            <div className="flex flex-row gap-10">
                                <p className="text-xl text-gray-400">BIO</p>
                                <h2 className="text-lg">Full-stack Developer</h2>
                            </div>
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-48 h-48 relative">
                            <svg
                                className="w-full h-full transform -rotate-90"
                                viewBox="0 0 120 120"
                            >
                                {/* Background circle */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth="3"
                                />

                                {/* Completed Tasks - Green */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="4"
                                    strokeDasharray="94.25 314.16"
                                    strokeDashoffset="0"
                                    strokeLinecap="butt"
                                />

                                {/* Pending Tasks - Yellow */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="4"
                                    strokeDasharray="94.25 314.16"
                                    strokeDashoffset="-104.72"
                                    strokeLinecap="butt"
                                />

                                {/* Over Due Tasks - Red */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="4"
                                    strokeDasharray="94.25 314.16"
                                    strokeDashoffset="-209.44"
                                    strokeLinecap="butt"
                                />
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center text-center">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Total Tasks
                                    </p>
                                    <p className="text-2xl font-bold">
                                        32
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Completed Tasks</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span>Pending Tasks</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span>Over Due Tasks</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Graph Section */}
            <div className="w-full min-h-[320px] border-2 border-slate-600 rounded-lg bg-slate-950 p-6">
                <h3 className="text-xl font-semibold mb-4">
                    Task Progress Over Time
                </h3>

                <div className="w-full h-80 bg-slate-950 rounded-lg">
                    <svg
                        viewBox="0 0 1000 280"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                    >
                        {/* Y Axis */}
                        <line
                            x1="0"
                            y1="10"
                            x2="0"
                            y2="270"
                            stroke="#1e293b"
                            strokeWidth="5"
                        />

                        {/* X Axis */}
                        <line
                            x1="0"
                            y1="270"
                            x2="1000"
                            y2="270"
                            stroke="#1e293b"
                            strokeWidth="5"
                        />

                        {/* Progress Line */}
                        <polyline
                            points="
                    0,270
                    100,170
                    170,170
                    260,100
                    365,100
                    445,170
                    535,135
                    640,170
                    740,45
                    840,220
                    895,220
                    1000,100
                "
                            fill="none"
                            stroke="#422a20"
                            strokeWidth="4"
                            strokeLinejoin="miter"
                            strokeLinecap="square"
                        />
                    </svg>
                </div>
            </div>

            {/* Streak Graph Section */}
            <div className="w-full min-h-[260px] border-2 border-slate-600 rounded-lg bg-slate-950 p-6">
                <h3 className="text-xl font-semibold mb-4">
                    Streak Activity
                </h3>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-[1100px]">

                        {/* Month Labels */}
                        <div className="ml-[54px] flex justify-between mb-3 pr-4">
                            {[
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                                "Jan",
                                "Feb",
                                "Mar",
                            ].map((month) => (
                                <span
                                    key={month}
                                    className="text-lg text-gray-200"
                                >
                                    {month}
                                </span>
                            ))}
                        </div>

                        <div className="flex">

                            {/* Weekday Labels */}
                            <div className="w-[42px] shrink-0 flex flex-col justify-between py-[3px] h-[200px]">
                                <span className="text-sm text-gray-200"></span>
                                <span className="text-sm text-gray-200">Mon</span>
                                <span className="text-sm text-gray-200"></span>
                                <span className="text-sm text-gray-200">Wed</span>
                                <span className="text-sm text-gray-200"></span>
                                <span className="text-sm text-gray-200">Fri</span>
                                <span className="text-sm text-gray-200"></span>
                            </div>

                            {/* Activity Grid */}
                            <div className="flex flex-col gap-[8px] flex-1">

                                {Array.from({ length: 7 }).map((_, row) => (
                                    <div
                                        key={row}
                                        className="flex gap-[8px]"
                                    >
                                        {Array.from({ length: 40 }).map((_, column) => {

                                            const active =
                                                (row === 1 && column % 7 === 0) ||
                                                (row === 2 && column % 11 === 0) ||
                                                (row === 3 && column % 5 === 0) ||
                                                (row === 4 && column % 8 === 0) ||
                                                (row === 5 && column % 6 === 0) ||
                                                (row === 6 && column % 9 === 0);

                                            const intensity =
                                                (column + row) % 5;

                                            return (
                                                <div
                                                    key={`${row}-${column}`}
                                                    className={`
                                            w-[20px]
                                            h-[20px]
                                            shrink-0
                                            rounded-[4px]
                                            ${active
                                                            ? intensity === 0
                                                                ? "bg-green-300"
                                                                : intensity === 1
                                                                    ? "bg-green-400"
                                                                    : intensity === 2
                                                                        ? "bg-green-500"
                                                                        : "bg-green-600"
                                                            : "bg-slate-200"
                                                        }
                                        `}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-end items-center gap-2 mt-7">

                            <span className="text-sm text-gray-400 mr-1">
                                Less
                            </span>

                            <div className="w-5 h-5 rounded-[4px] bg-slate-200" />

                            <div className="w-5 h-5 rounded-[4px] bg-green-800" />

                            <div className="w-5 h-5 rounded-[4px] bg-green-600" />

                            <div className="w-5 h-5 rounded-[4px] bg-green-500" />

                            <div className="w-5 h-5 rounded-[4px] bg-green-400" />

                            <div className="w-5 h-5 rounded-[4px] bg-green-300" />

                            <span className="text-sm text-gray-400 ml-1">
                                More
                            </span>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;