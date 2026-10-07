// -------------------- Slider --------------------
const slider = document.querySelector('.slider');
const items = slider?.querySelectorAll('.list .item') ?? [];
const next = slider?.querySelector('.next');
const prev = slider?.querySelector('.prev');
const thumbnails = slider?.querySelectorAll('.thumbnail .item') ?? [];
const countItems = items.length;
let itemActive = Math.max(0, Array.from(items).findIndex(item => item.classList.contains('active')));
let refreshInterval;

if (slider && countItems > 0 && next && prev && thumbnails.length === countItems) {
    function restartAutoplay() {
        clearInterval(refreshInterval);
        if (countItems > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            refreshInterval = setInterval(() => {
                itemActive = (itemActive + 1) % countItems;
                showSlider();
            }, 8000);
        }
    }

    function showSlider() {
        items.forEach((item, index) => {
            const isActive = index === itemActive;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-hidden', String(!isActive));
            item.inert = !isActive;
            thumbnails[index].classList.toggle('active', isActive);
            thumbnails[index].setAttribute('aria-current', String(isActive));
        });

        const thumbnail = thumbnails[itemActive];
        const thumbnailList = thumbnail.parentElement;
        thumbnailList.scrollTo({
            left: thumbnail.offsetLeft - (thumbnailList.clientWidth - thumbnail.clientWidth) / 2,
            behavior: 'smooth'
        });

        restartAutoplay();
    }

    next.addEventListener('click', () => {
        itemActive = (itemActive + 1) % countItems;
        showSlider();
    });

    prev.addEventListener('click', () => {
        itemActive = (itemActive - 1 + countItems) % countItems;
        showSlider();
    });

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            itemActive = index;
            showSlider();
        });
    });

    showSlider();
} else if (slider && countItems !== thumbnails.length) {
    console.error('O slider precisa ter uma miniatura para cada produto.');
}

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header?.classList.toggle("sticky", window.scrollY > 0);
});

const botaoMenu = document.querySelector('.menu-hamburguer');
const menu = document.querySelector('.nav-inner > .menu');
const sorvete = document.querySelector('.menu-hamburguer img');

if (botaoMenu instanceof HTMLButtonElement
    && menu instanceof HTMLUListElement
    && sorvete instanceof HTMLImageElement) {
    const fecharMenu = () => {
        menu.classList.remove('menu-aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
        botaoMenu.setAttribute('aria-label', 'Abrir menu');
    };

    botaoMenu.addEventListener('click', () => {
        const aberto = menu.classList.toggle('menu-aberto');
        botaoMenu.setAttribute('aria-expanded', String(aberto));
        botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');

        sorvete.classList.remove('sorvete-girando');
        void sorvete.offsetWidth;
        sorvete.classList.add('sorvete-girando');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('click', event => {
        if (event.target instanceof Node
            && !botaoMenu.contains(event.target)
            && !menu.contains(event.target)) {
            fecharMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.classList.contains('menu-aberto')) {
            fecharMenu();
            botaoMenu.focus();
        }
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', fecharMenu);
}