const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navLinks = navigation.querySelectorAll('a');
const bookingForm = document.querySelector('#booking-form');
const successMessage = document.querySelector('#form-success');
const scheduleMessage = document.querySelector('#schedule-message');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const serviceInput = document.querySelector('#service');
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
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu();
});

window.addEventListener('scroll', updateHeader, { passive: true });
const floatingBook = document.querySelector('.floating-book');
const heroSection = document.querySelector('.hero');
const bookingSection = document.querySelector('#booking');
const contactSection = document.querySelector('#contact');

function updateFloatingBook() {
  if (!floatingBook || !heroSection) return;
  const isMobile = window.matchMedia('(max-width: 680px)').matches;
  const bookingRect = bookingSection?.getBoundingClientRect();
  const contactRect = contactSection?.getBoundingClientRect();
  const bookingVisible = bookingRect && bookingRect.top < window.innerHeight && bookingRect.bottom > 0;
  const contactVisible = contactRect && contactRect.top < window.innerHeight && contactRect.bottom > 0;
  const pastHero = window.scrollY > heroSection.offsetHeight * 0.72;
  floatingBook.classList.toggle('visible', Boolean(isMobile && pastHero && !bookingVisible && !contactVisible));
}

window.addEventListener('scroll', updateFloatingBook, { passive: true });
window.addEventListener('resize', updateFloatingBook);
updateFloatingBook();

updateHeader();
const sectionNavLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]:not(.button)')];
const navTargets = sectionNavLinks
  .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.target);

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  sectionNavLinks.forEach((link) => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });
  const match = navTargets.find((item) => item.target === visible.target);
  if (match) {
    match.link.classList.add('active');
    match.link.setAttribute('aria-current', 'location');
  }
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .15, .35] });

navTargets.forEach(({ target }) => activeSectionObserver.observe(target));

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split('T')[0];

const scheduleByDay = {
  2: { label: 'Tuesday hours: 8:00 AM–12:00 PM', times: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
  3: { label: 'Wednesday hours: 8:00 AM–12:00 PM', times: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
  4: { label: 'Thursday hours: 7:00 AM–3:00 PM', times: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'] },
  5: { label: 'Friday hours: 7:00 AM–3:00 PM', times: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'] },
  6: { label: 'Saturday hours: 6:00 AM–1:00 PM', times: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'] }
};

function resetTimeOptions(message = 'Select a date first') {
  timeInput.innerHTML = `<option value="">${message}</option>`;
  timeInput.disabled = true;
}

dateInput.addEventListener('change', () => {
  successMessage.classList.remove('visible');
  const selected = new Date(`${dateInput.value}T12:00:00`);
  const schedule = scheduleByDay[selected.getDay()];

  if (!schedule) {
    resetTimeOptions('Closed on this day');
    scheduleMessage.textContent = 'Freda is closed on Sundays and Mondays. Please choose Tuesday through Saturday.';
    return;
  }

  timeInput.innerHTML = '<option value="">Select a time</option>';
  schedule.times.forEach((time) => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    timeInput.appendChild(option);
  });
  timeInput.disabled = false;
  scheduleMessage.textContent = schedule.label;
});

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    serviceInput.value = link.dataset.service;
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.classList.remove('visible');

  const selected = new Date(`${dateInput.value}T12:00:00`);
  if (!scheduleByDay[selected.getDay()]) {
    scheduleMessage.textContent = 'Freda is closed on Sundays and Mondays. Please choose another date.';
    dateInput.focus();
    return;
  }

  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const formattedDate = selected.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const message = [
    'Hi Freda, I would like to request an appointment.',
    '',
    `Name: ${formData.get('name')}`,
    `Callback number: ${formData.get('phone')}`,
    `Service: ${formData.get('service')}`,
    `Preferred date: ${formattedDate}`,
    `Preferred time: ${formData.get('time')}`,
    '',
    'Please let me know if this time is available. Thank you!'
  ].join('\n');

  successMessage.classList.add('visible');
  const smsUrl = `sms:+12094479025?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
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
    const sourceImage = item.querySelector('img');
    const imageUrl = sourceImage?.currentSrc || sourceImage?.src;
    lightboxImage.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : getComputedStyle(item).backgroundImage;
    lightboxLabel.textContent = item.dataset.label || 'Freda the Barber portfolio image';
    lightboxImage.setAttribute('aria-label', item.dataset.label || 'Freda the Barber portfolio image');
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

// Focused visual update: use Freda's professional portrait only in the existing About section.
const aboutImage = document.querySelector('.about-image');
if (aboutImage) {
  aboutImage.style.backgroundImage = 'linear-gradient(180deg, transparent, rgba(0,0,0,.32)), url("assets/freda-profile.webp")';
  aboutImage.style.backgroundPosition = 'center 28%';
}

// Focused gallery refinement: remove the oversized classic-style tile and rebalance the remaining photos.
const oversizedGalleryItem = document.querySelector('.gallery-item.gallery-one');
if (oversizedGalleryItem) {
  oversizedGalleryItem.remove();
}

const balancedGalleryStyles = document.createElement('style');
balancedGalleryStyles.textContent = `
  .gallery-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: none;
    grid-auto-rows: 300px;
  }
  .gallery-grid > .gallery-item {
    grid-column: span 2;
    grid-row: auto;
  }
  .gallery-grid > .gallery-item:nth-child(-n+2) {
    grid-column: span 3;
  }

  @media (max-width: 980px) {
    .gallery-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: none;
      grid-auto-rows: 300px;
    }
    .gallery-grid > .gallery-item,
    .gallery-grid > .gallery-item:nth-child(-n+2) {
      grid-column: auto;
      grid-row: auto;
    }
    .gallery-grid > .gallery-item:last-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 680px) {
    .gallery-grid {
      grid-template-columns: 1fr;
      grid-template-rows: none;
      grid-auto-rows: 360px;
    }
    .gallery-grid > .gallery-item,
    .gallery-grid > .gallery-item:nth-child(-n+2),
    .gallery-grid > .gallery-item:last-child {
      grid-column: auto;
      grid-row: auto;
    }
  }
`;
document.head.appendChild(balancedGalleryStyles);
