/* ============================================================
   CSIC Website — Animations & Interactions
   ============================================================ */

/* ---------- tiny toast ---------- */
var toastEl = document.getElementById('toast');
var toastTimer = null;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
}

/* ---------- scroll reveal animation ---------- */
(function setupReveal() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.section-head, .app, .card, .mini, .download-card, .feedback, .gallery-item'
  );
  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + 'ms';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
})();

/* ---------- app search filter ---------- */
var search = document.getElementById('appSearch');
var apps = Array.prototype.slice.call(document.querySelectorAll('#appGrid .app'));
var emptyMsg = document.getElementById('emptyMsg');

if (search) {
  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    apps.forEach(function (app) {
      var hit = app.dataset.name.indexOf(q) !== -1;
      app.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    if (emptyMsg) emptyMsg.style.display = shown === 0 ? 'block' : 'none';
  });
}

/* ---------- app tiles click ---------- */
apps.forEach(function (app) {
  app.addEventListener('click', function () {
    var nameEl = app.querySelector('.name');
    toast((nameEl ? nameEl.textContent : 'This app') + ' — coming with the CSIC app.');
  });
});

/* ---------- share button ---------- */
var shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', function () {
    var shareData = {
      title: 'CSIC — Comepty Super Intelligence Connection',
      text: 'CSIC is an autonomous AI for Windows. 12,000+ installs, rated 4.2.',
      url: location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(function () {
        toast('Link copied — paste it anywhere!');
      }).catch(function () {
        toast('Copy this page link from your address bar.');
      });
      return;
    }
    toast('Copy this page link from your address bar.');
  });
}

/* ---------- bottom preview image reveal ---------- */
var bottomImage = document.getElementById('bottomImage');
var imgSlot = document.getElementById('imgSlot');
if (bottomImage && imgSlot) {
  bottomImage.addEventListener('load', function () {
    imgSlot.style.display = 'block';
  });
  bottomImage.addEventListener('error', function () {
    imgSlot.style.display = 'none';
  });
  if (bottomImage.complete && bottomImage.naturalWidth > 0) {
    imgSlot.style.display = 'block';
  }
}

/* ---------- gallery handling ---------- */
var gallerySection = document.getElementById('gallery');
var galleryItems = document.querySelectorAll('.gallery-item');

if (gallerySection && galleryItems.length > 0) {
  gallerySection.style.display = 'none'; // Hide section by default
  var anyImageLoaded = false;

  galleryItems.forEach(function(item) {
    var img = item.querySelector('img');
    if (img) {
      // Hide the individual picture box if the image fails to load
      img.addEventListener('error', function() {
        item.style.display = 'none';
      });
      
      // If the image is already loaded (cached), or loads successfully
      if (img.complete && img.naturalWidth > 0) {
        anyImageLoaded = true;
      } else {
        img.addEventListener('load', function() {
          gallerySection.style.display = 'block';
        });
      }
    }
  });

  // Show the whole gallery section if at least one image is already ready
  if (anyImageLoaded) {
    gallerySection.style.display = 'block';
  }
}

/* ---------- footer year ---------- */
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();