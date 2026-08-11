import React from "react";
import profileImg from "../../assets/ProfileImg.jpg";

const NavBar = () => {
    const [profileClicked, setProfileClicked] = React.useState(false);
    return (
        <>
            <div
                className="relative flex flex-row justify-between m-1 p-1 bg-navbar text-white w-[1270px] h-[35px] items-center"
            > {/* -> NavBar box */}
                <div> {/* -> App Name box */}
                    <h1
                        className="text-xl font-bold"
                    >
                        HabStreak
                    </h1>
                </div>
                <div> {/*-> Notifications box*/}
                    <button className="text-xl">
                        Notifications
                    </button>
                </div>
                <div
                    className="flex flex-row justify-between gap-10"
                > {/* -> Profile Box */}
                    <div
                        className="flex flex-row justify-between gap-2 items-center relative"
                    > {/* -> Profile Img Box */}
                        <div>
                            <img src="src/assets/ProfileImg.jpg" height={30} width={30} className="rounded-full object-cover" />
                        </div>
                        <div>
                            <button onClick={() => setProfileClicked(!profileClicked)} className="text-xl">
                                Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {
                profileClicked && (
                    <div className="absolute right-0 w-25 rounded-lg border border-gray-200 bg-navbar shadow-lg z-50">

                        <div>
                            <button
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
                )
            }
        </>
    )
};

export default NavBar;