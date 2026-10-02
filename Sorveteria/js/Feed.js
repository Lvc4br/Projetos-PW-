const composer = document.querySelector('#feed-composer');
const posts = document.querySelector('#feed-posts');

function createComment(text) {
    const comment = document.createElement('p');
    const author = document.createElement('strong');
    author.textContent = 'Visitante';
    comment.className = 'feed-comment';
    comment.append(author, document.createTextNode(text));
    return comment;
}

function createPost(text) {
    const post = document.createElement('article');
    const header = document.createElement('header');
    const avatar = document.createElement('img');
    const identity = document.createElement('div');
    const name = document.createElement('h2');
    const subtitle = document.createElement('p');
    const message = document.createElement('p');
    const summary = document.createElement('div');
    const likeCount = document.createElement('span');
    const commentCount = document.createElement('span');
    const actions = document.createElement('div');
    const likeButton = document.createElement('button');
    const commentButton = document.createElement('button');
    const commentForm = document.createElement('form');
    const input = document.createElement('input');
    const submit = document.createElement('button');
    const comments = document.createElement('div');
    const inputId = `feed-comment-${Date.now()}`;
    const label = document.createElement('label');

    post.className = 'feed-post';
    header.className = 'feed-post__header';
    avatar.className = 'feed-post__avatar';
    avatar.src = './imgs/icones_sorveteria_separados/Logo1.png';
    avatar.alt = '';
    name.textContent = 'Ice Cream Panda';
    subtitle.textContent = 'Nova publicação';
    identity.append(name, subtitle);
    header.append(avatar, identity);
    message.className = 'feed-post__text';
    message.textContent = text;
    summary.className = 'feed-post__summary';
    likeCount.dataset.likeCount = '';
    likeCount.textContent = '0 curtidas';
    commentCount.dataset.commentCount = '';
    commentCount.textContent = 'Participe da conversa';
    summary.append(likeCount, commentCount);
    actions.className = 'feed-post__actions';
    likeButton.className = 'feed-action';
    likeButton.type = 'button';
    likeButton.dataset.like = '';
    likeButton.setAttribute('aria-pressed', 'false');
    likeButton.textContent = 'Curtir';
    commentButton.className = 'feed-action';
    commentButton.type = 'button';
    commentButton.dataset.toggleComments = '';
    commentButton.textContent = 'Comentar';
    actions.append(likeButton, commentButton);
    commentForm.className = 'feed-comment-form';
    commentForm.dataset.commentForm = '';
    commentForm.hidden = true;
    label.className = 'visually-hidden';
    label.htmlFor = inputId;
    label.textContent = 'Escreva um comentário';
    input.id = inputId;
    input.name = 'comment';
    input.type = 'text';
    input.placeholder = 'Escreva um comentário...';
    input.required = true;
    submit.className = 'feed-button';
    submit.type = 'submit';
    submit.textContent = 'Enviar';
    commentForm.append(label, input, submit);
    comments.className = 'feed-comments';
    comments.dataset.comments = '';
    post.append(header, message, summary, actions, commentForm, comments);

    return post;
}

if (composer && posts) {
    const messageInput = composer.querySelector('textarea[name="message"]');
    messageInput?.addEventListener('input', () => messageInput.setCustomValidity(''));

    composer.addEventListener('submit', event => {
        event.preventDefault();
        const input = composer.querySelector('textarea[name="message"]');
        const status = composer.querySelector('.feed-composer__status');
        const message = input?.value.trim();

        if (!input || !status || !message) {
            if (input && !message) {
                input.setCustomValidity('Escreva uma mensagem antes de publicar.');
                input.reportValidity();
            }
            return;
        }

        posts.prepend(createPost(message));
        composer.reset();
        status.textContent = 'Publicação adicionada a este feed.';
        status.hidden = false;
    });

    posts.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const post = target.closest('.feed-post');
        if (!post) return;

        const likeButton = target.closest('[data-like]');
        if (likeButton) {
            const count = post.querySelector('[data-like-count]');
            const wasLiked = likeButton.getAttribute('aria-pressed') === 'true';
            const currentCount = Number.parseInt(count?.textContent ?? '0', 10) || 0;
            const nextCount = Math.max(0, currentCount + (wasLiked ? -1 : 1));
            likeButton.setAttribute('aria-pressed', String(!wasLiked));
            likeButton.textContent = wasLiked ? 'Curtir' : 'Curtido';
            if (count) count.textContent = `${nextCount} ${nextCount === 1 ? 'curtida' : 'curtidas'}`;
            return;
        }

        if (target.closest('[data-toggle-comments]')) {
            const form = post.querySelector('[data-comment-form]');
            if (form) {
                form.hidden = !form.hidden;
                if (!form.hidden) form.querySelector('input')?.focus();
            }
        }
    });

    posts.addEventListener('submit', event => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !form.matches('[data-comment-form]')) return;

        event.preventDefault();
        const post = form.closest('.feed-post');
        const input = form.querySelector('input[name="comment"]');
        const comments = post?.querySelector('[data-comments]');
        const count = post?.querySelector('[data-comment-count]');
        const text = input?.value.trim();
        if (!input || !comments || !text) {
            if (input && !text) {
                input.setCustomValidity('Escreva um comentário antes de enviar.');
                input.reportValidity();
            }
            return;
        }

        comments.append(createComment(text));
        if (count) {
            const total = comments.children.length;
            count.textContent = `${total} ${total === 1 ? 'comentário' : 'comentários'}`;
        }
        form.reset();
        form.hidden = true;
    });

    posts.addEventListener('input', event => {
        const target = event.target;
        if (target instanceof HTMLInputElement && target.name === 'comment') {
            target.setCustomValidity('');
        }
    });
}
