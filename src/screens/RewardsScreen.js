// ===========================
// REWARDS SCREEN
// Badges and customization
// ===========================

import { storageService } from '../services/storageService.js';
import { gamificationService, BADGES } from '../services/gamificationService.js';
import { router } from '../utils/router.js';

export class RewardsScreen {
    constructor() {
        this.profile = null;
    }

    async init() {
        this.profile = await storageService.getCurrentProfile();
    }

    render() {
        const container = document.createElement('div');
        container.className = 'screen fade-in';

        container.innerHTML = `
      <div class="container">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary btn-small" id="back-btn">← Back</button>
          <h1 style="margin: 0;">Rewards & Badges</h1>
        </div>

        <!-- Coin Balance -->
        <div class="card mb-4 text-center">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🪙</div>
          <h2 style="margin: 0;">You have ${this.profile.coins} coins!</h2>
          <p class="text-secondary">Earn coins by completing practice sessions</p>
        </div>

        <!-- Badges -->
        <div class="card mb-4">
          <h2>🏆 Your Badges</h2>
          <p class="text-small text-secondary mb-3">
            Earned ${this.profile.badges.length} of ${Object.keys(BADGES).length} badges
          </p>
          ${this.renderBadges()}
        </div>

        <!-- Planet Journey -->
        <div class="card">
          <h2>🌌 Your Space Journey</h2>
          <p class="text-small text-secondary mb-3">
            Your rocket's journey through the solar system
          </p>
          ${this.renderPlanetJourney()}
        </div>
      </div>
    `;

        return container;
    }

    renderBadges() {
        const allBadges = Object.values(BADGES);
        let html = '<div class="badges-grid">';

        allBadges.forEach(badge => {
            const earned = this.profile.badges.includes(badge.id);
            html += `
        <div class="badge-card ${earned ? 'earned' : 'locked'}">
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-name">${badge.name}</div>
          <div class="badge-description">${badge.description}</div>
          ${!earned ? '<div class="badge-lock">🔒</div>' : ''}
        </div>
      `;
        });

        html += '</div>';
        return html;
    }

    renderPlanetJourney() {
        const planets = [
            { level: 1, name: 'Earth Orbit', icon: '🌍', color: '#4a90e2' },
            { level: 5, name: 'The Moon', icon: '🌙', color: '#c0c0c0' },
            { level: 10, name: 'Mars', icon: '🔴', color: '#ff6b6b' },
            { level: 15, name: 'Asteroid Belt', icon: '☄️', color: '#a4a4a4' },
            { level: 20, name: 'Jupiter', icon: '🪐', color: '#f9ca24' },
            { level: 30, name: 'Saturn', icon: '🪐', color: '#ffd93d' },
            { level: 40, name: 'Uranus', icon: '🌀', color: '#6dff6d' },
            { level: 50, name: 'Neptune', icon: '🔵', color: '#6c5ce7' },
            { level: 75, name: 'Deep Space', icon: '✨', color: '#fd79a8' }
        ];

        let html = '<div class="planet-journey">';

        planets.forEach((planet, index) => {
            const reached = this.profile.level >= planet.level;
            const current = this.profile.level >= planet.level &&
                (index === planets.length - 1 || this.profile.level < planets[index + 1].level);

            html += `
        <div class="planet-stop ${reached ? 'reached' : ''} ${current ? 'current' : ''}">
          <div class="planet-icon" style="background-color: ${reached ? planet.color : 'rgba(255,255,255,0.1)'};">
            ${planet.icon}
          </div>
          <div class="planet-info">
            <div class="planet-name">${planet.name}</div>
            <div class="planet-level">Level ${planet.level}</div>
          </div>
          ${current ? '<div class="current-marker">📍 You are here</div>' : ''}
        </div>
      `;

            if (index < planets.length - 1) {
                html += `<div class="planet-connector ${reached ? 'reached' : ''}"></div>`;
            }
        });

        html += '</div>';
        return html;
    }

    afterRender() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .badges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .badge-card {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md);
        padding: 1.5rem 1rem;
        text-align: center;
        position: relative;
        transition: all var(--transition-medium);
      }

      .badge-card.earned {
        background: rgba(108, 92, 231, 0.2);
        border-color: var(--cosmic-purple);
      }

      .badge-card.earned:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-glow);
      }

      .badge-card.locked {
        opacity: 0.4;
      }

      .badge-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }

      .badge-name {
        font-family: var(--font-display);
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .badge-description {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      .badge-lock {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 1rem;
      }

      .planet-journey {
        display: flex;
        flex-direction: column;
        gap: 0rem;
      }

      .planet-stop {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        position: relative;
      }

      .planet-stop.current {
        background: rgba(255, 217, 61, 0.1);
        border-radius: var(--radius-md);
      }

      .planet-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        flex-shrink: 0;
        box-shadow: var(--shadow-md);
      }

      .planet-stop.reached .planet-icon {
        animation: pulse 2s ease-in-out infinite;
      }

      .planet-info {
        flex: 1;
      }

      .planet-name {
        font-family: var(--font-display);
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .planet-level {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      .current-marker {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.875rem;
        color: var(--star-yellow);
        font-weight: 600;
      }

      .planet-connector {
        width: 4px;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        margin-left: 30px;
      }

      .planet-connector.reached {
        background: var(--cosmic-purple);
      }
    `;
        document.head.appendChild(style);

        const backBtn = document.getElementById('back-btn');
        backBtn.addEventListener('click', () => router.navigate('home'));
    }
}
