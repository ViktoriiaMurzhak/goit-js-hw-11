import './css/styles.css';
import { BASE_URL, getPhoto, itemPerPage } from './api/webApi';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');
const totalPages = Math.ceil(500 / itemPerPage);
let page = 1;
let searchValue = '';

formEl.addEventListener('submit', onSubmit);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);

  createGalleryMarkup(data.hits);

  if (page === totalPages) {
    addClass('visually-hidden');
  }
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);

    removeClass('visually-hidden');

    moreBtn.removeEventListener('click', moreBtnClbc);
    moreBtn.addEventListener('click', moreBtnClbc);

    if (data.hits.length === 0) {
      addClass('visually-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      createGalleryMarkup(data.hits);
      doLightbox();
    }
  } catch (error) {
    addClass('visually-hidden');
    console.log('errooooor', error);
  }
}

function moreBtnClbc() {
  loadMoreCards(searchValue);
}

function createGalleryMarkup(cardsArr) {
  const markup = cardsArr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
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
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function doLightbox() {
  const linkImg = document.querySelector('.link-img');
  linkImg.addEventListener('click', openModal);

  function openModal(event) {
    event.preventDefault();
  }

  let lightbox = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
  });
}

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(galleryEl);

  searchValue = event.currentTarget[0].value;

  console.log('searchValue', searchValue);

  mountData(searchValue);
}

function clearMarkup(element) {
  element.innerHTML = '';
}

function addClass(className) {
  moreBtn.classList.add(className);
}

function removeClass(className) {
  moreBtn.classList.remove(className);
}
