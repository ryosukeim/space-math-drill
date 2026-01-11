// ===========================
// SETTINGS SCREEN
// Configure practice mode settings
// ===========================

import { languageService } from '../services/languageService.js';
import { router } from '../utils/router.js';

export class SettingsScreen {
  constructor() {
    this.settings = {
      operations: {
        addition: true,
        subtraction: false,
        multiplication: false,
        division: false
      },
      difficulty: 'easy',
      questionCount: 10
    };
  }

  async init() {
    // Load saved settings if any
    // For now, we use defaults
  }

  render() {
    const container = document.createElement('div');
    container.className = 'screen fade-in';
    const t = languageService.t.bind(languageService);
    const currentLang = languageService.getCurrentLanguage();

    container.innerHTML = `
      <div class="container" style="max-width: 700px;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary btn-small" id="back-btn">← ${t('back')}</button>
          <h1 style="margin: 0;">${t('practiceSettings')}</h1>
        </div>

        <!-- Language Selector -->
        <div class="card mb-3">
          <h2>${t('language')}</h2>
          <p class="text-small text-secondary mb-3">${t('selectLanguage')}</p>
          <div class="language-buttons">
            <button class="btn btn-secondary lang-btn ${currentLang === 'en' ? 'selected' : ''}" data-lang="en">English</button>
            <button class="btn btn-secondary lang-btn ${currentLang === 'ja' ? 'selected' : ''}" data-lang="ja">日本語</button>
          </div>
        </div>

        <!-- Operations -->
        <div class="card mb-3">
          <h2>${t('chooseOperations')}</h2>
          <p class="text-small text-secondary mb-3">${t('selectOperations')}</p>
          <div class="operation-grid">
            <label class="operation-option ${this.settings.operations.addition ? 'selected' : ''}" data-operation="addition">
              <input type="checkbox" ${this.settings.operations.addition ? 'checked' : ''}>
              <div class="operation-icon">➕</div>
              <span>${t('addition')}</span>
            </label>
            <label class="operation-option ${this.settings.operations.subtraction ? 'selected' : ''}" data-operation="subtraction">
              <input type="checkbox" ${this.settings.operations.subtraction ? 'checked' : ''}>
              <div class="operation-icon">➖</div>
              <span>${t('subtraction')}</span>
            </label>
            <label class="operation-option ${this.settings.operations.multiplication ? 'selected' : ''}" data-operation="multiplication">
              <input type="checkbox" ${this.settings.operations.multiplication ? 'checked' : ''}>
              <div class="operation-icon">✖️</div>
              <span>${t('multiplication')}</span>
            </label>
            <label class="operation-option ${this.settings.operations.division ? 'selected' : ''}" data-operation="division">
              <input type="checkbox" ${this.settings.operations.division ? 'checked' : ''}>
              <div class="operation-icon">➗</div>
              <span>${t('division')}</span>
            </label>
          </div>
        </div>

        <!-- Difficulty -->
        <div class="card mb-3">
          <h2>${t('difficultyLevel')}</h2>
          <div class="difficulty-buttons">
            <button class="btn btn-large difficulty-btn selected" data-difficulty="easy">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌟</div>
              <div>${t('easy')}</div>
              <div class="text-small" style="opacity: 0.7;">${t('easyDesc')}</div>
            </button>
            <button class="btn btn-large difficulty-btn" data-difficulty="normal">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">⭐⭐</div>
              <div>${t('normal')}</div>
              <div class="text-small" style="opacity: 0.7;">${t('normalDesc')}</div>
            </button>
            <button class="btn btn-large difficulty-btn" data-difficulty="hard">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">⭐⭐⭐</div>
              <div>${t('hard')}</div>
              <div class="text-small" style="opacity: 0.7;">${t('hardDesc')}</div>
            </button>
          </div>
        </div>

        <!-- Question Count -->
        <div class="card mb-4">
          <h2>${t('numberOfQuestions')}</h2>
          <div class="question-count-buttons">
            <button class="btn btn-secondary count-btn" data-count="5">5</button>
            <button class="btn btn-secondary count-btn selected" data-count="10">10</button>
            <button class="btn btn-secondary count-btn" data-count="20">20</button>
            <button class="btn btn-secondary count-btn" data-count="30">30</button>
            <button class="btn btn-secondary count-btn" data-count="50">50</button>
          </div>
        </div>

        <!-- Start Button -->
        <button class="btn btn-primary btn-large" id="start-btn" style="width: 100%;">
          ${t('startPractice')}
        </button>
      </div>
    `;

    return container;
  }

  afterRender() {
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .operation-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      .operation-option {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md);
        padding: 1.5rem 1rem;
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-medium);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .operation-option input {
        display: none;
      }

      .operation-option:hover {
        border-color: var(--cosmic-purple);
        transform: translateY(-2px);
      }

      .operation-option.selected {
        background: rgba(108, 92, 231, 0.2);
        border-color: var(--cosmic-purple);
        box-shadow: 0 0 20px rgba(108, 92, 231, 0.3);
      }

      .operation-icon {
        font-size: 2.5rem;
      }

      .difficulty-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .difficulty-btn {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 2px solid rgba(255, 255, 255, 0.1);
        padding: 1.5rem 1rem;
        flex-direction: column;
      }

      .difficulty-btn.selected {
        background: linear-gradient(135deg, var(--cosmic-purple) 0%, var(--nebula-pink) 100%) !important;
        border-color: var(--cosmic-purple);
      }

      .question-count-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .count-btn {
        flex: 1;
        min-width: 60px;
        font-family: var(--font-display);
        font-size: 1.25rem;
      }

      .count-btn.selected {
        background: var(--cosmic-purple);
        border-color: var(--cosmic-purple);
      }

      .language-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .lang-btn {
        flex: 1;
        min-width: 120px;
        font-family: var(--font-display);
        font-size: 1rem;
      }

      .lang-btn.selected {
        background: var(--cosmic-purple);
        border-color: var(--cosmic-purple);
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', () => router.navigate('home'));

    // Language selection
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        await languageService.setLanguage(lang);
        // Re-navigate to settings to refresh UI with new language
        router.navigate('settings');
      });
    });

    // Operation selection
    const operationOptions = document.querySelectorAll('.operation-option');
    operationOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        // Prevent default label behavior to avoid double-toggle
        e.preventDefault();

        const checkbox = option.querySelector('input');
        const operation = option.dataset.operation;

        // Toggle checkbox state
        const newCheckedState = !checkbox.checked;
        checkbox.checked = newCheckedState;

        // Update visual state to match checkbox
        if (newCheckedState) {
          option.classList.add('selected');
        } else {
          option.classList.remove('selected');
        }

        // Update settings
        this.settings.operations[operation] = newCheckedState;

        // Ensure at least one is selected
        const anySelected = Object.values(this.settings.operations).some(v => v);
        if (!anySelected) {
          // Re-select this operation
          checkbox.checked = true;
          option.classList.add('selected');
          this.settings.operations[operation] = true;
        }
      });
    });

    // Difficulty selection
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.settings.difficulty = btn.dataset.difficulty;
      });
    });

    // Question count selection
    const countBtns = document.querySelectorAll('.count-btn');
    countBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        countBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.settings.questionCount = parseInt(btn.dataset.count);
      });
    });

    // Start button
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
      const settings = {
        ...this.settings,
        mode: 'practice'
      };
      router.navigate('question', { settings });
    });
  }
}
