import React from "react";
import type { ChangePasswordType } from "./ChangePasswordType";

const ChangePassword = () => {
    const [changePassword, setChangePassword] = React.useState<ChangePasswordType>({
        Username: "",
        Email: "",
        Current_password: "",
        New_password: "",
        Confirm_password: "",
    });

    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-16">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-16">
                    CHANGE PASSWORD
                </h1>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <label htmlFor="Username" className="text-lg md:text-xl font-medium md:w-1/3">
                            USERNAME
                        </label>
                        <input 
                            type="text"
                            name="Username"
                            id="Username"
                            value={changePassword.Username}
                            onChange={(e) => {setChangePassword({ ...changePassword, Username: e.target.value })}}
                            className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <label htmlFor="Email" className="text-lg md:text-xl font-medium md:w-1/3">
                            EMAIL
                        </label>
                        <input 
                            type="email"
                            name="Email"
                            id="Email"
                            value={changePassword.Email}
                            onChange={(e) => {setChangePassword({ ...changePassword, Email: e.target.value })}}
                            className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <label htmlFor="Current Password" className="text-lg md:text-xl font-medium md:w-1/3">
                            CURRENT PASSWORD
                        </label>
                        <input 
                            type="password"
                            name="Current Password"
                            id="Current Password"
                            value={changePassword.Current_password}
                            onChange={(e) => {setChangePassword({ ...changePassword, Current_password: e.target.value })}}
                            className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <label htmlFor="New Password" className="text-lg md:text-xl font-medium md:w-1/3">
                            NEW PASSWORD
                        </label>
                        <input 
                            type="password"
                            name="New Password"
                            id="New Password"
                            value={changePassword.New_password}
                            onChange={(e) => {setChangePassword({ ...changePassword, New_password: e.target.value })}}
                            className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <label htmlFor="Confirm Password" className="text-lg md:text-xl font-medium md:w-1/3">
                            CONFIRM PASSWORD
                        </label>
                        <input 
                            type="password"
                            name="Confirm Password"
                            id="Confirm Password"
                            value={changePassword.Confirm_password}
                            onChange={(e) => {setChangePassword({ ...changePassword, Confirm_password: e.target.value })}}
                            className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex justify-center md:justify-end pt-8">
                        <button 
                            type="submit"
                            className="px-12 py-3 bg-gray-400 text-black text-lg font-semibold rounded-full hover:bg-gray-500 transition duration-200"
                        >
                            Change It
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default ChangePassword;