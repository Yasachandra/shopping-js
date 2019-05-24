import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Like from "./models/Likes";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Likes from "./models/Likes";

/* Global state of the app
- Search object
- Current recipe
- Shopping list object
- Liked recipes
*/
const state = {};
window.state = state;

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (err) {
            alert("Error in processing recipe!");
        }
        
    }
}

["hashchange","load"].forEach(evt => window.addEventListener(evt,controlRecipe));


/**
 * List Controller
 */

const controlList = () => {
    // Create  new list if there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and the UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handling update and delete list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Handle the delete button
        // Delete the item from the state
        state.list.deleteItem(id);

        // Delete the item from the UI
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')) {
        // Handle the update value
        const val = parseInt(e.target.value,10);
        state.list.updateCount(id,val);
    }
});


/**
 * Like Controller
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Like();

    const currentId = state.recipe.id;

    if(!state.likes.isLiked(currentId)) {
        // If the user has not already liked the recipe
        // Add the like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add the like to the UI list
        likesView.renderLike(newLike);

    } else {
        // If the user has already liked the recipe
        // Remove the like from the state
        state.likes.deleteLike(currentId);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove the like from the UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

}

// Restore liked recipes on page load
window.addEventListener("load", () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // Decrease button is clicked
    if(e.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
    
});