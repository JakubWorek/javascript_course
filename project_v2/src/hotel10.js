const login = (id, passwd) => {
    fetch(`http://localhost:8000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: id, password: passwd })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'OK') {
            window.location.href = 'http://localhost:8000/admin/src/admin.html';
            window.alert('Login successful');
        } else {
            window.alert('Invalid login or password');
        }
    })
    .catch(err => console.trace(err));
}

let rooms = [];

const drawRooms = () => {
    var root = document.getElementById('rooms');
    for (let room of rooms) {
        var div = document.createElement('div');
        div.className = 'col-md-4';

        var img = document.createElement('img');
        img.className = 'room_image';
        img.src = `../public/images/${room.number}.jpg`;
        div.appendChild(img);

        var div2 = document.createElement('div');
        div2.className = 'card-body';

        var h5 = document.createElement('h5');
        h5.className = 'card-title';
        h5.textContent = `Pokój numer ${room.number}`;

        var ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush list-unstyled';

        var li1 = document.createElement('li');
        li1.textContent = `Cena: ${room.price}zł`;

        var li2 = document.createElement('li');
        var free = room.limit - room.guests.length;
        li2.textContent = `Ilość wolnych miejsc: ${free}`;

        var button = document.createElement('button');
        var number = room.number;
        if (free == 0) {
            button.className = 'btn-room-full';
            button.onclick = function() {
                window.alert('Brak wolnych miejsc');
            }
        } else {
            button.className = 'btn-room';
            button.onclick = function() {
                var name = window.prompt('Podaj imię');
                var surname = window.prompt('Podaj nazwisko');
                var arrival = new Date(window.prompt('Podaj datę przyjazdu'));
                var departure = new Date(window.prompt('Podaj datę wyjazdu'));

                var time_diff = departure.getTime() - arrival.getTime();
                var days_past = time_diff / (1000 * 60 * 60 * 24);
                var price = days_past * room.price;

                book(room.number, name, surname, arrival, departure, price);
            }
        }
        button.textContent = 'Zarezerwuj';

        div.appendChild(button);
        div2.appendChild(h5);
        ul.appendChild(li1);
        ul.appendChild(li2);
        div2.appendChild(ul);
        div.appendChild(div2);
                                    
        root.appendChild(div);           
    }
}

fetch('/rooms')
    .then(response => response.json())
    .then(data => {rooms = data; drawRooms()})
    .catch(err => console.trace(err));

let reservations = [] 

fetch('/reservations')
    .then(response => response.json())
    .then(data => {reservations = data})
    .catch(err => console.trace(err));

          
// eslint-disable-next-line
const book = (number, name, surname, arrival, departure, price) => {
    const room = rooms.find(room => {console.log(number, room.number); return room.number === number})
    console.group('book');
    if (room) {
        if (room.guests.length < room.limit) {                                                            
            console.log('Room Number:', number);
            console.log('Guest Name:', name + " " + surname);
            console.log('Arrival:', arrival);
            console.log('Departure:', departure);
            console.log(`Price: ${price}`);

            fetch('http://localhost:8000/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: number,
                    name: name,
                    surname: surname,
                    arrival: arrival,
                    departure: departure,
                    price: price
                })
            }).then( res => res.json())
            .then(data => {
                console.log(data);
                reservations.push(data);
                window.alert('Rezerwacja zakończona sukcesem\nCena: ' + price + 'zł');
                window.location.reload();
            })
            .catch(err => console.trace(err));            
        } else {
            console.warn('Room is full');
        }
    } else {
        console.warn('Room not found');
    }
    console.groupEnd();
}