import { createContext } from "react";
import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType>({
    login : async() => ({message : "Oke", error : false}),
    logout : async() => {},
    user : null
})

export default AuthContext