// ===========================
// LANGUAGE SERVICE
// Manages i18n with English and Japanese support
// ===========================

import { storageService } from './storageService.js';

const TRANSLATIONS = {
    en: {
        // Common
        back: 'Back',
        cancel: 'Cancel',
        create: 'Create',
        start: 'Start',
        continue: 'Continue',
        done: 'Done',

        // Profile Select Screen
        appTitle: '🚀 Space Math Drill',
        chooseAstronaut: 'Choose your astronaut',
        noProfiles: 'No profiles yet. Create one to get started!',
        createNewProfile: '➕ Create New Profile',
        createProfile: 'Create Profile',
        profileName: 'Name',
        enterName: 'Enter your name',
        chooseColor: 'Choose Color',
        pleaseEnterName: 'Please enter a name',
        level: 'Level',
        dayStreak: 'day streak',

        // Home Screen
        welcomeBack: 'Welcome back',
        switchProfile: 'Switch Profile',
        statsLevel: 'Level',
        statsCoins: 'Coins',
        statsBadges: 'Badges',
        currentLocation: 'Current Location',
        practiceMode: 'Practice Mode',
        practiceModeDesc: 'Choose your settings and practice at your own pace',
        dailyChallenge: 'Daily Challenge',
        dailyChallengeDesc: '10 quick questions to keep your streak!',
        dailyChallengeCompleted: 'Come back tomorrow!',
        completedToday: '✓ Completed Today',
        progress: '📊 Progress',
        rewards: '🏆 Rewards',
        settings: '⚙️ Settings',

        // Settings Screen
        practiceSettings: 'Practice Settings',
        chooseOperations: 'Choose Operations',
        selectOperations: 'Select one or more operations to practice',
        addition: 'Addition',
        subtraction: 'Subtraction',
        multiplication: 'Multiplication',
        division: 'Division',
        difficultyLevel: 'Difficulty Level',
        easy: 'Easy',
        normal: 'Normal',
        hard: 'Hard',
        easyDesc: '1-digit numbers',
        normalDesc: '2-digit numbers',
        hardDesc: '3-digit numbers',
        numberOfQuestions: 'Number of Questions',
        startPractice: '🚀 Start Practice!',
        language: 'Language',
        selectLanguage: 'Select Language',

        // Question Screen
        question: 'Question',
        of: 'of',
        submit: 'Submit',
        next: 'Next',
        correct: 'Correct! 🎉',
        incorrect: 'Not quite',
        tryAgain: 'Try again!',
        theAnswerIs: 'The answer is',

        // Result Screen
        sessionComplete: 'Session Complete!',
        greatJob: 'Great job',
        yourScore: 'Your Score',
        timeSpent: 'Time Spent',
        accuracy: 'Accuracy',
        questionsAnswered: 'Questions Answered',
        earnedXP: 'Earned XP',
        earnedCoins: 'Earned Coins',
        newBadges: 'New Badges!',
        levelUp: '🎊 Level Up!',
        youAreNow: 'You are now level',
        backToHome: '🏠 Back to Home',
        tryAgain: '🔄 Try Again',

        // Progress Screen
        yourProgress: 'Your Progress',
        totalSessions: 'Total Sessions',
        problemsSolved: 'Problems Solved',
        averageAccuracy: 'Average Accuracy',
        recentSessions: 'Recent Sessions',
        noSessions: 'No sessions yet. Start practicing to see your progress!',
        mode: 'Mode',
        practice: 'Practice',
        daily: 'Daily',
        score: 'Score',

        // Rewards Screen
        yourRewards: 'Your Rewards',
        badgesEarned: 'Badges Earned',
        noBadges: 'No badges yet. Keep practicing to earn your first badge!',
        allBadges: 'All Badges',
        locked: 'Locked',

        // Badge Names and Descriptions
        badge_first_session_name: 'Lift Off!',
        badge_first_session_desc: 'Complete your first practice session',
        badge_streak_3_name: '3 Day Streak',
        badge_streak_3_desc: 'Practice 3 days in a row',
        badge_streak_7_name: 'Week Warrior',
        badge_streak_7_desc: 'Practice 7 days in a row',
        badge_streak_30_name: 'Monthly Master',
        badge_streak_30_desc: 'Practice 30 days in a row',
        badge_perfect_session_name: 'Perfect Score!',
        badge_perfect_session_desc: 'Get 100% on a practice session',
        badge_problems_50_name: 'Problem Solver',
        badge_problems_50_desc: 'Solve 50 problems',
        badge_problems_100_name: 'Century Club',
        badge_problems_100_desc: 'Solve 100 problems',
        badge_problems_500_name: 'Math Champion',
        badge_problems_500_desc: 'Solve 500 problems',
        badge_addition_master_name: 'Addition Master',
        badge_addition_master_desc: 'Get 90%+ on 10 addition sessions',
        badge_multiplication_master_name: 'Multiplication Master',
        badge_multiplication_master_desc: 'Get 90%+ on 10 multiplication sessions',
        badge_level_10_name: 'Double Digits',
        badge_level_10_desc: 'Reach level 10',
        badge_level_25_name: 'Quarter Century',
        badge_level_25_desc: 'Reach level 25',

        // Planet Names
        planet_earth_orbit: 'Earth Orbit',
        planet_moon: 'The Moon',
        planet_mars: 'Mars',
        planet_asteroid: 'Asteroid Belt',
        planet_jupiter: 'Jupiter',
        planet_saturn: 'Saturn',
        planet_uranus: 'Uranus',
        planet_neptune: 'Neptune',
        planet_deep_space: 'Deep Space',

        // Error Messages
        errorOccurred: 'Oops! Something went wrong',
        reloadApp: 'Reload App',
    },

    ja: {
        // Common
        back: '戻る',
        cancel: 'キャンセル',
        create: '作成',
        start: 'スタート',
        continue: '続ける',
        done: '完了',

        // Profile Select Screen
        appTitle: '🚀 宇宙算数ドリル',
        chooseAstronaut: '宇宙飛行士を選んでください',
        noProfiles: 'まだプロフィールがありません。作成して始めましょう！',
        createNewProfile: '➕ 新しいプロフィールを作成',
        createProfile: 'プロフィールを作成',
        profileName: '名前',
        enterName: '名前を入力してください',
        chooseColor: '色を選択',
        pleaseEnterName: '名前を入力してください',
        level: 'レベル',
        dayStreak: '日連続',

        // Home Screen
        welcomeBack: 'おかえりなさい',
        switchProfile: 'プロフィール切替',
        statsLevel: 'レベル',
        statsCoins: 'コイン',
        statsBadges: 'バッジ',
        currentLocation: '現在地',
        practiceMode: '練習モード',
        practiceModeDesc: '設定を選んで自分のペースで練習しましょう',
        dailyChallenge: 'デイリーチャレンジ',
        dailyChallengeDesc: '10問の問題で連続記録を更新！',
        dailyChallengeCompleted: 'また明日チャレンジしよう！',
        completedToday: '✓ 今日は完了',
        progress: '📊 進捗',
        rewards: '🏆 報酬',
        settings: '⚙️ 設定',

        // Settings Screen
        practiceSettings: '練習設定',
        chooseOperations: '計算を選ぶ',
        selectOperations: '練習する計算を1つ以上選んでください',
        addition: '足し算',
        subtraction: '引き算',
        multiplication: 'かけ算',
        division: 'わり算',
        difficultyLevel: '難易度',
        easy: 'かんたん',
        normal: 'ふつう',
        hard: 'むずかしい',
        easyDesc: '1桁の数字',
        normalDesc: '2桁の数字',
        hardDesc: '3桁の数字',
        numberOfQuestions: '問題数',
        startPractice: '🚀 練習スタート！',
        language: '言語',
        selectLanguage: '言語を選択',

        // Question Screen
        question: '問題',
        of: '/',
        submit: '送信',
        next: '次へ',
        correct: '🌟 正解！よくできました！',
        incorrect: 'おしい',
        tryAgain: 'もう一度やってみよう！',
        theAnswerIs: '答えは',

        // Result Screen
        sessionComplete: 'セッション完了！',
        greatJob: 'よくできました',
        yourScore: 'スコア',
        timeSpent: 'かかった時間',
        accuracy: '正答率',
        questionsAnswered: '回答した問題',
        earnedXP: '獲得XP',
        earnedCoins: '獲得コイン',
        newBadges: '新しいバッジ！',
        levelUp: '🎊 レベルアップ！',
        youAreNow: 'レベル',
        backToHome: '🏠 ホームに戻る',
        tryAgain: '🔄 もう一度',

        // Progress Screen
        yourProgress: 'あなたの進捗',
        totalSessions: '総セッション数',
        problemsSolved: '解いた問題数',
        averageAccuracy: '平均正答率',
        recentSessions: '最近のセッション',
        noSessions: 'まだセッションがありません。練習を始めて進捗を確認しよう！',
        mode: 'モード',
        practice: '練習',
        daily: 'デイリー',
        score: 'スコア',

        // Rewards Screen
        yourRewards: 'あなたの報酬',
        badgesEarned: '獲得したバッジ',
        noBadges: 'まだバッジがありません。練習を続けて最初のバッジを獲得しよう！',
        allBadges: 'すべてのバッジ',
        locked: 'ロック中',

        // Badge Names and Descriptions
        badge_first_session_name: '発射！',
        badge_first_session_desc: '最初の練習セッションを完了',
        badge_streak_3_name: '3日連続',
        badge_streak_3_desc: '3日連続で練習',
        badge_streak_7_name: '1週間の戦士',
        badge_streak_7_desc: '7日連続で練習',
        badge_streak_30_name: '1ヶ月マスター',
        badge_streak_30_desc: '30日連続で練習',
        badge_perfect_session_name: 'パーフェクト！',
        badge_perfect_session_desc: '練習セッションで100%達成',
        badge_problems_50_name: '問題解決者',
        badge_problems_50_desc: '50問解く',
        badge_problems_100_name: '100問クラブ',
        badge_problems_100_desc: '100問解く',
        badge_problems_500_name: '算数チャンピオン',
        badge_problems_500_desc: '500問解く',
        badge_addition_master_name: '足し算マスター',
        badge_addition_master_desc: '足し算セッション10回で90%以上',
        badge_multiplication_master_name: 'かけ算マスター',
        badge_multiplication_master_desc: 'かけ算セッション10回で90%以上',
        badge_level_10_name: '2桁レベル',
        badge_level_10_desc: 'レベル10に到達',
        badge_level_25_name: '四半世紀',
        badge_level_25_desc: 'レベル25に到達',

        // Planet Names
        planet_earth_orbit: '地球軌道',
        planet_moon: '月',
        planet_mars: '火星',
        planet_asteroid: '小惑星帯',
        planet_jupiter: '木星',
        planet_saturn: '土星',
        planet_uranus: '天王星',
        planet_neptune: '海王星',
        planet_deep_space: '深宇宙',

        // Error Messages
        errorOccurred: 'エラーが発生しました',
        reloadApp: 'アプリを再読み込み',
    }
};

class LanguageService {
    constructor() {
        this.currentLanguage = 'en';
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        // Load saved language preference
        const savedLang = await storageService.getSetting('language', 'en');
        this.currentLanguage = savedLang;
        this.initialized = true;
    }

    async setLanguage(lang) {
        if (!TRANSLATIONS[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        this.currentLanguage = lang;
        await storageService.setSetting('language', lang);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    t(key) {
        const translation = TRANSLATIONS[this.currentLanguage]?.[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
            return TRANSLATIONS.en[key] || key;
        }
        return translation;
    }

    // Get all available languages
    getLanguages() {
        return [
            { code: 'en', name: 'English' },
            { code: 'ja', name: '日本語' }
        ];
    }
}

// Export singleton instance
export const languageService = new LanguageService();
