import { Route, Routes } from "react-router-dom"
import { LoginPage } from "../../components/Login/page"
import { RegisterPage } from "../../components/Register/page"

export const Authentication = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    )
}