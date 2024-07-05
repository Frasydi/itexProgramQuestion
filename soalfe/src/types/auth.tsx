import { UserType } from "./user";

export type AuthContextType = {
    user : UserType | null,
    login : (data : {username : string, password : string}) => Promise<{error :boolean, message : string}>,
    logout : () => void,

}