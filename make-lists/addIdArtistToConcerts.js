const fs = require('fs');
const path = require('path');

// Obtener la ruta absoluta de los archivos JSON
const concertListPath = path.join(__dirname, 'concert-list.json');
const artistListPath = path.join(__dirname, 'artist-list.json');
const newFile = path.join(__dirname, 'concertsWithRandomArtistId.json')

// Leer los archivos JSON
const concertList = JSON.parse(fs.readFileSync(concertListPath, 'utf8'));
const artistList = JSON.parse(fs.readFileSync(artistListPath, 'utf8'));

// Función para obtener un elemento aleatorio de un array
function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Modificar la propiedad artist.$oid de cada concierto
concertList.forEach(concert => {
  const randomArtist = getRandomElement(artistList);
  concert.artist = randomArtist._id;
});

// Imprimir el resultado en la consola
console.log(JSON.stringify(concertList, null, 2));

 // Guardar el archivo JSON modificado (opcional)
fs.writeFileSync(newFile, JSON.stringify(concertList, null, 2), 'utf8');
console.log('Archivo concert-list.json actualizado con éxito.'); 
