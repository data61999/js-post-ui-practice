import postApi from './api/postApi';

(async () => {
  try {
    const queryParams = {
      _limit: 5,
      _page: 1,
    };
    const response = await postApi.getAll(queryParams);
    console.log(response);
  } catch (e) {
    console.log('fetch all error', e);
  }
})();
