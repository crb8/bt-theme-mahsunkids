export async function mount(root, ctx) {
  const html = `
    <section class="bt-faq">
      <h2 class="bt-faq__title">Dúvidas frequentes</h2>
      <details class="bt-faq__item"><summary>Qual o prazo de entrega?</summary><p>3–5 dias úteis (Sul/Sudeste).</p></details>
      <details class="bt-faq__item"><summary>Como funcionam as trocas?</summary><p>Primeira troca grátis em até 7 dias.</p></details>
    </section>
  `;
  root.insertAdjacentHTML('afterbegin', html);
}
