/**
 * 고용24 육아휴직 급여 신청 Mockup - Core JS
 * Timer, form validation, popup management, navigation
 */

(function() {
  'use strict';

  // ==================== Timer ====================
  const Timer = {
    KEY: 'mockup_timer_start',
    ELAPSED_KEY: 'mockup_elapsed',

    start() {
      if (!sessionStorage.getItem(this.KEY)) {
        sessionStorage.setItem(this.KEY, Date.now().toString());
      }
    },

    getElapsedMs() {
      const start = sessionStorage.getItem(this.KEY);
      if (!start) return 0;
      return Date.now() - parseInt(start, 10);
    },

    stop() {
      const elapsed = this.getElapsedMs();
      sessionStorage.setItem(this.ELAPSED_KEY, elapsed.toString());
      sessionStorage.removeItem(this.KEY);
      return elapsed;
    },

    getStoredElapsed() {
      return parseInt(sessionStorage.getItem(this.ELAPSED_KEY) || '0', 10);
    },

    format(ms) {
      const totalSec = Math.floor(ms / 1000);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    },

    reset() {
      sessionStorage.removeItem(this.KEY);
      sessionStorage.removeItem(this.ELAPSED_KEY);
    },

    renderWidget() {
      if (!sessionStorage.getItem(this.KEY)) return;

      const el = document.getElementById('mockup-timer');
      if (!el) return;

      const valueEl = el.querySelector('.timer-value');
      if (!valueEl) return;

      const update = () => {
        valueEl.textContent = this.format(this.getElapsedMs());
      };

      update();
      setInterval(update, 1000);
      el.style.display = 'flex';
    }
  };

  // ==================== Navigation ====================
  const Nav = {
    go(page) {
      const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
      window.location.href = base + page;
    },

    goRelative(page) {
      window.location.href = page;
    }
  };

  // ==================== Modal ====================
  const Modal = {
    open(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    closeAll() {
      document.querySelectorAll('.mockup-modal-overlay.active').forEach(el => {
        el.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  };

  // ==================== Form Validation ====================
  const FormValidator = {
    validate(formId) {
      const form = document.getElementById(formId);
      if (!form) return true;

      const requiredRadioGroups = form.querySelectorAll('[data-required-group]');
      const checkedGroups = new Set();
      const uncheckedGroups = [];

      requiredRadioGroups.forEach(el => {
        const groupName = el.getAttribute('data-required-group');
        if (checkedGroups.has(groupName)) return;
        checkedGroups.add(groupName);

        const radios = form.querySelectorAll(`[data-required-group="${groupName}"] input[type="radio"]`);
        const anyChecked = Array.from(radios).some(r => r.checked);
        if (!anyChecked) {
          uncheckedGroups.push(groupName);
        }
      });

      // Check required checkboxes
      const requiredChecks = form.querySelectorAll('[data-required-check]');
      const uncheckedChecks = [];
      requiredChecks.forEach(el => {
        if (!el.checked) {
          uncheckedChecks.push(el.getAttribute('data-required-check'));
        }
      });

      if (uncheckedGroups.length > 0 || uncheckedChecks.length > 0) {
        const missing = [...uncheckedGroups, ...uncheckedChecks];
        alert('다음 필수 항목을 입력해주세요:\n\n- ' + missing.join('\n- '));
        return false;
      }

      return true;
    }
  };

  // ==================== Loading ====================
  const Loading = {
    show(text, durationMs, callback) {
      const overlay = document.getElementById('mockup-loading');
      if (!overlay) return callback && callback();

      const textEl = overlay.querySelector('.loading-text');
      if (textEl) textEl.textContent = text || '처리 중...';

      overlay.classList.add('active');

      setTimeout(() => {
        overlay.classList.remove('active');
        if (callback) callback();
      }, durationMs || 1500);
    }
  };

  // ==================== Init ====================
  function init() {
    // Render timer widget if timer is running
    Timer.renderWidget();

    // Setup modal close on overlay click
    document.querySelectorAll('.mockup-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Setup modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.mockup-modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==================== Global API ====================
  window.Mockup = {
    Timer,
    Nav,
    Modal,
    Loading,
    FormValidator
  };

})();
