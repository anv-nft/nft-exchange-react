import axios from 'axios';
import {showLoader, hideLoader} from '../store/actions/loader';
import {store} from '../store';
import {isTestNet} from "../utils/web3/networks";


export const MAIN_URL = isTestNet ? 'http://localhost:4000' : 'http://13.124.212.202:4000';
// export const MAIN_URL = 'http://localhost:4000'
//

// export const MAIN_URL = API_URL

const axiosInstance = axios.create({
    baseURL: MAIN_URL
});

export function GET(url) {
    return new Promise((resolve, reject) => {
        store.dispatch(showLoader());
        axiosInstance.get(url)
            .then(response => {
                resolve(response.data);
            }).catch(error => {
            reject(error);
        }).finally(() => {
            store.dispatch(hideLoader());
        });
    });
}

export function POST(url, data) {
    return new Promise((resolve, reject) => {
        store.dispatch(showLoader());
        axiosInstance.post(url, data)
            .then(response => {
                resolve(response.data);
            }).catch(error => {
            reject(error);
        }).finally(() => {
            store.dispatch(hideLoader());
        });
    });
}
