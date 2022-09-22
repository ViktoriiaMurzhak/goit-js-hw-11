import './css/styles.css';
import { BASE_URL, getPhoto, itemPerPage } from './api/webApi';
import Notiflix from 'notiflix';

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');

let page = 1;

const totalPages = Math.ceil(500 / itemPerPage);

formEl.addEventListener('submit', onSubmit);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  data.hits.forEach(photo => {
    createCardMarkup(photo);
  });
  if (page === totalPages) {
    moreBtn.classList.add('visually-hidden');
  }
}

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(galleryEl);

  const searchValue = event.currentTarget[0].value;
  mountData(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);

    moreBtn.classList.remove('visually-hidden');
    moreBtn.addEventListener('click', () => {
      loadMoreCards(searchValue);
    });
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    data.hits.forEach(photo => {
      createCardMarkup(photo);
    });
  } catch (error) {
    console.log('error', error);
  }
}

function createCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  galleryEl.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
  );
}

function clearMarkup(element) {
  element.innerHTML = '';
}
