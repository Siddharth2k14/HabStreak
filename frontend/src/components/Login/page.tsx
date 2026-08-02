import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoginPage from "./LoginPage";

export const Login = () => {
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
            const response = await axios.post(
                `${backend_Url}/api/auth/login`,
                auth,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Login successful:", response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
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