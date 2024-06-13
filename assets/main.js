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

window.addEventListener('scroll', function(){
    if(window.scrollY > 100){
        gsap.to("header", {
            duration: 0.7,
            height: 85,

        })
        gsap.to(".mobile-header-img", {
            duration: 0.7,
            width: 80
        })
    }else{
        gsap.to("header", {
            duration: 0.5,
            height: 200
        })
        gsap.to(".mobile-header-img", {
            duration: 0.5,
            width: 200
        })
    } 
})