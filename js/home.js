import {
  initSearch,
  renderPagination,
  renderPostList,
  registerBindPagination,
} from './ultis';
import postApi from './api/postApi';

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    if (filterName === 'title_like') {
      url.searchParams.set('_page', 1);
    }
    history.pushState({}, '', url);

    // fetch api
    const response = await postApi.getAll(url.searchParams);
    // render post list
    renderPostList('postList', response.data);
    // render pagination
    renderPagination('pagination', response.pagination);
  } catch (error) {
    console.log('fetch all post fail', error);
  }
}

(async () => {
  try {
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    // bind click event for pagination click
    registerBindPagination({
      elementId: 'pagination',
      queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    // initSearch
    initSearch({
      elementId: 'searchInput',
      queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    const response = await postApi.getAll(queryParams);
    renderPostList('postList', response.data);
    renderPagination('pagination', response.pagination);
  } catch (e) {
    console.log('fail to fetch all product', e);
  }
})();
