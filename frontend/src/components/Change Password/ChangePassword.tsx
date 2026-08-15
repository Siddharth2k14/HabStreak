import React from "react";
import type { ChangePasswordType } from "./ChangePasswordType";

const ChangePassword = () => {
    const [changePassword, setChangePassword] =
        React.useState<ChangePasswordType>({
            Username: "",
            Email: "",
            New_password: "",
            Confirm_password: "",
        });

    return (
        <div className="w-full min-h-[500px] flex justify-center p-2">

            <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/75 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-700">
                    <h2 className="text-2xl font-semibold text-white">
                        Change Password
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Update your account password.
                    </p>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-5"
                    >

                        {/* Username */}
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={changePassword.Username}
                                onChange={(e) =>
                                    setChangePassword({
                                        ...changePassword,
                                        Username: e.target.value,
                                    })
                                }
                                placeholder="Enter your username"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-700
                                    bg-slate-800
                                    px-4 py-3
                                    text-sm text-white
                                    placeholder:text-slate-500
                                    outline-none
                                    transition
                                    hover:border-slate-600
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-600/40
                                "
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={changePassword.Email}
                                onChange={(e) =>
                                    setChangePassword({
                                        ...changePassword,
                                        Email: e.target.value,
                                    })
                                }
                                placeholder="Enter your email"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-700
                                    bg-slate-800
                                    px-4 py-3
                                    text-sm text-white
                                    placeholder:text-slate-500
                                    outline-none
                                    transition
                                    hover:border-slate-600
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-600/40
                                "
                            />
                        </div>

                        {/* Password Section */}
                        <div className="border-t border-slate-800 pt-5">
                            <h3 className="text-sm font-medium text-white">
                                Password Security
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Enter your current password and choose a new one.
                            </p>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-slate-300"
                            >
                                New Password
                            </label>

                            <input
                                type="password"
                                name="new-password"
                                id="new-password"
                                value={changePassword.New_password}
                                onChange={(e) =>
                                    setChangePassword({
                                        ...changePassword,
                                        New_password: e.target.value,
                                    })
                                }
                                placeholder="Enter your new password"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-700
                                    bg-slate-800
                                    px-4 py-3
                                    text-sm text-white
                                    placeholder:text-slate-500
                                    outline-none
                                    transition
                                    hover:border-slate-600
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-600/40
                                "
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                name="confirm-password"
                                id="confirm-password"
                                value={changePassword.Confirm_password}
                                onChange={(e) =>
                                    setChangePassword({
                                        ...changePassword,
                                        Confirm_password: e.target.value,
                                    })
                                }
                                placeholder="Confirm your new password"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-700
                                    bg-slate-800
                                    px-4 py-3
                                    text-sm text-white
                                    placeholder:text-slate-500
                                    outline-none
                                    transition
                                    hover:border-slate-600
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-600/40
                                "
                            />
                        </div>

                        {/* Button */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="
                                    group
                                    flex items-center gap-2
                                    rounded-lg
                                    bg-white
                                    px-6 py-3
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    transition-all
                                    duration-200
                                    hover:bg-slate-200
                                    active:scale-[0.98]
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-slate-500
                                "
                            >
                                Change Password

                                <span className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;