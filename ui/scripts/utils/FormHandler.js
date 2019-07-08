import DOMHandler from './DOMHandler.js';

class FormHandler {
  constructor(formElement) {
    this.form = formElement;
    this.submitBtn = formElement.querySelector('[type="submit"]');
  }

  onSubmit(callback) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.disableSubmitBtn();
      const formData = new FormData(this.form);
      const json = DOMHandler.toJson(formData);
      callback(json, formData);
    });
  }

  disableSubmitBtn(disable = true) {
    if (disable) {
      this.submitBtn.setAttribute('disabled', 'true');
    } else {
      this.submitBtn.removeAttribute('disabled');
    }
  }
}

export default FormHandler;
