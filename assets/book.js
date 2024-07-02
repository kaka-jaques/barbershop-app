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

const hoursService = {
    1: '08:00',
    2: '08:30',
    3: '09:00',
    4: '09:30',
    5: '10:00',
    6: '10:30',
    7: '11:00',
    8: '11:30',
    9: '12:00',
    10: '12:30',
    11: '13:00',
    12: '13:30',
    13: '14:00',
    14: '14:30',
    15: '15:00',
    16: '15:30',
    17: '16:00',
    18: '16:30',
    19: '17:00',
    20: '17:30',
    21: '18:00',
    22: '18:30',
    23: '19:00'
}

var bookings = null;

async function constructCalendar(data) {

    const books = await getBooks();
    bookings = books;

    document.getElementById('month').innerHTML = months[new Date().getMonth()];

    let plan;

    if (data != null) {
        plan = data.client.plano;
    } else {
        plan = { price: 0 };
    }

    let firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    let dia = 1;
    let nextMonth = false;

    //if (firstDayOfMonth.getDay() > 0) {
        for (let j = 1; j <= 7; j++) {
            document.getElementById('week-1').querySelector('.day-' + j).querySelector('h3').innerHTML = (maxDaysOfMonth[new Date().getMonth() - 1] - firstDayOfMonth.getDay() + j);
            if (j < firstDayOfMonth.getDay() + 1) {
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-success').style.display = 'none'
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-danger').style.display = 'none'
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('button').disabled = true
            }
            if (j >= firstDayOfMonth.getDay() + 1) {
                document.getElementById('week-1').querySelector('.day-' + j).querySelector('h3').innerHTML = dia;
                await verifyDate(document.getElementById('week-1').querySelector('.day-' + j).querySelector('button'));
                if (dia < new Date().getDate()) {
                    document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
                    document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
                    document.getElementById('week-1').querySelector('.day-' + j).querySelector('.text-danger').style.display = 'block';
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
    //}

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
            if ((!nextMonth && dia > new Date().getDate()+8) || (nextMonth && (maxDaysOfMonth[new Date().getMonth()] - new Date().getDate() + dia) > 8)) {
                if (plan.price > 0) {
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-danger').style.display = 'block';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('button').disabled = true
                }else{
                    if ((dia > new Date().getDate() & !nextMonth) || (dia < new Date().getDate() && nextMonth) || dia == new Date().getDate()) {
                        await verifyDate(document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('button'));
                    }
                }
            }
            if ((dia <= new Date().getDate() && j != 1 && !nextMonth)) {
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
                width: 10
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

function extractTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function getBooks() {
    try {
        const response = await fetch('http://localhost:8080/book/client', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            //TODO - Criar info de erro
            throw new Error('Failed to fetch books');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        // Handle the error appropriately here
        return null;
    }
}


function sendBook() {

    if(document.querySelector('#service-time').value == null || document.querySelector('#service').value == 0){
        document.querySelector('#alert').innerHTML = 'Por favor, preencha todos os campos';
        gsap.to('#alert', {
            display: 'flex',
            opacity: 1,
        })
        setTimeout(() => {
            gsap.to('#alert', {
                opacity: 0,
                onComplete: () => {
                    document.querySelector('#alert').style.display = 'none'
                }
            })
        }, 5000)
        return;
    }

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
                    booking(data);
                    gsap.to('#calendar-overlay', {
                        opacity: 0,
                        onComplete: () => {
                            document.querySelector('#calendar-overlay').style.display = 'none'
                        }
                    })
                })
            } else {
                gsap.to('#calendar-user', {
                    display: 'flex',
                    opacity: 1
                })
            }
        })

}

document.getElementById('book-tel').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

function booking(user) {

    if(user.client.name == null || document.querySelector('#service').value == 0 || user.client.telephone == ''){
        if(user.client.telephone == ''){
            document.querySelector('#alert').innerHTML = 'Por favor, informe seu telefone! Se você já tem login, <a href="/login.html">atualize no seu perfil aqui</a>';
        }else{
            document.querySelector('#alert').innerHTML = 'Por favor, preencha todos os campos';
        }
        gsap.to('#alert', {
            display: 'flex',
            opacity: 1,
        })
        setTimeout(() => {
            gsap.to('#alert', {
                opacity: 0,
                onComplete: () => {
                    document.querySelector('#alert').style.display = 'none'
                }
            })
        }, 8000)
        return;
    }
    // else if(document.querySelector('#book-user') == null || document.querySelector('book-tel') == null){
    //     document.querySelector('#alert').innerHTML = 'Por favor, preencha todos os campos';
    //     gsap.to('#alert', {
    //         display: 'flex',
    //         opacity: 1,
    //     })
    //     setTimeout(() => {
    //         gsap.to('#alert', {
    //             opacity: 0,
    //             onComplete: () => {
    //                 document.querySelector('#alert').style.display = 'none'
    //             }
    //         })
    //     }, 5000)
    //     return;
    // }

    let date = document.querySelector('#calendar-overlay').querySelector('h3').textContent.split('/');
    let hour = hoursService[document.querySelector('#service-time').value].split(':');
    let bookDate = new Date(Date.UTC(parseInt(date[2], 10), parseInt(date[1], 10) - 1, parseInt(date[0], 10), parseInt(hour[0], 10), parseInt(hour[1], 10)));

    let body = {
        bookingDate: bookDate,
        services: {
            id: document.querySelector('#service').value
        },
        client: user.client
    }

    if (user.client.active) {

        fetch('http://localhost:8080/book', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Auth': true
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.status == 201) {
                    gsap.to('#calendar-overlay', {
                        opacity: 0,
                        onComplete: () => {
                            document.querySelector('#calendar-overlay').style.display = 'none'
                        }
                    });
                    gsap.to('#calendar-user', {
                        opacity: 0,
                        onComplete: () => {
                            document.querySelector('#calendar-user').style.display = 'none'
                        }
                    })
                    document.querySelector('#alert').innerHTML = 'Reserva efetuada com sucesso!';
                    document.querySelector('#alert').classList.remove('alert-danger');
                    document.querySelector('#alert').classList.add('alert-success');
                    gsap.to('#alert', {
                        display: 'flex',
                        opacity: 1,
                    })
                    setTimeout(() => {
                        gsap.to('#alert', {
                            opacity: 0,
                            onComplete: () => {
                                document.querySelector('#alert').style.display = 'none'
                                document.querySelector('#alert').classList.remove('alert-success');
                                document.querySelector('#alert').classList.add('alert-danger');
                            }
                        })
                    }, 5000)
                } else {
                    document.querySelector('#alert').innerHTML = 'Erro ao efetuar reserva!';
                    gsap.to('#alert', {
                        display: 'flex',
                        opacity: 1,
                    })
                    setTimeout(() => {
                        gsap.to('#alert', {
                            opacity: 0,
                            onComplete: () => {
                                document.querySelector('#alert').style.display = 'none'
                            }
                        })
                    }, 5000)
                }
            })

    }else{
        alert('auth em dev')
    }

}

