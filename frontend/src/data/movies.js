// The movie catalog lives here in the frontend, so the site shows movies even when the backend is off.
// To change the permanent catalog for everyone, edit this file (poster images go in public/posters).
// Movies the admin adds or deletes in the Admin panel are kept in that browser only
// (use "Export catalog" in the Admin panel to copy them back into this file).

const TIMES = ['10:00 AM', '01:30 PM', '06:00 PM', '09:30 PM'];

const movies = [
  { id: 'srimanthudu', title: 'Srimanthudu', posterUrl: '/posters/sremanthudu.jpg', genre: 'Action Drama', language: 'Telugu', durationMins: 151, price: 180, description: 'A wealthy young man returns to a village and takes responsibility for it, bringing a community together.' },
  { id: 'race-gurram', title: 'Race Gurram', posterUrl: '/posters/race-gurram.jpg', genre: 'Action Comedy', language: 'Telugu', durationMins: 160, price: 160, description: 'Two brothers with opposite natures collide in a fast-paced mix of comedy, rivalry and action.' },
  { id: 'eega', title: 'Eega', posterUrl: '/posters/eega.jpg', genre: 'Fantasy', language: 'Telugu', durationMins: 134, price: 150, description: 'A man is reborn as a housefly and sets out to take revenge on the villain who wronged him.' },
  { id: 'nannaku-prematho', title: 'Nannaku Prematho', posterUrl: '/posters/nannaku-prematho.jpg', genre: 'Family Drama', language: 'Telugu', durationMins: 160, price: 160, description: "A son sets out to fulfil his father's last wish in a story about family, love and revenge." },
  { id: 'karthikeya', title: 'Karthikeya', posterUrl: '/posters/karthikeya.jpg', genre: 'Mystery Thriller', language: 'Telugu', durationMins: 142, price: 150, description: 'A young doctor investigates strange events in a temple town and uncovers an old secret.' },
  { id: 'v', title: 'V', posterUrl: '/posters/v.jpg', genre: 'Crime Thriller', language: 'Telugu', durationMins: 136, price: 150, description: 'A police officer is drawn into a tense cat-and-mouse game with a serial killer.' },
  { id: 'hello', title: 'Hello', posterUrl: '/posters/hello.jpg', genre: 'Romance', language: 'Telugu', durationMins: 128, price: 140, description: 'A young man searches for the girl he met as a child and has never forgotten.' },
  { id: 'premalu', title: 'Premalu', posterUrl: '/posters/premalu.jpg', genre: 'Romantic Comedy', language: 'Malayalam', durationMins: 156, price: 150, description: 'A light-hearted romantic comedy about young people, big cities and awkward first love.' },
  { id: 'peddi', title: 'Peddi', posterUrl: '/posters/peddi.jpg', genre: 'Sports Action', language: 'Telugu', durationMins: 150, price: 200, description: 'A rural sports drama with raw action and a hero who fights to rise above his circumstances.' },
  { id: 'the-paradise', title: 'The Paradise', posterUrl: '/posters/paradise.jpg', genre: 'Action Drama', language: 'Telugu', durationMins: 145, price: 200, description: 'A gritty, high-intensity drama set in a world where survival has its own rules.' },
  { id: 'vishwambhara', title: 'Vishwambhara', posterUrl: '/posters/vishwambhara.jpg', genre: 'Fantasy Adventure', language: 'Telugu', durationMins: 150, price: 200, description: 'A grand fantasy adventure that travels across worlds in a battle between good and evil.' }
].map((m) => ({ showtimes: TIMES, ...m }));

export default movies;
