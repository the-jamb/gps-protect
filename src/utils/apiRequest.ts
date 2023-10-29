import axios, { AxiosRequestConfig } from "axios";

export default class ApiRequest {
    sendRequest = async (url: string, method: string = "POST", body: any, auth: string, callback: (data: any) => void, fail: (error: any) => void) => {
        let config: AxiosRequestConfig<any> = {
            url: url,
            method: method,
            headers: {'Content-Type': 'application/json', "Authorization": `Bearer ${auth}`}
        };

        if(method === "GET") {
            config.params = body;
        } else {
            config.data = body;
        }

        axios(config).then( response => {
            if(!response || !response.data || response.data.error){
                if(response.data.error){
                    return fail(response.data.error);
                }

                return fail("Something went wrong");
            }

            callback(response.data);
        }).catch(error => {
            return fail(error);
        });
    }
}