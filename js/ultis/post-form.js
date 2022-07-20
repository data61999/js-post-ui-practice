import {
  randomNumber,
  setBackgroundImage,
  setFormValue,
  setTextContent,
} from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function renderFormValues(form, formValues) {
  setFormValue(form, '[name="title"]', formValues?.title);
  setFormValue(form, '[name="author"]', formValues?.author);
  setFormValue(form, '[name="description"]', formValues?.description);
  // set hidden input
  setFormValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};
  // s1
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // s2 use formData
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup
      .string()
      .required('please enter title')
      .test(
        'at-least-two-words',
        'please enter at least two words',
        (value) =>
          value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    author: yup.string().required('please enter author'),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'invalid image source'),

    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('please random a background image')
        .url('please enter an valid url'),
    }),

    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'please select an image to upload', (file) =>
          Boolean(file?.name)
        )
        .test('max-3mb', 'please select <= 3 Mb to upload', (file) => {
          const MAX_SIZE = 3 * 1024 * 1024; // 3Mb
          return file?.size <= MAX_SIZE;
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostform(form, formValues) {
  try {
    // reset previous errors
    ['title', 'author', 'imageUrl', 'image', 'imageSource'].forEach((name) =>
      setFieldError(form, name, '')
    );

    // state validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.inner);
    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;
        // ignore if the field is already logged
        if (errorLog[name]) continue;

        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Loading...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomImageButton = document.getElementById('postChangeImage');
  if (randomImageButton) {
    randomImageButton.addEventListener('click', () => {
      // random image url
      const randomUrl = `https://picsum.photos/id/${randomNumber(
        1000
      )}/1368/400`;
      // set background image
      // set hidden input imageUrl
      setFormValue(form, '[name="imageUrl"]', randomUrl);
      setBackgroundImage(document, '#postHeroImage', randomUrl);
    });
  }
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  controlList.forEach(
    (control) =>
      (control.hidden = control.dataset.imageSource !== selectedValue)
  );
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      renderImageSourceControl(form, e.target.value);
    });
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');

  // preview image
  if (uploadImage) {
    uploadImage.addEventListener('change', () => {
      const file = uploadImage.files[0];
      if (file) {
        const uploadImageUrl = URL.createObjectURL(file);
        setBackgroundImage(document, '#postHeroImage', uploadImageUrl);
      }
    });
  }
}

export function initPostForm({ formId, defaultValues, onChange }) {
  const form = document.getElementById(formId);
  if (!form) return;

  renderFormValues(form, defaultValues);
  let isSubmitting;

  // init events
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);

  // bind submit event for form
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // get formValues
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    // prevent orther submitting
    if (isSubmitting) return;
    isSubmitting = true;

    showLoading(form);

    // validate formValues
    // if formValues is valid trigger call api
    // otherwise toast error message
    const valid = await validatePostform(form, formValues);
    if (valid) await onChange?.(formValues);

    // always hide loading
    hideLoading(form);
    isSubmitting = false;
  });
}
