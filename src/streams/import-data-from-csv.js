import fs from "node:fs";
import { parse } from 'csv-parse';

/**
 * biblioteca: csv-parse
 * parse(options): cria um Transform stream 
 *    que converte o chunk de uma linha em um array de strings
 *    separando pelo delimitador especificado.
 *    O delimitador default é ','
 */

const CSVPath = new URL("../../tasks.csv", import.meta.url);

const fileStream = fs.createReadStream(CSVPath)
const CSVparser = parse({
  fromLine: 2, // skip the header line
  skipEmptyLines: true
})

async function importCSV() {
  const taskList = fileStream.pipe(CSVparser)

  for await (const row of taskList) {
    console.log(row)
    const [title, description] = row

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    })
  }

}

importCSV()
