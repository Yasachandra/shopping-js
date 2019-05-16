import axios from 'axios';

export default class {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const api = 'https://www.food2fork.com/api/search';
            const key = 'edb35be307a43e2424b0855a6c4108fe';
            const res = await axios(`${api}?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch(err) {
            alert(err);
        }
    }
}