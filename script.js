// --- ACCESSIBLE LAYER PROFILE DROPDOWN MANAGER ---
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('accountDropdown');
  if (dropdown) dropdown.classList.toggle('show');
}

// Intercept clicks window-wide to collapse menu targets
window.addEventListener('click', function(e) {
  const dropdown = document.getElementById('accountDropdown');
  const widget = document.getElementById('profileWidget');
  const userBadge = document.querySelector('.user-profile-nav-badge');
  
  if (dropdown && !dropdown.contains(e.target)) {
    if ((widget && widget.contains(e.target)) || (userBadge && userBadge.contains(e.target))) {
      return;
    }
    dropdown.classList.remove('show');
  }
});

// --- PROFILE IMAGE INSTANT RE-RENDER STREAMER ---
function handleAvatarUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const liveDataUrl = e.target.result;
      currentUserProfile.avatar = liveDataUrl;
      saveProfileState();

      // Mirror chosen local data streams across profile image nodes
      const navAvatar = document.getElementById('navAvatarImg');
      const dropdownAvatar = document.getElementById('dropdownAvatarImg');
      const upbAvatar = document.querySelector('.upb-avatar');
      
      if (navAvatar) navAvatar.src = liveDataUrl;
      if (dropdownAvatar) dropdownAvatar.src = liveDataUrl;
      if (upbAvatar) {
        upbAvatar.style.background = `url('${liveDataUrl}') center/cover no-repeat`;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// --- SECURE MULTI-VIEW PANE WIRE ROUTER ---
function navigateToView(targetView) {
  const homePane = document.getElementById('home-view-wrapper');
  const reviewPane = document.getElementById('reviews-standalone-view');
  const accountPane = document.getElementById('account-portal-view');
  const aboutSection = document.getElementById('about');
  
  // Strip execution link indicators first
  document.querySelectorAll('.navbar .nav-item, nav .nav-item').forEach(item => item.classList.remove('active'));

  // Route layouts selectively based on view requests
  if (targetView === 'home') {
    if (homePane) homePane.classList.remove('view-pane-hidden');
    if (reviewPane) reviewPane.classList.add('view-pane-hidden');
    if (accountPane) accountPane.classList.add('view-pane-hidden');
    if (aboutSection) aboutSection.style.display = "block";
    
    const navHome = document.getElementById('navHome');
    if (navHome) navHome.classList.add('active');
    
    if (searchInput) searchInput.value = '';
    moodButtons.forEach(btn => btn.classList.remove('active'));
    
    storesVisible = false;
    if (showAllBtn) showAllBtn.textContent = "Show All Food Stores";
    showFeaturedCards();
  } else if (targetView === 'reviews') {
    if (homePane) homePane.classList.add('view-pane-hidden');
    if (reviewPane) reviewPane.classList.remove('view-pane-hidden');
    if (accountPane) accountPane.classList.add('view-pane-hidden');
    if (aboutSection) aboutSection.style.display = "none";
    
    const navReviews = document.getElementById('navReviews');
    if (navReviews) navReviews.classList.add('active');
    
    renderGlobalReviewsFeed();
  } else if (targetView === 'account') {
    if (homePane) homePane.classList.add('view-pane-hidden');
    if (reviewPane) reviewPane.classList.add('view-pane-hidden');
    if (accountPane) accountPane.classList.remove('view-pane-hidden');
    if (aboutSection) aboutSection.style.display = "none";
    
    // Fill profile values in editor cards
    document.getElementById('editDisplayName').value = currentUserProfile.displayName;
    document.getElementById('editUsername').value = currentUserProfile.username;
    
    renderAccountActivityLists();
  }
  
  if (navLinks) navLinks.classList.remove('show');
  const dropdown = document.getElementById('accountDropdown');
  if (dropdown) dropdown.classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Wire standard link items directly into custom single pane triggers
const navHome = document.getElementById('navHome');
const navReviews = document.getElementById('navReviews');
const navAbout = document.getElementById('navAbout');

if (navHome) navHome.addEventListener('click', (e) => { e.preventDefault(); navigateToView('home'); });
if (navReviews) navReviews.addEventListener('click', (e) => { e.preventDefault(); navigateToView('reviews'); });
if (navAbout) {
  navAbout.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.navbar .nav-item, nav .nav-item').forEach(item => item.classList.remove('active'));
    if (navAbout) navAbout.classList.add('active');
    
    const homePane = document.getElementById('home-view-wrapper');
    const reviewPane = document.getElementById('reviews-standalone-view');
    const accountPane = document.getElementById('account-portal-view');
    const aboutSection = document.getElementById('about');
    
    if (homePane) homePane.classList.remove('view-pane-hidden');
    if (reviewPane) reviewPane.classList.add('view-pane-hidden');
    if (accountPane) accountPane.classList.add('view-pane-hidden');
    if (aboutSection) aboutSection.style.display = "block";
    if (navLinks) navLinks.classList.remove('show');
    
    const offset = aboutSection ? aboutSection.offsetTop - 100 : 0;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
}

function displayAccountPortal() {
  navigateToView('account');
}

// FIXED LOGOUT: Clears session attributes, falls back to generic state, and rebuilds the nav bar
function handleLogout() {
  alert("Logging out from aNU Tara?...");
  currentUserProfile.isLoggedIn = false;
  saveProfileState();
  rebuildNavbarAuthState();
  navigateToView('home');
}

// --- SECURE FEEDBACK STORAGE HANDLING ---
function submitAdminFeedback(event) {
  event.preventDefault();

  // NEW RESTRICTION
  if (!currentUserProfile.isLoggedIn) {
    alert("Please log in first before submitting feedback.");
    isLoginMode = true;
    updateAuthFormUI();
    if (authModal) authModal.style.display = 'flex';
    return;
  }

  const targetTitle = document.getElementById('feedbackPlaceName').value;
  const targetBody = document.getElementById('feedbackText').value;
  
  console.log("🔒 Feedback submitted securely:", {
    title: targetTitle,
    message: targetBody,
    user: currentUserProfile.displayName
  });
  
  const status = document.getElementById('feedbackStatus');
  if (status) {
    status.style.color = "#2e7d32";
    status.innerText = "🔒 Feedback successfully logged to the secure Developer Log.";
  }

  document.getElementById('feedbackForm').reset();
}

/* RESPONSIVE HAMBURGER BAR LINK CHANGER */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (navLinks) navLinks.classList.toggle('show');
  });
}

