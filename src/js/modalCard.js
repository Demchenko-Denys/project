import ApiService from './api-service';
import galRefs from './refs';
import movieCardLibraryMarkUp from '../templates/library-movie-card.hbs';

import movieDetails from '../templates/modal-movie-card.hbs';
import {
  watchedQueueFlag,
  renewParam,
  firstSixMovies,
  sliceGanresDate,
  gallery,
  titleNoMovie,
} from './library';
const headerScroll = document.querySelector('.header');

const apiService = new ApiService();
let visualNumberOfItems = 6; // индекс для конца обрезки массива из локал
let startIndex = 6;
const home = document.querySelector('.home-js');
const library = document.querySelector('.library-js');

const refs = {
  backdrop: document.querySelector('.backdrop'),
  movieCardContainer: document.querySelector('.modal-card-container'),
  closeBtn: document.querySelector('.close-btn'),
};

let watchedLocalLength = 0;
let queueLocalLength = 0;

galRefs.gallery.addEventListener('click', onGallery);
galRefs.vidoCloseBtn.addEventListener('click', clearSpaceFromVideo);
refs.closeBtn.addEventListener('click', onCloseBtn);
refs.backdrop.addEventListener('click', onBackdrop);

function onGallery(e) {
  e.preventDefault();

  // console.log('watchedLocalLength', watchedLocalLength);
  // console.log('queueLocalLength', queueLocalLength);
  if (e.target.classList.contains('modal')) {
    return;
  } else {
    // Переменные которые нужны для корректного закрытия окна ,если ы открыли и ничего не удалили то просто сверяются длины локал сторедж
    watchedLocalLength = JSON.parse(localStorage.getItem('watched movies') || '[]');
    watchedLocalLength = watchedLocalLength.length;
    queueLocalLength = JSON.parse(localStorage.getItem('In queue') || '[]');
    queueLocalLength = queueLocalLength.length;
    const id = JSON.parse(e.target.dataset.action);
    const watchedList = JSON.parse(localStorage.getItem('watched movies') || '[]');
    const queueList = JSON.parse(localStorage.getItem('In queue') || '[]');
    const repeatInWatch = watchedList.some(elem => elem.id === id);
    const repeatInQueue = queueList.some(elem => elem.id === id);

    if (e.target.tagName.toLowerCase() !== 'img') return;

    if (repeatInWatch === true && repeatInQueue === true) {
      apiService.fetchMovieDetails(e.target.dataset.action).then(data => {
        data.wbuttonText = 'Remove from watched';
        data.qbuttonText = 'Remove from queue';
        clearModalMovieCardContainer();
        appendInModalCard(data);
      });
      refs.backdrop.classList.remove('is-hidden');
      window.addEventListener('keyup', onKeyClose);
    } else if (repeatInWatch === true && repeatInQueue !== true) {
      apiService.fetchMovieDetails(e.target.dataset.action).then(data => {
        data.wbuttonText = 'Remove from watched';
        data.qbuttonText = 'Add to queue';
        clearModalMovieCardContainer();
        appendInModalCard(data);
      });
      refs.backdrop.classList.remove('is-hidden');
      window.addEventListener('keyup', onKeyClose);
    } else if (repeatInWatch !== true && repeatInQueue === true) {
      apiService.fetchMovieDetails(e.target.dataset.action).then(data => {
        data.wbuttonText = 'Add to watched';
        data.qbuttonText = 'Remove from queue';
        clearModalMovieCardContainer();
        appendInModalCard(data);
      });
      refs.backdrop.classList.remove('is-hidden');
      window.addEventListener('keyup', onKeyClose);
    } else {
      apiService.fetchMovieDetails(e.target.dataset.action).then(data => {
        data.wbuttonText = 'Add to watched';
        data.qbuttonText = 'Add to queue';
        clearModalMovieCardContainer();
        appendInModalCard(data);
      });
      refs.backdrop.classList.remove('is-hidden');
      window.addEventListener('keyup', onKeyClose);
    }
  }
}

function appendInModalCard(data) {
  refs.movieCardContainer.insertAdjacentHTML('beforeend', movieDetails(data));
}

function clearModalMovieCardContainer() {
  refs.movieCardContainer.innerHTML = '';
  galRefs.videoContainer.innerHTML = '';
  galRefs.youTubeModal.classList.add('is-hidden');
}

function onCloseBtn(e) {
  refs.backdrop.classList.add('is-hidden');

  galRefs.videoContainer.innerHTML = '';
  galRefs.videoContainer.classList.remove('olreadyWatching');
  galRefs.youTubeModal.classList.add('is-hidden');
  galRefs.vidoCloseBtn.removeEventListener('click', onKeyClose);


  if (home.classList.contains('current-page')) {
    return;
  } else if (library.classList.contains('current-page')) {
    if (watchedQueueFlag) {
      if (matchLoaclStrage('watched movies')) {
        return;
      } else {
        renderAfterDeleteMovie('watched movies');
        // renewParam(6);
        // firstSixMovies('watched movies');
        // scrollContent();
        ifLocalEmpty('watched movies');
      }
    } else {
      if (matchLoaclStrage('In queue')) {
        return;
      } else {
        renderAfterDeleteMovie('In queue');
        // renewParam(6);
        // firstSixMovies('In queue');
        // scrollContent();
        ifLocalEmpty('In queue');
      }
    }
  }
  // обновление карточек в разделах билиотеки при закрытии модалки
  // if (renderLib.libraryLink.classList.contains('current-page')) {
  //   const watchedB = document.querySelector('.watched-js')
  //   const queueB = document.querySelector('.queue-js')

  //   if (watchedB.classList.contains('enabled-btn')) {
  //     renderLib.firstSixMovies('watched movies');
  //   } else {
  //     if (queueB.classList.contains('enabled-btn')) {
  //       renderLib.firstSixMovies('In queue');
  //     };
  //   };
  // };

  window.removeEventListener('keyup', onKeyClose);
}

function onBackdrop(e) {
  if (e.target === e.currentTarget) {
    onCloseBtn();
  }
}

function onKeyClose(e) {
  if (e.code === 'Escape') {
    onCloseBtn();
  }
}

function scrollContent() {
  headerScroll.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function matchLoaclStrage(key) {
  let lengthLocal = JSON.parse(localStorage.getItem(key) || '[]');
  lengthLocal = lengthLocal.length;
  if (lengthLocal === 0) {
    return false;
  }

  if (lengthLocal === watchedLocalLength || lengthLocal === queueLocalLength) {
    return true;
  } else {
    return false;
  }
}

function renderAfterDeleteMovie(key) {
  galRefs.gallery.innerHTML = '';
  const localArr = JSON.parse(localStorage.getItem(key) || '[]');
  gallery.insertAdjacentHTML('beforeend', movieCardLibraryMarkUp(sliceGanresDate(localArr)));
}

function ifLocalEmpty(key) {
  const localArr = JSON.parse(localStorage.getItem(key) || '[]');
  if (localArr.length === 0) {
    gallery.classList.add('galleryEmptySpace');
    titleNoMovie.classList.remove('display-none');
  } else {
    return;
  }
}

function clearSpaceFromVideo() {
  galRefs.videoContainer.innerHTML = '';
  galRefs.videoContainer.classList.remove('olreadyWatching');
  galRefs.youTubeModal.classList.add('is-hidden');
  galRefs.vidoCloseBtn.removeEventListener('click', onKeyClose);
}
