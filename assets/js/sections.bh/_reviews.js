"use strict"

import Swiper, { Navigation, Autoplay, Pagination, Scrollbar, Thumbs, EffectFade, Grid } from "swiper";

window.addEventListener("DOMContentLoaded", (event) => {
  let reviews = new Swiper(".reviews-carousel__swiper", {
    modules: [Navigation, Pagination, EffectFade, Scrollbar],
    // pagination: {
    //   el: ".reviews-pagination",
    //   clickable: true,
    // },
    // effect: 'fade',
    //   fadeEffect: {
    //   crossFade: true
    // },
    navigation: {
      nextEl: ".reviews-carousel__button-next",
      prevEl: ".reviews-carousel__button-prev",
    },
    scrollbar: {
      el: ".reviews-carousel__scrollbar",
    },
    slidesPerView: 1,
    // slidesPerView: 1.1,
    spaceBetween: 20,
    breakpoints: {
      992: {
        slidesPerView: 2,
        spaceBetween: 30,
      }
    }
  });

  const changeCarouselHeight = (carousel, modifier = 0, ignoreScroll = true) => {
    if (!carousel.el.querySelector) return;
    let currentSlides = [
      carousel.el.querySelector('.swiper-slide-active'),
      carousel.el.querySelector('.swiper-slide-next'),
    ];

    if (window.innerWidth < window.media.tablet + 1) {
      currentSlides = [currentSlides[0]];
    }

    const maxHeight = Math.max(...currentSlides.map(slide => slide.querySelector('.reviews-card').getBoundingClientRect().height));
    carousel.el.style.maxHeight = `${maxHeight + modifier}px`;

    if (ignoreScroll) return;

    window.scroll({
      top: carousel.el.closest('.section').getBoundingClientRect().top + pageYOffset,
      left: 0,
      behavior: 'smooth'
    })
  }

  reviews.on('slideChangeTransitionEnd', () => {
    changeCarouselHeight(reviews, 0, false);
  })
  window.addEventListener('resize', () => {
    changeCarouselHeight(reviews);
  })
  changeCarouselHeight(reviews, 20);

// console.log(reviews)
});
