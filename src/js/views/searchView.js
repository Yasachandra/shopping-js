import { elements } from "./base";

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
}

const createButton = (page,type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages > 1) {
        // Show only button to go to next page
        button = createButton(page,'next');
    } else if(page > 1 && page < pages) {
        // Show buttons to go to next and previous page respectively
        button = `${createButton(page,'prev')}${createButton(page,'next')}`;
    } else if(page === pages && pages > 1) {
        // Show only button to go to previous page
        button = createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

export const limitRecipeTitle = (title,limit=17) => {
    if(title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((acc, cur)=>{
            if(acc + cur.length <= limit)
                newTitle.push(cur);
            return acc + cur.length;
        },0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Display the results for the current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);

    // Render the buttons to go to next or previous page
    renderButtons(page,recipes.length,resPerPage);
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}