const PROFILE_STORAGE_KEY = 'anutaras-profile-state-v1';

function getDefaultProfileState() {
  return {
    avatar: "default-avatar.png",
    isLoggedIn: false,
    displayName: "User Profile",
    username: "Account Details",
    savedStores: []
  };
}

function loadProfileState() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null');
    return { ...getDefaultProfileState(), ...(saved || {}) };
  } catch (error) {
    console.warn('Profile restore failed, using defaults.', error);
    return getDefaultProfileState();
  }
}

function saveProfileState() {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(currentUserProfile));
}

let currentUserProfile = loadProfileState();

/* REVIEWS MEMORY GRID MODULE STORAGE */
const initialStoreComments = {
  'kainan-zamura': [
    { user: "Renz T.", stars: 5, text: "Serving sizes are huge! Best victory treat after surviving a database project defense." }
  ],
  'koncrete-cafe': [
    { user: "Patricia M.", stars: 4, text: "Super cool industrial layout aesthetic. Great coffee, open very late for late night study crunches." }
  ],
  'kmukbang-samgyupsal': [
    { user: "Josh D.", stars: 5, text: "Unlimited options are completely worth the price. Perfect meat options." }
  ],
  'apu-atang': [
    { user: "Ysa M.", stars: 5, text: "Exceptional homemade taste and the pricing is unmatched for budget student budgets." }
  ],
  'japacafe': [
    { user: "Kevin P.", stars: 5, text: "Amazing customer service and the katsu menu is extremely budget friendly!" },
    { user: "Sarah L.", stars: 4, text: "Cozy layout but seats fill up fast around standard afternoon class breaks." }
  ],
  'lika-kape': [
    { user: "Arianne V.", stars: 5, text: "Incredibly quiet. Love tracking creative references or reviewing exam modules here." }
  ],
  'budcheng-meryenda': [
    { user: "Dan S.", stars: 4, text: "Classic street snacks that never fail my tight mid-week wallet limits." }
  ],
  'li-ramyeon': [
    { user: "Chloe G.", stars: 3, text: "Nice soup options, warm broth helps block out stressful system errors." }
  ],
  'dantes-chicken-house': [
    { user: "Mark A.", stars: 4, text: "Crispy fried chicken options with generous gravy pairings." }
  ],
  'cafe-saburo': [
    { user: "Erika L.", stars: 5, text: "Minimalist and extremely clean interior look. Coffee options taste premium." }
  ],
  'crazy-curry': [
    { user: "Dave B.", stars: 5, text: "Spicy food lovers must try this spot! The curry depth level is phenomenal." }
  ],
  'inigo-street-food': [
    { user: "Justin C.", stars: 3, text: "Affordable street treats for a quick walk to your next campus assignment." }
  ],
  'kaldi-coffee': [
    { user: "Maria N.", stars: 4, text: "Strong robust brews that keep you completely alert during long lab configurations." }
  ],
  'samgyupsal-ni-kap': [
    { user: "Timothy R.", stars: 3, text: "Decent setup and affordable meat sets when planning group get-togethers." }
  ],
  'kjen-ramyun-house': [
    { user: "Bea P.", stars: 3, text: "Quick noodle preparations. Ideal if you need something steaming hot on a rainy day." }
  ],
  'pst-pastil-sa-tabi': [
    { user: "Rhea S.", stars: 5, text: "Affordable and super filling. Perfect for a quick bite before class." },
    { user: "Miguel A.", stars: 5, text: "Great value, fast service, and the pastil is always fresh and satisfying." }
  ]
};

