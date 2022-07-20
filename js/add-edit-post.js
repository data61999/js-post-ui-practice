import postApi from './api/postApi';
import { initPostForm, toast } from './ultis';

function removeUnusedField(formValues) {
  const payload = { ...formValues };

  if (payload.imageSource === 'picsum') {
    delete payload.image;
  } else {
    delete payload.imageUrl;
  }

  delete payload.imageSource;

  //delete id at add mode
  if (!payload.id) {
    delete payload.id;
  }

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handleSubmitForm(formValues) {
  try {
    const payload = removeUnusedField(formValues);
    const formData = jsonToFormData(payload);

    // check add or edit mode
    const response = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    // show toast success
    toast.success('success');

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${response.id}`);
    }, 2000);
  } catch (error) {
    console.log('fail to update / add new post', error);
    toast.error(error);
  }
}

(async () => {
  try {
    // check is add or edit mode
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    const defaultValues = Boolean(id)
      ? await postApi.getById(id)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onChange: async (formValues) => {
        await handleSubmitForm(formValues);
        // console.log(formValues);
      },
    });
  } catch (error) {
    console.log('error to fectch data', error);
  }
})();
