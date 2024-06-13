var planSwiper = new Swiper(".planSwiper", {
    centeredSlides: true,
    followFinger: true,
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
    }
})

window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
        gsap.to("header", {
            duration: 0.7,
            height: 85,

        })
        gsap.to(".mobile-header-img", {
            duration: 0.7,
            width: 80
        })
        gsap.to(".fa-user", {
            duration: 0.7,
            top: 20
        })
    } else {
        gsap.to("header", {
            duration: 0.5,
            height: 200
        })
        gsap.to(".mobile-header-img", {
            duration: 0.5,
            width: 200
        })
        gsap.to(".fa-user", {
            duration: 0.5,
            top: 210
        })
    }
})

function GotoLogin(event) {
    event.preventDefault();
    loadContent('/login.html');
    history.pushState({ page: 'login' }, 'Login', '/login');
};

function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => console.error('Error load content:', error));
}

window.addEventListener('popstate', () => {
    if (window.location.pathname === '/login') {
        loadContent('/login.html');
    }
    else {
        loadContent('/index.html');
    }
})

function sendLogin() {
    if (document.getElementById('login-email').value != '' && document.getElementById('login-password').value != '') {
        document.getElementById('login-button').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        document.getElementById('login-button').disabled = true;
        document.getElementById('login-button').style.cursor = 'not-allowed';
        document.getElementById('login-email').style.border = '1px solid rgb(63, 63, 63)';
        document.getElementById('login-password').style.border = '1px solid rgb(63, 63, 63)';
        login()
    } else{
        if(document.getElementById('login-email').value === ''){
            document.getElementById('login-email').style.border = '1px solid red';
        }
        else{
            document.getElementById('login-email').style.border = '1px solid rgb(63, 63, 63)';
        }
        if(document.getElementById('login-password').value === ''){
            document.getElementById('login-password').style.border = '1px solid red';
        }
        else{
            document.getElementById('login-password').style.border = '1px solid rgb(63, 63, 63)';
        }
    }
}

function login() {
    
}