import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import axios from "axios";
import toast from "react-hot-toast";

export const Register = () => {
    const [auth, setAuth] = React.useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const navigate = useNavigate();

    const backend_Url = import.meta.env.VITE_BACKEND_URL;

    const validateForm = (): boolean => {
        if (!auth.username || !auth.email || !auth.password || !auth.confirmPassword) {
            toast.error("Please fill all the fields");
            return false;
        }

        if (auth.username.length < 3 || auth.username.length > 15) {
            toast.error("Username must be between 3 and 15 characters");
            return false;
        }

        if (!/^[a-zA-Z0-9]+$/.test(auth.username)) {
            toast.error("Username can only contain letters and numbers");
            return false;
        }

        if(!/^[0-9]+$/.test(auth.password)) {
            toast.error("Password can only contain numbers");
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

        if ((auth.password !== auth.confirmPassword) && (auth.password.length === auth.confirmPassword.length)) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        // Handle register logic here
        try {
            await axios.post(
                `${backend_Url}/api/auth/register`,
                {
                    username: auth.username,
                    email: auth.email,
                    password: auth.password,
                    confirmPassword: auth.confirmPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // console.log("Registration successful:", data);
            toast.success("Registration successful.");
            navigate("/auth/login");

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.message === "Email is already registered.") {
                    toast.error("Email is already registered.");
                }
                console.error("Axios Error:", error.response?.data);
            } else if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("Unknown Error:", error);
            }
        }
    }

    return (
        <RegisterPage
            auth={auth}
            setAuth={setAuth}
            onRegister={handleRegister}
        />
    );
};