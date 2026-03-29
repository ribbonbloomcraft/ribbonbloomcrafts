/* =============================================
   RIBBON BLOOM CRAFTS — JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     1. STICKY HEADER — add "scrolled" class
     ------------------------------------------ */
  const header = document.getElementById('header');

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ------------------------------------------
     2. MOBILE HAMBURGER MENU
     ------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when any nav link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });


  /* ------------------------------------------
     3. ACTIVE NAV LINK ON SCROLL
     ------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    let currentId = '';
    const offset = 100;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }


  /* ------------------------------------------
     4. SMOOTH SCROLL FOR ALL ANCHOR LINKS
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ------------------------------------------
     5. SCROLL-TRIGGERED ANIMATIONS
     ------------------------------------------ */
  // Add class to elements we want to animate
  const animatableSelectors = [
    '.product-card',
    '.gallery-item',
    '.stat-card',
    '.value-item',
    '.contact-card',
    '.about-lead',
    '.about-body',
    '.section-header',
    '.products-cta',
    '.gallery-note',
    '.contact-form-wrap',
  ];

  const animatables = document.querySelectorAll(animatableSelectors.join(','));
  animatables.forEach((el, i) => {
    el.classList.add('animate-on-scroll');
    // Stagger delay for grid children
    const parent = el.parentElement;
    const siblings = [...parent.children].filter(c => c.classList.contains(el.classList[0]));
    const idx = siblings.indexOf(el);
    if (idx > 0) {
      el.style.transitionDelay = `${idx * 0.08}s`;
    }
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        scrollObserver.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatables.forEach(el => scrollObserver.observe(el));


  /* ------------------------------------------
     6. CONTACT FORM — submit handler
     ------------------------------------------ */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('form-submit-btn');
  const btnText     = document.getElementById('btn-text');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = document.getElementById('form-name').value.trim();
      const phone   = document.getElementById('form-phone').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const box     = document.getElementById('form-box').value;

      // Basic validation
      if (!name || !phone) {
        shakeField(!name ? 'form-name' : 'form-phone');
        return;
      }

      // Simulate sending (loading state)
      submitBtn.disabled = true;
      btnText.textContent = 'Sending… 💌';

      await fakeDelay(1400);

      // Build WhatsApp-style pre-filled message
      const wa = buildWhatsAppLink(name, phone, box, message);

      // Show success
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message 💌';
      formSuccess.classList.add('visible');
      form.reset();

      // Auto-open WhatsApp with the details
      setTimeout(() => window.open(wa, '_blank'), 800);

      // Hide success after 6 seconds
      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    });
  }

  function buildWhatsAppLink(name, phone, box, message) {
    const boxNames = {
      ladies:     'Ladies Gift Box',
      birthday:   'Birthday Gift Box',
      graduation: 'Graduation Gift Box',
      custom:     'Custom Gift Box',
      other:      'Not Sure / Other',
    };
    const boxLabel = boxNames[box] || 'Gift Box';
    const text = `Hi Ribbon Bloom Crafts! 🎀\n\nMy Name: ${name}\nPhone: ${phone}\nInterested In: ${boxLabel}\n\n${message || 'I would like to order a gift box.'}`;
    return `https://wa.me/94XXXXXXXXX?text=${encodeURIComponent(text)}`;
  }

  function fakeDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function shakeField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    el.focus();
    el.addEventListener('animationend', () => {
      el.style.animation = '';
    }, { once: true });
  }


  /* ------------------------------------------
     7. GALLERY LIGHTBOX (simple)
     ------------------------------------------ */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const label = item.querySelector('.gallery-label')?.textContent || '';
      if (!img) return;
      openLightbox(img.src, img.alt || label);
    });
  });

  function openLightbox(src, caption) {
    // Remove existing
    const existing = document.getElementById('lightbox');
    if (existing) existing.remove();

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <div id="lightbox-backdrop" style="
        position:fixed;inset:0;z-index:9999;
        background:rgba(45,27,46,0.92);
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        padding:1.5rem;
        animation:fade-in 0.3s ease;
      ">
        <button id="lightbox-close" aria-label="Close" style="
          position:absolute;top:20px;right:24px;
          background:rgba(255,255,255,0.15);
          border:none;color:#fff;
          width:42px;height:42px;border-radius:50%;
          font-size:1.3rem;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:background 0.2s;
        ">✕</button>
        <img src="${src}" alt="${caption}" style="
          max-width:92vw;max-height:80vh;
          border-radius:16px;
          box-shadow:0 20px 60px rgba(0,0,0,0.5);
          object-fit:contain;
        "/>
        ${caption ? `<p style="color:rgba(255,255,255,0.75);margin-top:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;">${caption}</p>` : ''}
      </div>
    `;
    document.body.appendChild(lb);

    const close = () => {
      lb.querySelector('#lightbox-backdrop').style.animation = 'none';
      lb.remove();
    };

    document.getElementById('lightbox-close').addEventListener('click', close);
    lb.addEventListener('click', (e) => {
      if (e.target === lb.querySelector('#lightbox-backdrop')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    }, { once: true });
  }


  /* ------------------------------------------
     8. PRODUCT CARD order-link → pre-fill form
     ------------------------------------------ */
  const productOrderMap = {
    'order-ladies':     'ladies',
    'order-birthday':   'birthday',
    'order-graduation': 'graduation',
    'order-custom':     'custom',
  };

  Object.entries(productOrderMap).forEach(([btnId, value]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('form-box').value = value;
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Small delay then focus name field
        setTimeout(() => document.getElementById('form-name').focus(), 800);
      });
    }
  });


  /* ------------------------------------------
     9. HERO "products-whatsapp-btn" → WhatsApp
     ------------------------------------------ */
  const productsWaBtn = document.getElementById('products-whatsapp-btn');
  if (productsWaBtn) {
    productsWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://wa.me/94XXXXXXXXX?text=Hi%20Ribbon%20Bloom%20Crafts!%20I%20need%20help%20choosing%20a%20gift%20box%20%F0%9F%8E%80', '_blank');
    });
  }


  /* ------------------------------------------
     10. ADD SHAKE KEYFRAME DYNAMICALLY
     ------------------------------------------ */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); border-color: #f0476e; }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ------------------------------------------
     11. FLOATING WHATSAPP — hide when contact
         section is in view (optional UX polish)
     ------------------------------------------ */
  const floatingWa      = document.getElementById('floating-whatsapp');
  const contactSection  = document.getElementById('contact');

  if (floatingWa && contactSection) {
    const waObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        floatingWa.style.opacity = entry.isIntersecting ? '0' : '1';
        floatingWa.style.pointerEvents = entry.isIntersecting ? 'none' : 'all';
      });
    }, { threshold: 0.3 });
    waObserver.observe(contactSection);
  }

}); // end DOMContentLoaded
