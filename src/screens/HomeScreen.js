// ===========================
// HOME SCREEN
// Main hub with practice mode and daily challenge
// ===========================

import { storageService } from '../services/storageService.js';
import { gamificationService } from '../services/gamificationService.js';
import { languageService } from '../services/languageService.js';
import { router } from '../utils/router.js';

export class HomeScreen {
  constructor() {
    this.profile = null;
  }

  async init() {
    this.profile = await storageService.getCurrentProfile();
    if (!this.profile) {
      router.navigate('profile-select');
      return;
    }

    // Check if daily challenge was played today
    this.dailyChallengeAvailable = await this.checkDailyChallengeAvailable();
  }

  async checkDailyChallengeAvailable() {
    const today = new Date().toDateString();
    const lastDaily = await storageService.getSetting('lastDailyDate');
    return lastDaily !== today;
  }

  render() {
    if (!this.profile) {
      return document.createElement('div');
    }

    const planet = gamificationService.getPlanetName(this.profile.level);
    const xpProgress = gamificationService.getXPProgress(this.profile.xp);
    const t = languageService.t.bind(languageService);

    const container = document.createElement('div');
    container.className = 'screen fade-in';

    container.innerHTML = `
      <div class="container">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h1 style="margin-bottom: 0.5rem;">${t('welcomeBack')}, ${this.profile.name}! 👋</h1>
            <div class="badge badge-warning">
              🔥 ${this.profile.streak} ${t('dayStreak')}
            </div>
          </div>
          <button class="btn btn-secondary btn-small" id="change-profile-btn">
            ${t('switchProfile')}
          </button>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-3 mb-4">
          <div class="card stat-display">
            <span class="stat-value">${this.profile.level}</span>
            <span class="stat-label">${t('statsLevel')}</span>
          </div>
          <div class="card stat-display">
            <span class="stat-value">${this.profile.coins}</span>
            <span class="stat-label">${t('statsCoins')}</span>
          </div>
          <div class="card stat-display">
            <span class="stat-value">${this.profile.badges.length}</span>
            <span class="stat-label">${t('statsBadges')}</span>
          </div>
        </div>

        <!-- XP Progress -->
        <div class="card mb-4">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-family: var(--font-display); font-weight: 600;">
              ${t('currentLocation')}: ${planet.name}
            </span>
            <span style="font-size: 0.875rem; color: var(--text-secondary);">
              ${xpProgress.current} / ${xpProgress.needed} XP
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${xpProgress.percentage}%;"></div>
          </div>
        </div>

        <!-- Main Actions -->
        <div class="grid grid-2 mb-4">
          <!-- Practice Mode -->
          <div class="card card-clickable" id="practice-btn" style="padding: 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
            <h2 style="margin-bottom: 0.5rem;">${t('practiceMode')}</h2>
            <p style="color: var(--text-secondary); margin: 0;">
              ${t('practiceModeDesc')}
            </p>
          </div>

          <!-- Daily Challenge -->
          <div class="card card-clickable ${!this.dailyChallengeAvailable ? 'card-disabled' : ''}" 
               id="daily-btn" 
               style="padding: 2rem; text-align: center; ${!this.dailyChallengeAvailable ? 'opacity: 0.5;' : ''}">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
            <h2 style="margin-bottom: 0.5rem;">${t('dailyChallenge')}</h2>
            <p style="color: var(--text-secondary); margin: 0;">
              ${this.dailyChallengeAvailable ? t('dailyChallengeDesc') : t('dailyChallengeCompleted')}
            </p>
            ${!this.dailyChallengeAvailable ? `<div class="badge badge-success mt-2">${t('completedToday')}</div>` : ''}
          </div>
        </div>

        <!-- Navigation -->
        <div class="grid grid-3">
          <button class="btn btn-secondary" id="progress-btn">
            ${t('progress')}
          </button>
          <button class="btn btn-secondary" id="rewards-btn">
            ${t('rewards')}
          </button>
          <button class="btn btn-secondary" id="settings-nav-btn">
            ${t('settings')}
          </button>
        </div>

        <!-- Rocket Animation -->
        <div class="rocket-float animate-float" style="position: fixed; bottom: 20px; right: 20px; font-size: 4rem; opacity: 0.6;">
          🚀
        </div>
      </div>
    `;

    return container;
  }

  afterRender() {
    // Add event listeners
    const practiceBtn = document.getElementById('practice-btn');
    practiceBtn.addEventListener('click', () => router.navigate('settings'));

    const dailyBtn = document.getElementById('daily-btn');
    if (this.dailyChallengeAvailable) {
      dailyBtn.addEventListener('click', () => this.startDailyChallenge());
    }

    const changeProfileBtn = document.getElementById('change-profile-btn');
    changeProfileBtn.addEventListener('click', () => router.navigate('profile-select'));

    const progressBtn = document.getElementById('progress-btn');
    progressBtn.addEventListener('click', () => router.navigate('progress'));

    const rewardsBtn = document.getElementById('rewards-btn');
    rewardsBtn.addEventListener('click', () => router.navigate('rewards'));

    const settingsNavBtn = document.getElementById('settings-nav-btn');
    settingsNavBtn.addEventListener('click', () => router.navigate('settings'));
  }

  async startDailyChallenge() {
    // Daily challenge: 10 random problems, mixed operations, normal difficulty
    const settings = {
      mode: 'daily',
      operations: {
        addition: true,
        subtraction: true,
        multiplication: true,
        division: true
      },
      difficulty: 'normal',
      questionCount: 10
    };

    router.navigate('question', { settings });
  }
}
