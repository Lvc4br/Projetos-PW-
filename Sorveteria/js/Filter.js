const filterButtons = document.querySelectorAll('.filter-buttons button');
const cards = document.querySelectorAll('.menu-options .menu-option');
const pendingHides = new WeakMap();
let activeFilter = 'all';
let filterRun = 0;

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter ?? 'all';
        const currentRun = ++filterRun;
        const hideDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;

        filterButtons.forEach(filterButton => {
            const isActive = filterButton === button;
            filterButton.classList.toggle('active', isActive);
            filterButton.setAttribute('aria-pressed', String(isActive));
        });

        cards.forEach(card => {
            const pendingHide = pendingHides.get(card);
            if (pendingHide !== undefined) {
                clearTimeout(pendingHide);
                pendingHides.delete(card);
            }

            const shouldShow = activeFilter === 'all' || card.dataset.category === activeFilter;
            card.style.transition = `opacity ${hideDuration}ms ease, transform ${hideDuration}ms ease`;

            if (shouldShow) {
                card.style.display = 'block';
                requestAnimationFrame(() => {
                    if (currentRun !== filterRun) return;
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';

                    requestAnimationFrame(() => {
                        if (currentRun !== filterRun) return;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                });
                return;
            }

            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            const timeout = setTimeout(() => {
                if (currentRun === filterRun && activeFilter !== 'all') {
                    card.style.display = 'none';
                }
                pendingHides.delete(card);
            }, hideDuration);
            pendingHides.set(card, timeout);
        });
    });
});
