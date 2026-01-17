const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Rutas
const BLOG_DIR = path.join(__dirname, '../blog');
const DATA_FILE = path.join(__dirname, '../data/posts.json');
const TEMPLATE_FILE = path.join(__dirname, '../blog/template.html');

console.log("--- CREAR NUEVO POST DE BLOG ---");

// Preguntas
const questions = [
    { key: 'titulo', prompt: 'Título del Post: ' },
    { key: 'resumen', prompt: 'Resumen o descripción corta: ' },
    { key: 'etiqueta', prompt: 'Etiqueta (ej. Tech, Poema, Gaming): ' },
    { key: 'imagen', prompt: 'URL o ruta de imagen (Opcional - Enter para omitir): ' }
];

let answers = {};
let currentQ = 0;

function ask() {
    if (currentQ < questions.length) {
        rl.question(questions[currentQ].prompt, (answer) => {
            answers[questions[currentQ].key] = answer.trim();
            currentQ++;
            ask();
        });
    } else {
        processResults();
    }
}

function processResults() {
    rl.close();

    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    // Generar Slug (nombre de archivo)
    const slug = answers.titulo
        .toLowerCase()
        .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const fileName = `${slug}.html`;
    const filePath = path.join(BLOG_DIR, fileName);

    // Preparar HTML de imagen
    let imgHtml = '';
    if (answers.imagen) {
        imgHtml = `<img src="${answers.imagen}" alt="${answers.titulo}" class="post-image">`;
    }

    // Leer Plantilla
    let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

    // Reemplazar Placeholders
    let content = template
        .replace(/{{TITULO}}/g, answers.titulo)
        .replace(/{{FECHA}}/g, formattedDate)
        .replace(/{{ETIQUETA}}/g, answers.etiqueta)
        .replace(/{{IMAGEN_DESTACADA}}/g, imgHtml)
        .replace(/{{CONTENIDO}}/g, `
            <p>Escribe aquí el inicio de tu historia...</p>
            <p>Recuerda usar las herramientas de formato si lo necesitas.</p>
        `);

    // Guardar nuevo archivo
    fs.writeFileSync(filePath, content);
    console.log(`\n✅ Archivo creado: blog/${fileName}`);

    // Actualizar JSON
    let posts = [];
    if (fs.existsSync(DATA_FILE)) {
        posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    const newPost = {
        id: `post-${Date.now()}`,
        titulo: answers.titulo,
        fecha: formattedDate,
        resumen: answers.resumen,
        etiqueta: answers.etiqueta,
        link: `../blog/${fileName}`
    };

    // Agregar al principio
    posts.unshift(newPost);
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));

    console.log("✅ Índice actualizado (data/posts.json)");
    console.log("\n¡Listo! Ahora abre el archivo creado y empieza a escribir.");
}

// Iniciar
ask();