function padnum(num){
    return num.toString().padStart(2,'0')
}

async function verifyDate(elem) {
    document.getElementById('service-time').innerHTML = '<option value="0">Selecione o horário</option>';
    document.getElementById('service').value = 0;

    const books = bookings;
    const dateTimeToRemove = books.map(book => extractTimestamp(book.bookingDate));

    let nextMonth = false;

    dia = elem.querySelector('h3').textContent;

    let date = new Date(new Date().getFullYear(), new Date().getMonth(), dia);

    if (elem.parentNode.parentElement.id == 'week-5' && dia < new Date().getDate() || elem.parentNode.parentElement.id == 'week-6' && dia < new Date().getDate()) {
        date.setMonth(date.getMonth() + 1)
        nextMonth = true;
    }

    for (const key in hoursService) {
        let currentTime = new Date();
        let currentTimeFormatted = padnum(currentTime.getHours()) + ':' + padnum(currentTime.getMinutes());
        let serviceTime = hoursService[key];

        if (dia === currentTime.getDate().toString()) {
            if (!dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + serviceTime) && serviceTime > currentTimeFormatted) {
                if (!dateTimeToRemove.includes(serviceTime)) {
                    const option = document.createElement('option');
                    option.value = key;
                    option.text = serviceTime;
                    document.getElementById('service-time').appendChild(option);
                    elem.querySelector('.text-success').style.display = 'block';
                    elem.querySelector('.text-danger').style.display = 'none';
                    elem.querySelector('.text-secondary').style.display = 'none';
                }
            }
        } else if (dia > currentTime.getDate() || (dia < currentTime.getDate() && nextMonth)) {
            if (!dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + hoursService[key])) {
                const option = document.createElement('option');
                option.value = key;
                option.text = serviceTime;
                document.getElementById('service-time').appendChild(option);
                elem.querySelector('.text-success').style.display = 'block';
                elem.querySelector('.text-danger').style.display = 'none';
                elem.querySelector('.text-secondary').style.display = 'none';
            }
        }
    }

    if (document.getElementById('service-time').getElementsByTagName('option').length == 1) {
        elem.querySelector('.text-success').style.display = 'none';
        elem.querySelector('.text-danger').style.display = 'block';
        elem.disabled = true;
    }
}

async function openOverlay(elem) {

    document.getElementById('service-time').innerHTML = '<option value="0">Selecione o horário</option>';
    document.getElementById('service').value = 0;

    const books = bookings;
    const dateTimeToRemove = books.map(book => extractTimestamp(book.bookingDate));

    let nextMonth = false;

    dia = elem.querySelector('h3').textContent

    let date = new Date(new Date().getFullYear(), new Date().getMonth(), dia);

    if (elem.parentNode.parentElement.id == 'week-5' && dia < new Date().getDate() || elem.parentNode.parentElement.id == 'week-6' && dia < new Date().getDate()) {
        date.setMonth(date.getMonth() + 1)
        nextMonth = true;
    }

    for (const key in hoursService) {
        let currentTime = new Date();
        let serviceTime = hoursService[key];

        if (dia === currentTime.getDate().toString()) {
            if (!dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + hoursService[key]) && serviceTime > (currentTime.getHours() + ':' + currentTime.getMinutes())) {
                if (!dateTimeToRemove.includes(serviceTime)) {
                    const option = document.createElement('option');
                    option.value = key;
                    option.text = serviceTime;
                    document.getElementById('service-time').appendChild(option);
                }
            }
        } else if (dia > currentTime.getDate() || (dia < currentTime.getDate() && nextMonth)) {
            if (!dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + hoursService[key])) {
                const option = document.createElement('option');
                option.value = key;
                option.text = serviceTime;
                document.getElementById('service-time').appendChild(option);
            }
        }
    }

    if (document.getElementById('service-time').getElementsByTagName('option').length == 1) {
        elem.querySelector('.text-success').style.display = 'none';
        elem.querySelector('.text-danger').style.display = 'block';
        elem.disabled = true;
    } else {
        document.querySelector('#calendar-overlay').querySelector('h3').innerHTML = date.toLocaleDateString();

        gsap.to('#calendar-overlay', {
            display: 'flex',
            opacity: 1
        })
    }


}

function closeOverlay() {
    gsap.to('#calendar-overlay', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('#calendar-overlay').style.display = 'none'
        }
    });
}