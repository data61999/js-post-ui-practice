import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

// config for fromNow() dayjs
dayjs.extend(relativeTime);

export function createPostElement(post) {
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

  // bind click event for post detail
  const divPostItem = liElement.querySelector('div.post-item');
  if (divPostItem) {
    divPostItem.addEventListener('click', (e) => {
      //if trigger event from menu -> ignore
      const menuItem = divPostItem.querySelector('[data-id="menu"]');
      if (menuItem.contains(e.target)) return;

      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  // bind click event for edit icon
  const editIcon = liElement.querySelector('[data-id="edit"]');
  if (editIcon) {
    editIcon.addEventListener('click', (e) => {
      // S1: prevent event from child
      // e.stopPropagation();
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  // return li
  return liElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // clear old post list bofore generate news
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
