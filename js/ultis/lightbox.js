function showModel(modalElement) {
  var modal = new window.bootstrap.Modal(document.getElementById(modalElement));
  if (modal) modal.show();
}

export function registerLightbox({
  modalId,
  imgSelector,
  prevSelector,
  nextSelector,
}) {
  const modalElement = document.getElementById(modalId);
  console.log(modalElement);
  if (!modalElement) return;

  const imgElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);

  console.log({ imgElement, prevButton, nextButton });

  if (!imgElement || !prevButton || !nextButton) return;

  console.log('go');
  // lightBox var
  let imgList = [];
  let currentIndex;

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }

  // handle click for all img -> event delegate
  // img click -> find imgs with the same album
  // determine index of selected img
  // show modal with selected img
  // hadle prev/next click

  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    //find imgs with the same album
    imgList = document.querySelectorAll(
      `img[data-album="${target.dataset.album}"]`
    );
    currentIndex = [...imgList].findIndex((x) => x === target);

    // show image at index
    showImageAtIndex(currentIndex);
    // show modal
    showModel(modalId);

    // bind click event for prev button
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
      showImageAtIndex(currentIndex);
    });

    // bind click event for next button
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imgList.length;
      showImageAtIndex(currentIndex);
    });
  });
}
