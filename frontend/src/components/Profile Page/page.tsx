import ProfileImg from "../../assets/ProfileImg.jpg";

const ProfilePage = () => {
    const today = new Date();

    const activityDays = Array.from({ length: 365 }, (_, index) => {
        const date = new Date(today);

        date.setDate(today.getDate() - (364 - index));

        return date;
    });

    const firstDay = activityDays[0];

    const startDay = firstDay.getDay();

    // Convert Sunday = 0 to Monday = 0
    const mondayOffset = startDay === 0 ? 6 : startDay - 1;

    // Add empty cells before the first date
    const paddedDays = [
        ...Array.from({ length: mondayOffset }, () => null),
        ...activityDays,
    ];

    // Split into weeks
    const weeks: (Date | null)[][] = [];

    for (let i = 0; i < paddedDays.length; i += 7) {
        weeks.push(paddedDays.slice(i, i + 7));
    }

    // Month labels
    const monthLabels = weeks
        .map((week, weekIndex) => {
            const firstDate = week.find((date) => date !== null);

            if (!firstDate) {
                return null;
            }

            return {
                month: firstDate.toLocaleString("en-US", {
                    month: "short",
                }),
                weekIndex,
            };
        })
        .filter(
            (
                item,
                index,
                array
            ) =>
                item &&
                (
                    index === 0 ||
                    item.month !== array[index - 1]?.month
                )
        );

    return (
        <div className="flex-1 w-full min-w-0 min-h-[calc(100vh-50px)] p-3 md:p-2 text-white flex flex-col gap-2 overflow-auto scrollbar-none">

            {/* ================= USER PROFILE ================= */}
            <div className="w-full border border-slate-600 rounded-lg bg-slate-950/25 p-4 md:p-5">
                <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">

                    {/* Profile Information */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start flex-1 min-w-0">

                        {/* Profile Image */}
                        <div className="w-20 h-20 rounded-full border-2 border-slate-600 flex-shrink-0 overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={ProfileImg}
                                alt="Profile"
                            />
                        </div>

                        {/* User Details */}
                        <div className="flex flex-col text-center sm:text-left gap-2 mt-1 min-w-0">

                            <div className="flex items-center gap-4">
                                <p className="w-16 text-sm text-gray-600">
                                    USERNAME
                                </p>

                                <h2 className="text-sm font-semibold truncate">
                                    John Doe
                                </h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <p className="w-16 text-sm text-gray-600">
                                    EMAIL
                                </p>

                                <h2 className="text-sm truncate">
                                    john@example.com
                                </h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <p className="w-16 text-sm text-gray-600">
                                    BIO
                                </p>

                                <h2 className="text-sm truncate">
                                    Full-stack Developer
                                </h2>
                            </div>

                        </div>
                    </div>

                    {/* ================= TASK PROGRESS ================= */}
                    <div className="flex items-center gap-4">

                        {/* Circular Progress */}
                        <div className="w-[120px] h-[120px] relative flex-shrink-0">

                            <svg
                                className="w-full h-full -rotate-90"
                                viewBox="0 0 120 120"
                            >

                                {/* Background */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth="3"
                                />

                                {/* Completed */}
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

                                {/* Pending */}
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

                                {/* Overdue */}
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

                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center text-center">
                                <div>
                                    <p className="text-[10px] text-gray-400">
                                        Total Tasks
                                    </p>

                                    <p className="text-xl font-bold">
                                        32
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-1.5 text-xs">

                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                <span>Completed</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                <span>Pending</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span>Overdue</span>
                            </div>

                        </div>

                    </div>

                </div>
            </div>


            {/* ================= LINE GRAPH ================= */}
            <div className="w-full min-h-[190px] border border-slate-600 rounded-lg bg-slate-950/25 p-4">

                <h3 className="text-base font-semibold mb-3">
                    Task Progress Over Time
                </h3>

                <div className="w-full h-[135px] bg-slate-950/30 rounded-lg">

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
                            strokeWidth="3"
                        />

                        {/* X Axis */}
                        <line
                            x1="0"
                            y1="270"
                            x2="1000"
                            y2="270"
                            stroke="#1e293b"
                            strokeWidth="3"
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
                            stroke="#10b981"
                            strokeWidth="4"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                    </svg>

                </div>
            </div>


            {/* ================= STREAK GRAPH ================= */}
            <div className="w-full min-h-[250px] border border-slate-600 rounded-lg bg-slate-950/25 p-4">

                <h3 className="text-base font-semibold mb-3">
                    Streak Activity
                </h3>

                <div className="w-full overflow-x-auto scrollbar-none">

                    <div className="min-w-max">

                        {/* ================= MONTH LABELS ================= */}
                        <div className="flex ml-[38px] h-6">

                            {weeks.map((_, weekIndex) => {

                                const label = monthLabels.find(
                                    (item) =>
                                        item?.weekIndex === weekIndex
                                );

                                return (
                                    <div
                                        key={weekIndex}
                                        className="w-[18px] mr-[4px] shrink-0 relative"
                                    >
                                        {label && (
                                            <span className="absolute left-0 text-[10px] text-gray-300 whitespace-nowrap">
                                                {label.month}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}

                        </div>


                        {/* ================= GRAPH ================= */}
                        <div className="flex">

                            {/* Weekday Labels */}
                            <div className="w-[38px] shrink-0 flex flex-col justify-between h-[142px] pr-2">

                                <span className="text-[10px] text-gray-400">
                                    Sun
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    Mon
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    Tue
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    Wed
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    Thu
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    Fri
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    Sat
                                </span>

                            </div>


                            {/* ================= ACTIVITY GRID ================= */}
                            <div className="flex gap-[4px]">

                                {weeks.map((week, weekIndex) => (

                                    <div
                                        key={weekIndex}
                                        className="flex flex-col gap-[4px]"
                                    >

                                        {Array.from({ length: 7 }).map(
                                            (_, dayIndex) => {

                                                const date =
                                                    week[dayIndex];

                                                if (!date) {
                                                    return (
                                                        <div
                                                            key={dayIndex}
                                                            className="w-[14px] h-[14px]"
                                                        />
                                                    );
                                                }

                                                /*
                                                 * Temporary activity value.
                                                 * Replace this with your actual
                                                 * task completion count later.
                                                 */
                                                const activity =
                                                    (
                                                        date.getDate() +
                                                        date.getMonth() +
                                                        dayIndex
                                                    ) % 6;

                                                let activityClass =
                                                    "bg-slate-700";

                                                switch (activity) {
                                                    case 1:
                                                        activityClass =
                                                            "bg-green-900";
                                                        break;

                                                    case 2:
                                                        activityClass =
                                                            "bg-green-800";
                                                        break;

                                                    case 3:
                                                        activityClass =
                                                            "bg-green-600";
                                                        break;

                                                    case 4:
                                                        activityClass =
                                                            "bg-green-500";
                                                        break;

                                                    case 5:
                                                        activityClass =
                                                            "bg-green-300";
                                                        break;

                                                    default:
                                                        activityClass =
                                                            "bg-slate-700";
                                                }

                                                return (
                                                    <div
                                                        key={date.toISOString()}
                                                        title={`${date.toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )} — ${activity} completed`}
                                                        className={`
                                                w-[14px]
                                                h-[14px]
                                                shrink-0
                                                rounded-[3px]
                                                ${activityClass}
                                            `}
                                                    />
                                                );
                                            }
                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* ================= LEGEND ================= */}
                        <div className="flex justify-end items-center gap-1.5 mt-4">

                            <span className="text-[10px] text-gray-400 mr-1">
                                Less
                            </span>

                            <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-700" />

                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-900" />

                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-800" />

                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-600" />

                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-500" />

                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-300" />

                            <span className="text-[10px] text-gray-400 ml-1">
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