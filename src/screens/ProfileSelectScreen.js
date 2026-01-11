// ===========================
// PROFILE SELECT SCREEN
// First screen - choose or create profile
// ===========================

import { storageService } from '../services/storageService.js';
import { languageService } from '../services/languageService.js';
import { router } from '../utils/router.js';

export class ProfileSelectScreen {
  constructor() {
    this.profiles = [];
  }

  async init() {
    this.profiles = await storageService.getAllProfiles();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'screen centered fade-in';
    const t = languageService.t.bind(languageService);
    const currentLang = languageService.getCurrentLanguage();

    container.innerHTML = `
      <div class="container" style="max-width: 600px;">
        <!-- Language Selector -->
        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary btn-small lang-btn ${currentLang === 'en' ? 'selected' : ''}" data-lang="en">English</button>
          <button class="btn btn-secondary btn-small lang-btn ${currentLang === 'ja' ? 'selected' : ''}" data-lang="ja">日本語</button>
        </div>
        
        <h1 class="text-center">${t('appTitle')}</h1>
        <p class="text-center text-large mb-4">${t('chooseAstronaut')}</p>
        
        <div class="flex-column" id="profile-list">
          ${this.renderProfiles()}
        </div>
        
        <button class="btn btn-primary btn-large mt-4" id="new-profile-btn" style="width: 100%;">
          ${t('createNewProfile')}
        </button>
      </div>
      
      <div id="profile-modal" class="hidden">
        <div class="modal-overlay"></div>
        <div class="modal-content card">
          <h2>${t('createProfile')}</h2>
          <div class="input-group">
            <label class="input-label">${t('profileName')}</label>
            <input type="text" class="input-field" id="profile-name" placeholder="${t('enterName')}" maxlength="20" />
          </div>
          <div class="input-group">
            <label class="input-label">${t('chooseColor')}</label>
            <div class="color-picker" id="color-picker">
              <div class="color-option" data-color="#6c5ce7" style="background: #6c5ce7;"></div>
              <div class="color-option" data-color="#ff6b6b" style="background: #ff6b6b;"></div>
              <div class="color-option" data-color="#ffd93d" style="background: #ffd93d;"></div>
              <div class="color-option" data-color="#6dff6d" style="background: #6dff6d;"></div>
              <div class="color-option" data-color="#fd79a8" style="background: #fd79a8;"></div>
              <div class="color-option" data-color="#00d2ff" style="background: #00d2ff;"></div>
            </div>
          </div>
          <div class="flex-row" style="gap: 1rem; margin-top: 1.5rem;">
            <button class="btn btn-secondary" id="cancel-profile-btn" style="flex: 1;">${t('cancel')}</button>
            <button class="btn btn-primary" id="create-profile-btn" style="flex: 1;">${t('create')}</button>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  renderProfiles() {
    const t = languageService.t.bind(languageService);
    if (this.profiles.length === 0) {
      return `<p class="text-center" style="color: var(--text-secondary); padding: 2rem;">${t('noProfiles')}</p>`;
    }

    return this.profiles.map(profile => `
      <div class="card card-clickable profile-card" data-profile-id="${profile.id}">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="profile-avatar" style="background: ${profile.avatarColor};">
            ${profile.name.charAt(0).toUpperCase()}
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0;">${profile.name}</h3>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.875rem;">
              <span>${t('level')} ${profile.level}</span>
              <span>🔥 ${profile.streak} ${t('dayStreak')}</span>
            </div>
          </div>
          <div style="font-size: 2rem;">→</div>
        </div>
      </div>
    `).join('');
  }

  afterRender() {
    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
      .profile-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        box-shadow: var(--shadow-md);
      }
      
      #profile-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
      }
      
      .modal-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 400px;
        animation: slideUp 0.3s ease-out;
      }
      
      .color-picker {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .color-option {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        border: 3px solid transparent;
        transition: all var(--transition-fast);
      }
      
      .color-option:hover {
        transform: scale(1.1);
      }
      
      .color-option.selected {
        border-color: white;
        box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2);
      }
      
      .lang-btn.selected {
        background: var(--cosmic-purple);
        border-color: var(--cosmic-purple);
      }
    `;
    document.head.appendChild(style);

    // Language selection
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        await languageService.setLanguage(lang);
        // Re-navigate to profile-select to refresh UI with new language
        router.navigate('profile-select');
      });
    });

    // Event listeners
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach(card => {
      card.addEventListener('click', () => {
        const profileId = card.dataset.profileId;
        this.selectProfile(profileId);
      });
    });

    const newProfileBtn = document.getElementById('new-profile-btn');
    newProfileBtn.addEventListener('click', () => this.showCreateModal());

    this.setupModalEvents();
  }

  showCreateModal() {
    const modal = document.getElementById('profile-modal');
    modal.classList.remove('hidden');

    // Select first color by default
    const firstColor = document.querySelector('.color-option');
    if (firstColor) {
      firstColor.classList.add('selected');
    }

    // Focus name input
    const nameInput = document.getElementById('profile-name');
    setTimeout(() => nameInput.focus(), 100);
  }

  hideCreateModal() {
    const modal = document.getElementById('profile-modal');
    modal.classList.add('hidden');
    document.getElementById('profile-name').value = '';
  }

  setupModalEvents() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        colorOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    const cancelBtn = document.getElementById('cancel-profile-btn');
    cancelBtn.addEventListener('click', () => this.hideCreateModal());

    const createBtn = document.getElementById('create-profile-btn');
    createBtn.addEventListener('click', () => this.createProfile());

    const nameInput = document.getElementById('profile-name');
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.createProfile();
      }
    });
  }

  async createProfile() {
    const nameInput = document.getElementById('profile-name');
    const name = nameInput.value.trim();
    const t = languageService.t.bind(languageService);

    if (!name) {
      alert(t('pleaseEnterName'));
      return;
    }

    const selectedColor = document.querySelector('.color-option.selected');
    const color = selectedColor ? selectedColor.dataset.color : '#6c5ce7';

    const profile = await storageService.createProfile(name, color);
    await this.selectProfile(profile.id);
  }

  async selectProfile(profileId) {
    await storageService.setCurrentProfile(profileId);
    router.navigate('home');
  }
}
