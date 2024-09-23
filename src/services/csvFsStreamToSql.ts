import fs from 'fs'; 

let reader = fs.createReadStream('../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1.csv');


reader.on('data', function(chunk){
    console.log(chunk.toString())
})