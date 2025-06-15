// === WP.CSS JS HELPERS ===
// All helpers are attached to window.wp* and auto-initialized on DOMContentLoaded.
// Usage: See documentation in index.html or comments below.

// === TOOLTIP ===
// Usage: Add data-tooltip="Text" (and optional data-tooltip-pos) to any element.
window.wpTooltip = {
  init(root = document) {
    root.querySelectorAll('[data-tooltip]').forEach(el => {
      if (el._wpTooltipBound) return;
      el._wpTooltipBound = true;
      let tooltip = null;
      function showTooltip() {
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.className = 'tooltip tooltip-top';
          document.body.appendChild(tooltip);
        }
        const placement = el.getAttribute('data-tooltip-pos') || 'top';
        tooltip.className = 'tooltip tooltip-' + placement;
        tooltip.innerHTML = `<span class="tooltip-arrow"></span>${el.getAttribute('data-tooltip')}`;
        // Initial position
        const rect = el.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width/2 + window.scrollX) + 'px';
        tooltip.style.top = (placement === 'top' ? (rect.top + window.scrollY) : (rect.bottom + window.scrollY)) + 'px';
        tooltip.classList.add('show');
        // Final position after render
        setTimeout(() => {
          const tRect = tooltip.getBoundingClientRect();
          if (placement === 'top') {
            tooltip.style.left = (rect.left + rect.width/2 - tRect.width/2 + window.scrollX) + 'px';
            tooltip.style.top = (rect.top - tRect.height - 8 + window.scrollY) + 'px';
          } else if (placement === 'bottom') {
            tooltip.style.left = (rect.left + rect.width/2 - tRect.width/2 + window.scrollX) + 'px';
            tooltip.style.top = (rect.bottom + 8 + window.scrollY) + 'px';
          } else if (placement === 'left') {
            tooltip.style.left = (rect.left - tRect.width - 8 + window.scrollX) + 'px';
            tooltip.style.top = (rect.top + rect.height/2 - tRect.height/2 + window.scrollY) + 'px';
          } else if (placement === 'right') {
            tooltip.style.left = (rect.right + 8 + window.scrollX) + 'px';
            tooltip.style.top = (rect.top + rect.height/2 - tRect.height/2 + window.scrollY) + 'px';
          }
        }, 1);
      }
      function hideTooltip() {
        if (tooltip) {
          tooltip.classList.remove('show');
          setTimeout(() => { if (tooltip) { tooltip.remove(); tooltip = null; } }, 180);
        }
      }
      el.addEventListener('mouseenter', showTooltip);
      el.addEventListener('focus', showTooltip);
      el.addEventListener('mouseleave', hideTooltip);
      el.addEventListener('blur', hideTooltip);
    });
  }
};

// === POPOVER ===
// Usage: Add data-popover="Text" (and optional data-popover-title, data-popover-pos) to any element.
window.wpPopover = {
  init(root = document) {
    root.querySelectorAll('[data-popover]').forEach(el => {
      if (el._wpPopoverBound) return;
      el._wpPopoverBound = true;
      let popover = null;
      function showPopover() {
        if (!popover) {
          popover = document.createElement('div');
          popover.className = 'popover popover-bottom';
          document.body.appendChild(popover);
        }
        const placement = el.getAttribute('data-popover-pos') || 'bottom';
        popover.className = 'popover popover-' + placement;
        const header = el.getAttribute('data-popover-title');
        const body = el.getAttribute('data-popover');
        popover.innerHTML = (header ? `<div class='popover-header'>${header}</div>` : '') + `<div class='popover-body'>${body}</div><span class='popover-arrow'></span>`;
        // Initial position
        const rect = el.getBoundingClientRect();
        setTimeout(() => {
          const pRect = popover.getBoundingClientRect();
          if (placement === 'top') {
            popover.style.left = (rect.left + rect.width/2 - pRect.width/2 + window.scrollX) + 'px';
            popover.style.top = (rect.top - pRect.height - 8 + window.scrollY) + 'px';
          } else if (placement === 'bottom') {
            popover.style.left = (rect.left + rect.width/2 - pRect.width/2 + window.scrollX) + 'px';
            popover.style.top = (rect.bottom + 8 + window.scrollY) + 'px';
          } else if (placement === 'left') {
            popover.style.left = (rect.left - pRect.width - 8 + window.scrollX) + 'px';
            popover.style.top = (rect.top + rect.height/2 - pRect.height/2 + window.scrollY) + 'px';
          } else if (placement === 'right') {
            popover.style.left = (rect.right + 8 + window.scrollX) + 'px';
            popover.style.top = (rect.top + rect.height/2 - pRect.height/2 + window.scrollY) + 'px';
          }
        }, 1);
        popover.classList.add('show');
      }
      function hidePopover() {
        if (popover) {
          popover.classList.remove('show');
          setTimeout(() => { if (popover) { popover.remove(); popover = null; } }, 180);
        }
      }
      el.addEventListener('mouseenter', showPopover);
      el.addEventListener('focus', showPopover);
      el.addEventListener('mouseleave', hidePopover);
      el.addEventListener('blur', hidePopover);
    });
  }
};

