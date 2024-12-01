const refs = {
  watchedBtn: document.querySelector('.watched-js'),
  queueBtn: document.querySelector('.queue-js'),
  header: document.querySelector('.header-js')
}


refs.watchedBtn.addEventListener('click', onWatchedBtnClick);
refs.queueBtn.addEventListener('click', onQueueBtnClick);

// Функции изменения классов кнопок в хэдере для активной и неактивной кнопки
function onWatchedBtnClick() {
  refs.watchedBtn.classList.add('enabled-btn');
  refs.watchedBtn.classList.remove('disabled-btn');
  refs.queueBtn.classList.add('disabled-btn');
  refs.queueBtn.classList.remove('enabled-btn');
}

function onQueueBtnClick() {
  refs.watchedBtn.classList.remove('enabled-btn');
  refs.watchedBtn.classList.add('disabled-btn');
  refs.queueBtn.classList.remove('disabled-btn');
  refs.queueBtn.classList.add('enabled-btn');
}


// Эта часть кода вынесена в файл library.js
// const refs = {
//     homePageLink: document.querySelector('.home-js'),
//     libraryPageLink: document.querySelector('.library-js'),
//     searchForm: document.querySelector('.search-form-js'),
//     libraryBtns: document.querySelector('.buttons-library-js')
// }

// refs.libraryPageLink.addEventListener('click', onChangePage);

// function onChangePage() {
//     // e.preventDefault();
//     refs.searchForm.classList.remove('visually-hidden');
//     refs.libraryBtns.classList.add('visually-hidden');
// }
