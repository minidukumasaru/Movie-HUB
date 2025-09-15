
import axios from "axios"

const api = axios.create({
    baseURL: process.env.EXPO_BASE_URL,
    timeout: 10000
})

api.interceptors.request.use(async(config)=>{
    //methanin headers unath add karanna puluwan req eka yanna kalin 
    return config
})

api.interceptors.response.use(async(config)=>{
    return config
})


export default api
