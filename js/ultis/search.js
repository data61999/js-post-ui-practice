import debounce from 'lodash.debounce';

export function initSearch({ elementId, queryParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  // set search value from URL params
  if (queryParams?.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }
  const searchDebounce = debounce((e) => {
    onChange?.(e.target.value);
  }, 500);

  searchInput.addEventListener('input', searchDebounce);
}
