const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

// Toggle menu ONLY when hamburger is clicked
hamburger.addEventListener("click", () => {
  const isActive = hamburger.classList.contains("active");
  if (isActive) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  } else {
    hamburger.classList.add("active");
    navMenu.classList.add("open");
  }
});

// Close menu when clicking a nav link
document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  });
});


//Visitor Counter Script
// Load stats from localStorage or initialize
let stats = JSON.parse(localStorage.getItem("visitorStats")) || {
  today: 0,
  yesterday: 0,
  thisWeek: 0,
  lastWeek: 0,
  thisMonth: 0,
  lastMonth: 0,
  thisYear: 0,
  lastYear: 0,
  lastVisitDate: "",
  lastWeekNumber: getWeekNumber(new Date()),
  lastMonthNumber: new Date().getMonth(),
  lastYearNumber: new Date().getFullYear()
};
// Get current date
const now = new Date();
const todayStr = now.toDateString();
const currentWeek = getWeekNumber(now);
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

// Reset logic (if day/week/month/year changed since last visit)
if (stats.lastVisitDate !== todayStr) {
  // Day changed
  stats.yesterday = stats.today;
  stats.today = 0;
  stats.lastVisitDate = todayStr;

  // Week changed
  if (stats.lastWeekNumber !== currentWeek) {
    stats.lastWeek = stats.thisWeek;
    stats.thisWeek = 0;
    stats.lastWeekNumber = currentWeek;
  }

  // Month changed
  if (stats.lastMonthNumber !== currentMonth) {
    stats.lastMonth = stats.thisMonth;
    stats.thisMonth = 0;
    stats.lastMonthNumber = currentMonth;
  }

  // Year changed
  if (stats.lastYearNumber !== currentYear) {
    stats.lastYear = stats.thisYear;
    stats.thisYear = 0;
    stats.lastYearNumber = currentYear;
  }
}


// Reset logic (if day changed since last visit)
if (stats.lastVisitDate !== todayStr) {
  stats.yesterday = stats.today;
  stats.today = 0;
  stats.lastVisitDate = todayStr;
}

// Increment stats
stats.today++;
stats.thisWeek++;
stats.thisMonth++;
stats.thisYear++;
stats.total++;

// Save stats
localStorage.setItem("visitorStats", JSON.stringify(stats));

// Display in small counter
if (document.getElementById("todayCount")) {
  document.getElementById("todayCount").innerText = stats.today;
}
if (document.getElementById("yesterdayCount")) {
  document.getElementById("yesterdayCount").innerText = stats.yesterday;
}

// Display in popup
if (document.getElementById("popupToday")) {
  document.getElementById("popupToday").innerText = stats.today;
  document.getElementById("popupWeek").innerText = stats.thisWeek;
  document.getElementById("popupLastWeek").innerText = stats.lastWeek;
  document.getElementById("popupMonth").innerText = stats.thisMonth;
  document.getElementById("popupLastMonth").innerText = stats.lastMonth;
  document.getElementById("popupYear").innerText = stats.thisYear;
  document.getElementById("popupLastYear").innerText = stats.lastYear;
  document.getElementById("popupTotal").innerText = stats.total;
}

// Helper: Get week number
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

// Open & Close Popup
function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
}
function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}



//Awards Grid Click Handler

document.addEventListener("DOMContentLoaded", () => {
  const awards = document.querySelectorAll(".awards-grid .award");

  awards.forEach(item => {
    const targets = item.querySelectorAll(".award-icon, .text");

    targets.forEach(el => {
      el.addEventListener("click", () => {
        const wasActive = item.classList.contains("active");

        // close all
        awards.forEach(a => a.classList.remove("active"));

        // reopen if it was closed
        if (!wasActive) item.classList.add("active");
      });
    });
  });
});


//Video Play Button Handler

