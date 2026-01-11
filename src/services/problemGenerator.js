// ===========================
// PROBLEM GENERATOR SERVICE
// Generates math problems based on operation type and difficulty
// ===========================

export const OPERATIONS = {
    ADD: 'addition',
    SUBTRACT: 'subtraction',
    MULTIPLY: 'multiplication',
    DIVIDE: 'division'
};

export const DIFFICULTIES = {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard'
};

export class ProblemGenerator {
    constructor() {
        this.problems = [];
    }

    // Generate a set of problems
    generateProblems(operations, difficulty, count) {
        this.problems = [];

        for (let i = 0; i < count; i++) {
            const operation = this.selectRandomOperation(operations);
            const problem = this.generateProblem(operation, difficulty);
            this.problems.push(problem);
        }

        return this.problems;
    }

    // Select random operation from enabled operations
    selectRandomOperation(operations) {
        const enabledOps = Object.values(OPERATIONS).filter(op => operations[op]);
        return enabledOps[Math.floor(Math.random() * enabledOps.length)];
    }

    // Generate a single problem
    generateProblem(operation, difficulty) {
        let problem;

        switch (operation) {
            case OPERATIONS.ADD:
                problem = this.generateAddition(difficulty);
                break;
            case OPERATIONS.SUBTRACT:
                problem = this.generateSubtraction(difficulty);
                break;
            case OPERATIONS.MULTIPLY:
                problem = this.generateMultiplication(difficulty);
                break;
            case OPERATIONS.DIVIDE:
                problem = this.generateDivision(difficulty);
                break;
            default:
                problem = this.generateAddition(difficulty);
        }

        return {
            ...problem,
            operation,
            difficulty,
            userAnswer: null,
            isCorrect: null,
            timeSpent: 0
        };
    }

    // === ADDITION GENERATORS ===

    generateAddition(difficulty) {
        let operand1, operand2;

        switch (difficulty) {
            case DIFFICULTIES.EASY:
                // 1-digit + 1-digit (0-10)
                operand1 = this.randomInt(0, 10);
                operand2 = this.randomInt(0, 10);
                break;

            case DIFFICULTIES.NORMAL:
                // 2-digit + 1 or 2-digit with carrying
                if (Math.random() > 0.5) {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(1, 9);
                } else {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(10, 99);
                }
                break;

            case DIFFICULTIES.HARD:
                // 3-digit + 2 or 3-digit
                if (Math.random() > 0.5) {
                    operand1 = this.randomInt(100, 999);
                    operand2 = this.randomInt(10, 99);
                } else {
                    operand1 = this.randomInt(100, 999);
                    operand2 = this.randomInt(100, 999);
                }
                break;
        }

        return {
            operand1,
            operand2,
            correctAnswer: operand1 + operand2,
            symbol: '+'
        };
    }

    // === SUBTRACTION GENERATORS ===

    generateSubtraction(difficulty) {
        let operand1, operand2;

        switch (difficulty) {
            case DIFFICULTIES.EASY:
                // 1-digit - 1-digit (no negatives)
                operand1 = this.randomInt(1, 10);
                operand2 = this.randomInt(0, operand1);
                break;

            case DIFFICULTIES.NORMAL:
                // 2-digit - 1 or 2-digit with borrowing
                if (Math.random() > 0.5) {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(1, Math.min(9, operand1));
                } else {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(10, operand1);
                }
                break;

            case DIFFICULTIES.HARD:
                // 3-digit - 2 or 3-digit with multiple borrowing
                if (Math.random() > 0.5) {
                    operand1 = this.randomInt(100, 999);
                    operand2 = this.randomInt(10, Math.min(99, operand1));
                } else {
                    operand1 = this.randomInt(100, 999);
                    operand2 = this.randomInt(100, operand1);
                }
                break;
        }

        return {
            operand1,
            operand2,
            correctAnswer: operand1 - operand2,
            symbol: '-'
        };
    }

    // === MULTIPLICATION GENERATORS ===

    generateMultiplication(difficulty) {
        let operand1, operand2;

        switch (difficulty) {
            case DIFFICULTIES.EASY:
                // Times tables (1-9)
                operand1 = this.randomInt(1, 9);
                operand2 = this.randomInt(1, 9);
                break;

            case DIFFICULTIES.NORMAL:
                // 1-digit × 2-digit or 2-digit × 1-digit
                if (Math.random() > 0.5) {
                    operand1 = this.randomInt(1, 9);
                    operand2 = this.randomInt(10, 99);
                } else {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(1, 9);
                }
                break;

            case DIFFICULTIES.HARD:
                // 2-digit × 1 or 2-digit
                if (Math.random() > 0.5) {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(1, 9);
                } else {
                    operand1 = this.randomInt(10, 99);
                    operand2 = this.randomInt(10, 20); // Keep it reasonable
                }
                break;
        }

        return {
            operand1,
            operand2,
            correctAnswer: operand1 * operand2,
            symbol: '×'
        };
    }

    // === DIVISION GENERATORS ===

    generateDivision(difficulty) {
        let divisor, quotient, dividend;

        switch (difficulty) {
            case DIFFICULTIES.EASY:
                // Simple division (56 ÷ 7 = 8)
                divisor = this.randomInt(2, 9);
                quotient = this.randomInt(2, 9);
                dividend = divisor * quotient;
                break;

            case DIFFICULTIES.NORMAL:
                // 2-digit ÷ 1-digit
                divisor = this.randomInt(2, 9);
                quotient = this.randomInt(2, 12);
                dividend = divisor * quotient;
                break;

            case DIFFICULTIES.HARD:
                // 3-digit ÷ 1-digit
                divisor = this.randomInt(2, 9);
                quotient = this.randomInt(10, 99);
                dividend = divisor * quotient;
                break;
        }

        return {
            operand1: dividend,
            operand2: divisor,
            correctAnswer: quotient,
            symbol: '÷'
        };
    }

    // === UTILITY METHODS ===

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Validate answer
    checkAnswer(problem, userAnswer) {
        const correct = userAnswer === problem.correctAnswer;
        problem.userAnswer = userAnswer;
        problem.isCorrect = correct;
        return correct;
    }

    // Get problems that were answered incorrectly
    getWrongProblems(problems) {
        return problems.filter(p => p.isCorrect === false);
    }

    // Calculate accuracy
    calculateAccuracy(problems) {
        const answered = problems.filter(p => p.isCorrect !== null);
        if (answered.length === 0) return 0;
        const correct = answered.filter(p => p.isCorrect).length;
        return Math.round((correct / answered.length) * 100);
    }

    // Get operation display name
    static getOperationName(operation) {
        const names = {
            [OPERATIONS.ADD]: 'Addition',
            [OPERATIONS.SUBTRACT]: 'Subtraction',
            [OPERATIONS.MULTIPLY]: 'Multiplication',
            [OPERATIONS.DIVIDE]: 'Division'
        };
        return names[operation] || operation;
    }
}

// Export singleton instance
export const problemGenerator = new ProblemGenerator();