// === AUTO-INIT FOR TOOLTIP & POPOVER ===
document.addEventListener('DOMContentLoaded', function() {
  window.wpTooltip.init();
  window.wpPopover.init();
});
// === DROPDOWN JS HELPER ===
// Usage: Add .dropdown, .dropdown-toggle, .dropdown-menu to HTML.
// Call wpDropdown.init() once on page load or after dynamic content.
window.wpDropdown = {
  init(root = document) {
    root.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      let dropdown = toggle.closest('.dropdown');
      if (!dropdown) return;
      // Prevent double binding
      if (toggle._wpDropdownBound) return;
      toggle._wpDropdownBound = true;
      toggle.addEventListener('click', e => {
        e.stopPropagation();
        let menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;
        let isOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        if (!isOpen) {
          dropdown.classList.add('open');
          menu.classList.add('show');
        } else {
          dropdown.classList.remove('open');
          menu.classList.remove('show');
        }
      });
    });
    // Close on outside click
    document.addEventListener('click', e => {
      root.querySelectorAll('.dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
        let menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      });
    });
  }
};
// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => { window.wpDropdown.init(); });
// === ALERT JS HELPERS ===
// Usage: wpAlert.show({
//   message: 'Text',
//   type: 'success'|'warning'|'info'|null,
//   bar: true|false, // bar style
//   fixed: 'br'|'tr'|false, // bottom right, top right, or false
//   dismissable: true|false, // show close button
//   autoclose: true|false, // auto close after 10s
//   permanent: true|false, // not dismissable, not autoclose
//   className: '', // extra classes
//   parent: document.body // or custom parent
// })
window.wpAlert = {
  show(opts) {
    if (!opts) return;
    const {
      message = '',
      type = '',
      bar = false,
      fixed = false,
      dismissable = true,
      autoclose = false,
      permanent = false,
      className = '',
      parent = document.body
    } = opts;
    let alert = document.createElement('div');
    let classes = ['alert'];
    if (type === 'success') classes.push('alert-success');
    else if (type === 'warning') classes.push('alert-warning');
    else if (type === 'info') classes.push('alert-info');
    if (bar) classes.push('alert-bar');
    if (fixed === 'br') classes.push('alert-fixed-br');
    if (fixed === 'tr') classes.push('alert-fixed-tr');
    if (!dismissable) classes.push('alert-nodismiss');
    if (permanent) classes.push('alert-permanent');
    if (autoclose) classes.push('alert-autoclose');
    if (className) classes.push(className);
    alert.className = classes.join(' ');
    alert.innerHTML = `<span class="alert-message">${message}</span>`;
    if (dismissable && !permanent) {
      let btn = document.createElement('button');
      btn.className = 'alert-close';
      btn.type = 'button';
      btn.innerHTML = '&times;';
      btn.onclick = () => {
        alert.classList.add('alert-hide');
        setTimeout(() => alert.remove(), 400);
      };
      alert.appendChild(btn);
    }
    if (bar) {
      // bar alerts go at top of parent
      parent.prepend(alert);
    } else {
      parent.appendChild(alert);
    }
    if (autoclose && !permanent) {
      setTimeout(() => {
        alert.classList.add('alert-hide');
        setTimeout(() => alert.remove(), 400);
      }, 10000);
    }
    return alert;
  }
};
// Sidebar off-canvas toggle helper
window.SidebarToggle = function(sidebarSelector = '.sidebar', dimClass = 'sidebar-dim') {
  const sidebar = document.querySelector(sidebarSelector);
  if (!sidebar) return;
  // Only for small screens
  function openSidebar() {
    sidebar.classList.add('open');
    let dim = document.createElement('div');
    dim.className = dimClass;
    dim.onclick = closeSidebar;
    document.body.appendChild(dim);
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    let dim = document.querySelector('.' + dimClass);
    if (dim) dim.remove();
  }
  // Expose for manual use
  sidebar.OpenSidebar = openSidebar;
  sidebar.CloseSidebar = closeSidebar;
  // Optionally, add triggers (e.g., a button with data-wp-sidebar-toggle)
  document.querySelectorAll('[data-sidebar-toggle]').forEach(btn => {
    btn.onclick = openSidebar;
  });
  // Close on resize if needed
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeSidebar();
  });
  return { openSidebar, closeSidebar };
}
// Accordion component
window.wpAccordion = function(selector) {
  const accordions = typeof selector === 'string' ? document.querySelectorAll(selector) : (selector instanceof Element ? [selector] : selector);
  accordions.forEach(acc => {
    acc.querySelectorAll('.wp-accordion-header').forEach(header => {
      header.onclick = function () {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        // Close all siblings
        item.parentElement.querySelectorAll('.wp-accordion-item').forEach(i => i.classList.remove('open'));
        // Open this one if it was not open
        if (!isOpen) item.classList.add('open');
      };
    });
  });
};
// wpcss.js - JS helpers for wp.css framework


