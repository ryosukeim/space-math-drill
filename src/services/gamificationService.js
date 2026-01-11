// ===========================
// GAMIFICATION SERVICE
// Manages XP, levels, coins, badges, and rewards
// ===========================

export const BADGES = {
    FIRST_SESSION: {
        id: 'first_session',
        name: 'Lift Off!',
        description: 'Complete your first practice session',
        icon: '🚀'
    },
    STREAK_3: {
        id: 'streak_3',
        name: '3 Day Streak',
        description: 'Practice 3 days in a row',
        icon: '🔥'
    },
    STREAK_7: {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Practice 7 days in a row',
        icon: '⭐'
    },
    STREAK_30: {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Practice 30 days in a row',
        icon: '👑'
    },
    PERFECT_SESSION: {
        id: 'perfect_session',
        name: 'Perfect Score!',
        description: 'Get 100% on a practice session',
        icon: '💯'
    },
    PROBLEMS_50: {
        id: 'problems_50',
        name: 'Problem Solver',
        description: 'Solve 50 problems',
        icon: '📝'
    },
    PROBLEMS_100: {
        id: 'problems_100',
        name: 'Century Club',
        description: 'Solve 100 problems',
        icon: '💪'
    },
    PROBLEMS_500: {
        id: 'problems_500',
        name: 'Math Champion',
        description: 'Solve 500 problems',
        icon: '🏆'
    },
    ADDITION_MASTER: {
        id: 'addition_master',
        name: 'Addition Master',
        description: 'Get 90%+ on 10 addition sessions',
        icon: '➕'
    },
    MULTIPLICATION_MASTER: {
        id: 'multiplication_master',
        name: 'Multiplication Master',
        description: 'Get 90%+ on 10 multiplication sessions',
        icon: '✖️'
    },
    LEVEL_10: {
        id: 'level_10',
        name: 'Double Digits',
        description: 'Reach level 10',
        icon: '🌟'
    },
    LEVEL_25: {
        id: 'level_25',
        name: 'Quarter Century',
        description: 'Reach level 25',
        icon: '🎯'
    }
};

export class GamificationService {
    constructor() {
        // XP needed for each level (exponential growth)
        this.levelThresholds = this.generateLevelThresholds(100);
    }

    // Generate XP thresholds for levels
    generateLevelThresholds(maxLevel) {
        const thresholds = [0]; // Level 1 starts at 0 XP
        let baseXP = 100;

        for (let i = 1; i < maxLevel; i++) {
            const xpNeeded = Math.floor(baseXP * Math.pow(1.15, i - 1));
            thresholds.push(thresholds[i - 1] + xpNeeded);
        }

        return thresholds;
    }

    // Calculate XP earned from a session
    calculateXP(session) {
        const baseXP = 10; // Base XP per problem

        // Difficulty multiplier
        const difficultyMultipliers = {
            'easy': 1.0,
            'normal': 1.5,
            'hard': 2.0
        };
        const difficultyMultiplier = difficultyMultipliers[session.difficulty] || 1.0;

        // Accuracy bonus (perfect = 1.5x)
        const accuracy = session.correctAnswers / session.totalQuestions;
        const accuracyBonus = accuracy === 1.0 ? 1.5 : (1 + (accuracy * 0.5));

        // Daily challenge bonus
        const modeBonus = session.mode === 'daily' ? 1.2 : 1.0;

        const totalXP = Math.floor(
            baseXP * session.totalQuestions * difficultyMultiplier * accuracyBonus * modeBonus
        );

        return totalXP;
    }

    // Calculate coins earned from a session
    calculateCoins(session) {
        const coinsPerCorrect = 5;
        let coins = session.correctAnswers * coinsPerCorrect;

        // Perfect bonus
        if (session.correctAnswers === session.totalQuestions) {
            coins += 50;
        }

        // Difficulty bonus
        const difficultyBonus = {
            'easy': 0,
            'normal': 10,
            'hard': 25
        };
        coins += difficultyBonus[session.difficulty] || 0;

        return coins;
    }

