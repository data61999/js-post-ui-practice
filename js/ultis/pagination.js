export function registerBindPagination({ elementId, queryParams, onChange }) {
  const paginationElement = document.getElementById(elementId);
  if (!paginationElement) return;

  // bind click event for previous link
  const prevLink = paginationElement.firstElementChild.firstElementChild;
  if (prevLink)
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      const currentPage = Number.parseInt(paginationElement.dataset.page);

      if (currentPage >= 2) onChange?.(currentPage - 1);
    });

  // bind click event for previous link
  const nextLink = paginationElement.lastElementChild.firstElementChild;
  if (nextLink)
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const currentPage = Number.parseInt(paginationElement.dataset.page);
      const totalPage = Number.parseInt(paginationElement.dataset.totalPage);

      console.log({ currentPage, totalPage });

      if (currentPage < totalPage) onChange?.(currentPage + 1);
    });
}

export function renderPagination(elementId, pagination) {
  const paginationElement = document.getElementById(elementId);
  if (!pagination || !paginationElement) return;

  const { _page, _limit, _totalRows } = pagination;
  const currentPage = _page;
  const totalPage = Math.ceil(_totalRows / _limit);

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
