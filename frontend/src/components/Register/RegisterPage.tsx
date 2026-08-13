const RegisterPage = ({
    auth,
    setAuth,
    onRegister
}: {
    auth: any;
    setAuth: any;
    onRegister: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) => {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{
                backgroundImage: 'var(--background-image-dashboard)'
            }}
        >
            <h1 className="text-4xl font-bold mb-8">
                REGISTER
            </h1>
            <div
                className="flex flex-col rounded-lg w-full max-w-md gap-6 p-9"
                style={{
                    backgroundColor: 'var(--color-auth-background)',
                    border: '1px solid var(--color-auth-border)'
                }}
            >
                <form className="flex flex-col gap-4 rounded-lg" onSubmit={onRegister}>
                    <label htmlFor="username" className="text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={auth.username}
                        placeholder="Enter your username"
                        className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                        onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                    />

                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={auth.email}
                        placeholder="Enter your email"
                        className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                        onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                    />

                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={auth.password}
                        placeholder="Enter your password"
                        className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                        onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    />

                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={auth.confirmPassword}
                        placeholder="Confirm your password"
                        className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                        onChange={(e) => setAuth({ ...auth, confirmPassword: e.target.value })}
                    />

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-full px-4 py-3 text-sm font-medium text-white"
                        style={{ backgroundColor: 'rgba(217, 217, 217, 0.17)' }}
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
};

export default RegisterPage