const storeNameMap = {
  'kainan-zamura': 'Kainan Zamura',
  'dantes-chicken-house-2': "Dante's Chicken House",
  'koncrete-cafe': 'Koncrete Cafe',
  'kmukbang-samgyupsal': 'Kmukbang samgyupsal house',
  'apu-atang': 'Apu Atang',
  'japacafe': 'Japacafe',
  'lika-kape': 'Lik’a Kape',
  'budcheng-meryenda': 'Budcheng Meryenda ang Sarap',
  'li-ramyeon': 'Li Ramyeon',
  'dantes-chicken-house': "Dante's Chicken House",
  'cafe-saburo': 'Cafe Saburo',
  'crazy-curry': 'Crazy Curry',
  'inigo-street-food': 'Share it Bistro',
  'kaldi-coffee': 'KALDI Coffee NU',
  'samgyupsal-ni-kap': 'Samgyupsal ni Kap',
  'kjen-ramyun-house': 'K-Jen Ramyun House',
  'pst-pastil-sa-tabi': 'PST Pastil sa Tabi'
};

// Central menu preview map. Update this one object to change each store's menu image in one place.
const storeMenuMap = {
  'dantes-chicken-house': 'dante.png',
  'cafe-saburo': 'cs.png',
  'pst-pastil-sa-tabi': 'pastil.png',
  'kjen-ramyun-house': 'm1.jpg',
  'samgyupsal-ni-kap': 'm2.jpg'
};

/* AUTH UI MANAGEMENT WINDOWS */
const authModal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authText = document.getElementById('authText');
const authButton = document.getElementById('authButton');
const switchAuth = document.getElementById('switchAuth');
const switchMessage = document.getElementById('switchMessage');
let isLoginMode = true;

function syncAuthActionListeners() {
  const loginBtn = document.querySelector('.login-btn');
  const signupBtn = document.querySelector('.signup-btn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => { isLoginMode = true; updateAuthFormUI(); if (authModal) authModal.style.display = 'flex'; });
  }
  if (signupBtn) {
    signupBtn.addEventListener('click', () => { isLoginMode = false; updateAuthFormUI(); if (authModal) authModal.style.display = 'flex'; });
  }
}

if (switchAuth) {
  switchAuth.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    updateAuthFormUI();
  });
}

