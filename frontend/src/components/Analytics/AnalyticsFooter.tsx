const AnalyticsFooter = () => {
    return (
        <div className="border-2 border-slate-600 rounded-lg p-4 md:p-6 bg-slate-950/25 w-full">
            <div className="grid grid-cols-3 gap-4 md:gap-6 text-white">
                <div>
                    <h2 className="text-sm md:text-base font-semibold">Completed Tasks</h2>
                    <p className="text-xl md:text-2xl font-bold mt-1">0</p>
                </div>
                <div>
                    <h2 className="text-sm md:text-base font-semibold">Pending Tasks</h2>
                    <p className="text-xl md:text-2xl font-bold mt-1">0</p>
                </div>
                <div>
                    <h2 className="text-sm md:text-base font-semibold">Over Due Tasks</h2>
                    <p className="text-xl md:text-2xl font-bold mt-1">0</p>
                </div>
            </div>
        </div>
    )
};

export default AnalyticsFooter;