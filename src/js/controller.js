import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (model.hot) {
//   model.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Make the asynchronous function for show the Recipes
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0. Update results view to mark selected search result
    resultView.update(model.getSearchResultPage());
    //1. Loading recipe
    await model.loadRecipe(id);
    //2. Rendering recipe
    recipeView.render(model.state.recipe);

    //3 updating bookmarks view
    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    ``;
    recipeView.renderError();
    console.error(err);
  }
};

//Make the asynchronous function for render the results when user search any item ex "pizza"
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1. Get search query
    const query = searchView.getQuery();

    if (!query) return;

    //2. Load search results
    await model.loadSearchResults(query);

    //3 Render Results
    resultView.render(model.getSearchResultPage());

    //4 Render inital pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1 Render New Results
  resultView.render(model.getSearchResultPage(goToPage));

  //2 Render New inital pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1. Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2. Update recipe view
  recipeView.update(model.state.recipe);

  //3. Render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //SHow loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Seccess Message

    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close Form  Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(`${err} 💥`);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