document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("button");
  const videoIframe = document.getElementById("videoLink");
  const filmImage = document.querySelector(".film3 img");

  if (playButton && videoIframe && filmImage) {
    playButton.addEventListener("click", () => {
      // Hide the thumbnail
      filmImage.style.display = "none";
      playButton.style.display = "none";

      // Update iframe src to autoplay
      const src = videoIframe.getAttribute("src");
      videoIframe.setAttribute("src", src + "&autoplay=1");

      // Show the iframe
      videoIframe.style.display = "block";
    });
  }
});

// Live Ticker for Location and Time
(function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  let locationStr = 'Locating…';
  let city = '', region = '', country = '';
  let gotReadableLocation = false;

  // Update the ticker text, duplicate it for seamless scroll
  function renderTicker() {
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const loc = gotReadableLocation
      ? `${city ? city + ', ' : ''}${region ? region + ', ' : ''}${country || ''}`.replace(/,\s*$/,'')
      : locationStr;

    const base = `📍 ${loc} <span class="ticker-dot">•</span> 📅 ${dateStr} <span class="ticker-dot">•</span> ⏰ ${timeStr}`;
    // Duplicate with spacing for a continuous loop
    track.innerHTML = `${base} <span class="ticker-dot">•</span> ${base}`;
  }

  // Try geolocation
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      locationStr = `Lat ${latitude.toFixed(3)}, Lng ${longitude.toFixed(3)}`;

      // Try reverse geocoding (OpenStreetMap Nominatim)
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          city   = addr.city || addr.town || addr.village || addr.hamlet || '';
          region = addr.state || addr.region || '';
          country= addr.country || '';
          gotReadableLocation = !!(city || region || country);
        }
      } catch (_) {
        // ignore network errors; we'll keep the lat/lng fallback
      }

      renderTicker();
    }, () => {
      // Permission denied or failed
      locationStr = 'Location unavailable';
      renderTicker();
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
  } else {
    locationStr = 'Geolocation unsupported';
    renderTicker();
  }

  // Initial paint + live time updates
  renderTicker();
  setInterval(renderTicker, 1000);
})();

// Carousel Functionality
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel1");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-button-next");
  const prevButton = document.querySelector(".carousel-button-prev");
  const dotsNav = document.querySelector(".carousel-nav");
  const dots = Array.from(dotsNav.children);

  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active dot
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
  }

  function moveToSlide(index) {
    currentIndex = (index + slides.length) % slides.length; // loop around
    updateCarousel();
  }

  // Button clicks
  nextButton.addEventListener("click", () => moveToSlide(currentIndex + 1));
  prevButton.addEventListener("click", () => moveToSlide(currentIndex - 1));

  // Dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => moveToSlide(index));
  });

  // Auto play every 5s
  setInterval(() => moveToSlide(currentIndex + 1), 5000);

  // Init
  updateCarousel();
});


// Dynamic Responsive Adjustments
function adjustLayout() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Example: Adjust font sizes globally
  document.documentElement.style.setProperty('--base-font-size', width > 1200 ? '18px' :
                                                         width > 768 ? '16px' : '14px');

 const header = document.querySelector('header.nav'); // only apply to nav headers

  // Example: Adjust padding/margin for main sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.padding = width > 1200 ? '60px 40px' :
                            width > 768 ? '40px 20px' : '30px 15px';
  });

  // Example: Adjust small counter size
  const counter = document.querySelector('.visitor-counter');
  if (counter) {
    counter.style.width = width > 1200 ? '260px' :
                          width > 768 ? '220px' : '180px';
    counter.style.padding = width > 768 ? '20px 30px' : '15px 20px';
    counter.style.fontSize = width > 768 ? '1em' : '0.85em';
  }

  // Example: Adjust ticker font size
  const ticker = document.getElementById('tickerTrack');
  if (ticker) {
    ticker.style.fontSize = width > 1200 ? '1.1em' :
                            width > 768 ? '1em' : '0.85em';
  }
}

// Initial adjustment
adjustLayout();

// Adjust dynamically on window resize
window.addEventListener('resize', adjustLayout);
