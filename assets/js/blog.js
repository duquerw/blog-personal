document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-container');

    if (blogContainer) {
        fetch('../data/posts.json')
            .then(response => response.json())
            .then(posts => {
                posts.forEach(post => {
                    const card = document.createElement('article');
                    card.classList.add('blog-card');

                    card.innerHTML = `
                        <div class="card-content">
                            <span class="card-tag">${post.etiqueta}</span>
                            <h3 class="card-title">${post.titulo}</h3>
                            <p class="card-date">${post.fecha}</p>
                            <p class="card-summary">${post.resumen}</p>
                            <a href="${post.link}" class="card-link">Leer más →</a>
                        </div>
                    `;

                    blogContainer.appendChild(card);
                });
            })
            .catch(error => console.error('Error cargando los posts:', error));
    }
});
