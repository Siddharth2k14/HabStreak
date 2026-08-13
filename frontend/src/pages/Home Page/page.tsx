import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/page";
import SideBar from "../../components/SideBar/page";

const HomePage = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-dashboard bg-no-repeat bg-center bg-cover">
        <NavBar />
        <div className="flex flex-row">
            <SideBar />
            <Outlet />
        </div>
    </div>
  );
};

export default HomePage;

