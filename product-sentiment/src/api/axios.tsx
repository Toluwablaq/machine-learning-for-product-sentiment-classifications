import axios from "axios";


export const axiosWithoutToken = axios.create({
    baseURL: "https://fc-rikkos.onrender.com/api/v1/",
    headers: {
        "Content-Type": "application/json"
    },
})