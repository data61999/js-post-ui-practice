export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncateText(text, maxLength) {
  if (text.length < maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFormValue(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;
  const image = parent.querySelector(selector);
  if (image) image.style.backgroundImage = `url(${imageUrl})`;
}

export function randomNumber(number) {
  if (number < 0) return;
  return Math.round(Math.random() * number);
}
