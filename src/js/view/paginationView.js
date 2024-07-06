import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(hanlder) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      hanlder(goToPage);
    });
  }

  _generateMarkup() {
    const curpage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (curpage === 1 && numPages > 1) {
      return this._generateMarkupHalper('next', curpage);
    }
    //Last page
    if (curpage === numPages && numPages > 1) {
      return this._generateMarkupHalper('prev', curpage);
    }
    //Other page
    if (curpage < numPages) {
      return this._generateMarkupHalper('both', curpage);
    }
    //Page 1, and there are No other pages
    return '';
  }

  _generateMarkupHalper(bottonType, curpage) {
    const next = `
        <button data-goto="${
          curpage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curpage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
    const prev = `
        <button data-goto="${
          curpage - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curpage - 1}</span>
          </button>
    `;
    if (bottonType === 'prev') return prev;
    if (bottonType === 'next') return next;
    if (bottonType === 'both') return prev + next;
  }
}

export default new PaginationView();
