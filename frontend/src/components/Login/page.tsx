import React from "react";
import LoginPage from "./LoginPage";

export const Login = () => {
    const [auth, setAuth] = React.useState({
        email: "",
        password: ""
    })

    const handleLogin = (e: React.SubmitEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login submitted with email:", auth.email, "and password:", auth.password);
    }

    return (
        <LoginPage
            auth={auth}
            setAuth={setAuth}
            onLogin={handleLogin}
        />
    );
};