// ===== HEADER TRANSPARENTE - MAHUNKIDS =====
export async function mount(root, ctx) {
  'use strict';

  console.log('[bt-mahsunkids] 🚀 Script de header carregado!');

  // Função para aguardar header aparecer no DOM
  function waitForHeader(maxAttempts = 50, interval = 100) {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkHeader = () => {
        attempts++;
        const header = document.querySelector('#header-react-app');
        if (header) {
          console.log('[bt-mahsunkids] ✅ Header encontrado após', attempts, 'tentativas');
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
    console.log('[bt-mahsunkids] ✅ Header já disponível, iniciando...');
    init(existingHeader);
  } else {
    console.log('[bt-mahsunkids] ⏳ Aguardando header aparecer...');
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
      const isAllowed = CONFIG.allowedPages.some((allowed) => {
        return (
          path === allowed ||
          path === allowed + '/' ||
          path.startsWith(allowed + '/') ||
          path.includes(allowed)
        );
      });
      console.log('[bt-mahsunkids] 🔍 Página:', path, '| Permitida?', isAllowed);
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
      header.style.setProperty('position', 'fixed', 'important');
      header.style.setProperty('top', '0', 'important');
      header.style.setProperty('left', '0', 'important');
      header.style.setProperty('right', '0', 'important');
      header.style.setProperty('width', '100%', 'important');
      header.style.setProperty('z-index', '999', 'important');
    }

    // ===== FORÇA FUNDO BRANCO COM MÁXIMA PRIORIDADE =====
    function forceWhiteBackground() {
      // Remove qualquer estilo que possa estar forçando transparência
      header.style.removeProperty('background');
      header.style.removeProperty('background-color');
      
      // Aplica fundo branco com !important usando múltiplas propriedades
      header.style.setProperty('background-color', '#ffffff', 'important');
      header.style.setProperty('background', '#ffffff', 'important');
      
      // Também aplica no header-top se existir
      const headerTop = header.querySelector('.header-top');
      if (headerTop) {
        headerTop.style.removeProperty('background');
        headerTop.style.removeProperty('background-color');
        headerTop.style.setProperty('background-color', '#ffffff', 'important');
        headerTop.style.setProperty('background', '#ffffff', 'important');
      }
      
      // Garante que a classe está presente ANTES de aplicar estilos
      if (!header.classList.contains('header-scrolled')) {
        header.classList.add('header-scrolled');
      }
      
      // Força reflow para garantir aplicação
      header.offsetHeight;
      
      console.log('[bt-mahsunkids] ✅ Fundo branco FORÇADO | Classes:', header.className);
    }

    // ===== FORÇA TRANSPARÊNCIA =====
    function forceTransparentBackground() {
      // Remove background sólido
      header.style.removeProperty('background');
      header.style.setProperty('background-color', 'transparent', 'important');
      header.style.setProperty('background', 'transparent', 'important');
      
      const headerTop = header.querySelector('.header-top');
      if (headerTop) {
        headerTop.style.removeProperty('background');
        headerTop.style.setProperty('background-color', 'transparent', 'important');
        headerTop.style.setProperty('background', 'transparent', 'important');
      }
      
      // Remove classe ANTES de aplicar estilos
      if (header.classList.contains('header-scrolled')) {
        header.classList.remove('header-scrolled');
      }
      
      // Força reflow
      header.offsetHeight;
      
      console.log('[bt-mahsunkids] ✅ Transparência FORÇADA | Classes:', header.className);
    }

    // ===== CONTROLE DO SCROLL =====
    function checkScroll() {
      ensureFixedPosition();

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeTransparent = shouldApplyTransparentHeader();

      console.log(
        '[bt-mahsunkids] 📊 Scroll:',
        scrollTop,
        '| Deve ser transparente?',
        shouldBeTransparent
      );

      // Se não deve ser transparente, força branco
      if (!shouldBeTransparent) {
        forceWhiteBackground();
        console.log('[bt-mahsunkids] ✅ Header BRANCO (página não permitida)');
        return;
      }

      // Se deve ser transparente, verifica scroll
      if (scrollTop > CONFIG.scrollThreshold) {
        forceWhiteBackground();
        console.log('[bt-mahsunkids] ✅ Header BRANCO (scrolled)');
      } else {
        forceTransparentBackground();
        console.log('[bt-mahsunkids] ✅ Header TRANSPARENTE');
      }
    }

    // ===== INICIALIZAÇÃO =====
    ensureFixedPosition();
    checkScroll();

    // ===== LISTENERS DE SCROLL OTIMIZADOS =====
    // Múltiplos listeners para garantir captura em diferentes cenários
    let scrollTimeout = null;
    let isScrolling = false;

    function handleScroll() {
      // Executa imediatamente (sem throttling) para resposta rápida
      checkScroll();
      
      // Marca que está scrollando
      isScrolling = true;
      
      // Limpa timeout anterior
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Marca como parado após 150ms sem scroll
      scrollTimeout = setTimeout(function () {
        isScrolling = false;
        // Verificação final
        checkScroll();
      }, 150);
    }

    // Event listeners para diferentes tipos de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    // ===== PROTEÇÃO: VERIFICA PERIODICAMENTE SE O ESTILO FOI SOBRESCRITO =====
    let lastScrollState = null;
    const verificationInterval = setInterval(function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeTransparent = shouldApplyTransparentHeader();
      const currentState = {
        scroll: scrollTop > CONFIG.scrollThreshold,
        shouldBeTransparent: shouldBeTransparent,
        scrollValue: scrollTop
      };

      // Verifica se mudou o estado
      const stateChanged = !lastScrollState || 
          lastScrollState.scroll !== currentState.scroll ||
          lastScrollState.shouldBeTransparent !== currentState.shouldBeTransparent ||
          Math.abs(lastScrollState.scrollValue - currentState.scrollValue) > 10; // Mudança significativa
      
      if (stateChanged || isScrolling) {
        // Verifica se o estilo atual está correto
        const computedBg = window.getComputedStyle(header).backgroundColor;
        const isWhite = computedBg.includes('255') || computedBg.includes('rgb(255');
        const shouldBeWhite = scrollTop > CONFIG.scrollThreshold || !shouldBeTransparent;
        
        if (shouldBeWhite) {
          // DEVERIA ser branco
          if (!header.classList.contains('header-scrolled') || !isWhite) {
            console.log('[bt-mahsunkids] 🔧 Corrigindo: fundo deveria ser branco! Scroll:', scrollTop);
            forceWhiteBackground();
          }
        } else {
          // DEVERIA ser transparente
          if (header.classList.contains('header-scrolled') || isWhite) {
            console.log('[bt-mahsunkids] 🔧 Corrigindo: fundo deveria ser transparente! Scroll:', scrollTop);
            forceTransparentBackground();
          }
        }
        
        lastScrollState = currentState;
      }
    }, 50); // Verifica a cada 50ms (mais frequente durante scroll)

    // ===== PROTEÇÃO: OBSERVA MUDANÇAS NO HEADER (se outros scripts modificarem) =====
    const styleObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Se o style foi modificado externamente, verifica e corrige se necessário
          setTimeout(function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldBeTransparent = shouldApplyTransparentHeader();

            if (scrollTop > CONFIG.scrollThreshold || !shouldBeTransparent) {
              // Deveria ser branco
              if (!header.classList.contains('header-scrolled')) {
                forceWhiteBackground();
              }
            }
          }, 10);
        }

        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Se a classe foi modificada, verifica se está correta
          setTimeout(checkScroll, 10);
        }
      });
    });

    styleObserver.observe(header, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false
    });

    // Adiciona classe ao body
    if (shouldApplyTransparentHeader()) {
      document.body.classList.add('has-transparent-header');
      console.log('[bt-mahsunkids] ✅ Classe "has-transparent-header" adicionada');
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
  console.log('[bt-mahsunkids] 🎨 Iniciando overlay de banners...');

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
        path.startsWith(allowed + '/') ||
        path.includes(allowed)
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
    console.log('[bt-mahsunkids] ❌ Overlay não será aplicado nesta página');
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
        console.log('[bt-mahsunkids] ✅ Overlay aplicado');
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
