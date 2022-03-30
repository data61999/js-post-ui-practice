import dayjs from 'dayjs';
import postApi from './api/postApi';
import { setTextContent } from './ultis';

// id="goToEditPageLink"
// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"

// author: "Demarcus Spencer"
// createdAt: 1633700485639
// description: "voluptas vel id cupiditate id quia quo tenetur porro sunt error nesciunt explicabo et et quia cupiditate a qui ut ea ullam laboriosam ipsa quisquam eligendi a dolores rerum repellendus dolorum debitis in soluta quis ratione eaque mollitia eius provident qui laborum similique quidem ullam dolorem exercitationem eum vero voluptatem"
// id: "sktwi1cgkkuif36dk"
// imageUrl: "https://picsum.photos/id/327/1368/400"
// title: "Labore aut"
// updatedAt: 1633700485639

function renderPostDetail(post) {
  if (!post) return;

  //set textContent title, author, timeSpan, description
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm')
  );
  setTextContent(document, '#postDetailDescription', post.description);

  // set hero image
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url(${post.imageUrl})`;

    // set default image when image error
    heroImage.addEventListener('error', () => {
      heroImage.style.background =
        "url('https://via.placeholder.com/1368x400&text=image')";
    });
  }
  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.textContent = 'Edit post';
  }
}

(async () => {
  try {
    // get id from url params
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.get('id')) {
      console.log('Id not found');
    }
    const id = searchParams.get('id');
    console.log(id);
    // fetch post detail by getById
    // render post detail
    const post = await postApi.getById(id);
    renderPostDetail(post);
  } catch (error) {
    console.log('fail to fetch post by id', error);
  }
})();
