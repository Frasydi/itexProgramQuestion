import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { UserType } from "../types/user";
import axios from "axios"
import apifetch from "../util/axios";
import AuthContext from "../provider/auth";
export default function Layout() {
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)
    const rout = useNavigate()
    const loc = useLocation()

    async function auth() {
        try {
            const feting = await apifetch.get("/auth")
            if (feting.status >= 400) {
                if (!["/login"].includes(loc.pathname)) {
                    rout("/login")
                }
                return
            }

            setUser(feting.data)
            console.log(feting.data)

            if(/^\/admin*$/i.test(loc.pathname) == false) {
                if (feting.data.role == 99) {
                    rout("/admin")
                } 
            } else {
                
                if (feting.data.role != 99) {
                    rout("/")
                } 
            }
            
            if (loc.pathname == "/login") {
                if (feting.data.role == 99) {
                    rout("/admin")
                } else {
                    rout("/")
                }
            }
        } catch (err) {
            rout("/login")
        }
    }

    async function login(data: { username: string, password: string }) {
        try {
            const feting = await apifetch.post("/login", {
                ...data
            })

            if (feting.status >= 400) {
                return {
                    message: feting.data.message,
                    error: true
                }
            }

            setUser(feting.data)



            if (feting.data.role == 99) {
                rout("/admin")
            } else {
                rout("/")
            }


            return {
                message: "Berhasil Login",
                error: false
            }
        } catch (err) {
            return {
                message: "Ada Masalah",
                error: true
            }
        }
    }

    async function logout() {
        try {
            rout("/login")
            await apifetch.delete("/logout")

        } catch (err) {
            rout("/")
        }
    }

    useEffect(() => {
        auth()
    }, [])


    return (
        <AuthContext.Provider value={{
            login: login,
            logout: logout,
            user: user

        }}>
            <Outlet />

        </AuthContext.Provider>
    )
}