function updateAuthFormUI() {
  if (!authTitle) return;
  
  const usernameGroup = document.getElementById('authUsernameGroup');
  const confirmPasswordGroup = document.getElementById('authConfirmPasswordGroup');
  if (isLoginMode) {
    authTitle.innerText = 'Sign In';
    authText.innerText = 'Welcome back to aNU Tara.';
    if (authButton) authButton.innerText = 'Log In';
    if (switchMessage) switchMessage.innerText = "Don't have an account?";
    switchAuth.innerText = 'Sign Up';
    if (usernameGroup) usernameGroup.style.display = 'none';
    if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'none';
  } else {
    authTitle.innerText = 'Create Account';
    authText.innerText = 'Join aNU Tara and discover cravings.';
    if (authButton) authButton.innerText = 'Sign Up';
    if (switchMessage) switchMessage.innerText = 'Already have an account?';
    switchAuth.innerText = 'Log In';
    if (usernameGroup) usernameGroup.style.display = 'flex';
    if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'flex';
  }
}

function handleAuthSubmission(event) {
  if (event) event.preventDefault(); 
  
  const emailField = document.getElementById('authEmailField');
  const passwordField = document.getElementById('authPasswordField');

  const emailVal = emailField ? emailField.value.trim() : "";
  const passwordVal = passwordField ? passwordField.value.trim() : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(emailVal)) {
  alert("Invalid email format.");
  return;
}
  // GMAIL VALIDATION
  if (!emailVal.endsWith('@gmail.com')) {
    alert("Please use a valid Gmail account.");
    return;
  }

  // PASSWORD VALIDATION
  if (passwordVal.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  // VALIDATION FOR SIGN UP MODE
  if (!isLoginMode) {
    const usernameField = document.getElementById('authUsernameField');
    const confirmPasswordField = document.getElementById('authConfirmPasswordField');
    
    const usernameVal = usernameField ? usernameField.value.trim() : "";
    const confirmPasswordVal = confirmPasswordField ? confirmPasswordField.value.trim() : "";
    
    if (!usernameVal) {
      alert("Please enter a username.");
      return;
    }
    
    if (passwordVal !== confirmPasswordVal) {
      alert("Passwords do not match.");
      return;
    }
    
    currentUserProfile.username = usernameVal;
  }

  // AUTO GENERATE USER INFO FROM EMAIL
  const generatedName = emailVal.split('@')[0];

  currentUserProfile.displayName = generatedName;
  if (isLoginMode) {
    currentUserProfile.username = generatedName.toLowerCase().replace(/\s+/g, '_');
  }
  currentUserProfile.isLoggedIn = true;
  saveProfileState();

  // REBUILD NAVBAR
  rebuildNavbarAuthState();

  // CLOSE MODAL
  closeAuthModal();

  navigateToView('home');
}

function rebuildNavbarAuthState() {
  const navAuthWrapper = document.getElementById('navAuthWrapper');
  if (!navAuthWrapper) 
    return;
  
  if (currentUserProfile.isLoggedIn) {
    navAuthWrapper.innerHTML = `
      <div class="profile-widget" id="profileWidget" onclick="toggleDropdown(event)">
        <div class="profile-info">
          <span class="user-name">${currentUserProfile.displayName}</span>
          <span class="user-handle">@${currentUserProfile.username}</span>
        </div>
        <div class="avatar-container-nav">
          <img src="${currentUserProfile.avatar}" alt="Profile Picture" class="navbar-avatar" id="navAvatarImg">
        </div>
      </div>

      <div class="account-dropdown" id="accountDropdown">
        <div class="dropdown-header">
          <div class="avatar-uploader">
            <img src="${currentUserProfile.avatar}" alt="User Avatar" class="avatar-circle-large" id="dropdownAvatarImg">
            <label for="avatarFileInput" class="upload-badge" title="Upload Photo">📷</label>
            <input type="file" id="avatarFileInput" accept="image/*" onchange="handleAvatarUpload(this)" style="display: none;">
          </div>
          <div class="user-details">
            <h4 class="dropdown-display-name">${currentUserProfile.displayName}</h4>
            <p class="dropdown-user-handle">@${currentUserProfile.username}</p>
          </div>
        </div>
        
        <hr class="menu-divider">
        
        <ul class="dropdown-menu-links">
          <li><a href="#account" onclick="navigateToView('account')"><span class="icon">👤</span> My Account</a></li>
          <li><a href="#saved" onclick="navigateToView('account')"><span class="icon">📍</span> Saved Places</a></li>
          <li><a href="#my-reviews" onclick="navigateToView('account')"><span class="icon">⭐</span> My Reviews</a></li>
        </ul>
        
        <hr class="menu-divider">
        
        <button class="btn-logout" onclick="handleLogout()"><span class="icon">🚪</span> Log Out</button>
      </div>
    `;
  } else {
    navAuthWrapper.innerHTML = `
      <div class="auth-buttons">
        <button class="login-btn">Log In</button>
        <button class="signup-btn">Sign Up</button>
      </div>
    `;
    syncAuthActionListeners(); 
  }
}

