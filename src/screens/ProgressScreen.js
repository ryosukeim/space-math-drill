// ===========================
// PROGRESS SCREEN
// Show stats and history
// ===========================

import { storageService } from '../services/storageService.js';
import { gamificationService } from '../services/gamificationService.js';
import { router } from '../utils/router.js';

export class ProgressScreen {
    constructor() {
        this.profile = null;
        this.sessions = [];
    }

    async init() {
        this.profile = await storageService.getCurrentProfile();
        this.sessions = await storageService.getSessionsByProfile(this.profile.id, 20);
    }

    render() {
        const planet = gamificationService.getPlanetName(this.profile.level);
        const xpProgress = gamificationService.getXPProgress(this.profile.xp);

        const container = document.createElement('div');
        container.className = 'screen fade-in';

        container.innerHTML = `
      <div class="container">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary btn-small" id="back-btn">← Back</button>
          <h1 style="margin: 0;">Your Progress</h1>
        </div>

        <!-- Current Status -->
        <div class="grid grid-2 mb-4">
          <div class="card">
            <h3>🚀 Current Journey</h3>
            <div class="stat-display">
              <span class="stat-value" style="font-size: 2rem;">${planet.name}</span>
              <span class="stat-label">Level ${this.profile.level}</span>
            </div>
            <div class="progress-bar mt-2">
              <div class="progress-fill" style="width: ${xpProgress.percentage}%;"></div>
            </div>
            <p class="text-small text-center mt-1" style="color: var(--text-secondary);">
              ${xpProgress.current} / ${xpProgress.needed} XP to next level
            </p>
          </div>

          <div class="card">
            <h3>🔥 Activity Streak</h3>
            <div class="stat-display">
              <span class="stat-value" style="font-size: 2rem;">${this.profile.streak}</span>
              <span class="stat-label">Days in a row</span>
            </div>
            <div class="mt-2">
              ${this.renderStreakCalendar()}
            </div>
          </div>
        </div>

       <!-- Stats by Operation -->
        <div class="card mb-4">
          <h3>📊 Performance by Operation</h3>
          ${this.renderOperationStats()}
        </div>

        <!-- Recent Sessions -->
        <div class="card">
          <h3>📜 Recent Sessions</h3>
          ${this.sessions.length > 0 ? this.renderSessions() : '<p class="text-center text-secondary">No sessions yet. Start practicing!</p>'}
        </div>
      </div>
    `;

        return container;
    }

    renderStreakCalendar() {
        const days = 7;
        const today = new Date();
        let html = '<div class="streak-calendar">';

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();

            const lastStreakDate = this.profile.lastStreakDate
                ? new Date(this.profile.lastStreakDate).toDateString()
                : null;

            const isActive = this.profile.streak > i &&
                lastStreakDate &&
                new Date(lastStreakDate) >= date;

            html += `
        <div class="streak-day ${isActive ? 'active' : ''}">
          <div class="day-label">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
          <div class="day-indicator">${isActive ? '✓' : '·'}</div>
        </div>
      `;
        }

        html += '</div>';
        return html;
    }

    renderOperationStats() {
        if (this.sessions.length === 0) {
            return '<p class="text-center text-secondary">Complete some sessions to see stats!</p>';
        }

        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        const stats = {};

        operations.forEach(op => {
            const opSessions = this.sessions.filter(s => s.operations.includes(op));
            if (opSessions.length > 0) {
                const totalCorrect = opSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
                const totalQuestions = opSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
                const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

                stats[op] = {
                    accuracy,
                    count: opSessions.length,
                    total: totalQuestions
                };
            }
        });

        const icons = {
            addition: '➕',
            subtraction: '➖',
            multiplication: '✖️',
            division: '➗'
        };

        const names = {
            addition: 'Addition',
            subtraction: 'Subtraction',
            multiplication: 'Multiplication',
            division: 'Division'
        };

        let html = '<div class="operation-stats">';

        Object.keys(stats).forEach(op => {
            const stat = stats[op];
            html += `
        <div class="operation-stat-item">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.5rem;">${icons[op]}</span>
            <span style="font-weight: 600;">${names[op]}</span>
          </div>
          <div class="progress-bar" style="height: 16px;">
            <div class="progress-fill" style="width: ${stat.accuracy}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.25rem; font-size: 0.875rem; color: var(--text-secondary);">
            <span>${stat.accuracy}% accuracy</span>
            <span>${stat.total} problems solved</span>
          </div>
        </div>
      `;
        });

        html += '</div>';
        return html;
    }

    renderSessions() {
        let html = '<div class="sessions-list">';

        this.sessions.slice(0, 10).forEach(session => {
            const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
            const date = new Date(session.completedAt);
            const timeAgo = this.getTimeAgo(date);

            html += `
        <div class="session-item">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600;">
                ${session.mode === 'daily' ? '⭐ Daily Challenge' : '📚 Practice'}
              </div>
              <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ${timeAgo} • ${session.difficulty}
              </div>
            </div>
            <div style="text-align: right;">
              <div class="badge ${accuracy >= 80 ? 'badge-success' : ''}">
                ${accuracy}% • ${session.correctAnswers}/${session.totalQuestions}
              </div>
            </div>
          </div>
        </div>
      `;
        });

        html += '</div>';
        return html;
    }

    getTimeAgo(date) {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    }

    afterRender() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .streak-calendar {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
      }

      .streak-day {
        text-align: center;
      }

      .day-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
      }

      .day-indicator {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .streak-day.active .day-indicator {
        background: var(--star-yellow);
        color: var(--deep-space);
        box-shadow: 0 0 10px rgba(255, 217, 61, 0.5);
      }

      .operation-stats {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .operation-stat-item {
        /* Styling handled inline */
      }

      .sessions-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .session-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-sm);
        padding: 1rem;
      }
    `;
        document.head.appendChild(style);

        const backBtn = document.getElementById('back-btn');
        backBtn.addEventListener('click', () => router.navigate('home'));
    }
}
