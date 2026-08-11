import NavBar from "../../components/NavBar/page"
import SideBar from "../../components/SideBar/page"
import TaskTable from "../../components/Task Table/TaskTable"

const HomePage = () => {
  return (
    <div className="h-screen w-screen flex flex-col scrollbar-none overflow-hidden">
        <NavBar />
        <div className="flex flex-1 overflow-hidden">
            <SideBar />
            <TaskTable />
        </div>
    </div>
  )
}

export default HomePage
