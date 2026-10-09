/* =========================================================
   Georgina Raquel Hernández Valencia · Página personal
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* almacenamiento no disponible */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#050509' : '#f6f3ff';
  });

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  function setMenu(open) {
    if (!menuBtn || !navLinks) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navLinks.classList.toggle('open', open);
  }

  menuBtn?.addEventListener('click', () => {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  navLinks?.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setMenu(false); menuBtn?.focus(); }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => setMenu(false));

  /* ---------- Cabecera con sombra al hacer scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Aparición de elementos al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el, i) => {
    // pequeño escalonado entre hermanos
    const index = [...el.parentElement.children].filter(c => c.classList.contains('reveal')).indexOf(el);
    el.style.setProperty('--delay', `${Math.max(index, 0) * 110}ms`);
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => {
            const active = l.getAttribute('href') === '#' + entry.target.id;
            l.classList.toggle('active', active);
            if (active) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Efecto de escritura en el rol ---------- */
  const typed = document.getElementById('typed');
  const roles = ['desarrollo Full Stack', 'bases de datos', 'crear experiencias web', 'aprender cada día'];

  if (typed && !reduceMotion) {
    let r = 0, c = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[r];
      typed.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 90;

      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      else { c += deleting ? -1 : 1; }

      setTimeout(tick, delay);
    };
    setTimeout(tick, 2000);
  }

  /* ---------- Brillo que sigue al cursor en las tarjetas ---------- */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
})();
