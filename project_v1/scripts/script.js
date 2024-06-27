const rooms_local = [[1, 1, 100, []], [2, 3, 300, []], [3, 2, 200, []]];
let openRequest = indexedDB.open("hotelDB", 1);

openRequest.onupgradeneeded = function(e) {
    let db = e.target.result;
    if (!db.objectStoreNames.contains('rooms')) {
        db.createObjectStore('rooms', {keyPath: 'number'});
        db.createObjectStore('reservations', { autoIncrement: true });
    }
};

openRequest.onsuccess = function(e) {
    let db = e.target.result;
    let transaction = db.transaction('rooms', 'readwrite');
    let store = transaction.objectStore('rooms');

    let countRequest = store.count();
    countRequest.onsuccess = function() {
        if (countRequest.result === 0) {
            rooms_local.forEach(room => {
                store.put({number: room[0], size: room[1], price: room[2], guests: room[3]});
            });
        }
    };
};

openRequest.onerror = function(e) {
    console.log('Error opening/accessing the indexedDB database');
};

let hotel =  () => {
    let commands = document.getElementById('command_console').value;
    commands = commands.split(" ");
            
    switch (commands[0].toLowerCase()) {
        case 'book':
            var number = parseInt(commands[1]);
            var name = commands[2];
            var surname = commands[3];
            var arrival = new Date(commands[4]);
            var departure = new Date(commands[5]);
            book(number, name, surname, arrival, departure);            
            break;
        case 'release':
            var number = parseInt(commands[1]);
            releaseRoom(number);
        case 'guests':
            guests();
            break;
        case 'guest':
            var name = commands[1];
            var surname = commands[2];
            guest(name, surname);
            break;
        case 'hotel':
            hotel_print();
            break;
        case "clear":
            var db = openRequest.result;
            if (!db) {
                console.warn("Ostrzeżenie: Baza danych nie istnieje.");
            } else {
                db.close();
                indexedDB.deleteDatabase("hotelDB");
                console.warn("Baza danych została wyczyszczona");
                window.location.reload();
            }
            break;
        default:
            window.alert('Invalid command');
            break;
    }
    document.getElementById('command_console').value = '';
}

let book = (number, name, surname, arrival, departure) => {
    var db = openRequest.result;

    var transaction = db.transaction(["rooms", "reservations"], "readwrite");
    var rooms = transaction.objectStore("rooms");
    var reservations = transaction.objectStore("reservations");

    var getRoom = rooms.get(number);
    getRoom.onsuccess = function() {
        var room = getRoom.result;

        console.group('book');
        if (room.guests.length < room.size) {                                                            
            console.log('Room Number:', number);
            console.log('Guest Name:', name + " " + surname);
            console.log('Arrival:', arrival);
            console.log('Departure:', departure);

            room.guests.push(`${name} ${surname}`);
            rooms.put(room);

            var time_diff = departure.getTime() - arrival.getTime();
            var days_past = time_diff / (1000 * 60 * 60 * 24);
            var price = days_past * room.price;
            console.log(`Price: ${price}`);
            
            reservations.put({guest: `${name} ${surname}`, room: number, arrival: arrival, departure: departure, price: price});
        } else {
            window.alert('Room is full');
        }
    }
    console.groupEnd();
}

let releaseRoom = (number) => {
    var db = openRequest.result;
    var transaction = db.transaction(["rooms", "reservations"], "readwrite");
    var rooms = transaction.objectStore("rooms");
    var reservations = transaction.objectStore("reservations");

    var getRoom = rooms.get(number);
    getRoom.onsuccess = function() {
        var room = getRoom.result;

        console.group('releaseRoom');
        if (room.guests.length > 0) {                                                            
            console.log('Room Number:', number);
            console.log('Guests Released:', room.guests);

            room.guests = [];
            rooms.put(room);

            // Usunięcie wszystkich rezerwacji dla tego pokoju
            var reservationCursor = reservations.openCursor();
            reservationCursor.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.room === number) {
                        cursor.delete();
                    }
                    cursor.continue();
                }
            };

            console.log('Room released successfully');
        } else {
            console.log('Room is already empty');
        }
        console.groupEnd();
    }
}

let guests = () => {
    var db = openRequest.result;
    var transaction = db.transaction(["reservations"], "readonly");
    var reservations = transaction.objectStore("reservations")

    console.group('guests');
    let guestlist = [];
    var CursorAsk = reservations.openCursor();
    CursorAsk.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            guestlist.push(cursor.value.guest);
            cursor.continue();
        } else {
            guestlist = [...new Set(guestlist)];
            console.log(guestlist);
            console.groupEnd();
        }
    };
}

let guest = (name, surname) => {
    var db = openRequest.result;
    var transaction = db.transaction(["rooms", "reservations"], "readonly");
    var rooms = transaction.objectStore("rooms");
    var reservations = transaction.objectStore("reservations")

    console.group('guest: ', `${name} ${surname}`);

    var CursorAsk = rooms.openCursor();
    CursorAsk.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.guests.includes(`${name} ${surname}`)) {                              
                console.log(`Room ${cursor.value.number} is rented by ${name} ${surname}`);
            }
            cursor.continue();
        } else {
            console.groupEnd();
        }
    };

    var to_pay = 0;
    var CursorAsk = reservations.openCursor();
    CursorAsk.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.guest === `${name} ${surname}`) {                              
                to_pay = to_pay + parseInt(cursor.value.price);
            }
            cursor.continue();
        } else {
            console.log(`To pay: ${to_pay}`)
            console.groupEnd();
        }
    };
}

let hotel_print = () => {
    var db = openRequest.result;
    var transaction = db.transaction(["rooms"], "readonly");
    var rooms = transaction.objectStore("rooms");  

    console.group('hotel');

    var CursorAsk = rooms.openCursor();
    CursorAsk.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.group(`Room ${cursor.value.number}`);
            console.log(`Size: ${cursor.value.size}`);
            console.log(`Price: ${cursor.value.price}`);
            console.log(`Guests: ${cursor.value.guests}`);
            console.groupEnd();
            cursor.continue();
        } else {
            console.groupEnd();
        }
    };
}