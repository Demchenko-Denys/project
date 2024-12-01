import movieMarkup from '../templates/library-movie-card.hbs';

//Получаю доступ к элементам
const libraryLink = document.querySelector('.library-js');
const listOfHeaderBtns = document.querySelector('.buttons.list');
export const gallery = document.querySelector('.movie-list-js');
export const titleNoMovie = document.querySelector('.no-movie');
const plaginationEl = document.querySelector('.pagination');
const section = document.querySelector('.gall-js');
//yarik
const searchForm = document.querySelector('.search-form-js');
const homePageLink = document.querySelector('.home-js');
const header = document.querySelector('.header-js');
const sentinel = document.getElementById('sentinel');

export let watchedQueueFlag = true; // флаг для определения какой ключ брать из ока сторедж
export let visualNumberOfItems = 6; // индекс для конца обрезки массива из локал
export let startIndex = 6; // индекс для начала обрезки массива из локал

//Вешаю слушателей на кнопки и мою библиотеку
libraryLink.addEventListener('click', onLibraryLinkCLick);
listOfHeaderBtns.addEventListener('click', onListOfHeadersBtns);

//функция на ссылке моя библиотека при нажатии скрывает плагинацию открывает кнопки на хедере
//добавляет класс чтобы футер был внизу

function onLibraryLinkCLick(event) {
  event.preventDefault();
  plaginationEl.style.display = 'none';
  listOfHeaderBtns.classList.remove('visually-hidden');
  section.classList.add('section-library-height');
  sentinel.classList.remove('display-none'); // открываем часового (пустой див для инфинити скролла)
  watchedQueueFlag = true;
  // изменяет хедер визуально
  //yarik
  searchForm.classList.add('visually-hidden'); // прячет инпут
  homePageLink.classList.remove('current-page'); // убирает псевдоэлемент ссылки хоум
  libraryLink.classList.add('current-page'); // и добавляет псевдоэлемент на лайбрари
  header.classList.remove('header-home'); // смена класса хэдера для изменения фонового изображения
  header.classList.add('header-library'); // смена класса хэдера для изменения фонового изображения
  //
  // вызывает функцию которая рендерит карточки из локалсторедж (renderMarkupFromLocalStorage)
  // вызывает функцию проверку, если локалсторедж пуст, то на галерею вешается фоновый рисунок и надпись No movies (heightForGalleryBackgroundImg)
  renewParam(6);
  firstSixMovies('watched movies');
}

//функция обрабатвает события на кнопках
function onListOfHeadersBtns(event) {
  event.preventDefault();
  //если кнопка вотчед, то тогда рендерятся карточки из локалсторедж под ключом вотчед

  if (event.target.classList.contains('watched-js')) {
    watchedQueueFlag = true;
    renewParam(6); // сбрасываем параметры обрезки для корректного рендеринга карточек

    firstSixMovies('watched movies'); // рендерим только 6 карточек, а остальное рендерит IntersectionObserve
  }
  //если кнопка кьюю то тогда рендерятся карточки из ключа кьюю + та же лагика что и выше с вотчед

  if (event.target.classList.contains('queue-js')) {
    watchedQueueFlag = false;

    renewParam(6);
    firstSixMovies('In queue');
  }
}

//функция для обрезки жанров до 2х и обрезки дат фильмов до года
export function sliceGanresDate(arr) {
  if (arr === null) {
    return;
  }
  return arr.map(item => {
    if (item.genres.length > 2) {
      item.genres.splice(2, 5);
      item.genres.splice(1, 0, { name: `, ` });
    } else if (item.genres.length === 2) {
      item.genres.splice(1, 0, { name: `, ` });
    }
    if (item.release_date) {
      item.release_date = item.release_date.slice(0, 4);
    }
    return item;
  });
}
//============================================= infinity scroll==================

// функция которая отвечает за точтобы рендерились карточки как только мы достролили до часового
const loadMore = function (key) {
  const moviesFromLocalStorage = JSON.parse(localStorage.getItem(key)); // получаем массив из локалсторедж
  let numberOfItems = 6;
  visualNumberOfItems += numberOfItems;
  // проверка массива на нулл
  if (moviesFromLocalStorage === null) {
    return;
  }
  const visualItems = moviesFromLocalStorage.slice(startIndex, visualNumberOfItems); // обрезаем массив на части по шесть фильмов
  // рендерим полученный результат
  gallery.insertAdjacentHTML('beforeend', movieMarkup(sliceGanresDate(visualItems)));
  // бодавляем к стартовому индексу  для следующей обрезки слудующих 6 ти фильмов
  startIndex += numberOfItems;
};

// функция отвечает за фиксацией всех пересечений с часовым
function onEntry(entries) {
  entries.forEach(entry => {
    //  когда скролим при пересечении с часовым в консоли будет объект entry, entry.isIntersecting = это свойство объекта он либо тру либо фалсе
    if (entry.isIntersecting) {
      // логика для того какой ключ использовать
      if (watchedQueueFlag) {
        loadMore('watched movies');
      } else {
        loadMore('In queue');
      }
    }
  });
}
// опции для IntersectionObserver трешхолд это на сколько объект должен появиться а рутмаржин это на сколько сместиться часовой при загрузке
const options = {
  threshold: 0.8,
  rootMargin: '0px 0px 50px 0px',
};
// создаем новый экземпляр IntersectionObserver передаем в него известные функции
const interObserv = new IntersectionObserver(onEntry, options);

// применяем свойство экземплра которое указвает за кем мы должн наблюдать
interObserv.observe(sentinel);
// функция для рендеринга первых шести фильмов из локал,
export function firstSixMovies(key) {
  gallery.innerHTML = '';
  const moviesFromLocalStorage = JSON.parse(localStorage.getItem(key));
  // проверка массива объектов по разным кейсам
  if (moviesFromLocalStorage === null) {
    gallery.classList.add('galleryEmptySpace');
    titleNoMovie.classList.remove('display-none');
    return;
  } else if (moviesFromLocalStorage.length === 0) {
    gallery.classList.add('galleryEmptySpace');
    titleNoMovie.classList.remove('display-none');
    return;
  } else {
    gallery.classList.remove('galleryEmptySpace');
    titleNoMovie.classList.add('display-none');
  }
  const updateInfoFroLocalStarage = sliceGanresDate(moviesFromLocalStorage);
  const firstSix = updateInfoFroLocalStarage.slice(0, 6);
  gallery.insertAdjacentHTML('beforeend', movieMarkup(firstSix));
}
// функция для обновлeния параметров обрезки при перезагрузки страницы
export function renewParam(num) {
  visualNumberOfItems = num;
  startIndex = num;
}

// экспортировал в modalCard.js для обновления списка в категориях при onCloseBtn()