function closeAuthModal() {
  if (authModal) authModal.style.display = 'none';

  const emailField = document.getElementById('authEmailField');
  const passwordField = document.getElementById('authPasswordField');

  if (emailField) emailField.value = "";
  if (passwordField) passwordField.value = "";
}

const authForm = document.querySelector('#authModal form');
if (authForm) {
  authForm.addEventListener('submit', handleAuthSubmission);
}

// Direct button listener for redundancy
if (authButton) {
  authButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleAuthSubmission();
  });
}

/* ACCORDION REVIEWS SUBMISSION ENGINE */
function toggleReview(button) {
  const reviewBox = button.parentElement.querySelector('.review-box');
  if (reviewBox) reviewBox.classList.toggle('active');
}

function rateCardStar(star) {
  const stars = star.parentElement.querySelectorAll('span');
  const index = Array.from(stars).indexOf(star);

  star.parentElement.dataset.rating = index + 1;

  stars.forEach((s, i) => {
    if (i <= index) s.classList.add('active');
    else s.classList.remove('active');
  });
}

function submitCardReview(button, storeId) {
  const reviewBox = button.parentElement;
  const textarea = reviewBox.querySelector('textarea');
  const reviewText = textarea.value.trim();

  const starsContainer = reviewBox.querySelector('.stars');
  const selectedRating = parseInt(starsContainer?.dataset.rating || '0', 10);

  if (selectedRating < 1) {
    alert('Please select a star rating.');
    return;
  }
  if (reviewText === '') {
    alert('Please write your feedback.');
    return;
  }

  const authorName = currentUserProfile.isLoggedIn ? currentUserProfile.displayName : "Anonymous Student";

  if (!initialStoreComments[storeId]) initialStoreComments[storeId] = [];
  const alreadyReviewed = initialStoreComments[storeId].some(
  review =>
    review.user === authorName &&
    review.text.toLowerCase() === reviewText.toLowerCase()
);

if (alreadyReviewed) {
  alert("You already submitted this review.");
  return;
}
  initialStoreComments[storeId].unshift({
    user: authorName,
    stars: selectedRating,
    text: reviewText
  });

  alert('Thank you for sharing your food review!');
  textarea.value = '';
  reviewBox.querySelectorAll('.stars span').forEach(star => star.classList.remove('active'));
  reviewBox.classList.remove('active');
  
  renderGlobalReviewsFeed();
}

/* LIVE BOOKMARKING & STORE STORAGE FLOWS */
function toggleSaveStore(storeId) {
  if (!currentUserProfile.isLoggedIn) {
    alert("Please sign in to bookmark items to your personal boards.");
    return;
  }

  const cardNodes = document.querySelectorAll(`.card[data-store-id="${storeId}"]`);
  const index = currentUserProfile.savedStores.indexOf(storeId);

  if (index > -1) {
    currentUserProfile.savedStores.splice(index, 1);
    cardNodes.forEach(cardNode => cardNode.classList.remove('saved-active'));
  } else {
    currentUserProfile.savedStores.push(storeId);
    cardNodes.forEach(cardNode => cardNode.classList.add('saved-active'));
  }

  saveProfileState();

  const accountPortalView = document.getElementById('account-portal-view');
  if (accountPortalView && !accountPortalView.classList.contains('view-pane-hidden')) {
    renderAccountActivityLists();
  }
}

