// ===== HEADER TRANSPARENTE - MAHUNKIDS =====

// Helper para logs condicionais (sincronizado com boot/index.js)
const DEV = false; // produção - não usado aqui
const DEBUG_LOGS = true; // DEBUG - ativa logs no console
const log = (...args) => DEBUG_LOGS && console.log(...args);
const warn = (...args) => DEBUG_LOGS && console.warn(...args);

export async function mount(root, ctx) {
  'use strict';

  log('[bt-mahsunkids] 🚀 Script de header carregado!');

  // Função para aguardar header aparecer no DOM
  function waitForHeader(maxAttempts = 50, interval = 100) {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkHeader = () => {
        attempts++;
        const header = document.querySelector('#header-react-app');
        if (header) {
          log('[bt-mahsunkids] ✅ Header encontrado após', attempts, 'tentativas');
          resolve(header);
          return;
        }
        if (attempts >= maxAttempts) {
          console.error('[bt-mahsunkids] ❌ Header não encontrado após', maxAttempts, 'tentativas');
          resolve(null);
          return;
        }
        setTimeout(checkHeader, interval);
      };
      checkHeader();
    });
  }

  // Aguarda o header aparecer e então inicializa
  async function initWhenReady() {
    const header = await waitForHeader();
    if (header) {
      init(header);
    }
  }

  // Verifica se já está disponível ou aguarda
  const existingHeader = document.querySelector('#header-react-app');
  if (existingHeader) {
    log('[bt-mahsunkids] ✅ Header já disponível, iniciando...');
    init(existingHeader);
  } else {
    log('[bt-mahsunkids] ⏳ Aguardando header aparecer...');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWhenReady);
    } else {
      initWhenReady();
    }
  }

  function init(header) {
    console.log('[bt-mahsunkids] ✅ Iniciando configuração do header...');

    if (!header) {
      console.error('[bt-mahsunkids] ❌ Header não fornecido!');
      return;
    }

    console.log('[bt-mahsunkids] ✅ Header recebido:', header);

    // ===== CONFIGURAÇÃO =====
    const CONFIG = {
      transparentHeader: true,
      onlyHomePage: true,
      allowedPages: ['/mah-sun-kids', '/teste', '/home-nova'],
      scrollThreshold: 50,
    };

    // ===== FORÇA SUBMENUS PRETOS =====
    function forceSubmenuColors() {
      const elements = document.querySelectorAll(
        '.container-menu a, .container-menu span.menu-text'
      );
      elements.forEach(function (el) {
        el.classList.remove('text-cor-texto');
        el.classList.remove('dark:text-secondary-50');
        el.classList.remove('dark:text-secondary-300');
        el.classList.remove('dark:hover:text-secondary-300');
        el.style.color = '#333333';
      });

      const containers = document.querySelectorAll('.container-menu');
      containers.forEach(function (container) {
        container.style.backgroundColor = '#ffffff';
      });
    }

    // ===== DETECTA PÁGINA PERMITIDA =====
    function isAllowedPage() {
      const path = window.location.pathname;
      console.log('[bt-mahsunkids] 🔍 Verificando página:', path);
      console.log('[bt-mahsunkids] 📋 Páginas permitidas:', CONFIG.allowedPages);

      const isAllowed = CONFIG.allowedPages.some((allowed) => {
        const exactMatch = path === allowed;
        const withSlash = path === allowed + '/';
        const startsWith = path.startsWith(allowed + '/');
        console.log(`[bt-mahsunkids]   Testando "${allowed}": exact=${exactMatch}, withSlash=${withSlash}, startsWith=${startsWith}`);
        return exactMatch || withSlash || startsWith;
      });

      console.log('[bt-mahsunkids] 🎯 Resultado final: Página', isAllowed ? 'PERMITIDA ✅' : 'NÃO PERMITIDA ❌');
      return isAllowed;
    }

    // ===== VERIFICA SE APLICA TRANSPARENTE =====
    function shouldApplyTransparentHeader() {
      if (!CONFIG.transparentHeader) return false;
      if (CONFIG.onlyHomePage) {
        return isAllowedPage();
      }
      return true;
    }

    // ===== FORÇA POSITION FIXED =====
    function ensureFixedPosition() {
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.width = '100%';
      header.style.zIndex = '999';
    }

    // ===== CONTROLE DO SCROLL =====
    function checkScroll() {
      ensureFixedPosition();

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeTransparent = shouldApplyTransparentHeader();

      log(
        '[bt-mahsunkids] 📊 Scroll:',
        scrollTop,
        '| Deve ser transparente?',
        shouldBeTransparent
      );

      // Se não deve ser transparente, força branco
      if (!shouldBeTransparent) {
        header.classList.add('header-scrolled');
        header.style.backgroundColor = '#ffffff';
        log('[bt-mahsunkids] ✅ Header BRANCO (página não permitida)');
        return;
      }

      // Se deve ser transparente, verifica scroll
      if (scrollTop > CONFIG.scrollThreshold) {
        header.classList.add('header-scrolled');
        header.style.backgroundColor = '#ffffff';
        log('[bt-mahsunkids] ✅ Header BRANCO (scrolled)');
      } else {
        header.classList.remove('header-scrolled');
        header.style.backgroundColor = 'transparent';
        log('[bt-mahsunkids] ✅ Header TRANSPARENTE');
      }
    }

    // ===== INICIALIZAÇÃO =====
    ensureFixedPosition();
    checkScroll();

    // Listener de scroll
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Adiciona classe ao body
    const shouldAdd = shouldApplyTransparentHeader();
    console.log('[bt-mahsunkids] 🎯 Deve adicionar classe "has-transparent-header"?', shouldAdd);
    if (shouldAdd) {
      document.body.classList.add('has-transparent-header');
      console.log('[bt-mahsunkids] ✅ Classe "has-transparent-header" ADICIONADA ao body');
      console.log('[bt-mahsunkids] 📋 Classes do body:', document.body.className);
    } else {
      console.warn('[bt-mahsunkids] ⚠️ Classe "has-transparent-header" NÃO foi adicionada (página não permitida)');
    }

    // ===== FORÇA CORES DOS SUBMENUS =====
    const menuItems = document.querySelectorAll('#nav-root > li');
    menuItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        setTimeout(forceSubmenuColors, 10);
      });
    });

    setInterval(forceSubmenuColors, 1000);
    setTimeout(forceSubmenuColors, 500);
  }
}

