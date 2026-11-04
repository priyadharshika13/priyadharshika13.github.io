(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('#theme-toggle');
  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#nav-links');
  const year = document.querySelector('#current-year');
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const projects = [...document.querySelectorAll('.project-card')];
  const projectCount = document.querySelector('#project-count');

  year.textContent = new Date().getFullYear();

  // Local storage is optional; fail gracefully in restricted browsing modes.
  let savedTheme;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* no-op */ }
  const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  root.dataset.theme = initialTheme;
  const updateThemeLabel = () => {
    toggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    toggle.setAttribute('title', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  updateThemeLabel();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) { /* no-op */ }
    updateThemeLabel();
  });

  const closeMenu = () => {
    nav.classList.remove('open');
    menu.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  };
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      let visible = 0;
      filterButtons.forEach(b => {
        const active = b === button;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      projects.forEach(project => {
        const included = category === 'all' || project.dataset.category.split(' ').includes(category);
        project.hidden = !included;
        if (included) visible++;
      });
      projectCount.textContent = `${String(visible).padStart(2, '0')} SELECTED ${visible === 1 ? 'PROJECT' : 'PROJECTS'}`;
    });
  });

  if (window.IntersectionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px 40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // Mark the current section in the navigation as visitors scroll.
  if (window.IntersectionObserver) {
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-22% 0px -67% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }
})();
