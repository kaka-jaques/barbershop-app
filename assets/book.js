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

async function constructCalendar() {
    bookings = await getBooks();
    services = await getServices();
    config = await getConfig();
    availabilityMap = checkAvailabilityForAllDates(config, services, bookings);

    const fullcalendarEl = document.getElementById('calendar');
    const fullcalendar = new FullCalendar.Calendar(fullcalendarEl, {
        initialView: 'dayGridMonth',
        slotDuration: '00:10:00',
        locale: 'pt-br',
        selectable: true,
        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        selectAllow: (selectInfo) => {
            const today = new Date();
            return selectInfo.start >= today;
        },
        dateClick: function (info) {
            const dateStr = info.dateStr;
            if (!availabilityMap[dateStr]) {
                alert("Esta data não está disponível para agendamento.");
                return;
            }

            alert(`Data disponível: ${dateStr}`);
        },
        titleFormat: {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        },
        events: bookings.map(book => ({
            title: book.services.name,
            start: new Date(book.bookingDate).toISOString(),
            end: new Date(book.bookingDate + (book.services.duration[1] * 60000) + (book.services.duration[0] * 3600000)).toISOString(),
            extendedProps: {
                ...book
            }
        }))
    })

    fullcalendar.render();

    updateDayCellContent();

    gsap.to('#loading-screen', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('#loading-screen').style.display = 'none'
        }
    })

}

fullcalendar.on('datesSet', function () {
    updateDayCellContent();
});

function updateDayCellContent() {
    // Obter todas as células visíveis
    const calendarDates = document.querySelectorAll('.fc-daygrid-day'); // Seletor padrão para células do FullCalendar

    calendarDates.forEach((cell) => {
        const dateStr = cell.getAttribute('data-date'); // Data no formato "YYYY-MM-DD"

        if (!dateStr) return;

        // Verificar disponibilidade
        const isAvailable = availabilityMap[dateStr];

        // Adicionar o ícone de disponibilidade
        const icon = document.createElement('i');
        icon.style.marginLeft = '5px';

        if (isAvailable === true) {
            icon.className = 'fa fa-circle';
            icon.style.color = 'green';
            icon.style.width = '10px';
        } else if (isAvailable === false) {
            icon.className = 'fa fa-circle';
            icon.style.color = 'red';
            icon.style.width = '10px';
            cell.style.pointerEvents = 'none'; // Desativar clique
        }

        cell.appendChild(icon);
    });
}

function checkAvailabilityForAllDates(workingHours, services, bookings) {
    const startHour = parseInt(workingHours.openTime[0], 10);
    const endHour = parseInt(workingHours.closeTime[0], 10);

    // Criação de um mapa com disponibilidade por dia
    const availabilityMap = {};

    today = new Date();

    // Listar dias relevantes do calendário
    const daysInMonth = Array.from({ length: maxDaysOfMonth[today.getMonth()] }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));

    daysInMonth.forEach(date => {
        const dateStr = date.toISOString().split("T")[0];

        // Verificar agendamentos por data
        const dayBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.bookingDate).toISOString().split("T")[0];
            return bookingDate === dateStr;
        });

        // Calcular disponibilidade com base nos serviços
        let isAvailable = false;
        for (let service of services) {
            const serviceDuration = service.duration;
            const timeSlots = Array.from(
                { length: (endHour - startHour) * 60 / serviceDuration },
                (_, i) => {
                    const start = new Date(date);
                    start.setHours(startHour, i * serviceDuration);
                    const end = new Date(start);
                    end.setMinutes(start.getMinutes() + serviceDuration);

                    // Verificar conflitos com agendamentos
                    const conflict = dayBookings.some(
                        booking => (new Date(booking.start) < end && new Date(booking.end) > start)
                    );
                    return !conflict;
                }
            );

            if (timeSlots.some(slot => slot)) {
                isAvailable = true;
                break;
            }
        }

        availabilityMap[dateStr] = isAvailable;
    });

    return availabilityMap;
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
        throw new Error('Failed to fetch books');
    }

}

async function getConfig() {

    const response = await fetch('http://localhost:8080/config/workday', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Failed to fetch config');
    }

}

async function getServices() {

    const response = await fetch('http://localhost:8080/config/serviceStats', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Failed to fetch services');
    }

}

document.getElementById('book-tel').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

var lastServiceHour = null;

function closeOverlay() {
    gsap.to('#calendar-overlay', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('#calendar-overlay').style.display = 'none'
        }
    });
}