// ===== BANNERS CARROSSEL (OVERLAY) =====
export async function initBannerOverlay() {
  log('[bt-mahsunkids] 🎨 Iniciando overlay de banners...');

  const OVERLAY_CONFIG = {
    enabled: true,
    onlyHomePage: true,
    allowedPages: ['/', '/index.html', '/mah-sun-kids', '/teste', '/home-nova'],
    opacity: 0.3,
    color: '0, 0, 0',
  };

  function isAllowedPage() {
    const path = window.location.pathname;
    return OVERLAY_CONFIG.allowedPages.some((allowed) => {
      return (
        path === allowed ||
        path === allowed + '/' ||
        path.startsWith(allowed + '/')
      );
    });
  }

  function shouldApplyOverlay() {
    if (!OVERLAY_CONFIG.enabled) return false;
    if (OVERLAY_CONFIG.onlyHomePage) {
      return isAllowedPage();
    }
    return true;
  }

  if (!shouldApplyOverlay()) {
    log('[bt-mahsunkids] ❌ Overlay não será aplicado nesta página');
    return;
  }

  function applyOverlay() {
    const slides = document.querySelectorAll('.bt-section-banner .swiper-slide');
    slides.forEach(function (slide) {
      if (!slide.querySelector('.banner-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'banner-overlay';
        overlay.style.backgroundColor = `rgba(${OVERLAY_CONFIG.color}, ${OVERLAY_CONFIG.opacity})`;
        slide.appendChild(overlay);
        log('[bt-mahsunkids] ✅ Overlay aplicado');
      }
    });
  }

  setTimeout(applyOverlay, 500);

  const observer = new MutationObserver(applyOverlay);
  const bannerElement = document.querySelector('.bt-section-banner');
  if (bannerElement) {
    observer.observe(bannerElement, { childList: true, subtree: true });
  }
}
