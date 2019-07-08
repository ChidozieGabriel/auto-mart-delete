import FormHandler from './utils/FormHandler.js';
import Api from './utils/Api.js';

const api = new Api();
const form = document.querySelector('[data-form="form"]');
const formHandler = new FormHandler(form);
formHandler.onSubmit((json) => {
  api
    .signup(json)
    .then(() => {
      let redirect = document.referrer;
      if (!redirect || redirect.toLowerCase().includes('signin')) {
        redirect = 'index';
      }

      window.location.href = redirect;
    })
    .catch(err => console.log(err))
    .finally(() => formHandler.disableSubmitBtn(false));
});
