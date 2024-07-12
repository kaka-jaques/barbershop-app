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
    2: '08:10',
    3: '08:20',
    4: '08:30',
    5: '08:40',
    6: '08:50',
    7: '09:00',
    8: '09:10',
    9: '09:20',
    10: '09:30',
    11: '09:40',
    12: '09:50',
    13: '10:00',
    14: '10:10',
    15: '10:20',
    16: '10:30',
    17: '10:40',
    18: '10:50',
    19: '11:00',
    20: '11:10',
    21: '11:20',
    22: '11:30',
    23: '11:40',
    24: '11:50',
    25: '12:00',
    26: '12:10',
    27: '12:20',
    28: '12:30',
    29: '12:40',
    30: '12:50',
    31: '13:00',
    32: '13:10',
    33: '13:20',
    34: '13:30',
    35: '13:40',
    36: '13:50',
    37: '14:00',
    38: '14:10',
    39: '14:20',
    40: '14:30',
    41: '14:40',
    42: '14:50',
    43: '15:00',
    44: '15:10',
    45: '15:20',
    46: '15:30',
    47: '15:40',
    48: '15:50',
    49: '16:00',
    50: '16:10',
    51: '16:20',
    52: '16:30',
    53: '16:40',
    54: '16:50',
    55: '17:00',
    56: '17:10',
    57: '17:20',
    58: '17:30',
    59: '17:40',
    60: '17:50',
    61: '18:00',
    62: '18:10',
    63: '18:20',
    64: '18:30',
    65: '18:40',
    66: '18:50',
    67: '19:00'
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
            if ((!nextMonth && dia > new Date().getDate() + 8) || (nextMonth && (maxDaysOfMonth[new Date().getMonth()] - new Date().getDate() + dia) > 8)) {
                if (plan.price > 0) {
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-success').style.display = 'none';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-secondary').style.display = 'none';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('.text-danger').style.display = 'block';
                    document.getElementById('week-' + i).querySelector('.day-' + j).querySelector('button').disabled = true
                } else {
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

    if (document.querySelector('#service-time').value == null || document.querySelector('#service').value == 0) {
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

    if (user.client.name == null || document.querySelector('#service').value == 0 || user.client.telephone == '') {
        if (user.client.telephone == '') {
            document.querySelector('#alert').innerHTML = 'Por favor, informe seu telefone! Se você já tem login, <a href="/login.html">atualize no seu perfil aqui</a>';
        } else if (user.client.name == null) {
            document.querySelector('#alert').innerHTML = 'Por favor, informe seu nome! Se você já tem login, <a href="/login.html">atualize no seu perfil aqui</a>';
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
                                window.location.href = '/index.html'
                            }
                        })
                    }, 2250)
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

    } else {
        alert('auth em dev')
    }

}

function padnum(num) {
    return num.toString().padStart(2, '0')
}

