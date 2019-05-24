import axios from 'axios';
import { key, api } from "../config";

export default class {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${api}/get?key=${key}&rId=${this.id}`);
            if(res.data.recipe) {
                this.title = res.data.recipe.title;
                this.author = res.data.recipe.publisher;
                this.img = res.data.recipe.image_url;
                this.url = res.data.recipe.source_url;
                this.ingredients = res.data.recipe.ingredients;
            }
        } catch(err) {
            console.log(err);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 minutes for every 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound', 'kg', 'g'];
        let newIngredients = this.ingredients.map(el => {
            // Uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,unitShort[i]);
            });

            // Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');

            // Parse ingredient into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));
            let objIng;
            if(unitIndex > -1) {
                // There is a unit
                // Ex 4 1/2 cup of water
                // Ex 2 tsp salt
                // Ex 1-1/2 oz of sugar
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1)
                    count = eval(arrIng[0].replace("-","+"));
                else
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };

            } else if(parseInt(arrIng[0],10)) {
                // There is no unit but the first word is a number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                // There is no unit and the first word is not a number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        this.ingredients.forEach(ing => {
            ing.count *= newServings/this.servings;
        });
        this.servings = newServings;
    }
}