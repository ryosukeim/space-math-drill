// ===========================
// STORAGE SERVICE - IndexedDB with localStorage fallback
// Handles all data persistence for profiles, sessions, and settings
// ===========================

const DB_NAME = 'SpaceMathDrill';
const DB_VERSION = 1;
const STORES = {
    PROFILES: 'profiles',
    SESSIONS: 'sessions',
    SETTINGS: 'settings'
};

class StorageService {
    constructor() {
        this.db = null;
        this.useLocalStorage = false;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.warn('IndexedDB not available, using localStorage fallback');
                this.useLocalStorage = true;
                resolve();
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Database failed to open, using localStorage fallback');
                this.useLocalStorage = true;
                resolve();
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database initialized successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create profiles store
                if (!db.objectStoreNames.contains(STORES.PROFILES)) {
                    const profileStore = db.createObjectStore(STORES.PROFILES, { keyPath: 'id' });
                    profileStore.createIndex('name', 'name', { unique: false });
                    profileStore.createIndex('lastPlayedAt', 'lastPlayedAt', { unique: false });
                }

                // Create sessions store
                if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
                    const sessionStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
                    sessionStore.createIndex('profileId', 'profileId', { unique: false });
                    sessionStore.createIndex('completedAt', 'completedAt', { unique: false });
                }

                // Create settings store
                if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                    db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
                }
            };
        });
    }

    // Generate UUID
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // === PROFILE METHODS ===

    async createProfile(name, avatarColor = '#6c5ce7') {
        const profile = {
            id: this.generateId(),
            name,
            avatarColor,
            createdAt: Date.now(),
            lastPlayedAt: Date.now(),
            streak: 0,
            lastStreakDate: null,
            xp: 0,
            level: 1,
            coins: 0,
            badges: [],
            customizations: {
                rocketColor: '#ff6b6b',
                rocketDecal: 'default',
                spaceBackground: 'default'
            }
        };

        if (this.useLocalStorage) {
            const profiles = this.getAllProfilesLocal();
            profiles.push(profile);
            localStorage.setItem('profiles', JSON.stringify(profiles));
            return profile;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.PROFILES], 'readwrite');
            const store = transaction.objectStore(STORES.PROFILES);
            const request = store.add(profile);

            request.onsuccess = () => resolve(profile);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProfiles() {
        if (this.useLocalStorage) {
            return this.getAllProfilesLocal();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.PROFILES], 'readonly');
            const store = transaction.objectStore(STORES.PROFILES);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    getAllProfilesLocal() {
        const profiles = localStorage.getItem('profiles');
        return profiles ? JSON.parse(profiles) : [];
    }

    async getProfile(id) {
        if (this.useLocalStorage) {
            const profiles = this.getAllProfilesLocal();
            return profiles.find(p => p.id === id);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.PROFILES], 'readonly');
            const store = transaction.objectStore(STORES.PROFILES);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateProfile(profile) {
        if (this.useLocalStorage) {
            const profiles = this.getAllProfilesLocal();
            const index = profiles.findIndex(p => p.id === profile.id);
            if (index !== -1) {
                profiles[index] = profile;
                localStorage.setItem('profiles', JSON.stringify(profiles));
            }
            return profile;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.PROFILES], 'readwrite');
            const store = transaction.objectStore(STORES.PROFILES);
            const request = store.put(profile);

            request.onsuccess = () => resolve(profile);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteProfile(id) {
        if (this.useLocalStorage) {
            const profiles = this.getAllProfilesLocal();
            const filtered = profiles.filter(p => p.id !== id);
            localStorage.setItem('profiles', JSON.stringify(filtered));
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.PROFILES], 'readwrite');
            const store = transaction.objectStore(STORES.PROFILES);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // === SESSION METHODS ===

    async saveSession(session) {
        if (this.useLocalStorage) {
            const sessions = this.getAllSessionsLocal();
            sessions.push(session);
            localStorage.setItem('sessions', JSON.stringify(sessions));
            return session;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.SESSIONS], 'readwrite');
            const store = transaction.objectStore(STORES.SESSIONS);
            const request = store.add(session);

            request.onsuccess = () => resolve(session);
            request.onerror = () => reject(request.error);
        });
    }

    async getSessionsByProfile(profileId, limit = 20) {
        if (this.useLocalStorage) {
            const sessions = this.getAllSessionsLocal();
            return sessions
                .filter(s => s.profileId === profileId)
                .sort((a, b) => b.completedAt - a.completedAt)
                .slice(0, limit);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.SESSIONS], 'readonly');
            const store = transaction.objectStore(STORES.SESSIONS);
            const index = store.index('profileId');
            const request = index.getAll(profileId);

            request.onsuccess = () => {
                const sorted = request.result
                    .sort((a, b) => b.completedAt - a.completedAt)
                    .slice(0, limit);
                resolve(sorted);
            };
            request.onerror = () => reject(request.error);
        });
    }

    getAllSessionsLocal() {
        const sessions = localStorage.getItem('sessions');
        return sessions ? JSON.parse(sessions) : [];
    }

    // === SETTINGS METHODS ===

    async getSetting(key, defaultValue = null) {
        if (this.useLocalStorage) {
            const value = localStorage.getItem(`setting_${key}`);
            return value ? JSON.parse(value) : defaultValue;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.SETTINGS], 'readonly');
            const store = transaction.objectStore(STORES.SETTINGS);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : defaultValue);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async setSetting(key, value) {
        if (this.useLocalStorage) {
            localStorage.setItem(`setting_${key}`, JSON.stringify(value));
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORES.SETTINGS], 'readwrite');
            const store = transaction.objectStore(STORES.SETTINGS);
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // === UTILITY METHODS ===

    async getCurrentProfile() {
        const profileId = await this.getSetting('currentProfileId');
        if (!profileId) return null;
        return this.getProfile(profileId);
    }

    async setCurrentProfile(profileId) {
        return this.setSetting('currentProfileId', profileId);
    }

    // Update streak - called when daily challenge is completed
    async updateStreak(profile) {
        const today = new Date().toDateString();
        const lastDate = profile.lastStreakDate ? new Date(profile.lastStreakDate).toDateString() : null;

        if (lastDate === today) {
            // Already played today, no change
            return profile;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === yesterdayStr) {
            // Consecutive day
            profile.streak += 1;
        } else if (lastDate === null || lastDate !== yesterdayStr) {
            // Streak broken or first time
            profile.streak = 1;
        }

        profile.lastStreakDate = new Date().toISOString();
        profile.lastPlayedAt = Date.now();

        return this.updateProfile(profile);
    }
}

// Export singleton instance
export const storageService = new StorageService();
