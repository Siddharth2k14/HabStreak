import { Link } from "react-router-dom";

const EmailVerified = () => {
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Email Verified Successfully
                    </h1>

                    <p className="mt-3 text-slate-600">
                        Your HabStreak account has been verified.
                    </p>

                    <Link
                        to="/login"
                        className="inline-block mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
                    >
                        Go to Login
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default EmailVerified;