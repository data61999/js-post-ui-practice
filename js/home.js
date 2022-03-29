import postApi from './api/postApi';
import { setTextContent, truncateText } from './ultis';

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

  // return li
  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    const response = await postApi.getAll(queryParams);
    renderPostList(response.data);
  } catch (e) {
    console.log('fail to fetch all product', e);
  }
})();
