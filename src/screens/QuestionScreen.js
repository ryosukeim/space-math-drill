// ===========================
// QUESTION SCREEN
// Display problems and collect answers
// ===========================

import { problemGenerator } from '../services/problemGenerator.js';
import { router } from '../utils/router.js';

export class QuestionScreen {
    constructor(params) {
        this.settings = params.settings;
        this.problems = [];
        this.currentIndex = 0;
        this.startTime = Date.now();
        this.questionStartTime = Date.now();
    }

    async init() {
        // Generate problems
        this.problems = problemGenerator.generateProblems(
            this.settings.operations,
            this.settings.difficulty,
            this.settings.questionCount
        );
    }

    render() {
        const problem = this.problems[this.currentIndex];
        const progress = this.currentIndex + 1;
        const total = this.problems.length;
        const progressPercent = (progress / total) * 100;

        const container = document.createElement('div');
        container.className = 'screen centered fade-in';

        container.innerHTML = `
      <div class="container" style="max-width: 600px;">
        <!-- Progress Header -->
        <div class="mb-4">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="badge">Question ${progress} of ${total}</span>
            <button class="btn btn-secondary btn-small" id="quit-btn">Exit</button>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Rocket Progress Animation -->
        <div class="rocket-track mb-4" style="position: relative; height: 60px;">
          <div class="rocket-sprite animate-float" style="position: absolute; left: ${progressPercent}%; transform: translateX(-50%); transition: left 0.5s ease; font-size: 3rem;">
            🚀
          </div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.2);"></div>
        </div>

        <!-- Problem Display -->
        <div class="card text-center" style="padding: 3rem 2rem; margin-bottom: 2rem;">
          <div class="problem-equation" style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 700; color: var(--star-yellow); margin-bottom: 1.5rem;">
            ${problem.operand1} ${problem.symbol} ${problem.operand2} = ?
          </div>
          
          <input 
            type="number" 
            class="input-number-large" 
            id="answer-input" 
            placeholder="?" 
            autocomplete="off"
            style="width: 100%; max-width: 300px;"
          />
        </div>

        <!-- Answer Feedback -->
        <div id="feedback" class="feedback hidden"></div>

        <!-- Action Buttons -->
        <div class="flex-row" style="justify-content: center;">
          <button class="btn btn-secondary" id="skip-btn">Skip ⏭️</button>
          <button class="btn btn-primary btn-large" id="submit-btn">Submit ✓</button>
        </div>

        <!-- Number Pad (for touch devices) -->
        <div class="number-pad mt-4" id="number-pad">
          <div class="number-pad-grid">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => `
              <button class="number-pad-btn" data-value="${n}">${n}</button>
            `).join('')}
            <button class="number-pad-btn" data-action="backspace">⌫</button>
            <button class="number-pad-btn btn-primary" data-action="submit">✓</button>
          </div>
        </div>
      </div>
    `;

        return container;
    }

    afterRender() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .number-pad-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        max-width: 300px;
        margin: 0 auto;
      }

      .number-pad-btn {
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 600;
        padding: 1rem;
        border: none;
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        cursor: pointer;
        transition: all var(--transition-fast);
        min-height: 60px;
      }

      .number-pad-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
      }

      .number-pad-btn:active {
        transform: scale(0.95);
      }

      .feedback {
        text-align: center;
        padding: 1.5rem;
        border-radius: var(--radius-md);
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        animation: slideUp 0.3s ease-out;
      }

      .feedback.correct {
        background: rgba(109, 255, 109, 0.2);
        border: 2px solid var(--planet-green);
        color: var(--planet-green);
      }

      .feedback.incorrect {
        background: rgba(255, 107, 107, 0.2);
        border: 2px solid var(--rocket-orange);
        color: var(--rocket-orange);
      }

      @media (max-width: 768px) {
        .problem-equation {
          font-size: 2.5rem !important;
        }

        .input-number-large {
          font-size: 2rem !important;
        }
      }
    `;
        document.head.appendChild(style);

        // Focus input
        const answerInput = document.getElementById('answer-input');
        answerInput.focus();

        // Event listeners
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.addEventListener('click', () => this.submitAnswer());

        const skipBtn = document.getElementById('skip-btn');
        skipBtn.addEventListener('click', () => this.skipQuestion());

        const quitBtn = document.getElementById('quit-btn');
        quitBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
                router.navigate('home');
            }
        });

        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        // Number pad
        const numberPadBtns = document.querySelectorAll('.number-pad-btn[data-value]');
        numberPadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                answerInput.value += value;
                answerInput.focus();
            });
        });

        const backspaceBtn = document.querySelector('[data-action="backspace"]');
        backspaceBtn.addEventListener('click', () => {
            answerInput.value = answerInput.value.slice(0, -1);
            answerInput.focus();
        });

        const submitPadBtn = document.querySelector('[data-action="submit"]');
        submitPadBtn.addEventListener('click', () => this.submitAnswer());

        this.questionStartTime = Date.now();
    }

    submitAnswer() {
        const answerInput = document.getElementById('answer-input');
        const userAnswer = parseInt(answerInput.value);

        if (isNaN(userAnswer)) {
            return;
        }

        // Record time spent
        const timeSpent = (Date.now() - this.questionStartTime) / 1000;
        this.problems[this.currentIndex].timeSpent = timeSpent;

        // Check answer
        const problem = this.problems[this.currentIndex];
        const isCorrect = problemGenerator.checkAnswer(problem, userAnswer);

        // Show feedback
        this.showFeedback(isCorrect, problem.correctAnswer);

        // Auto-advance after delay
        setTimeout(() => {
            this.nextQuestion();
        }, isCorrect ? 1000 : 2000);
    }

    skipQuestion() {
        this.problems[this.currentIndex].userAnswer = null;
        this.problems[this.currentIndex].isCorrect = null;
        this.nextQuestion();
    }

    showFeedback(isCorrect, correctAnswer) {
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('hidden', 'correct', 'incorrect');

        if (isCorrect) {
            feedback.textContent = '🌟 Correct! Great job!';
            feedback.classList.add('correct');
            this.createStarBurst();
        } else {
            feedback.textContent = `Not quite! The answer is ${correctAnswer}`;
            feedback.classList.add('incorrect');
        }

        // Disable input
        document.getElementById('answer-input').disabled = true;
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('skip-btn').disabled = true;
    }

    createStarBurst() {
        // Create star animation
        const container = document.querySelector('.container');
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.style.position = 'absolute';
            star.style.fontSize = '2rem';
            star.style.left = '50%';
            star.style.top = '50%';
            star.style.pointerEvents = 'none';
            star.classList.add('animate-star-collect');

            const angle = (Math.PI * 2 * i) / 5;
            const distance = 100;
            star.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;

            container.appendChild(star);

            setTimeout(() => star.remove(), 600);
        }
    }

    nextQuestion() {
        this.currentIndex++;

        if (this.currentIndex >= this.problems.length) {
            // Session complete
            this.finishSession();
        } else {
            // Re-render next question
            const app = document.getElementById('app');
            app.innerHTML = '';
            app.appendChild(this.render());
            this.afterRender();
        }
    }

    finishSession() {
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const correctAnswers = this.problems.filter(p => p.isCorrect).length;

        const sessionData = {
            settings: this.settings,
            problems: this.problems,
            totalTime,
            correctAnswers,
            totalQuestions: this.problems.length
        };

        router.navigate('result', { sessionData });
    }
}
