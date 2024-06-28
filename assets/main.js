
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
                    if (window.location.pathname == '/login.html') {
                        document.getElementById('main-login').style.display = 'none';
                        document.getElementById('main-profile').style.display = 'flex';
                        document.getElementById('user').value = data.user;
                        document.getElementById('profile-image').src = data.client.image_url;
                        document.getElementById('name').value = data.client.name;
                        document.getElementById('email').value = data.email;
                    }
                    else if (window.location.pathname == '/register.html') {
                        window.location.href = '/login.html';
                    }
                })
            }
        })
}

function bookAuth() {

    fetch('http://localhost:8080/auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if(response.status == 302){
                response.json().then(data => {
                    if (window.location.pathname == '/booking.html') {
                        constructCalendar(data);
                    }
                })
            }else{
                constructCalendar(null);
            }
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

function route(path){

    setInterval(() => {
        window.location.href = path;
    }, 550);

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

const months = {
    0: 'Janeiro',
    1: 'Fevereiro',
    2: 'Março',
    3: 'Abril',
    4: 'Maio',
    5: 'Junho',
    6: 'Julho',
    7: 'Agosto',
    8: 'Setembro',
    9: 'Outubro',
    10: 'Novembro',
    11: 'Dezembro'
}

const maxDaysOfMonth = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
}

function constructCalendar(data) {

    document.getElementById('month').innerHTML = months[new Date().getMonth()];
    
    let plan;

    if(data != null){
        plan = data.client.plano;
    }else{
        plan = {price: 0};
    }

    let firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    let dia = 1;
    let nextMonth = false;

    if (firstDayOfMonth.getDay() > 0) {
        for (let j = 1; j <= 7; j++) {
            document.getElementById('week-1').querySelector('.day-' + j).querySelector('h3').innerHTML = (maxDaysOfMonth[new Date().getMonth() - 1] - firstDayOfMonth.getDay() + j);
            if (j < firstDayOfMonth.getDay() + 1) {
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-success').style.display = 'none'
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-danger').style.display = 'none'
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('button').disabled = true
            }
            if (j >= firstDayOfMonth.getDay() + 1) {
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('h3').innerHTML = dia;
                if (dia < new Date().getDate()) {
                    document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
                    document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
                    document.getElementById('week-1').querySelector('.day-' + j).querySelector('button').disabled = true
                }
                dia++;
            }
            if (j == 1) {
                document.getElementById('week-1').querySelector('.day-1').querySelector('.text-success').style.display = 'none'
                document.getElementById('week-1').querySelector('.day-1').querySelector('.text-danger').style.display = 'none'
                document.getElementById('week-1').querySelector('.day-1').querySelector('button').disabled = true
            }
        }
    }

    for (let i = 2; i <= 6; i++) {

        for (let j = 1; j <= 7; j++) {
            document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('h3').innerHTML = dia;
            document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-danger').style.display = 'none';
            document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
            dia++;
            if (dia > maxDaysOfMonth[new Date().getMonth()]) {
                dia = 1;
                nextMonth = true;
            }
            if ((dia + 7 > new Date().getDate() && nextMonth) || (nextMonth && dia > (new Date().getDate() + 8 - maxDaysOfMonth[new Date().getMonth()]))) {
                if (plan.price > 0) {
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-danger').style.display = 'block';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('button').disabled = true
                }
            }
            // if (nextMonth) {
            //     document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
            //     document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-danger').style.display = 'none';
            //     document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'block';
            //     document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('button').disabled = true
            // }
            if (dia <= new Date().getDate() && j != 1 && !nextMonth) {
                document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
                document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
                document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-danger').style.display = 'block';
                document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('button').disabled = true
            }
            if (j == 1) {
                document.getElementById('week-' + i).querySelector('.day-1').querySelector('.text-success').style.display = 'none'
                document.getElementById('week-' + i).querySelector('.day-1').querySelector('.text-danger').style.display = 'none'
                document.getElementById('week-' + i).querySelector('.day-1').querySelector('.text-secondary').style.display = 'block'
                document.getElementById('week-' + i).querySelector('.day-1').querySelector('button').disabled = true
            }
        }

    }

    if (window.screen.width < 380 || window.screen.height < 785) {
        for (let i = 1; i <= 7; i++) {
            gsap.to($('.day-' + i).find('h3'), {
                duration: 0,
                fontSize: 18
            });
            gsap.to($('.day-' + i).find('svg'), {
                duration: 0,
                width: 7
            });
            gsap.to('#month', {
                duration: 0,
                fontSize: 20
            });
            gsap.to('#calendar', {
                duration: 0,
                height: '85%'
            })
        }
    }

    gsap.to('#loading-screen', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('#loading-screen').style.display = 'none'
        }
    })

}

function openOverlay(elem) {

    dia = elem.querySelector('h3').textContent

    let date = new Date(new Date().getFullYear(), new Date().getMonth(), dia);

    if (elem.parentNode.parentElement.id == 'week-5' && dia < new Date().getDate() || elem.parentNode.parentElement.id == 'week-6' && dia < new Date().getDate()) {
        date.setMonth(date.getMonth() + 1)
    }

    document.querySelector('#calendar-overlay').querySelector('h3').innerHTML = date.toLocaleDateString();

    gsap.to('#calendar-overlay', {
        display: 'flex',
        opacity: 1
    })
}

function closeOverlay() {
    gsap.to('#calendar-overlay', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('#calendar-overlay').style.display = 'none'
        }
    });

}