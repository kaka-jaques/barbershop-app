
if (window.location.pathname == '/login.html' || window.location.pathname == '/register.html') {
    auth();
}
else if (window.location.pathname == '/booking.html') {
    bookAuth();
}

function auth() {
    fetch('http://localhost:8080/auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.status == 302) {

                response.json().then(data => {
                    console.log(data.client.birthDate);
                    if (window.location.pathname == '/login.html') {
                        document.getElementById('main-login').style.display = 'none';
                        document.getElementById('main-profile').style.display = 'flex';
                        document.getElementById('user').value = data.user;
                        document.getElementById('profile-image').src = data.client.image_url;
                        document.getElementById('name').value = data.client.name;
                        document.getElementById('email').value = data.email;
                        document.getElementById('birth').value = new Date(data.client.birthDate[0], data.client.birthDate[1] - 1, data.client.birthDate[2]).toISOString().split('T')[0];
                        document.getElementById('phone').value = data.client.telephone;
                        document.getElementById('plan-title').innerHTML = data.client.plano.name;
                        document.getElementById('plan-price').innerHTML = 'R$' + data.client.plano.price;
                        document.getElementById('plan-description').innerHTML = data.client.plano.description.replace(/\*/g, '<br>*');
                    }
                    else if (window.location.pathname == '/register.html') {
                        window.location.href = '/login.html';
                    }
                    gsap.to('#loading-screen', {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            if (window.location.pathname == '/login.html') {
                                document.getElementById('loading-screen').style.display = 'none';
                            }
                        }
                    })
                })
            }
            else {
                throw new Error('Sem token')
            }
        })
        .catch(error => {
            console.log(error);
            gsap.to('#loading-screen', {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    if (window.location.pathname == '/login.html') {
                        document.getElementById('loading-screen').style.display = 'none';
                    }
                }
            })
        })
}

function phoneCase(e) {
    // Remove caracteres não numéricos
    e.target.value = e.target.value.replace(/\D/g, '');
};

function bookAuth() {

    fetch('http://localhost:8080/auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.status == 302) {
                response.json().then(data => {
                    if (window.location.pathname == '/booking.html') {
                        constructCalendar(data);
                    }
                })
            } else {
                constructCalendar(null);
                throw new Error('Sem token')
            }
        })
        .catch(error => {
            gsap.to('.fa-circle-notch', {
                opacity: 0,
                onComplete: () => {
                    gsap.to('#erro-api-screen',{
                        opacity: 1,
                        display: 'flex',
                    })
                }
            })
        })
}

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
            height: 200,
            delay: 0.2
        })
        gsap.to(".mobile-header-img", {
            duration: 0.5,
            width: 375,
            delay: 0.2
        })
        gsap.to(".fa-user", {
            duration: 0.5,
            top: 210,
            delay: 0.2
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

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'keep': keep
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else if (response.status === 401) {
                document.getElementById('login-button').innerHTML = 'Login';
                document.getElementById('login-button').disabled = false;
                document.getElementById('login-button').style.cursor = 'pointer';
                document.getElementById('login-email').style.border = '1px solid rgb(63, 63, 63)';
                document.getElementById('login-password').style.border = '1px solid rgb(63, 63, 63)';
                alert('Login ou senha inválidos!');
            } else {
                console.log(response.json());
                alert('Erro! Por favor contate o administrador do sistema.');
            }

        })
}

function sendRegister() {
    if (document.getElementById('register-email').value != '' && document.getElementById('register-password').value != '' && document.getElementById('register-user').value != '') {
        document.getElementById('register-button').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        document.getElementById('register-button').disabled = true;
        document.getElementById('register-button').style.cursor = 'not-allowed';
        document.getElementById('register-email').style.border = '1px solid rgb(63, 63, 63)';
        document.getElementById('register-password').style.border = '1px solid rgb(63, 63, 63)';
        document.getElementById('register-user').style.border = '1px solid rgb(63, 63, 63)';
        register();
    } else {
        if (document.getElementById('register-email').value === '') {
            document.getElementById('register-email').style.border = '1px solid red';
        }
        else {
            document.getElementById('register-email').style.border = '1px solid rgb(63, 63, 63)';
        }
        if (document.getElementById('register-password').value === '') {
            document.getElementById('register-password').style.border = '1px solid red';
        }
        else {
            document.getElementById('register-password').style.border = '1px solid rgb(63, 63, 63)';
        }
    }
}

function register() {

    const body = {
        user: document.getElementById('register-user').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value
    }

    console.log(body.json);

    fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.status === 201) {
                response.json().then(data => {
                    console.log(data);
                })
            } else {
                console.log(response.json());
                alert('Erro! Por favor contate o administrador do sistema.');
            }
        })

}

var elemAtual = document.getElementsByClassName('profile-content')[0];

function route(path) {

    setTimeout(() => {
        window.location.href = path;
    }, 500);

}

function changingWindow(elem) {

    elemAtual.style.display = 'none';
    elemAtual = elem;
    elem.style.display = 'flex';


    let position = '';

    if (elem.classList.contains('profile-content')) {
        position = '190deg, transparent 12%, black 12%, black 32%, transparent 32%';
        document.getElementsByClassName('fa-user')[0].style.color = 'white';
        document.getElementsByClassName('fa-id-card')[0].style.color = 'black';
        document.getElementsByClassName('fa-dollar-sign')[0].style.color = 'black';
    }
    else if (elem.classList.contains('profile-credentials')) {
        position = '190deg, transparent 32%, black 32%, black 50%, transparent 50%';
        document.getElementsByClassName('fa-id-card')[0].style.color = 'white';
        document.getElementsByClassName('fa-dollar-sign')[0].style.color = 'black';
        document.getElementsByClassName('fa-user')[0].style.color = 'black';
    }
    else if (elem.classList.contains('profile-plans')) {
        position = '190deg, transparent 52%, black 52%, black 70%, transparent 70%';
        document.getElementsByClassName('fa-dollar-sign')[0].style.color = 'white';
        document.getElementsByClassName('fa-user')[0].style.color = 'black';
        document.getElementsByClassName('fa-id-card')[0].style.color = 'black';
    }

    gsap.to('.nav-bar', {
        duration: 0.3,
        backgroundImage: 'linear-gradient(' + position + ')'
    })

}