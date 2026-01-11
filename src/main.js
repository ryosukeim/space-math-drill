// ===========================
// MAIN.JS - Application Entry Point
// ===========================

import './style.css';
import { storageService } from './services/storageService.js';
import { router } from './utils/router.js';
import { ProfileSelectScreen } from './screens/ProfileSelectScreen.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { QuestionScreen } from './screens/QuestionScreen.js';
import { ResultScreen } from './screens/ResultScreen.js';
import { ProgressScreen } from './screens/ProgressScreen.js';
import { RewardsScreen } from './screens/RewardsScreen.js';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
                console.log('ServiceWorker registration successful');
            },
            (err) => {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// Initialize app
async function initApp() {
    try {
        // Initialize storage
        await storageService.init();
        console.log('Storage initialized');

        // Get app container
        const app = document.getElementById('app');
        if (!app) {
            throw new Error('App container not found');
        }

        // Initialize router
        router.init(app);

        // Register all screens
        router.register('profile-select', ProfileSelectScreen);
        router.register('home', HomeScreen);
        router.register('settings', SettingsScreen);
        router.register('question', QuestionScreen);
        router.register('result', ResultScreen);
        router.register('progress', ProgressScreen);
        router.register('rewards', RewardsScreen);

        // Check if we have a current profile
        const currentProfile = await storageService.getCurrentProfile();

        // Navigate to appropriate screen
        if (currentProfile) {
            await router.navigate('home');
        } else {
            await router.navigate('profile-select');
        }

        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }

        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize app:', error);

        // Show error message
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <h1>Oops! Something went wrong</h1>
          <p style="color: var(--text-secondary); margin: 1rem 0;">
            ${error.message}
          </p>
          <button class="btn btn-primary" onclick="location.reload()">
            Reload App
          </button>
        </div>
      `;
        }
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline (PWA mode active)');
});
