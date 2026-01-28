// Theme toggle functionality
(function() {
  var toggle = document.getElementById('theme-toggle');
  var html = document.documentElement;

  function setTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }

  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = html.classList.contains('dark') ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

// Reading progress bar
(function() {
  var progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// Back to top button
(function() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;

  function toggleVisibility() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Image lightbox
(function() {
  var backdrop = document.getElementById('lightbox-backdrop');
  var lightboxImg = document.getElementById('lightbox-img');
  if (!backdrop || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    backdrop.classList.add('open');
    lightboxImg.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    backdrop.classList.remove('open');
    lightboxImg.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Click on prose images to open lightbox
  document.querySelectorAll('.prose img').forEach(function(img) {
    img.addEventListener('click', function() {
      openLightbox(img.src, img.alt);
    });
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closeLightbox);
  lightboxImg.addEventListener('click', closeLightbox);

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

// Code copy button
(function() {
  document.querySelectorAll('.prose pre').forEach(function(pre) {
    // Create copy button
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');

    btn.addEventListener('click', function() {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;

      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
})();
