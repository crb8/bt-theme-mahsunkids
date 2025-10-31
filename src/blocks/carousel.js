export async function mount(root, ctx) {
  const items = [
    { t: 'Produto excelente!', a: 'Ana' },
    { t: 'Chegou rápido.', a: 'Marcos' },
    { t: 'Voltarei a comprar.', a: 'Lucia' },
  ];
  const html = `
    <div class="bt-carousel" role="region" aria-label="Carrossel">
      <div class="bt-carousel__track">
        ${items
          .map(
            i => `
          <article class="bt-carousel__item">
            <p class="bt-carousel__text">"${i.t}"</p>
            <span class="bt-carousel__author">— ${i.a}</span>
          </article>
        `,
          )
          .join('')}
      </div>
      <button class="bt-carousel__prev" type="button" aria-label="Anterior">‹</button>
      <button class="bt-carousel__next" type="button" aria-label="Próximo">›</button>
    </div>
  `;
  root.insertAdjacentHTML('afterbegin', html);

  const track = root.querySelector('.bt-carousel__track');
  const itemsEls = [...root.querySelectorAll('.bt-carousel__item')];
  let idx = 0;
  const go = d => {
    idx = (idx + d + itemsEls.length) % itemsEls.length;
    track.style.transform = `translateX(${-idx * 100}%)`;
  };
  root.querySelector('.bt-carousel__prev').addEventListener('click', () => go(-1));
  root.querySelector('.bt-carousel__next').addEventListener('click', () => go(+1));
  track.style.display = 'flex';
  track.style.transition = 'transform .3s ease';
  itemsEls.forEach(el => (el.style.minWidth = '100%'));
}
