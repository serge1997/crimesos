import axios from "axios";

export class Api {

    async get(url, params = {}){
        return await axios.get('url')
    }

    async post(url, data, params = null){
        return await axios.post(url, data);
    }
}