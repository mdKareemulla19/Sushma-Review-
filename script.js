/* ========================================
   PREMIUM 3D REVIEW BOOSTER - APPLICATION LOGIC
   ======================================== */

const TEMPLATES = {
  hospital: {
    5: [
      { emoji: "🌟", text: "Outstanding experience at this hospital! The doctors were incredibly knowledgeable and took the time to explain everything thoroughly. The staff was warm, caring, and professional. The facilities are modern and clean. Highly recommend to everyone!" },
      { emoji: "💙", text: "I'm truly grateful for the exceptional care I received here. From admission to discharge, every staff member was compassionate and attentive. The medical team was thorough in their diagnosis and treatment. A world-class healthcare experience!" },
      { emoji: "🏥", text: "Best hospital in the area, hands down! The doctors are top-notch, the nursing staff is incredibly supportive, and the facilities are state-of-the-art. They made a stressful time so much easier with their professionalism and empathy. Five stars well deserved!" },
      { emoji: "👨‍⚕️", text: "Amazing medical care! The doctor was patient, attentive, and explained the treatment plan clearly. The support staff ensured a comfortable stay. The hospital maintains excellent hygiene standards. Truly a trustworthy healthcare institution!" },
      { emoji: "🙏", text: "Exceptional service from start to finish. The reception was smooth, wait times were minimal, and the medical team was outstanding. They truly care about their patients' well-being. I feel blessed to have such a great hospital nearby!" }
    ],
    4: [
      { emoji: "👍", text: "Very good experience overall. The doctors are skilled and the staff is friendly. The hospital is well-maintained and clean. Minor wait times but nothing unreasonable. Would definitely recommend this hospital for quality healthcare." },
      { emoji: "😊", text: "Great hospital with experienced doctors and helpful staff. The treatment was effective and the facilities are modern. A few minor areas for improvement but overall a very positive experience. Happy with the care received." },
      { emoji: "✅", text: "Good healthcare experience. Professional doctors who listen to your concerns. The hospital is well-equipped with modern technology. Staff is courteous and responsive. Would recommend to others seeking quality medical care." }
    ],
    3: [
      { emoji: "🤔", text: "Decent hospital with competent doctors. The medical care was adequate but the wait times could be improved. Staff was generally helpful. The facilities are clean but could use some updates. An average experience overall." },
      { emoji: "😐", text: "The medical treatment was fine and the doctors seemed knowledgeable. However, the waiting time was longer than expected. The staff could be more attentive. Facilities are okay but nothing exceptional." }
    ],
    2: [
      { emoji: "😕", text: "Below average experience. Long waiting times and the staff seemed overwhelmed. The doctor was rushed during consultation. The facilities need better maintenance. Room for significant improvement in patient care." },
      { emoji: "👎", text: "Disappointing visit. The wait was unreasonably long and communication from staff was lacking. While the doctor was competent, the overall experience was not what I expected from this hospital." }
    ],
    1: [
      { emoji: "😞", text: "Very poor experience. Extremely long wait times, unresponsive staff, and the facilities were not up to standard. The whole experience was frustrating. Significant improvements are needed in patient care and management." },
      { emoji: "❌", text: "Terrible experience overall. Staff was rude and unhelpful. Had to wait for hours without any updates. The hospital needs to seriously improve their service quality and patient management systems." }
    ]
  },
  generic: {
    5: [
      { emoji: "🌟", text: "Absolutely fantastic experience! Everything was perfect from start to finish. The team is incredibly professional, skilled, and genuinely cares about their customers. The quality of service is outstanding. Highly recommended to everyone!" },
      { emoji: "❤️", text: "Best in the business! Exceptional quality, wonderful customer service, and great value for money. Every interaction has been positive and the results always exceed expectations. Five stars well deserved! Will keep coming back!" },
      { emoji: "⭐", text: "Outstanding service! The team goes above and beyond to ensure customer satisfaction. The attention to detail is remarkable and the professionalism is top-notch. I wouldn't hesitate to recommend them to anyone!" }
    ],
    4: [
      { emoji: "👍", text: "Very good experience overall. Professional service, friendly staff, and quality results. A few minor areas could be improved but nothing significant. Would happily recommend and will definitely return." }
    ],
    3: [
      { emoji: "🤷", text: "Average experience. The service was decent but nothing exceptional. Staff was polite enough. Results were satisfactory. Pricing is fair. An okay option but there might be better alternatives available." }
    ],
    2: [
      { emoji: "😕", text: "Below average experience. The service quality didn't meet expectations and the staff could be more attentive." }
    ],
    1: [
      { emoji: "😞", text: "Very poor experience. Terrible service quality, rude staff, and unacceptable results. Not worth the money at all." }
    ]
  }
};

