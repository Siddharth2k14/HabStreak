import React from "react";
import Profile from "../Profile/Profile";

const NavBar = () => {
    const [profileClicked, setProfileClicked] = React.useState(false);
    return (
        <>
            <div
                className="border-2 border-slate-600 rounded-lg relative flex flex-row justify-between m-1 p-1 bg-navbar text-white w-[1270px] h-[35px] items-center"
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
                profileClicked && (<Profile />)
            }
        </>
    )
};

export default NavBar;