function syncCardBookmarkVisualStates() {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    const sId = card.dataset.storeId;
    if (currentUserProfile.savedStores.includes(sId)) {
      card.classList.add('saved-active');
    } else {
      card.classList.remove('saved-active');
    }
  });
}

/* ACCOUNT MANAGEMENTS SETTINGS UPDATE HANDLERS */
function saveProfileChanges() {
  const dName = document.getElementById('editDisplayName').value.trim();
  const uName = document.getElementById('editUsername').value.trim();
  
  if (dName === "" || uName === "") {
    alert("Profile configurations cannot contain empty fields.");
    return;
  }
  
  currentUserProfile.displayName = dName;
  currentUserProfile.username = uName;
  saveProfileState();

  rebuildNavbarAuthState();
  alert("Account parameters modified successfully!");
}

function switchAccountTab(evt, tabId) {
  const tabcontents = document.getElementsByClassName("account-tab-content");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].classList.remove("active-tab");
  }
  const tablinks = document.getElementsByClassName("tab-link");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  document.getElementById(tabId).classList.add("active-tab");
  evt.currentTarget.classList.add("active");
}

function getUserReviewEntries() {
  const viewerName = currentUserProfile.displayName || 'User Profile';

  return Object.entries(initialStoreComments).flatMap(([storeId, comments]) =>
    comments
      .filter(comment => comment.user === viewerName)
      .map(comment => ({
        storeId,
        storeName: storeNameMap[storeId] || storeId,
        stars: comment.stars,
        text: comment.text
      }))
  );
}

function renderAccountActivityLists() {
  const savedContainer = document.getElementById('dashboardSavedContainer');
  const reviewsContainer = document.getElementById('dashboardReviewsContainer');

  if (savedContainer) {
    savedContainer.innerHTML = "";

    const savedItems = currentUserProfile.isLoggedIn
      ? currentUserProfile.savedStores
      : [];

    if (savedItems.length === 0) {
      savedContainer.innerHTML = `<p style="font-size:0.9rem; color:#888; font-style:italic;">No saved places available yet.</p>`;
    } else {
      savedItems.forEach(sId => {
        const name = storeNameMap[sId] || sId;
        const row = document.createElement('div');
        row.className = "dashboard-item-row";
        row.innerHTML = `
          <div class="dir-meta">
            <h4>${name}</h4>
            <p>Saved near campus for quick reference.</p>
          </div>
          <button class="remove-dashboard-entry-btn" onclick="toggleSaveStore('${sId}')">Remove</button>
        `;
        savedContainer.appendChild(row);
      });
    }
  }

  if (reviewsContainer) {
    reviewsContainer.innerHTML = "";

    const reviewEntries = getUserReviewEntries();

    if (reviewEntries.length === 0) {
      reviewsContainer.innerHTML = `<p style="font-size:0.9rem; color:#888; font-style:italic;">No reviews available yet.</p>`;
    } else {
      reviewEntries.forEach(entry => {
        const row = document.createElement('div');
        row.className = "dashboard-item-row";
        row.innerHTML = `
          <div class="dir-meta">
            <h4>${entry.storeName} — ${"⭐".repeat(entry.stars)}</h4>
            <p>"${entry.text}"</p>
          </div>
        `;
        reviewsContainer.appendChild(row);
      });
    }
  }

  syncCardBookmarkVisualStates();
}

