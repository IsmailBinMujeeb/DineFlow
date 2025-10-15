import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

function Protected({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { setEmail, setRole } = useContext(AuthContext)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}user/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access-token')}`
                    }
                });

                const user = await response.json();

                console.log(user)
                if (!user.success) {
                    setIsAuth(false);
                } else {
                    setIsAuth(true);
                    setEmail(user.user.email)
                    setRole(user.user.role)
                }
            } catch (error) {
                console.log(error);
                setIsAuth(false);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [setEmail, setRole]);

    if (isLoading) {
        return (
            <div className="dark text-zinc-50 bg-muted flex min-h-svh flex-col items-center justify-center md:p-10">
                <div className="w-full max-w-sm md:max-w-4xl">
                    <Button size="sm" variant="outline" disabled>
                        <Spinner />
                        Authorizing
                    </Button>
                </div>
            </div>
        )
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default Protected;