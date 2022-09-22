import './css/styles.css';
import { BASE_URL, getPhoto, itemPerPage } from './api/webApi';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

    console.log('data', data);

    moreBtn.classList.remove('visually-hidden');
    moreBtn.addEventListener('click', () => {
      loadMoreCards(searchValue);
    });
    if (data.hits.length === 0) {
      moreBtn.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`, 500);
    data.hits.forEach(photo => {
      createCardMarkup(photo);

      doLightbox();
    });
  } catch (error) {
    console.log('errooooor', error);
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
    <a class='link-img' href=${largeImageURL}><img src=${webformatURL} alt=${tags} loading="lazy" class="card-img"/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-label">Likes </b><span class="info-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Views </b><span class="info-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Comments </b><span class="info-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Downloads </b><span class="info-span">${downloads}</span>
    </p>
  </div>
</div>`
  );
}

function doLightbox() {
  const linkImg = document.querySelector('.link-img');
  linkImg.addEventListener('click', openModal);

  function openModal(event) {
    event.preventDefault();
  }

  let lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

function clearMarkup(element) {
  element.innerHTML = '';
}