async function verifyDate(elem) {
    document.getElementById('service-time').innerHTML = '<option value="0">Selecione o horário</option>';
    document.getElementById('service').value = 0;

    const books = bookings;
    const dateTimeToRemove = books.map(book => extractTimestamp(book.bookingDate));

    let nextMonth = false;

    dia = elem.querySelector('h3').textContent;

    let date = new Date(new Date().getFullYear(), new Date().getMonth(), dia);

    if (elem.parentNode.parentElement.id == 'week-5' && dia < 13 || elem.parentNode.parentElement.id == 'week-6' && dia < 13) {
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
            } else {
                elem.querySelector('.text-success').style.display = 'none';
                elem.querySelector('.text-danger').style.display = 'block';
                elem.querySelector('.text-secondary').style.display = 'none';
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

    document.getElementById('service-time').innerHTML = '<option value="0" selected disabled hidden>Selecione o horário</option>';
    document.getElementById('service').value = 0;
    const books = bookings;
    const dateTimeToRemove = books.map(book => extractTimestamp(book.bookingDate));
    let nextMonth = false;

    dia = elem.querySelector('h3').textContent

    let date = new Date(new Date().getFullYear(), new Date().getMonth(), dia);

    if (elem.parentNode.parentElement.id == 'week-5' && dia < 13 || elem.parentNode.parentElement.id == 'week-6' && dia < 13) {
        date.setMonth(date.getMonth() + 1)
        nextMonth = true;
    }

    let nextKey = 1;

    for (let key in hoursService) {

        if(nextKey > key && nextKey <= Object.keys(hoursService).length){
            key = nextKey.toString();
            nextKey++;
        }else{
            nextKey++;
        }

        let currentTime = new Date();
        let serviceTime = hoursService[key];

        if (dia === currentTime.getDate().toString()) {
            if (!dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + serviceTime) && serviceTime > (padnum(currentTime.getHours()) + ':' + padnum(currentTime.getMinutes()))) {
                if (!dateTimeToRemove.includes(serviceTime)) {
                    const option = document.createElement('option');
                    option.value = key;
                    option.text = serviceTime;
                    document.getElementById('service-time').appendChild(option);
                }
            } else if (dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + serviceTime) && serviceTime < (padnum(currentTime.getHours()) + ':' + padnum(currentTime.getMinutes()))) {
                let bookIndex = bookings.findIndex(book => extractTimestamp(book.bookingDate) == date.toLocaleDateString() + ' ' + serviceTime);
                if (books[bookIndex].services.id == 1 && (bookIndex<dateTimeToRemove.length?dateTimeToRemove[bookIndex+1]:true)) {
                    nextKey += 2;
                }
                if (books[bookIndex].services.id == 2) {
                    nextKey += 2;
                }
                if (books[bookIndex].services.id == 3) {
                    nextKey += 2;
                }
                if (books[bookIndex].services.id == 4) {
                    nextKey += 3;
                }
                if(books[bookIndex].services.id == 5) {
                    nextKey += 2;
                }
                interHoursService(serviceTime, books[bookIndex].services.id, key);
            }
        } else if (dia > currentTime.getDate() || (dia < currentTime.getDate() && nextMonth)) {
            if (!dateTimeToRemove.includes(date.toLocaleDateString() + ' ' + hoursService[key])) {
                const option = document.createElement('option');
                option.value = key;
                option.text = serviceTime;
                document.getElementById('service-time').appendChild(option);
            } else {
                let bookIndex = bookings.findIndex(book => extractTimestamp(book.bookingDate) == date.toLocaleDateString() + ' ' + serviceTime);
                if (bookings[bookIndex].services.id == 1) {
                    nextKey += 2;
                }
                if (bookings[bookIndex].services.id == 2) {
                    nextKey += 2;
                }
                if (bookings[bookIndex].services.id == 3) {
                    nextKey += 2;
                }
                if (bookings[bookIndex].services.id == 4) {
                    nextKey += 3;
                }
                if(bookings[bookIndex].services.id == 5) {
                    nextKey += 2;
                }
                interHoursService(serviceTime, bookings[bookIndex].services.id, key);
            }
        }

        lastServiceHour = null;

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

var lastServiceHour = null;

function interHoursService(serviceHour, serviceId, key) {

    if(lastServiceHour == null){
        lastServiceHour = serviceHour;
    }else{
        if(timeToMinutes(lastServiceHour) - timeToMinutes(serviceHour) < 30){
            document.getElementById('service-time').querySelector(`option[value="${key-2}"]`).remove();
            document.getElementById('service-time').querySelector(`option[value="${key-1}"]`).remove();
        } else if(30 <= timeToMinutes(lastServiceHour) - timeToMinutes(serviceHour) < 40){
            document.getElementById('service-time').querySelector(`option[value="${key-1}"]`).style.disabled = true;
            document.getElementById('service-time').querySelector(`option[value="${key-2}"]`).style.disabled = true;
        }
    }

}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

function closeOverlay() {
    gsap.to('#calendar-overlay', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('#calendar-overlay').style.display = 'none'
        }
    });
}