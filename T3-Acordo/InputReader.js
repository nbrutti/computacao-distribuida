const fs = require('fs');
const csv = require('csv-parser');

class InputReader {
  parseCsv(csv_file) {
    return new Promise((resolve, reject) => {
      let results = [];
      fs.createReadStream(csv_file)
        .pipe(csv({ separator: ';' }))
        .on('data', data => results.push(data))
        .on('end', () => {
          return resolve(results);
        });
    });
  }
}

module.exports = InputReader;