import { Route, Routes } from "react-router-dom"
import { Login } from "../../components/Login/page"
import { Register } from "../../components/Register/page"

export const Authentication = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}