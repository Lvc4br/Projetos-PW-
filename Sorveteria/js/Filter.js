const filterButtons = document.querySelectorAll('.filter-buttons button');
const cards = document.querySelectorAll('.menu-options .menu-option');

filterButtons.forEach(button => {
button.addEventListener('click', () => {


    // ==============================
    // Botão ativo
    // ==============================

    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    button.classList.add('active');

    // ==============================
    // Categoria selecionada
    // ==============================

    const filter = button.dataset.filter;

    // ==============================
    // Filtrar cards
    // ==============================

    cards.forEach(card => {

        const category = card.dataset.category;

        const shouldShow =
            filter === 'all' ||
            category === filter;

        if (shouldShow) {

            // Primeiro torna o elemento visível
            card.style.display = 'block';

            // Garante que o navegador registre
            // o estado inicial antes da animação
            requestAnimationFrame(() => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';

                requestAnimationFrame(() => {
                    card.style.transition =
                        'opacity 0.4s ease, transform 0.4s ease';

                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
            });

        } else {

            // Animação de saída
            card.style.transition =
                'opacity 0.3s ease, transform 0.3s ease';

            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            // Remove visualmente depois da animação
            setTimeout(() => {

                // Só esconde se o card ainda
                // estiver sendo filtrado
                if (
                    card.dataset.category !== filter &&
                    filter !== 'all'
                ) {
                    card.style.display = 'none';
                }

            }, 300);
        }
    });
});


});
