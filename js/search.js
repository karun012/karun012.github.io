// Command Palette Search
(function() {
  var backdrop = document.getElementById('cmd-backdrop');
  var palette = document.getElementById('cmd-palette');
  var input = document.getElementById('cmd-input');
  var resultsContainer = document.getElementById('cmd-results');
  var searchBtn = document.getElementById('search-btn');
  var searchBtnMobile = document.getElementById('search-btn-mobile');

  if (!palette || !input) return;

  var fuse = null;
  var results = [];
  var selectedIndex = -1;

  // Load search index
  fetch('/index.json')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      fuse = new Fuse(data, {
        keys: ['title', 'content', 'summary', 'tags'],
        threshold: 0.4,
        distance: 1000,
        includeMatches: true,
        minMatchCharLength: 2,
      });
    })
    .catch(function(err) { console.error('Error loading search index:', err); });

  // Open palette
  function open() {
    backdrop.classList.add('open');
    palette.classList.add('open');
    input.value = '';
    resultsContainer.innerHTML = '';
    selectedIndex = -1;
    results = [];
    setTimeout(function() { input.focus(); }, 50);
    document.body.style.overflow = 'hidden';
  }

  // Close palette
  function close() {
    backdrop.classList.remove('open');
    palette.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Render results
  function render() {
    if (results.length === 0 && input.value.trim()) {
      resultsContainer.innerHTML = '<div class="cmd-palette-empty">No results found</div>';
      return;
    }

    if (results.length === 0) {
      resultsContainer.innerHTML = '';
      return;
    }

    var html = results.slice(0, 8).map(function(result, i) {
      var item = result.item;
      var selected = i === selectedIndex ? ' selected' : '';
      var tags = item.tags ? item.tags.slice(0, 2) : [];
      var tagsText = tags.length > 0 ? ' · ' + tags.join(', ') : '';

      return '<div class="cmd-palette-result' + selected + '" data-index="' + i + '" data-url="' + item.permalink + '">' +
        '<div class="cmd-palette-result-title">' + item.title + '</div>' +
        '<div class="cmd-palette-result-meta">' + (item.summary ? item.summary.substring(0, 80) + '...' : '') + tagsText + '</div>' +
      '</div>';
    }).join('');

    resultsContainer.innerHTML = html;

    // Add click handlers
    var items = resultsContainer.querySelectorAll('.cmd-palette-result');
    items.forEach(function(el) {
      el.addEventListener('click', function() {
        window.location.href = el.dataset.url;
      });
    });
  }

  // Update selection
  function updateSelection() {
    var items = resultsContainer.querySelectorAll('.cmd-palette-result');
    items.forEach(function(el, i) {
      if (i === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  // Navigate to selected
  function goToSelected() {
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      window.location.href = results[selectedIndex].item.permalink;
    }
  }

  // Search handler
  var searchTimeout;
  input.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      var query = input.value.trim();
      if (!query) {
        results = [];
        selectedIndex = -1;
        render();
        return;
      }
      if (fuse) {
        results = fuse.search(query);
        selectedIndex = results.length > 0 ? 0 : -1;
        render();
      }
    }, 150);
  });

  // Keyboard navigation
  input.addEventListener('keydown', function(e) {
    var maxIndex = Math.min(results.length, 8) - 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < maxIndex) {
        selectedIndex++;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex > 0) {
        selectedIndex--;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      goToSelected();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });

  // Global keyboard shortcut
  document.addEventListener('keydown', function(e) {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) {
        close();
      } else {
        open();
      }
    }
    // Escape to close
    if (e.key === 'Escape' && palette.classList.contains('open')) {
      close();
    }
  });

  // Click backdrop to close
  backdrop.addEventListener('click', close);

  // Search button click
  if (searchBtn) {
    searchBtn.addEventListener('click', open);
  }
  if (searchBtnMobile) {
    searchBtnMobile.addEventListener('click', open);
  }
})();
