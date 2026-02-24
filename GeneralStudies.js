/* =============================================
   GeneralStudies.js — UPSC Portal
   GS Paper 1: Interactive Logic
   Tabs · Flashcards · Quiz · Progress
   ============================================= */

(function () {
  'use strict';

  /* ── STATE ─────────────────────────────── */
  var cardsViewed    = new Set();
  var selectedAnswers = {};
  var quizSubmitted  = false;
  var totalCards     = 10;

  /* ── CORRECT ANSWERS ────────────────────── */
  // q0→b, q1→b, q2→c, q3→b, q4→b, q5→d, q6→b, q7→c, q8→c, q9→c
  var correctAnswers = { q0:'b', q1:'b', q2:'c', q3:'b', q4:'b', q5:'d', q6:'b', q7:'c', q8:'c', q9:'c' };

  var explanations = {
    q0: 'Raziya Sultana (1236–1240) was the daughter of Iltutmish and the first (and only) woman to rule the Delhi Sultanate.',
    q1: 'Godavari originates from Trimbakeshwar near Nashik, Maharashtra. (Krishna originates from Mahabaleshwar; Narmada from Amarkantak.)',
    q2: 'Taj Mahal was built by Shah Jahan (1628–58) in memory of his wife Mumtaz Mahal between 1632–1653.',
    q3: 'Sattriya was introduced by the Vaishnava saint Shankaradeva in 15th century Assam. It is performed by Vaishnava monks called Bhokots.',
    q4: 'Kalinga War was fought in 261 BCE. The carnage transformed Ashoka and he adopted Buddhism and the policy of Dhamma.',
    q5: 'Lothal (Gujarat) is the only Indus Valley site with evidence of a dockyard — used for maritime trade with Mesopotamia.',
    q6: 'Child Sex Ratio (0–6 yrs) as per Census 2011 was 918 females per 1000 males — a cause for concern.',
    q7: 'Ajanta Caves (2nd century BCE to 6th century CE) are entirely Buddhist — featuring chaityas, viharas and Jataka story paintings.',
    q8: 'Ain-i-Akbari was written by Abul Fazl, one of the Navratnas of Akbar\'s court. It is a detailed document of the Mughal administration.',
    q9: 'Godavari is called "Dakshina Ganga" (Ganga of the South) — it is the longest peninsular river of India.'
  };

  /* ── DARK MODE SYNC ─────────────────────── */
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var html = document.documentElement;
      if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
      } else {
        html.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      }
    });
  }

  /* ── TAB SWITCHING ──────────────────────── */
  var tabs   = document.querySelectorAll('.la-tab');
  var panels = document.querySelectorAll('.la-panel');

  function switchTab(tabName) {
    tabs.forEach(function (t) {
      var active = t.dataset.tab === tabName;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.classList.toggle('active', p.id === 'tab-' + tabName);
    });
    var panel = document.getElementById('tab-' + tabName);
    if (panel) {
      panel.querySelectorAll('.fade-in:not(.visible)').forEach(function (el, i) {
        el.style.transitionDelay = (i * 60) + 'ms';
        el.classList.add('visible');
      });
    }
    try { history.replaceState(null, '', '#' + tabName); } catch (e) {}
  }

  window.switchTab = switchTab;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { switchTab(tab.dataset.tab); });
  });

  // Restore from URL hash
  var hash = window.location.hash.replace('#', '');
  var validTabs = ['history', 'geography', 'artculture', 'society', 'flashcards', 'quiz'];
  if (hash && validTabs.indexOf(hash) !== -1) {
    switchTab(hash);
  }

  /* ── FLASHCARDS ─────────────────────────── */
  var fcCards = document.querySelectorAll('.la-fc');

  fcCards.forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
      var id = card.dataset.id;
      if (card.classList.contains('flipped')) {
        cardsViewed.add(id);
        card.classList.add('viewed');
      }
      updateProgress();
    });
  });

  function updateProgress() {
    var viewed  = cardsViewed.size;
    var percent = Math.round((viewed / totalCards) * 100);

    var elViewed  = document.getElementById('cards-viewed');
    var elPercent = document.getElementById('completion-percent');
    var elBar     = document.getElementById('main-progress');
    var elFcDone  = document.getElementById('fc-done');
    var elFcBar   = document.getElementById('fc-bar');

    if (elViewed)  elViewed.textContent  = viewed + '/' + totalCards;
    if (elPercent) elPercent.textContent = percent + '%';
    if (elBar)     elBar.style.width     = percent + '%';
    if (elFcDone)  elFcDone.textContent  = viewed;
    if (elFcBar)   elFcBar.style.width   = percent + '%';
  }

  updateProgress();

  /* Reset flashcards */
  var resetCardsBtn = document.getElementById('resetCards');
  if (resetCardsBtn) {
    resetCardsBtn.addEventListener('click', function () {
      cardsViewed.clear();
      fcCards.forEach(function (card) {
        card.classList.remove('flipped', 'viewed');
      });
      updateProgress();
    });
  }

  /* ── QUIZ — OPTION SELECTION ────────────── */
  // Add letter labels to options
  var letters = ['A', 'B', 'C', 'D'];
  document.querySelectorAll('.la-options').forEach(function (optGroup) {
    optGroup.querySelectorAll('.la-option span').forEach(function (span, i) {
      span.setAttribute('data-letter', letters[i]);
    });
  });

  document.querySelectorAll('.la-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      if (quizSubmitted) return;
      var qName = opt.querySelector('input').name;
      // deselect siblings
      document.querySelectorAll('input[name="' + qName + '"]').forEach(function (inp) {
        inp.closest('.la-option').classList.remove('selected');
      });
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      selectedAnswers[qName] = opt.querySelector('input').value;
    });
  });

  /* ── SUBMIT QUIZ ────────────────────────── */
  var quizForm   = document.getElementById('quizForm');
  var submitBtn  = document.getElementById('submitQuiz');
  var resetBtn   = document.getElementById('resetQuiz');
  var scoreCard  = document.getElementById('scoreCard');

  if (quizForm) {
    quizForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (quizSubmitted) return;

      var correct = 0;
      var total   = Object.keys(correctAnswers).length;

      Object.keys(correctAnswers).forEach(function (qName) {
        var rightVal = correctAnswers[qName];
        var userVal  = selectedAnswers[qName];

        // Mark all options
        document.querySelectorAll('input[name="' + qName + '"]').forEach(function (inp) {
          var opt = inp.closest('.la-option');
          opt.classList.add('answered');
          if (inp.value === rightVal) {
            opt.classList.add('correct');
          } else if (inp.value === userVal && userVal !== rightVal) {
            opt.classList.add('incorrect');
          }
        });

        if (userVal === rightVal) correct++;

        // Show explanation
        var expEl = document.getElementById('exp' + qName.replace('q', ''));
        if (expEl && explanations[qName]) {
          expEl.innerHTML = '💡 ' + explanations[qName];
          expEl.classList.add('show');
        }
      });

      quizSubmitted = true;

      // Update header
      var scoreDisplay = document.getElementById('quiz-score-display');
      if (scoreDisplay) scoreDisplay.textContent = correct + '/' + total;

      // Show score card
      if (scoreCard) {
        var icon = document.getElementById('scoreIcon');
        var num  = document.getElementById('scoreNum');
        var msg  = document.getElementById('scoreMsg');

        num.textContent = correct + ' / ' + total;

        if (correct === total) {
          icon.textContent = '🏆';
          msg.textContent  = 'Perfect! Outstanding preparation!';
          scoreCard.style.borderColor = '#16a34a';
        } else if (correct >= 8) {
          icon.textContent = '🎉';
          msg.textContent  = 'Excellent! You are well-prepared for UPSC Prelims.';
          scoreCard.style.borderColor = '#16a34a';
        } else if (correct >= 6) {
          icon.textContent = '👍';
          msg.textContent  = 'Good effort! Review the sections you got wrong.';
          scoreCard.style.borderColor = '#d97706';
        } else {
          icon.textContent = '📚';
          msg.textContent  = 'Keep studying! Go through flashcards and theory, then retry.';
          scoreCard.style.borderColor = '#dc2626';
        }

        scoreCard.style.display = 'block';
        scoreCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (submitBtn) submitBtn.style.display = 'none';
      if (resetBtn)  resetBtn.style.display  = '';
    });
  }

  /* ── RESET QUIZ ─────────────────────────── */
  function resetQuiz() {
    selectedAnswers = {};
    quizSubmitted   = false;

    document.querySelectorAll('.la-option').forEach(function (opt) {
      opt.classList.remove('selected', 'correct', 'incorrect', 'answered');
      var inp = opt.querySelector('input');
      if (inp) inp.checked = false;
    });
    document.querySelectorAll('.la-q-exp').forEach(function (el) {
      el.classList.remove('show');
      el.innerHTML = '';
    });
    if (scoreCard)  { scoreCard.style.display = 'none'; }
    if (submitBtn)  { submitBtn.style.display  = ''; }
    if (resetBtn)   { resetBtn.style.display   = 'none'; }

    var scoreDisplay = document.getElementById('quiz-score-display');
    if (scoreDisplay) scoreDisplay.textContent = '–/10';

    window.scrollTo({ top: document.getElementById('tab-quiz').offsetTop - 160, behavior: 'smooth' });
  }

  if (resetBtn) resetBtn.addEventListener('click', resetQuiz);

  /* ── FADE-IN ON SCROLL ──────────────────── */
  var faders = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (i % 6 * 55) + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    faders.forEach(function (el) { io.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── NAV ACTIVE STATE ON SCROLL ─────────── */
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.dataset.section === id);
          });
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('[id]').forEach(function (el) {
      sectionObserver.observe(el);
    });
  }

})();
