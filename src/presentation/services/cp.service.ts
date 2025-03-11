import { envs } from "../../config/plugin";

export class CPService {

    private _urlMex = 'https://api.geoapify.com/v1/postcode/search?';

    async getLocationFromCp(type: 'mx' | 'us', cp: string) {
        try {

            const resp = await fetch(`${this._urlMex}postcode=${cp}&countrycode=${type}&geometry=original&apiKey=${envs.API_KEY}`);
            const data = await resp.json();
            return data;



        } catch (error) {
            throw error;
        }
    }
}