const RATING_LABELS = {
  1: "Terrible 😞",
  2: "Poor 😕",
  3: "Average 😐",
  4: "Good 😊",
  5: "Excellent 🌟"
};

// ---- APP STATE ----
// Auto-detect client slug from URL path
function getClientSlug() {
  const path = window.location.pathname;
  const match = path.match(/kareem\/([^/]+)/);
  return match ? match[1] : 'sushma';
}
const CLIENT_SLUG = getClientSlug();

const state = {
  rating: 0,
  selectedTemplate: null,
  businessName: "Sushma Multispeciality Hospital",
  location: "Siddipet, Telangana",
  lrd: "0x3bcc93a0ee6fc931:0x83ea431dd11b5280",
  category: "hospital"
};

// ---- DOM REFERENCES ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  starsContainer: $("#starsContainer"),
  starBtns: $$(".star-btn"),
  ratingLabel: $("#ratingLabel"),
  templatesSection: $("#templatesSection"),
  templatesGrid: $("#templatesGrid"),
  reviewSection: $("#reviewSection"),
  actionsSection: $("#actionsSection"),
  reviewTextarea: $("#reviewTextarea"),
  selectedStars: $("#selectedStars"),
  charCount: $("#charCount"),
  btnPost: $("#btnPost"),
  btnClear: $("#btnClear"),
  toast: $("#toast"),
  toastMessage: $("#toastMessage"),
  businessName: $("#businessName"),
  businessLocation: $("#businessLocation"),
  avatarInitial: $("#avatarInitial"),
  settingsToggle: $("#settingsToggle"),
  settingsModal: $("#settingsModal"),
  modalClose: $("#modalClose"),
  btnSaveSettings: $("#btnSaveSettings"),
  inputBusinessName: $("#inputBusinessName"),
  inputLocation: $("#inputLocation"),
  inputLrd: $("#inputLrd"),
  inputCategory: $("#inputCategory"),
  existingReviewsSection: $("#existingReviewsSection"),
  testimonialsContainer: $("#testimonialsContainer")
};

