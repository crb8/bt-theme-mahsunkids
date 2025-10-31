const DEV = false; // produção - SEMPRE false para Worker usar URLs absolutas
const DEBUG_LOGS = true; // DEBUG - ativa logs no console

// Helper para logs condicionais
const log = (...args) => DEBUG_LOGS && console.log(...args);
const warn = (...args) => DEBUG_LOGS && console.warn(...args);

// bt-boot - loader específico para Mahsunkids
console.log('[bt-mahsunkids] ✅ Script boot carregado!');

if (!window.__btInit) {
  window.__btInit = true;

  (async () => {
    const host = location.hostname;
    console.log('[bt-mahsunkids] 🌐 Hostname detectado:', host);

    // Validação de domínio específico
    const allowedHosts = ['mahsunkids.com.br', 'www.mahsunkids.com.br'];
    const isAllowed = allowedHosts.some(allowed => host === allowed || host.endsWith('.' + allowed));
    console.log('[bt-mahsunkids] 🔒 Validação de domínio:', isAllowed ? 'PASSOU ✅' : 'BLOQUEADO ❌');

    if (!isAllowed) {
      console.warn('[bt-theme-mahsunkids] ⛔ Domínio não autorizado:', host);
      console.warn('[bt-theme-mahsunkids] 📋 Domínios permitidos:', allowedHosts);
      return;
    }

    console.log('[bt-mahsunkids] 🚀 Iniciando carregamento do tema...');

    try {
      const tenant = 'mahsunkids';
      document.documentElement.setAttribute('data-bt', tenant);

      // Carregar CSS base (tema base opcional)
      const baseCss = new URL('/bt/base.css', import.meta.url).href;
      const pre = Object.assign(document.createElement('link'), {
        rel: 'preload',
        as: 'style',
        href: baseCss,
      });
      const link = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: baseCss,
      });
      document.head.append(pre, link);

      // Carregar CSS específico do tema
      const themeCss = new URL('/bt/bt-overrides.mahsunkids.v1.css', import.meta.url).href;
      const themePre = Object.assign(document.createElement('link'), {
        rel: 'preload',
        as: 'style',
        href: themeCss,
      });
      const themeLink = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: themeCss,
      });
      document.head.append(themePre, themeLink);

      // Importar e inicializar header transparente
      log('[bt-mahsunkids] 🔄 Iniciando import do header...');
      try {
        // ✅ IMPORTANTE: Import dinâmico com string literal para o Vite detectar durante o build
        // O Vite vai gerar: chunks/mahsunkids-header.js
        // Em prod, sempre usar URL absoluta do Worker (boot loader é sempre servido pelo Worker)
        // Em dev, usar import relativo para o Vite resolver durante desenvolvimento
        let headerModule;

        if (DEV) {
          // Dev: usar import relativo (string literal para Vite detectar e gerar chunk)
          headerModule = await import('../blocks/header.js');
          log('[bt-mahsunkids] 🔗 Import relativo usado (dev mode)');
        } else {
          // Prod: sempre usar caminho absoluto do Worker (chunk já foi gerado pelo Vite)
          // Como o boot loader é servido pelo Worker, usar import.meta.url para construir a URL base
          const headerUrl = new URL('/bt/chunks/mahsunkids-header.js', import.meta.url).href;
          log('[bt-mahsunkids] 🔗 URL do header (Worker):', headerUrl);
          log('[bt-mahsunkids] 🔗 import.meta.url base:', import.meta.url);
          headerModule = await import(headerUrl);
        }

        log('[bt-mahsunkids] 📦 Header module carregado:', headerModule);
        log('[bt-mahsunkids] 📋 Funções disponíveis:', Object.keys(headerModule));
        if (typeof headerModule.mount === 'function') {
          log('[bt-mahsunkids] ✅ Função mount encontrada, executando...');
          // Monta header (não precisa de elemento raiz específico)
          await headerModule.mount(document.body, { tenant, host });
          log('[bt-mahsunkids] ✅ Header mount executado');
        } else {
          warn('[bt-mahsunkids] ⚠️ Função mount NÃO encontrada no módulo');
        }
        if (typeof headerModule.initBannerOverlay === 'function') {
          await headerModule.initBannerOverlay();
          log('[bt-mahsunkids] ✅ Banner overlay inicializado');
        }
      } catch (err) {
        console.error('[bt-mahsunkids] ❌ Erro ao carregar header:', err);
        console.error('[bt-mahsunkids] ❌ Stack trace:', err.stack);
      }

      // Importar blocos (serão code-split em chunks pelo Vite)
      const faqModule = () => import('../blocks/faq.js');
      const carouselModule = () => import('../blocks/carousel.js');

      // Montar blocos por âncoras
      document.querySelectorAll('[data-bt-block]').forEach(async el => {
        const kind = el.getAttribute('data-bt-block');
        let mod = null;
        if (kind === 'faq') {
          mod = await faqModule();
        } else if (kind === 'carousel') {
          mod = await carouselModule();
        } else {
          warn('[bt-theme-mahsunkids] Bloco desconhecido:', kind);
          return;
        }
        if (typeof mod.mount === 'function') mod.mount(el, { tenant, host });
      });
    } catch (err) {
      console.error('[bt-theme-mahsunkids] boot error:', err);
    }
  })();
}
