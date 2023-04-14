const swiperSlides = document.getElementsByClassName('swiper-slide');
for (let i = 0; i < swiperSlides.length; i++) {
  swiperSlides[i].addEventListener('click', function (event) {
    swiperSlides[i].children[0].classList.toggle('swiper-text-active');
  });
}