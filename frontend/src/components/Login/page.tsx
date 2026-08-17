import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoginPage from "./LoginPage";

export const Login = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = React.useState({
        email: "",
        password: ""
    })

    const backend_Url = import.meta.env.VITE_BACKEND_URL;

    const validateForm = (): boolean => {
        if (!auth.email || !auth.password) {
            toast.error("Please fill all the fields");
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(auth.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (auth.password.length < 6 || auth.password.length > 10) {
            toast.error("Password must be between 6 and 10 characters");
            return false;
        }

        return true;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            await axios.post(
                `${backend_Url}/api/auth/login`,
                auth,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const token = response.data.token || response.data.accessToken;
            if (token) {
                localStorage.setItem("token", token);
            }
            toast.success("Login successful");
            navigate("/home-page");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.message === "Too many login attempts. Please try again later.") {
                    toast.error("Too many login attempts. Please try again later.");
                }
                console.error("Axios Error:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("Unknown Error:", error);
            }
        }
    }

    return (
        <LoginPage
            auth={auth}
            setAuth={setAuth}
            onLogin={handleLogin}
        />
    );
};