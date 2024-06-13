var planSwiper = new Swiper(".planSwiper", {
    centeredSlides: true,
    followFinger: true,
    slidesPerView: 1,
    spaceBetween: 50,
    navigation:{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
    }
})