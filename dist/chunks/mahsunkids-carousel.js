async function i(e,o){const c=`
    <div class="bt-carousel" role="region" aria-label="Carrossel">
      <div class="bt-carousel__track">
        ${[{t:"Produto excelente!",a:"Ana"},{t:"Chegou rápido.",a:"Marcos"},{t:"Voltarei a comprar.",a:"Lucia"}].map(t=>`
          <article class="bt-carousel__item">
            <p class="bt-carousel__text">"${t.t}"</p>
            <span class="bt-carousel__author">— ${t.a}</span>
          </article>
        `).join("")}
      </div>
      <button class="bt-carousel__prev" type="button" aria-label="Anterior">‹</button>
      <button class="bt-carousel__next" type="button" aria-label="Próximo">›</button>
    </div>
  `;e.insertAdjacentHTML("afterbegin",c);const a=e.querySelector(".bt-carousel__track"),s=[...e.querySelectorAll(".bt-carousel__item")];let r=0;const l=t=>{r=(r+t+s.length)%s.length,a.style.transform=`translateX(${-r*100}%)`};e.querySelector(".bt-carousel__prev").addEventListener("click",()=>l(-1)),e.querySelector(".bt-carousel__next").addEventListener("click",()=>l(1)),a.style.display="flex",a.style.transition="transform .3s ease",s.forEach(t=>t.style.minWidth="100%")}export{i as mount};