/* RENDERING MODULE CONTROLS FOR LOGGED REVIEWS TRACKS */
function renderGlobalReviewsFeed() {
  const globalContainer = document.getElementById('globalReviewsFeed');
  if (!globalContainer) return;
  globalContainer.innerHTML = "";
  
  let allReviews = [];
  for (const storeId in initialStoreComments) {
    initialStoreComments[storeId].forEach(comment => {
      allReviews.push({
        storeName: storeNameMap[storeId] || storeId,
        user: comment.user,
        stars: comment.stars,
        text: comment.text
      });
    });
  }
  
  if (allReviews.length === 0) {
    globalContainer.innerHTML = `<p style="font-size:0.9rem; color:#aaa; font-style:italic;">No user reviews posted yet.</p>`;
    return;
  }
  
  allReviews.forEach(r => {
    let starsStr = "⭐".repeat(r.stars);
    const cardNode = document.createElement('div');
    cardNode.className = "sidebar-review-card";
    cardNode.innerHTML = `
      <div class="src-header">
        <strong>${r.user}</strong> <span>${r.storeName}</span>
      </div>
      <div class="src-stars">${starsStr}</div>
      <p>"${r.text}"</p>
    `;
    globalContainer.appendChild(cardNode);
  });
}

/* CARDS FILTER ARCHITECTURES AND VIEWS CONTROLLERS */
const cards = Array.from(document.querySelectorAll('.card'));

function showFeaturedCards() {
  cards.forEach((card, index) => {
    card.style.display = index < 8 ? 'flex' : 'none';
  });
}

function getCardSearchText(card) {
  return [
    card.dataset.name || '',
    card.querySelector('h3')?.textContent || '',
    card.querySelector('.tag-row')?.textContent || '',
    card.querySelector('.price-tag')?.textContent || ''
  ]
    .join(' ')
    .toLowerCase();
}

function applySearchFilter(value) {
  const trimmedValue = value.trim().toLowerCase();
  const budgetMatch = trimmedValue.match(/\d+/);

  cards.forEach((card) => {
    const price = Number.parseInt(card.dataset.price || '0', 10);
    const searchText = getCardSearchText(card);

    let isMatch = false;

    if (budgetMatch) {
      const budget = Number.parseInt(budgetMatch[0], 10);
      isMatch = !Number.isNaN(price) && price <= budget;
    } else {
      isMatch = searchText.includes(trimmedValue);
    }

    card.style.display = isMatch ? 'flex' : 'none';
  });
}

showFeaturedCards();

// --- INJECTED UTILITY: SECURITY GUARD hehe ---
// Checks login status, //
function checkAuthenticationGuard() {
  if (!currentUserProfile.isLoggedIn) {
    alert("Please log in or sign up to use this feature.");
    isLoginMode = true;
    updateAuthFormUI();
    if (authModal) authModal.style.display = 'flex';
    return false;
  }
  return true;
}

/* SEARCH CONTROLS OVER MATTE BOX */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  // Guard intercepting user search bar interaction if unauthenticated
  searchInput.addEventListener('mousedown', function(e) {
    if (!checkAuthenticationGuard()) {
      e.preventDefault();
      searchInput.blur();
    }
  });

  searchInput.addEventListener('keydown', function(e) {
    if (!currentUserProfile.isLoggedIn) {
      e.preventDefault();
      checkAuthenticationGuard();
    }
  });

  searchInput.addEventListener('keyup', () => {
    if (!currentUserProfile.isLoggedIn) {
      searchInput.value = '';
      return;
    }

    const value = searchInput.value;
    moodButtons.forEach((btn) => btn.classList.remove('active'));

    if (value.trim() === '') {
      if (storesVisible) {
        cards.forEach((card) => {
          card.style.display = 'flex';
        });
      } else {
        showFeaturedCards();
      }
      return;
    }

    applySearchFilter(value);
  });
}

/* MOOD FILTERING ENGINE */
const moodButtons = document.querySelectorAll('.mood-btn');
moodButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    // Guard tracking mood layout clicks
    if (!checkAuthenticationGuard()) {
      e.stopPropagation();
      return;
    }

    const mood = button.dataset.mood.toLowerCase();
    const wasAlreadyActive = button.classList.contains('active');
    
    moodButtons.forEach(btn => btn.classList.remove('active'));
    
    if (wasAlreadyActive) { showFeaturedCards(); return; }
    button.classList.add('active');

    cards.forEach(card => {
      const textMatch = card.dataset.name.toLowerCase();
      if (textMatch.includes(mood)) card.style.display = 'flex';
      else card.style.display = 'none';
    });
  });
});

