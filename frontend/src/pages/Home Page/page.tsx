import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/page";
import SideBar from "../../components/SideBar/page";

const HomePage = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-dashboard bg-no-repeat bg-center bg-cover">
      <NavBar />
      <div className="flex flex-1 flex-row min-h-0 min-w-0">
        <SideBar />
        <main className="flex flex-1 min-h-0 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