// Modal helper (half-screen and full-screen variants)
window.wpModal = function(options = {}) {
  // options: { content, variant: 'half'|'full', closeOnBgClick, closeOnEsc, onClose }
  const modalBg = document.createElement('div');
  modalBg.className = 'wp-modal-bg';
  const variant = options.variant === 'full' ? 'wp-modal wp-modal-full' : (options.variant === 'half' ? 'wp-modal wp-modal-half' : 'wp-modal');
  modalBg.innerHTML = `
    <div class="${variant}" role="dialog" aria-modal="true" tabindex="-1">
      <button class="wp-modal-close" aria-label="Close">&times;</button>
      <div class="wp-modal-content">${options.content || ''}</div>
    </div>
  `;

  // Close logic
  function close() {
    modalBg.remove();
    if (typeof options.onClose === 'function') options.onClose();
    document.removeEventListener('keydown', escListener);
  }
  // Close on background click
  if (options.closeOnBgClick !== false) {
    modalBg.addEventListener('mousedown', e => {
      if (e.target === modalBg) close();
    });
  }
  // Close on Esc
  function escListener(e) {
    if (options.closeOnEsc !== false && e.key === 'Escape') close();
  }
  document.addEventListener('keydown', escListener);
  // Close button
  modalBg.querySelector('.wp-modal-close').onclick = close;

  document.body.appendChild(modalBg);
  setTimeout(() => {
    modalBg.querySelector('.wp-modal').focus();
  }, 10);
  return close;
};

// Simple Dialog helper (centered, smaller than modal)
window.wpDialog = function(title, content, options = {}) {
  const dialogBg = document.createElement('div');
  dialogBg.className = 'wp-dialog-bg';
  dialogBg.innerHTML = `
    <div class="wp-dialog" role="dialog" aria-modal="true" tabindex="-1">
      <button class="wp-dialog-close" aria-label="Close">&times;</button>
      <div class="wp-dialog-header">${title || ''}</div>
      <div class="wp-dialog-content">${content || ''}</div>
      <div class="wp-dialog-footer"><button class="btn btn-blue-5 wp-dialog-close">OK</button></div>
    </div>
  `;
  function close() {
    dialogBg.remove();
    if (typeof options.onClose === 'function') options.onClose();
    document.removeEventListener('keydown', escListener);
  }
  dialogBg.querySelectorAll('.wp-dialog-close').forEach(btn => btn.onclick = close);
  function escListener(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', escListener);
  document.body.appendChild(dialogBg);
  setTimeout(() => {
    dialogBg.querySelector('.wp-dialog').focus();
  }, 10);
  return close;
};



// Auto-init for accordion on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  window.wpAccordion('.wp-accordion');
});



