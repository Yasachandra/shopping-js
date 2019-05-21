import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
- Search object
- Current recipe
- Shopping list object
- Liked recipes
*/
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();
    if(query) {
        // Search object and add to the state
        state.search = new Search(query);

        // Prepare UI for the result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // Search for the recipes
            await state.search.getResults();

            // Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert("Something went wrong with the search...");
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit',e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click',e=> {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});


/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace("#","");
    if(id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        // Highlight the selected recipe
        if(state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse the ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate time and num of servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert("Error in processing recipe!");
        }
        
    }
}

["hashchange","load"].forEach(evt => window.addEventListener(evt,controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    console.log(e.target.matches('.btn-decrease', '.btn-decrease *'));
    // Decrease button is clicked
    if(e.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
})