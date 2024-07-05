import axios from "axios";

const apifetch = axios.create({
    baseURL :"/api",
    validateStatus : (status) => status <= 500
})
export default apifetch
