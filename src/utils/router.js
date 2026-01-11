// ===========================
// ROUTER - Simple client-side routing
// ===========================

class Router {
    constructor() {
        this.routes = {};
        this.currentScreen = null;
        this.appElement = null;
    }

    init(appElement) {
        this.appElement = appElement;
    }

    // Register a screen
    register(name, screenClass) {
        this.routes[name] = screenClass;
    }

    // Navigate to a screen
    async navigate(name, params = {}) {
        const ScreenClass = this.routes[name];

        if (!ScreenClass) {
            console.error(`Screen "${name}" not found`);
            return;
        }

        // Clean up current screen
        if (this.currentScreen && this.currentScreen.cleanup) {
            this.currentScreen.cleanup();
        }

        // Create and render new screen
        this.currentScreen = new ScreenClass(params);
        await this.currentScreen.init();

        this.appElement.innerHTML = '';
        this.appElement.appendChild(this.currentScreen.render());

        // Call afterRender hook if exists
        if (this.currentScreen.afterRender) {
            this.currentScreen.afterRender();
        }
    }

    // Go back
    back() {
        // Simple implementation - can be enhanced with history stack
        this.navigate('home');
    }
}

// Export singleton instance
export const router = new Router();
