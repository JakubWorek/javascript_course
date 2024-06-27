const unlog = (id, passwd) => {
  window.location.href = 'http://localhost:8000/src/hotel10.html';
}

const ADDroom = (number, limit, price) => {
  fetch('http://localhost:8000/admin/addroom', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          number: number,
          limit: limit,
          price: price
      })
  }).then( res => res.json())
  .then(data => {
      if (data.status === 'OK') {
          window.alert('Room added');
      } else {
          window.alert('Error');
      }
  })
  .catch(err => console.trace(err));
}

let rooms = [];

fetch('/rooms')
  .then(response => response.json())
  .then(data => {rooms = data})
  .catch(err => console.trace(err));

let reservations = [] 

fetch('/reservations')
  .then(response => response.json())
  .then(data => {reservations = data})
  .catch(err => console.trace(err));

        
// eslint-disable-next-line
const hotel = (commands) => {
  commands = commands.split(" ");
  
  let name;
  let surname;

  switch (commands[0].toLowerCase()) {
      case 'book':
          // eslint-disable-next-line
          const number = parseInt(commands[1]);
          name = commands[2];
          surname = commands[3];
          // eslint-disable-next-line
          const arrival = new Date(commands[4]);
          // eslint-disable-next-line
          const departure = new Date(commands[5]);
          book(number, name, surname, arrival, departure);            
          break;
      case 'guests':
          guests();
          break;
      case 'guest':
          name = commands[1];
          surname = commands[2];
          guest(name, surname);
          break;
      case 'hotel':
          hotel_print();
          break;
      case 'delete':
          fetch('http://localhost:8000/admin/delete', 
          {
              method: 'DELETE'             
          })
          .then(res => res.json())
          .then(data => { console.log(data); })
          break;
      default:
          window.alert('Invalid command');
          break;
  }
  document.getElementById('command_console').value = '';
}

const book = (number, name, surname, arrival, departure) => {
  const room = rooms.find(room => {console.log(number, room.number); return room.number === number})
  console.group('book');
  if (room) {
      if (room.guests.length < room.limit) {                                                            
          console.log('Room Number:', number);
          console.log('Guest Name:', name + " " + surname);
          console.log('Arrival:', arrival);
          console.log('Departure:', departure);

          var time_diff = departure.getTime() - arrival.getTime();
          var days_past = time_diff / (1000 * 60 * 60 * 24);
          var price = days_past * room.price;
          console.log(`Price: ${price}`);

          fetch('http://localhost:8000/admin/book', {
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

const guests = () => {
  console.group('guests');
  let guestlist = []
  for (const room of rooms) {
      guestlist = [...guestlist, ...room.guests]
  }
  guestlist = [...new Set(guestlist)];
  console.log(guestlist);
  console.groupEnd();
}

const guest = (name, surname) => {
  console.group('guest: ', `${name} ${surname}`);
  for (const room of rooms) {
      if (room.guests.includes(`${name} ${surname}`)) {                              
          console.log(`Room ${room.number} is rented by ${name} ${surname}`);
      }
  }
  var to_pay = 0;
  for (const reservation of reservations) {
      if (reservation.guest === `${name} ${surname}`) {
          to_pay = to_pay + parseInt(reservation.price);
      }
  }
  console.log(`To pay: ${to_pay}`)
  console.groupEnd(); 
}

const print_room = (number) => {
  for (const room of rooms) {
      if (room.number === number) {
          console.group('Room number:', number);
          console.log('Guests:', room.guests);
          console.log('Limit:', room.limit);
          console.log('Price:', room.price);
          console.groupEnd();
      }
  }
}

const hotel_print = () => {
  console.group('hotel');
  for (const room of rooms) {
      print_room(room.number);
  }
  console.groupEnd();
}