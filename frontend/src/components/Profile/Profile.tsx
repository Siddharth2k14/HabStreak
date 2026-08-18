import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            if (token && refreshToken) {
                await axios.post(
                    `${backendUrl}/api/auth/logout`,
                    { refreshToken },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            toast.success("Logged out successfully");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Logout failed. Please try again.");
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/auth/login", { replace: true });
        }
    };

    return (
        <>
            <div className="absolute right-0 w-25 rounded-lg border border-gray-200 bg-navbar shadow-lg z-50 mt-11">

                <div>
                    <button
                        onClick={() => navigate('/profile-page')}
                        className="w-full px-4 py-2 text-left text-lg text-white hover:bg-gray-100 hover:text-gray-900"
                    >
                        Profile
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full px-4 py-2 text-left text-lg text-white hover:bg-gray-100 hover:text-gray-900"
                    >
                        Settings
                    </button>
                </div>

                <div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        Log Out
                    </button>
                </div>

            </div>
        </>
    );
};

export default Profile;
