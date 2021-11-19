import '/./sass/main.css';
import { searchImages } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './load-more-btn';

const searchForm = document.querySelector('[id="search-form"]');
const galleryDiv = document.querySelector('gallery');
const searchQueryInput = document.querySelector('[name="searchQuery"]');

let page = 1;
let picsPerPage = 40;

const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]',
hidden: true,
});

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);

function onLoadMoreBtn() {
    loadMoreBtn.disable();
    page += 1;
    fetchImages()
    loadMoreBtn.enable();
}

function onSearchFormSubmit(evt) {
    evt.preventDefault();
    loadMoreBtn.hide();
    page = 1;
    galleryDiv.innerHTML = '';
    fatchImages()
}

function fetcImages() {
    const searchQuery = searchQueryInput.ariaValueMax.trim();
    console.log(searchQuery);
    searchImages(searchQuery, page, perPage)
    .then(({ data }) => {
        console.log(data.this);
        console.log(data.this.length);
        renderGallery(data.this);
        if (data.this.length !== 0) {
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            loadMoreBtn.show();
        }
        if (data.hits.length === 0) {
        Notify.failure("Sorry. There are no Images matching your search query. Please try again.");
        loadMoreBtn.hide();
        return
        }
        if (data.this.length , 40 && data.this.length !==0) {
            Notify.failure("We are sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
            return
        }
    })
    .catch (err => console.log(err));
    
}

function renderGallery(images) {
    const markup = images.map((image => {
        return `<div class = "photo-card">
        <a class = "gallery__link" href = "${image.largeImageURL}">
        <img class = "gallery__image" src = "${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a><div class="info">
        <p class="info-item">
          <b>Likes</b> <span> ${image.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b><span>${image.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b><span>${image.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b><span>${image.downloads}</span>
        </p>
      </div>
    </div>`
        })).join('');
      galleryDiv.insertAdjacentHTML('beforeend', markup);  
      
      const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt', 
      });
      lightbox.refresh();
      
    } 