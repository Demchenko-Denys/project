import ApiService from './api-service';
import renderTrailer from '../templates/trailer.hbs'
import refs from './refs';

const API = new ApiService();


const modal = document.querySelector('.modal');

const watchedList = JSON.parse(localStorage.getItem('watched movies') || '[]');
const queueList = JSON.parse(localStorage.getItem('In queue') || '[]');

modal.addEventListener('click', onModalButtons);

function onModalButtons(e) {
  e.preventDefault();
  if (!e.target.classList.contains('watched') && !e.target.classList.contains('queue') && !e.target.classList.contains('youtubeBtn-js')) {
    return;
  } else {
    const id = JSON.parse(e.target.dataset.id);

    const repeatedIndexWatched = watchedList.findIndex(elem => elem.id === id);
    const repeatedIndexQueue = queueList.findIndex(elem => elem.id === id);

    if (e.target.hasAttribute('data-dir')) {
      if (e.target.classList.contains('watched') && repeatedIndexWatched !== -1) {
        watchedList.splice(repeatedIndexWatched, 1);
        localStorage.setItem('watched movies', JSON.stringify(watchedList));
        e.target.textContent = 'Add to watched';
      } else {
        API.fetchMovieDetails(id).then(data => {
          insertToStorage(data, watchedList, 'watched movies');
          e.target.textContent = 'Remove from watched';
        });
      }
    } else if (e.target.hasAttribute('data-source')) {
      if (e.target.classList.contains('queue') && repeatedIndexQueue !== -1) {
        queueList.splice(repeatedIndexQueue, 1);
        localStorage.setItem('In queue', JSON.stringify(queueList));
        e.target.textContent = 'Add to queue';
      } else {
        API.fetchMovieDetails(id).then(data => {
          insertToStorage(data, queueList, 'In queue');
          e.target.textContent = 'Remove from queue';
        });
      }
    }
      //Добавляем видео из ютуба
    else if (e.target.hasAttribute('data-tailer')) {if(refs.videoContainer.classList.contains('olreadyWatching')){return}
    API.fatchTrailerSearch(id).then(el => {
      return el.results.find(el => {
        const videoTitle = el.name.split(' ')
          return videoTitle.some(el => el === "Trailer")
      })
    }).then(el => {
      refs.videoContainer.insertAdjacentHTML('beforeend', renderTrailer(el));
      refs.videoContainer.classList.add('olreadyWatching');
      refs.youTubeModal.classList.remove('is-hidden');
    })
  }
  }
}

function insertToStorage(data, list, state) {
  const destr = destructObj(data);
  list.push(destr);
  localStorage.setItem(state, JSON.stringify(list));
}

function destructObj({
  id,
  overview,
  backdrop_path,
  original_title,
  poster_path,
  release_date,
  popularity,
  vote_average,
  genres,
}) {
  return {
    id,
    overview,
    backdrop_path,
    original_title,
    poster_path,
    release_date,
    popularity,
    vote_average,
    genres,
  };
}

// localStorage.clear()
