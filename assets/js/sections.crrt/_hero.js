import Swiper, { Navigation, Pagination, EffectCreative } from "swiper";
import {debounce} from "../helpers.b/condition-helpers.js";

window.addEventListener('DOMContentLoaded', (event) => {
	const hero = document.querySelector('.hero');

	if (!hero) return;


	const swiperConfig = {
		speed: 450,
		slidesPerView: 1,
		modules: [Navigation, Pagination, EffectCreative],
		spaceBetween: 10,
		effect: "creative",
		creativeEffect: {
			prev: {
				shadow: true,
				translate: ["-20%", 0, -1],
				opacity: 0,
			},
			next: {
				translate: ["130%", 0, 0],
			},
		},

		navigation: {
			nextEl: ".hero-gallery__button-next",
			prevEl: ".hero-gallery__button-prev",
		},

		lazy: {
		    loadPrevNext: true, // pre-loads the next image to avoid showing a loading placeholder if possible
		    loadPrevNextAmount: 2 //or, if you wish, preload the next 2 images
		},
	}
	// console.log(swiperConfig)

	let heroGallerySwiper = new Swiper('.hero-gallery__swiper', swiperConfig);
	// console.log(heroGallerySwiper)



  const searchForm = document.querySelector('.hero__bookform');
  function getCarCard(car) {
    const card = document.createElement('article');
    card.classList.add('js_created', 'car-card');
    card.dataset.id = car.id;

    let dateStart = '';
    if (car.search_start) {
      dateStart = `date_start=${car.search_start}&`;
    }
    let dateEnd = '';
    if (car.search_end) {
      dateEnd = `date_end=${car.search_end}&`;
    }
    let locationStart = '';
    if (car.location_start) {
      locationStart = `location_start=${car.location_start}&`;
    }
    let flightNumber = '';
    if (car.flight_number) {
      flightNumber = `flight_number=${car.flight_number}`;
    }

    car.url = `${car.url}?${dateStart}${dateEnd}${locationStart}${flightNumber}`;

    let carHtml = `
        <div class="car-card__media">
            <picture class="car-card__media-pic">
                <img class="car-card__media-img" src="${car.thumb}" alt="${car.title}">
            </picture>
        </div>
        <div class="car-card__body">
            <header class="car-card__header">
                <h3 class="car-card__title">
                    <a href="${car.url}" class="car-card__link">${car.title}</a>
                </h3>
                <div class="car-card__header-info">
            <span class="car-card__price">
              <span>${car.price_cheap}</span>
              <span class="currency">${car.currency}</span>
            </span>
            <span class="car-card__caption">${car.text_price_hint}</span>
                </div>
            </header>
            <div class="car-card__bullets">
      `;

    if (car.fuel && car.fuel != 0) {
      carHtml += `
                <div class="car-card-bullet">
                    <div class="car-card-bullet__media">
                        <picture class="car-card-bullet__media-pic">
                            <img class="car-card-bullet__media-img" src="${window.m_ajax.static}/img/common.crrt/icon-fuel.svg" alt="">
                        </picture>
                    </div>
                    <p class="card-card-bullet__caption">${car.fuel}</p>
                </div>
                `;
    }
    if (car.number_seats && car.number_seats != 0) {
      carHtml += `
                <div class="car-card-bullet">
                    <div class="car-card-bullet__media">
                        <picture class="car-card-bullet__media-pic">
                            <img class="car-card-bullet__media-img" src="${window.m_ajax.static}/img/common.crrt/icon-capacity.svg" alt="">
                        </picture>
                    </div>
                    <p class="card-card-bullet__caption">${car.number_seats}</p>
                </div>
                `;
    }

    if (car.trunk_volume && car.trunk_volume != 0) {
      carHtml += `
                <div class="car-card-bullet">
                    <div class="car-card-bullet__media">
                        <picture class="car-card-bullet__media-pic">
                            <img class="car-card-bullet__media-img" src="${window.m_ajax.static}/img/common.crrt/icon-volume.svg" alt="">
                        </picture>
                    </div>
                    <p class="card-card-bullet__caption">${car.trunk_volume}</p>
                </div>
                `;
    }
    if (car.transmission && car.transmission != 0) {
      carHtml += `
                <div class="car-card-bullet">
                    <div class="car-card-bullet__media">
                        <picture class="car-card-bullet__media-pic">
                            <img class="car-card-bullet__media-img" src="${window.m_ajax.static}/img/common.crrt/icon-transmission.svg" alt="">
                        </picture>
                    </div>
                    <p class="card-card-bullet__caption">${car.transmission}</p>
                </div>
                `;
    }

    carHtml += `
            </div>
        </div>
        <div class="car-card__body">
            <a href="${car.url}" class="button-primary car-card__button">${car.text_book}</a>
        </div>
    `;
    card.innerHTML = carHtml;

    return card;
  }

  const carsShelf = document.querySelector('#cars .shelf__content')
  searchForm.addEventListener('submit-success', (e) => {
    const result = JSON.parse(e.detail.result);
    carsShelf.innerHTML = '';

    result.cars.forEach(car => {
      car.search_start = result.search_start;
      car.search_end = result.search_end;
      car.flight_number = result.flight_number;
      car.location_start = result.location_start;
      const card = getCarCard(car);
      carsShelf.append(card)
    })

    if (result.cars.length === 0) {
      const message = document.createElement('p');
      message.innerText = result.messages.empty
      message.classList.add('text-center', 'shelf__message');
      carsShelf.append(message)
    }

    window.scroll({
      top: document.querySelector('#cars').getBoundingClientRect().top + pageYOffset,
      left: 0,
      behavior: 'smooth'
    })

    searchForm.querySelector('.js_form__submit').classList.remove('button--wait');

  })
});
