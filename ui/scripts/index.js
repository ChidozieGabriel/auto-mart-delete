const viewBtns = document.querySelectorAll('[data-car="order"]');
viewBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    window.location.href = './purchaseorder.html';
  });
});

const orderBtns = document.querySelectorAll('[data-car="report"]');
orderBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    window.location.href = './report.html';
  });
});
