"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestXpReward = exports.getLevelThreshold = exports.XP_REWARD = void 0;
const enums_1 = require("../../generated/prisma/enums");
exports.XP_REWARD = {
    [enums_1.Difficulty.easy]: 20,
    [enums_1.Difficulty.medium]: 50,
    [enums_1.Difficulty.hard]: 100,
};
const getLevelThreshold = (level) => {
    if (level <= 0)
        return 0;
    return Math.floor(100 * Math.pow(level, 1.35));
};
exports.getLevelThreshold = getLevelThreshold;
const getQuestXpReward = (difficulty) => {
    return exports.XP_REWARD[difficulty];
};
exports.getQuestXpReward = getQuestXpReward;
