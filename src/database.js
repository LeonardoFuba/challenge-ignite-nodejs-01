import fs from "node:fs/promises";
const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {}; // atributo privado no javascript

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  // método privado no javascript
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) =>
        Object.entries(search).some(([key, value]) =>
          row[key].toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    if(!this.#database[table]) {
      return `Unable to update record. The table ${table} does not exist in the database`
    }

    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], id, ...data };
      this.#persist()
      return null
    }

    return `Unable to update record. The id ${id} does not exist in the table ${table}`
  }

  delete(table, id) {
    if(!this.#database[table]) {
      return `Unable to delete record. The table ${table} does not exist in the database`
    }

    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex && rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist()
      return null
    }

    return `Unable to delete record. The id ${id} does not exist in the table ${table}`
  }
}
