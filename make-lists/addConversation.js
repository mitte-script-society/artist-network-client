const fs = require('fs');
const path = require('path');

// Obtener la ruta absoluta del archivo JSON
const concertListPath = path.join(__dirname, 'artist-list.json');

// Leer el archivo JSON
fs.readFile(concertListPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Parsear el contenido del archivo JSON
  let concertList;
  try {
    concertList = JSON.parse(data);
  } catch (err) {
    console.error('Error al parsear el archivo JSON:', err);
    return;
  }

  // Agregar la propiedad conversations a cada elemento si no existe
  concertList.forEach(concert => {
    if (!concert.hasOwnProperty('conversations')) {
      concert.conversations = [];
    }
  });

  console.log(JSON.stringify(concertList, null, 2))

  // Guardar el archivo JSON modificado
 /*  fs.writeFile(concertListPath, JSON.stringify(concertList, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error al escribir el archivo:', err);
    } else {
      console.log('Archivo concert-list.json actualizado con éxito.');
    }
  }); */
});
