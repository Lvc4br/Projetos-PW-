const productCards = document.querySelectorAll('.menu-option, .product-card');

if (productCards.length > 0 && typeof HTMLDialogElement !== 'undefined') {
    const dialog = document.createElement('dialog');
    dialog.className = 'product-modal';
    dialog.setAttribute('aria-labelledby', 'product-modal-title');
    dialog.innerHTML = `
        <div class="product-modal__content">
            <button class="product-modal__close" type="button" aria-label="Fechar detalhes">&times;</button>
            <img class="product-modal__image" alt="">
            <section class="product-modal__details">
                <p class="product-modal__eyebrow"></p>
                <h2 class="product-modal__title" id="product-modal-title"></h2>
                <p class="product-modal__description"></p>
                <label class="product-modal__payment-label" for="product-modal-payment">Forma de pagamento</label>
                <select class="product-modal__payment" id="product-modal-payment" name="payment-method">
                    <option value="pix">Pix</option>
                    <option value="credit">Cartão de crédito</option>
                    <option value="debit">Cartão de débito</option>
                </select>
                <div class="product-modal__price-row">
                    <span class="product-modal__price-caption">Preço</span>
                    <span class="product-modal__price"></span>
                </div>
            </section>
        </div>
    `;
    document.body.append(dialog);

    const title = dialog.querySelector('.product-modal__title');
    const eyebrow = dialog.querySelector('.product-modal__eyebrow');
    const description = dialog.querySelector('.product-modal__description');
    const image = dialog.querySelector('.product-modal__image');
    const price = dialog.querySelector('.product-modal__price');
    const closeButton = dialog.querySelector('.product-modal__close');
    let activeCard = null;

    function openProductModal(card) {
        const productTitle = card.querySelector('.hover-layer h3, .product-card h3')?.textContent?.trim()
            ?? 'Produto';
        const productEyebrow = card.querySelector('.menu-option__eyebrow, .product-card__eyebrow')?.textContent?.trim()
            ?? '';
        const productDescription = card.querySelector('.hover-layer p:not(.menu-option__eyebrow), .product-card__info > p:not(.product-card__eyebrow):not(.product-card__price)')?.textContent?.trim()
            ?? '';
        const productImage = card.querySelector('img');
        const productPrice = card.querySelector('.menu-option__price, .product-card__price')?.textContent?.trim()
            ?? '';

        title.textContent = productTitle;
        eyebrow.textContent = productEyebrow;
        description.textContent = productDescription || 'Consulte a equipe para saber mais sobre este produto.';
        image.src = productImage?.getAttribute('src') ?? '';
        image.alt = productImage?.alt || productTitle;
        price.textContent = productPrice;
        activeCard = card;
        dialog.showModal();
    }

    productCards.forEach(card => {
        const titleText = card.querySelector('.hover-layer h3, .product-card h3')?.textContent?.trim()
            ?? 'produto';
        const cardImage = card.querySelector('img');

        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', `Ver detalhes: ${titleText}`);

        if (cardImage && card.classList.contains('menu-option')) {
            cardImage.alt = titleText;
        }

        card.addEventListener('click', () => openProductModal(card));
        card.addEventListener('keydown', event => {
            if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
            event.preventDefault();
            openProductModal(card);
        });
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('cancel', event => {
        event.preventDefault();
        if (dialog.open) {
            dialog.close();
        }
    });
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        const cardToFocus = activeCard;
        activeCard = null;
        requestAnimationFrame(() => {
            if (cardToFocus?.isConnected) cardToFocus.focus();
        });
    });
}
