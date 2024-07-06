import View from './View.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found. Please try another ingredient.';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultView();
