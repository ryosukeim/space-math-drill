// ===========================
// RESULT SCREEN
// Show session results and rewards earned
// ===========================

import { storageService } from '../services/storageService.js';
import { gamificationService } from '../services/gamificationService.js';
import { router } from '../utils/router.js';

export class ResultScreen {
    constructor(params) {
        this.sessionData = params.sessionData;
        this.profile = null;
        this.xpEarned = 0;
        this.coinsEarned = 0;
        this.newBadges = [];
        this.leveledUp = false;
        this.oldLevel = 0;
    }

    async init() {
        this.profile = await storageService.getCurrentProfile();

        // Calculate rewards
        const session = {
            mode: this.sessionData.settings.mode,
            difficulty: this.sessionData.settings.difficulty,
            totalQuestions: this.sessionData.totalQuestions,
            correctAnswers: this.sessionData.correctAnswers,
            wrongAnswers: this.sessionData.totalQuestions - this.sessionData.correctAnswers,
            timeSpent: this.sessionData.totalTime
        };

        this.xpEarned = gamificationService.calculateXP(session);
        this.coinsEarned = gamificationService.calculateCoins(session);

        // Update profile
        this.oldLevel = this.profile.level;
        this.profile.xp += this.xpEarned;
        this.profile.coins += this.coinsEarned;
        this.profile.level = gamificationService.getLevelFromXP(this.profile.xp);
        this.leveledUp = this.profile.level > this.oldLevel;
        this.profile.lastPlayedAt = Date.now();

        // Update streak if daily challenge
        if (session.mode === 'daily') {
            await storageService.updateStreak(this.profile);
            await storageService.setSetting('lastDailyDate', new Date().toDateString());
        }

        // Save session
        const fullSession = {
            id: storageService.generateId(),
            profileId: this.profile.id,
            ...session,
            problems: this.sessionData.problems.map(p => ({
                operation: p.operation,
                operand1: p.operand1,
                operand2: p.operand2,
                correctAnswer: p.correctAnswer,
                userAnswer: p.userAnswer,
                isCorrect: p.isCorrect,
                timeSpent: p.timeSpent
            })),
            completedAt: Date.now(),
            xpEarned: this.xpEarned,
            coinsEarned: this.coinsEarned,
            operations: Object.keys(this.sessionData.settings.operations).filter(
                op => this.sessionData.settings.operations[op]
            )
        };
        await storageService.saveSession(fullSession);

        // Check for badges
        const sessions = await storageService.getSessionsByProfile(this.profile.id);
        this.newBadges = gamificationService.checkBadges(this.profile, sessions, fullSession);

        if (this.newBadges.length > 0) {
            this.profile.badges = [...this.profile.badges, ...this.newBadges];
        }

        // Save updated profile
        await storageService.updateProfile(this.profile);
    }

