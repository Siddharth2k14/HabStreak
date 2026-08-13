const LoginPage = ({ 
        auth, 
        setAuth, 
        onLogin 
    }:{ 
        auth: any; 
        setAuth: any; 
        onLogin: (e: React.SubmitEvent<HTMLFormElement>

        ) => void }) => {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{
                backgroundImage: 'var(--background-image-dashboard)'
            }}
        >
            <h1 className="text-4xl font-bold mb-8">
                LOGIN
            </h1>
            <div
                className="flex flex-col rounded-lg w-[300px] h-[300px] gap-9 p-9"
                style={{
                    backgroundColor: 'var(--color-auth-background)',
                    border: '1px solid var(--color-auth-border)'
                }}
            >
                <form className="flex flex-col gap-4 rounded-lg" onSubmit={onLogin}>
                    <label htmlFor="Email">
                        Email
                    </label>
                    <input
                        type="email"
                        name="Email"
                        value={auth.email}
                        id="Email"
                        placeholder="Enter your email"
                        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-white outline-none focus:border-blue-400"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                        onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                    />

                    <label htmlFor="Password">
                        Password
                    </label>
                    <input
                        type="password"
                        name="Password"
                        value={auth.password}
                        id="Password"
                        placeholder="Enter your password"
                        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-white outline-none focus:border-blue-400"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                        onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    />

                    <button
                        type="submit"
                        className="mt-4 rounded-full px-4 py-2 text-sm font-medium text-white"
                        style={{
                            backgroundColor: 'rgba(217, 217, 217, 0.17)'
                        }}
                    >
                        Log In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <a href="/auth/register" className="text-blue-400 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    )
};

export default LoginPage;
