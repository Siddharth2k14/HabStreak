import React from "react";
import RegisterPage from "./RegisterPage";

export const Register = () => {
    const [auth, setAuth] = React.useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) : void => {
        e.preventDefault();
        // Handle register logic here
        console.log("Register submitted with username:", auth.username, "email:", auth.email, "password:", auth.password, "confirmPassword:", auth.confirmPassword);
    }

    return (
        <RegisterPage
            auth={auth}
            setAuth={setAuth}
            onRegister={handleRegister}
        />
    );
};