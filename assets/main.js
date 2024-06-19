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
            width: 260
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
            width: 375
        })
        gsap.to(".fa-user", {
            duration: 0.5,
            top: 210
        })
    }
})

function hoveredButton(element, icon, hover) {
    if (hover) {
        gsap.to(element, {
            duration: 0.5,
            backgroundImage: 'linear-gradient(250deg, rgb(255, 255, 255) 100%, #ffffff3d 0%)'
        })
        gsap.to(icon, {
            duration: 0.5,
            color: 'black'
        })
    } else {
        gsap.to(element, {
            duration: 0.5,
            backgroundImage: 'linear-gradient(250deg, rgb(255, 255, 255) 75%, #ffffff3d 0%)'
        })
        gsap.to(icon, {
            duration: 0.5,
            color: 'white'
        })
    }
}

function sendLogin() {
    if (document.getElementById('login-email').value != '' && document.getElementById('login-password').value != '') {
        document.getElementById('login-button').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        document.getElementById('login-button').disabled = true;
        document.getElementById('login-button').style.cursor = 'not-allowed';
        document.getElementById('login-email').style.border = '1px solid rgb(63, 63, 63)';
        document.getElementById('login-password').style.border = '1px solid rgb(63, 63, 63)';
        login(document.getElementById('login-email').value, document.getElementById('login-password').value, document.getElementById('keep').checked);
    } else {
        if (document.getElementById('login-email').value === '') {
            document.getElementById('login-email').style.border = '1px solid red';
        }
        else {
            document.getElementById('login-email').style.border = '1px solid rgb(63, 63, 63)';
        }
        if (document.getElementById('login-password').value === '') {
            document.getElementById('login-password').style.border = '1px solid red';
        }
        else {
            document.getElementById('login-password').style.border = '1px solid rgb(63, 63, 63)';
        }
    }
}

function login(user, password, keep) {
    const body = {
        user: user,
        password: password
    }

    console.log(body);

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'keep': keep
        }
    })
        .then(response => {
            if (!response.ok) {
                document.getElementById('login-button').innerHTML = 'Login';
                document.getElementById('login-button').disabled = false;
                document.getElementById('login-button').style.cursor = 'pointer';
                document.getElementById('login-email').style.border = '1px solid rgb(63, 63, 63)';
                document.getElementById('login-password').style.border = '1px solid rgb(63, 63, 63)';
                alert('Login ou senha inválidos!');
            }
            return response.json()
        })
        .then(data => {
            console.log(data);
            const expiration = new Date();
            if (keep = true) {
                expiration.setDate(expiration.getTime() + (1000 * 60 * 60 * 360));
                document.cookie = "token=" + data.token + "; Max-Age="+ (60*60*15) +"; Expires=" + expiration.toUTCString() + "; path=/; SameSite=Strict; Secure;"
            } else {
                expiration.setDate(expiration.getTime() + (1000 * 60 * 60 * 15));
                document.cookie = "token=" + data.token + "; Max-Age="+ (15*24*60*60) +"; Expires=" + expiration.toUTCString() + "; path=/; SameSite=Strict; Secure;"
            }
        })

}