    // Get current level from XP
    getLevelFromXP(xp) {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (xp >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    // Get XP needed for next level
    getXPForNextLevel(currentLevel) {
        if (currentLevel >= this.levelThresholds.length) {
            return null; // Max level
        }
        return this.levelThresholds[currentLevel];
    }

    // Get XP progress in current level
    getXPProgress(xp) {
        const currentLevel = this.getLevelFromXP(xp);
        const currentLevelXP = this.levelThresholds[currentLevel - 1];
        const nextLevelXP = this.getXPForNextLevel(currentLevel);

        if (!nextLevelXP) {
            return { current: xp, needed: xp, percentage: 100 };
        }

        const xpInLevel = xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;
        const percentage = Math.floor((xpInLevel / xpNeeded) * 100);

        return {
            current: xpInLevel,
            needed: xpNeeded,
            percentage
        };
    }

    // Check for new badges earned
    checkBadges(profile, sessions, newSession) {
        const newBadges = [];

        // First session
        if (!profile.badges.includes(BADGES.FIRST_SESSION.id) && sessions.length === 1) {
            newBadges.push(BADGES.FIRST_SESSION.id);
        }

        // Perfect session
        if (!profile.badges.includes(BADGES.PERFECT_SESSION.id) &&
            newSession.correctAnswers === newSession.totalQuestions &&
            newSession.totalQuestions >= 5) {
            newBadges.push(BADGES.PERFECT_SESSION.id);
        }

        // Streak badges
        if (!profile.badges.includes(BADGES.STREAK_3.id) && profile.streak >= 3) {
            newBadges.push(BADGES.STREAK_3.id);
        }
        if (!profile.badges.includes(BADGES.STREAK_7.id) && profile.streak >= 7) {
            newBadges.push(BADGES.STREAK_7.id);
        }
        if (!profile.badges.includes(BADGES.STREAK_30.id) && profile.streak >= 30) {
            newBadges.push(BADGES.STREAK_30.id);
        }

        // Problem count badges
        const totalProblems = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
        if (!profile.badges.includes(BADGES.PROBLEMS_50.id) && totalProblems >= 50) {
            newBadges.push(BADGES.PROBLEMS_50.id);
        }
        if (!profile.badges.includes(BADGES.PROBLEMS_100.id) && totalProblems >= 100) {
            newBadges.push(BADGES.PROBLEMS_100.id);
        }
        if (!profile.badges.includes(BADGES.PROBLEMS_500.id) && totalProblems >= 500) {
            newBadges.push(BADGES.PROBLEMS_500.id);
        }

        // Level badges
        if (!profile.badges.includes(BADGES.LEVEL_10.id) && profile.level >= 10) {
            newBadges.push(BADGES.LEVEL_10.id);
        }
        if (!profile.badges.includes(BADGES.LEVEL_25.id) && profile.level >= 25) {
            newBadges.push(BADGES.LEVEL_25.id);
        }

        // Operation mastery (90%+ on 10 sessions)
        const additionSessions = sessions.filter(s =>
            s.operations.includes('addition') &&
            (s.correctAnswers / s.totalQuestions) >= 0.9
        );
        if (!profile.badges.includes(BADGES.ADDITION_MASTER.id) && additionSessions.length >= 10) {
            newBadges.push(BADGES.ADDITION_MASTER.id);
        }

        const multiplicationSessions = sessions.filter(s =>
            s.operations.includes('multiplication') &&
            (s.correctAnswers / s.totalQuestions) >= 0.9
        );
        if (!profile.badges.includes(BADGES.MULTIPLICATION_MASTER.id) && multiplicationSessions.length >= 10) {
            newBadges.push(BADGES.MULTIPLICATION_MASTER.id);
        }

        return newBadges;
    }

    // Get badge info
    getBadge(badgeId) {
        return Object.values(BADGES).find(b => b.id === badgeId);
    }

    // Get all earned badges
    getEarnedBadges(profile) {
        return profile.badges.map(id => this.getBadge(id)).filter(b => b);
    }

    // Get planet name based on XP/level (for visual progression)
    getPlanetName(level) {
        const planets = [
            { max: 5, name: 'Earth Orbit', color: '#4a90e2' },
            { max: 10, name: 'The Moon', color: '#c0c0c0' },
            { max: 15, name: 'Mars', color: '#ff6b6b' },
            { max: 20, name: 'Asteroid Belt', color: '#a4a4a4' },
            { max: 30, name: 'Jupiter', color: '#f9ca24' },
            { max: 40, name: 'Saturn', color: '#ffd93d' },
            { max: 50, name: 'Uranus', color: '#6dff6d' },
            { max: 75, name: 'Neptune', color: '#6c5ce7' },
            { max: 100, name: 'Deep Space', color: '#fd79a8' }
        ];

        for (const planet of planets) {
            if (level <= planet.max) {
                return planet;
            }
        }

        return planets[planets.length - 1];
    }
}

// Export singleton instance
export const gamificationService = new GamificationService();
