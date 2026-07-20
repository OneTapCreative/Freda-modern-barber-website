const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navLinks = navigation.querySelectorAll('a');
const bookingForm = document.querySelector('#booking-form');
const successMessage = document.querySelector('#form-success');
const dateInput = document.querySelector('#date');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxLabel = document.querySelector('#lightbox-label');
const galleryItems = document.querySelectorAll('.gallery-item');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 18);
}

function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split('T')[0];

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  successMessage.classList.add('visible');
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const image = getComputedStyle(item).backgroundImage;
    lightboxImage.style.backgroundImage = image;
    lightboxLabel.textContent = item.dataset.label || 'Barber portfolio image';
    lightboxImage.setAttribute('aria-label', item.dataset.label || 'Barber portfolio image');
    lightbox.showModal();
  });
});

lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelectorAll('.accordion details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.accordion details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