/* REPOSITORY INCREMENTS CONTROL OVER VIEWS */
const showAllBtn = document.getElementById("showAllBtn");
const hiddenStores = document.querySelectorAll(".hidden-store");
let storesVisible = false;

if (showAllBtn) {
  showAllBtn.addEventListener("click", (e) => {
    // Guard targeting Show All structural button displays
    if (!checkAuthenticationGuard()) {
      e.stopPropagation();
      return;
    }

    storesVisible = !storesVisible;
    moodButtons.forEach(btn => btn.classList.remove('active'));
  
    hiddenStores.forEach(store => {
      if (storesVisible) store.style.display = "flex";
      else store.style.display = "none";
    });
  
    if (storesVisible) showAllBtn.textContent = "Hide Food Stores";
    else showAllBtn.textContent = "Show All Food Stores";
  });
}

/* STORE TARGETED MODAL HANDLERS */
const modal = document.getElementById('modal');
let currentActiveStoreId = "";

// FIXED: Removed the hardcoded symbol character concatenator. 
// It now directly prints whatever customized string parameter is passed to it from the UI layer.
function openModal(title, image, rating, location, budget, mood, opening, wifi, sockets, dineIn, ac, link, menu, storeId) {
  currentActiveStoreId = storeId;
  const menuPreview = (menu && menu !== 'menu1.png') ? menu : (storeMenuMap[storeId] || 'menu1.png');
  
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalImage').src = image;
  document.getElementById('modalRating').innerText = '⭐ Rating: ' + rating;
  document.getElementById('modalLocation').innerText = location;
  document.getElementById('modalBudget').innerText = budget; 
  document.getElementById('modalMood').innerText = mood;
  document.getElementById('modalOpening').innerText = opening;
  
  document.getElementById('modalWifi').innerText = wifi;
  document.getElementById('modalSockets').innerText = sockets;
  document.getElementById('modalDineIn').innerText = dineIn;
  document.getElementById('modalAC').innerText = ac;
  
  const linkElement = document.getElementById('modalLink');
  if (link && link.trim()) {
    linkElement.href = link;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.innerText = 'Visit Facebook Page';
    linkElement.style.display = 'inline';
  } else {
    linkElement.removeAttribute('href');
    linkElement.target = '_self';
    linkElement.rel = '';
    linkElement.innerText = 'No page available';
    linkElement.style.display = 'inline';
  }

  document.getElementById('modalMenu').src = menuPreview;
  renderModalComments();

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function renderModalComments() {
  const container = document.getElementById('modalCommentsContainer');
  if (!container) return;
  container.innerHTML = "";
  
  const comments = initialStoreComments[currentActiveStoreId] || [];
  if (comments.length === 0) {
    container.innerHTML = `<p style="font-size: 0.85rem; color:#aaa; font-style:italic;">No reviews posted yet.</p>`;
    return;
  }
  
  comments.forEach(c => {
    let starString = "⭐".repeat(c.stars);
    const node = document.createElement('div');
    node.className = "modal-comment-node";
    node.innerHTML = `
      <div class="mcn-meta"><strong>${c.user}</strong><span>${starString}</span></div>
      <div class="mcn-text">${c.text}</div>
    `;
    container.appendChild(node);
  });
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

/* ACCORDION DISMISSAL FROM GLOBAL WINDOW FRAME CLICKS */
window.onclick = function(e) {
  if (e.target == modal) { if (modal) modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
  if (authModal && e.target == authModal) { authModal.style.display = 'none'; }
}

const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('authPasswordField');

if (togglePassword && passwordField) {

  togglePassword.addEventListener('click', () => {

    const type =
      passwordField.getAttribute('type') === 'password'
      ? 'text'
      : 'password';

    passwordField.setAttribute('type', type);

    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');

  });

}

// Strict Initialization Guard.
document.addEventListener('DOMContentLoaded', () => {
  currentUserProfile = loadProfileState();
  rebuildNavbarAuthState();
  syncCardBookmarkVisualStates();
});
