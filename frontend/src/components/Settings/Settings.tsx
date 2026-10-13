import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex items-center justify-center p-6">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/50 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-700">
                    <h2 className="text-2xl font-semibold text-white">
                        Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Manage your account and dashboard preferences.
                    </p>
                </div>

                {/* Settings List */}
                <div className="p-4">

                    {/* Change Password */}
                    <button
                        className="
                            group w-full flex items-center justify-between
                            rounded-xl px-4 py-4
                            text-left
                            transition-all duration-200
                            hover:bg-slate-800
                            focus:outline-none
                            focus:ring-2 focus:ring-slate-500
                        "

                        onClick={() => navigate('/change-password')}
                    >
                        <div>
                            <h3 className="text-base font-medium text-white">
                                Change Password
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Update your account password.
                            </p>
                        </div>

                        <span className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white">
                            →
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="mx-4 border-t border-slate-800" />

                    {/* Change Background */}
                    <button
                        className="
                            group w-full flex items-center justify-between
                            rounded-xl px-4 py-4
                            text-left
                            transition-all duration-200
                            hover:bg-slate-800
                            focus:outline-none
                            focus:ring-2 focus:ring-slate-500
                        "
                        onClick={() => navigate("/change-background")}
                    >
                        <div>
                            <h3 className="text-base font-medium text-white">
                                Change Background
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Customize your dashboard background image.
                            </p>
                        </div>

                        <span className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white">
                            →
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Settings;