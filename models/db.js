const sqlite3 = require('sqlite3');
const { open } = require('sqlite'); // al usar las llaves { ... } estamos aplicando Destructuring Assigment, es decir
// extraemos unicamente el metodo open, evitando asi cargar todo el namespace en una variable innecesaria Optimiza el uso de la memoria y hace el codigo mas limpio 

async function initDB() {
    // Abre el archivo de base de datos (se creará si no existe)
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database // esto hace una Inyeccion de Dependencia, se pasa la impolementacion de bajo nivel SQLite3 al wrapper de alto nivel sqlite
        // El driver es la pieza fundamental que sabe hablar el lenguaje binario del archivo .db, al especificarlo le decimos a la libreria de promesas que motor debe de usar por debajo 
    });


    // IMPORTANTE para tu diseño: Activar el borrado en cascada
    await db.get("PRAGMA foreign_keys = ON");

    // Crear tablas según tus planos de Figma 
    await db.exec(`
        CREATE TABLE IF NOT EXISTS temas (
            id_tema INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_tema TEXT NOT NULL UNIQUE,
            descripcion_tema TEXT,
            autor_tema TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS enlaces (
            id_enlace INTEGER PRIMARY KEY AUTOINCREMENT,
            id_tema INTEGER NOT NULL,
            enlace_url TEXT NOT NULL,
            enlace_descripcion TEXT,
            FOREIGN KEY (id_tema) REFERENCES temas(id_tema) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS votos (
            id_voto INTEGER PRIMARY KEY AUTOINCREMENT,
            id_tema INTEGER NOT NULL,
            id_usuario INTEGER NOT NULL,
            fecha_voto DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_tema) REFERENCES temas(id_tema) ON DELETE CASCADE
        );
    `);

    return db;
}

module.exports = initDB;