// ---- PARTICLE SYSTEM (Canvas) ----
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    // Create 70 particles
    for(let i=0; i<70; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        depth: Math.random() * 0.6 + 0.1
      });
    }
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(let i=0; i<this.particles.length; i++) {
      let p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Wrap around
      if(p.x < 0) p.x = this.canvas.width;
      if(p.x > this.canvas.width) p.x = 0;
      if(p.y < 0) p.y = this.canvas.height;
      if(p.y > this.canvas.height) p.y = 0;
      
      // Mouse repulsion
      if(this.mouse.x) {
        let dx = this.mouse.x - p.x;
        let dy = this.mouse.y - p.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }
      }
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(123, 170, 247, ${p.depth})`;
      this.ctx.fill();
      
      // Connect nearby particles
      for(let j=i+1; j<this.particles.length; j++) {
        let p2 = this.particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(123, 170, 247, ${0.1 * (1 - dist/100)})`;
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ---- 3D TILT ENGINE ----
function initTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const tiltCards = $$('.tilt-card');
  tiltCards.forEach(card => {
    const inner = card.querySelector('.card-inner') || card;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      inner.style.transform = `rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      inner.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'none';
    });
  });
}

// ---- MAGNETIC BUTTONS ----
function initMagnetic() {
  const magnets = $$('.magnetic-btn');
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

// ---- MOUSE FOLLOWER ----
function initMouseFollower() {
  const follower = document.getElementById('mouseFollower');
  if (!follower) return;
  window.addEventListener('mousemove', e => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  });
}

// ---- SMOOTH REVEAL ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => observer.observe(el));
}

// ---- STAR BURST ----
function createBurst(x, y) {
  for(let i=0; i<12; i++) {
    const p = document.createElement('div');
    p.className = 'burst-particle';
    document.body.appendChild(p);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 30 + Math.random() * 40;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    
    setTimeout(() => p.remove(), 600);
  }
}


// ---- INITIALIZE APP ----
function init() {
  new ParticleSystem();
  initMouseFollower();
  loadSettings();
  renderExistingReviews();
  bindEvents();
  updateBusinessDisplay();
  checkURLParams();
  
  // Delay visual inits
  setTimeout(() => {
    initTilt();
    initMagnetic();
    initScrollReveal();
    $('#headerCard').classList.add('active');
  }, 100);
}

function renderExistingReviews() {
  try {
    const data = localStorage.getItem('rb_existing_reviews_' + CLIENT_SLUG) || localStorage.getItem('rb_existing_reviews');
    if (!data) return;
    const reviews = JSON.parse(data);
    if (!reviews || reviews.length === 0) return;
    
    dom.existingReviewsSection.classList.remove('hidden');
    dom.testimonialsContainer.innerHTML = '';
    
    reviews.forEach((review, index) => {
      const initials = review.name.substring(0, 2).toUpperCase();
      let starsHtml = '';
      for(let i=0; i<5; i++) {
        starsHtml += `<svg class="t-star ${i < review.rating ? 'active' : ''}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      }
      
      const card = document.createElement('div');
      card.className = 'testimonial-card tilt-card reveal';
      card.style.transitionDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <div class="card-inner">
          <div class="t-header">
            <div class="t-avatar">${initials}</div>
            <div class="t-info">
              <h4 class="t-name">${review.name}</h4>
              <div class="t-date">${review.date}</div>
            </div>
            <div class="t-stars">${starsHtml}</div>
          </div>
          <div class="t-quote">"</div>
          <p class="t-text">${review.text}</p>
        </div>
      `;
      dom.testimonialsContainer.appendChild(card);
    });
  } catch (e) {
    console.error("Error loading existing reviews:", e);
  }
}

// ---- LOAD FROM LOCAL STORAGE ----
function loadSettings() {
  // Try client-specific settings first
  const clientKey = 'rb_client_' + CLIENT_SLUG;
  const clients = localStorage.getItem('rb_clients');
  if (clients) {
    const parsed = JSON.parse(clients);
    const client = parsed.find(c => c.slug === CLIENT_SLUG);
    if (client) {
      state.businessName = client.name;
      state.location = client.location;
      state.lrd = client.lrd || state.lrd;
      state.category = client.category || state.category;
    }
  }

  // Then check saved settings (overrides)
  const saved = localStorage.getItem('reviewBoosterSettings_' + CLIENT_SLUG) || localStorage.getItem('reviewBoosterSettings');
  if (saved) {
    const s = JSON.parse(saved);
    state.businessName = s.businessName || state.businessName;
    state.location = s.location || state.location;
    state.lrd = s.lrd || state.lrd;
    state.category = s.category || state.category;
  }

  dom.inputBusinessName.value = state.businessName;
  dom.inputLocation.value = state.location;
  dom.inputLrd.value = state.lrd;
  dom.inputCategory.value = state.category;
}

function saveSettings() {
  localStorage.setItem('reviewBoosterSettings_' + CLIENT_SLUG, JSON.stringify({
    businessName: state.businessName,
    location: state.location,
    lrd: state.lrd,
    category: state.category
  }));
}

// ---- CHECK URL PARAMS ----
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("name")) {
    state.businessName = decodeURIComponent(params.get("name"));
    dom.inputBusinessName.value = state.businessName;
  }
  if (params.get("location")) {
    state.location = decodeURIComponent(params.get("location"));
    dom.inputLocation.value = state.location;
  }
  if (params.get("lrd")) {
    state.lrd = decodeURIComponent(params.get("lrd"));
    dom.inputLrd.value = state.lrd;
  }
  if (params.get("category")) {
    state.category = decodeURIComponent(params.get("category"));
    dom.inputCategory.value = state.category;
  }
  updateBusinessDisplay();
}

// ---- BIND EVENTS ----
function bindEvents() {
  dom.starBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      createBurst(rect.left + rect.width/2, rect.top + rect.height/2);
      
      // 3D Flip animation trigger
      btn.classList.add('flip');
      setTimeout(() => btn.classList.remove('flip'), 600);
      
      handleRating(parseInt(btn.dataset.rating));
    });
    btn.addEventListener("mouseenter", () => highlightStars(parseInt(btn.dataset.rating)));
    btn.addEventListener("mouseleave", () => highlightStars(state.rating));
  });

  dom.reviewTextarea.addEventListener("input", () => {
    dom.charCount.textContent = dom.reviewTextarea.value.length;
  });

  dom.btnPost.addEventListener("click", handlePost);
  dom.btnClear.addEventListener("click", handleClear);

  dom.settingsToggle.addEventListener("click", () => {
    dom.settingsModal.classList.remove("hidden");
  });
  dom.modalClose.addEventListener("click", () => {
    dom.settingsModal.classList.add("hidden");
  });
  dom.settingsModal.addEventListener("click", (e) => {
    if (e.target === dom.settingsModal) dom.settingsModal.classList.add("hidden");
  });
  dom.btnSaveSettings.addEventListener("click", handleSaveSettings);
}

// ---- STAR RATING HANDLING ----
function handleRating(rating) {
  state.rating = rating;
  state.selectedTemplate = null;

  highlightStars(rating);
  
  dom.ratingLabel.textContent = RATING_LABELS[rating];
  dom.ratingLabel.classList.add("active");
  setTimeout(() => dom.ratingLabel.classList.remove("active"), 300);

  renderTemplates(rating);
  dom.templatesSection.classList.remove("hidden");
  dom.reviewSection.classList.remove("hidden");
  dom.actionsSection.classList.remove("hidden");
  
  setTimeout(() => {
    dom.templatesSection.classList.add("active");
    dom.reviewSection.classList.add("active");
    dom.actionsSection.classList.add("active");
  }, 50);

  renderSelectedStars(rating);
  dom.reviewTextarea.value = "";
  dom.charCount.textContent = "0";

  setTimeout(() => {
    dom.templatesSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 300);
}

function highlightStars(rating) {
  dom.starBtns.forEach((btn, i) => {
    if (i < rating) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function renderSelectedStars(rating) {
  let html = "";
  for (let i = 0; i < rating; i++) {
    html += `<svg class="mini-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }
  dom.selectedStars.innerHTML = html;
}

// ---- TEMPLATE RENDERING ----
function renderTemplates(rating) {
  const category = state.category;
  let templates;

  try {
    const cmsData = localStorage.getItem('rb_all_reviews_' + CLIENT_SLUG) || localStorage.getItem('rb_all_reviews');
    if (cmsData) {
      const parsed = JSON.parse(cmsData);
      templates = (parsed[rating] || []).map(t => ({ emoji: t.emoji, text: t.text }));
    }
  } catch(e) {}

  if (!templates || templates.length === 0) {
    templates = (TEMPLATES[category] && TEMPLATES[category][rating]) || TEMPLATES.generic[rating] || [];
  }
  
  dom.templatesGrid.innerHTML = "";

  templates.forEach((template, index) => {
    const card = document.createElement("div");
    card.className = "template-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <span class="template-emoji">${template.emoji}</span>
      <p class="template-text">${template.text}</p>
    `;
    card.addEventListener("click", () => selectTemplate(card, template.text));
    dom.templatesGrid.appendChild(card);
  });
}

function selectTemplate(card, text) {
  $$(".template-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
  state.selectedTemplate = text;
  dom.reviewTextarea.value = text;
  dom.charCount.textContent = text.length;
  
  setTimeout(() => {
    dom.reviewSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 200);
}

// ---- POST REVIEW ----
async function handlePost() {
  const reviewText = dom.reviewTextarea.value.trim();
  if (!reviewText) {
    showToast("Please write or select a review first!");
    return;
  }

  try {
    await navigator.clipboard.writeText(reviewText);
  } catch (err) {
    const textarea = document.createElement("textarea");
    textarea.value = reviewText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  showToast("✅ Review copied! Opening Google...");

  const searchQuery = encodeURIComponent(state.businessName + " " + state.location + " reviews");
  let reviewUrl = state.lrd ? 
    `https://www.google.com/search?q=${searchQuery}#lrd=${state.lrd},3,,,,` : 
    `https://www.google.com/search?q=${searchQuery}`;

  setTimeout(() => {
    window.open(reviewUrl, "_blank");
  }, 1200);
}

function handleClear() {
  state.selectedTemplate = null;
  dom.reviewTextarea.value = "";
  dom.charCount.textContent = "0";
  $$(".template-card").forEach(c => c.classList.remove("selected"));
}

function handleSaveSettings() {
  state.businessName = dom.inputBusinessName.value.trim() || state.businessName;
  state.location = dom.inputLocation.value.trim() || state.location;
  state.lrd = dom.inputLrd.value.trim();
  state.category = dom.inputCategory.value;

  saveSettings();
  updateBusinessDisplay();
  dom.settingsModal.classList.add("hidden");

  if (state.rating > 0) renderTemplates(state.rating);
  showToast("Settings saved successfully!");
}

function updateBusinessDisplay() {
  dom.businessName.textContent = state.businessName;
  dom.avatarInitial.textContent = state.businessName.charAt(0).toUpperCase();
  dom.businessLocation.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
    ${state.location}
  `;
}

function showToast(message) {
  dom.toastMessage.textContent = message;
  dom.toast.classList.remove("hidden");
  dom.toast.offsetHeight;
  dom.toast.classList.add("show");

  setTimeout(() => {
    dom.toast.classList.remove("show");
    setTimeout(() => dom.toast.classList.add("hidden"), 500);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", init);