    render() {
        const accuracy = Math.round((this.sessionData.correctAnswers / this.sessionData.totalQuestions) * 100);
        const isPerfect = accuracy === 100;
        const wrongProblems = this.sessionData.problems.filter(p => p.isCorrect === false);

        const container = document.createElement('div');
        container.className = 'screen centered fade-in';

        container.innerHTML = `
      <div class="container" style="max-width: 700px;">
        <!-- Celebration Header -->
        <div class="text-center mb-4">
          ${this.leveledUp ? `
            <div class="level-up-banner animate-pulse mb-3">
              <div style="font-size: 4rem;">🎉</div>
              <h1 style="margin: 0.5rem 0;">Level Up!</h1>
              <p style="font-size: 1.5rem; color: var(--star-yellow);">
                You reached Level ${this.profile.level}!
              </p>
            </div>
          ` : ''}
          
          <div class="rocket-launch" style="font-size: 5rem; margin: 1rem 0;">
            🚀
          </div>
          
          <h1>${isPerfect ? 'Perfect Score!' : 'Great Work!'}</h1>
          <p class="text-large" style="color: var(--text-secondary);">
            ${isPerfect ? 'You got every question right! Amazing!' : 'Keep practicing to improve!'}
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-3 mb-4">
          <div class="card stat-display">
            <span class="stat-value" style="color: ${accuracy >= 80 ? 'var(--planet-green)' : accuracy >= 60 ? 'var(--star-yellow)' : 'var(--rocket-orange)'};">
              ${accuracy}%
            </span>
            <span class="stat-label">Accuracy</span>
          </div>
          <div class="card stat-display">
            <span class="stat-value">${this.sessionData.correctAnswers}/${this.sessionData.totalQuestions}</span>
            <span class="stat-label">Correct</span>
          </div>
          <div class="card stat-display">
            <span class="stat-value">${this.formatTime(this.sessionData.totalTime)}</span>
            <span class="stat-label">Time</span>
          </div>
        </div>

        <!-- Rewards Earned -->
        <div class="card mb-4">
          <h2 class="text-center mb-3">🎁 Rewards Earned</h2>
          <div class="rewards-grid">
            <div class="reward-item">
              <div class="reward-icon">⚡</div>
              <div class="reward-value">+${this.xpEarned} XP</div>
            </div>
            <div class="reward-item">
              <div class="reward-icon">🪙</div>
              <div class="reward-value">+${this.coinsEarned} Coins</div>
            </div>
            ${this.newBadges.length > 0 ? `
              <div class="reward-item">
                <div class="reward-icon">🏆</div>
                <div class="reward-value">${this.newBadges.length} New Badge${this.newBadges.length > 1 ? 's' : ''}!</div>
              </div>
            ` : ''}
          </div>
          
          ${this.newBadges.length > 0 ? `
            <div class="new-badges mt-3">
              ${this.newBadges.map(badgeId => {
            const badge = gamificationService.getBadge(badgeId);
            return `
                  <div class="badge-earned animate-pulse">
                    <span style="font-size: 2rem;">${badge.icon}</span>
                    <div>
                      <div style="font-weight: 600;">${badge.name}</div>
                      <div style="font-size: 0.875rem; opacity: 0.8;">${badge.description}</div>
                    </div>
                  </div>
                `;
        }).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Wrong Answers Review -->
        ${wrongProblems.length > 0 ? `
          <div class="card mb-4">
            <h3>📝 Review Mistakes</h3>
            <p class="text-small text-secondary mb-2">These are the problems you got wrong:</p>
            <div class="wrong-problems-list">
              ${wrongProblems.map(p => `
                <div class="wrong-problem">
                  <div class="problem-text">
                    ${p.operand1} ${p.symbol} ${p.operand2} = ?
                  </div>
                  <div class="answer-comparison">
                    <span style="color: var(--rocket-orange);">Your answer: ${p.userAnswer !== null ? p.userAnswer : 'Skipped'}</span>
                    <span style="color: var(--planet-green);">Correct: ${p.correctAnswer}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="flex-row" style="justify-content: center; gap: 1rem;">
          <button class="btn btn-secondary btn-large" id="home-btn">
            🏠 Home
          </button>
          <button class="btn btn-primary btn-large" id="retry-btn">
            🔄 Practice Again
          </button>
        </div>
      </div>
    `;

        return container;
    }

    afterRender() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .level-up-banner {
        background: linear-gradient(135deg, var(--cosmic-purple) 0%, var(--nebula-pink) 100%);
        border-radius: var(--radius-lg);
        padding: 2rem;
        box-shadow: var(--shadow-lg), var(--shadow-glow);
      }

      .rocket-launch {
        animation: rocketBounce 1s ease-in-out infinite;
      }

      @keyframes rocketBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      .rewards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .reward-item {
        text-align: center;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-md);
      }

      .reward-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .reward-value {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--star-yellow);
      }

      .badge-earned {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(108, 92, 231, 0.2);
        border: 2px solid var(--cosmic-purple);
        border-radius: var(--radius-md);
        margin-top: 0.5rem;
      }

      .wrong-problems-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .wrong-problem {
        background: rgba(255, 107, 107, 0.1);
        border: 1px solid rgba(255, 107, 107, 0.3);
        border-radius: var(--radius-sm);
        padding: 1rem;
      }

      .problem-text {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .answer-comparison {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.875rem;
      }
    `;
        document.head.appendChild(style);

        // Event listeners
        const homeBtn = document.getElementById('home-btn');
        homeBtn.addEventListener('click', () => router.navigate('home'));

        const retryBtn = document.getElementById('retry-btn');
        retryBtn.addEventListener('click', () => router.navigate('settings'));
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    }
}
