/* eslint-disable*/

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is "succes" or 'error'
export const showAlert = (type, msg) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}<div>`;
  document.body.insertAdjacentHTML('afterbegin', markup);

  setTimeout(() => {
    hideAlert();
  }, 3000);
};
