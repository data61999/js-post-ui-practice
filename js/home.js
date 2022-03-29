import dayjs from 'dayjs';
import postApi from './api/postApi';
import { setTextContent, truncateText } from './ultis';
import relativeTime from 'dayjs/plugin/relativeTime';

// config for fromNow() dayjs
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  // find and clone li teplate
  const templateElement = document.getElementById('postItemTemplate');
  if (!templateElement) return;

  const liElement = templateElement.content.firstElementChild.cloneNode(true);

  // update thumnail, title, desc, author, time span
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(
    liElement,
    '[data-id="description"]',
    truncateText(post.description, 100)
  );
  setTextContent(liElement, '[data-id="author"]', post.author);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    // set default thumbnail image
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400&text=image';
    });
  }

  setTextContent(
    liElement,
    '[data-id="timeSpan"]',
    `- ${dayjs(post.updateAt).fromNow()}`
  );

  // return li
  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  // clear old post list bofore generate news
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    history.pushState({}, '', url);
    // fetch api
    const response = await postApi.getAll(url.searchParams);
    // render post list
    renderPostList(response.data);
    // render pagination
    renderPagination(response.pagination);
  } catch (error) {
    console.log('fetch all post fail', error);
  }
}

function handlePrevPaginationClick(e) {
  e.preventDefault();

  const paginationElement = document.getElementById('pagination');
  const currentPage = Number.parseInt(paginationElement.dataset.page);
  const totalPage = Number.parseInt(paginationElement.dataset.totalPage);

  if (currentPage <= 1) return;

  handleFilterChange('_page', currentPage - 1);
}

function handleNextPaginationClick(e) {
  e.preventDefault();

  const paginationElement = document.getElementById('pagination');
  const currentPage = Number.parseInt(paginationElement.dataset.page);
  const totalPage = Number.parseInt(paginationElement.dataset.totalPage);

  if (currentPage >= totalPage) return;

  handleFilterChange('_page', currentPage + 1);
}

function registerBindPagination() {
  const paginationElement = document.getElementById('pagination');
  if (!paginationElement) return;

  // bind click event for previous link
  const prevLink = paginationElement.firstElementChild.firstElementChild;
  if (prevLink) prevLink.addEventListener('click', handlePrevPaginationClick);

  // bind click event for previous link
  const nextLink = paginationElement.lastElementChild.firstElementChild;
  if (nextLink) nextLink.addEventListener('click', handleNextPaginationClick);
}

function initURL() {
  const url = new URL(window.location);
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

function renderPagination(pagination) {
  const paginationElement = document.getElementById('pagination');
  if (!pagination || !paginationElement) return;

  const { _page, _limit, _totalRows } = pagination;
  const currentPage = _page;
  const totalPage = Math.ceil(_totalRows / _limit);

  console.log('total page', totalPage);

  // set data set pagination
  paginationElement.dataset.page = currentPage;
  paginationElement.dataset.totalPage = totalPage;

  // check disble prev/next link pagination
  if (currentPage <= 1)
    paginationElement.firstElementChild?.classList.add('disabled');
  else paginationElement.firstElementChild?.classList.remove('disabled');

  if (currentPage >= totalPage)
    paginationElement.lastElementChild?.classList.add('disabled');
  else paginationElement.lastElementChild?.classList.remove('disabled');
}

(async () => {
  try {
    // bind click event for pagination click
    registerBindPagination();
    //  set default params in URL
    initURL();

    const queryParams = new URLSearchParams(window.location.search);
    const response = await postApi.getAll(queryParams);
    renderPostList(response.data);
    renderPagination(response.pagination);
  } catch (e) {
    console.log('fail to fetch all product', e);
  }
})();
