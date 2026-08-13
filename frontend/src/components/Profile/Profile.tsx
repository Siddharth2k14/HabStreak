import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
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
                        className="w-full px-4 py-2 text-left text-lg text-white hover:bg-gray-100 hover:text-gray-900"
                    >
                        Settings
                    </button>
                </div>

                <div>
                    <button
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