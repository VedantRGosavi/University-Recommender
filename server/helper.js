/**
 * Calculate a score based on user's SAT score compared to university's SAT range
 * @param {number} userSat - User's SAT score
 * @param {number} sat25th - University's 25th percentile SAT score
 * @param {number} sat75th - University's 75th percentile SAT score
 * @returns {number} - Compatibility score from 0 to 100
 */
function calculateScore(userSat, sat25th, sat75th) {
    if (!sat25th || !sat75th) return 50; // Default score if data unavailable
    
    if (userSat < sat25th) {
        // Low base score for SAT below the 25th percentile
        return 20 + (userSat - sat25th) / 10;
    } else if (sat25th <= userSat && userSat <= sat75th) {
        // Variable score for SAT within the range
        return 20 + 60 * (userSat - sat25th) / (sat75th - sat25th);
    } else {
        // High base score for SAT above the 75th percentile
        return 80 - (userSat - sat75th) / 10;
    }
}

/**
 * Calculate combined score based on verbal and math SAT scores
 * @param {number} userSatVerbal - User's SAT verbal score
 * @param {number} userSatMath - User's SAT math score
 * @param {object} university - University object with SAT score data
 * @returns {number} - Overall compatibility score from 5 to 85
 */
function combinedScore(userSatVerbal, userSatMath, university) {
    const verbScore = calculateScore(userSatVerbal, university.SATVR25, university.SATVR75);
    const mathScore = calculateScore(userSatMath, university.SATMAT25, university.SATMAT75);

    const combinedScore = (verbScore + mathScore) / 2;
    return Math.max(5, Math.min(combinedScore, 85));
}

/**
 * Calculate cost affordability score based on max budget
 * @param {number} maxBudget - User's maximum budget
 * @param {number} universityCost - University's annual cost
 * @returns {number} - Affordability score from 0 to 100
 */
function affordabilityScore(maxBudget, universityCost) {
    if (!universityCost) return 50; // Default score if data unavailable
    
    if (maxBudget >= universityCost) {
        // Full affordability
        return 100;
    } else if (maxBudget >= universityCost * 0.8) {
        // Close to affordable
        return 75;
    } else if (maxBudget >= universityCost * 0.6) {
        // Somewhat affordable
        return 50;
    } else if (maxBudget >= universityCost * 0.4) {
        // Less affordable
        return 25;
    } else {
        // Not affordable
        return 0;
    }
}

/**
 * Calculate career match score based on university rankings in related fields
 * @param {string} careerField - User's career interest field
 * @param {object} university - University object with ranking data
 * @returns {number} - Career match score from 0 to 100
 */
function careerMatchScore(careerField, university) {
    const fieldToRankingMap = {
        'ComputerSci': 'computerScienceRank',
        'Engineering': 'engineeringRank',
        'Business': 'businessRank',
        'Nursing': 'nursingRank',
        'Psychology': 'psychologyRank',
        'Finance': 'financeRank',
        'Economics': 'economicsRank',
        'Management': 'managementRank',
        'Marketing': 'marketingRank',
        'AI': 'artificialIntelligenceRank',
        'Aerospace': 'aerospaceRanking'
    };
    
    const rankingField = fieldToRankingMap[careerField];
    if (!rankingField || !university[rankingField]) return 50; // Default if no data
    
    const ranking = university[rankingField];
    
    // Higher score for better rankings (lower numbers)
    if (ranking <= 10) return 100;
    if (ranking <= 25) return 90;
    if (ranking <= 50) return 80;
    if (ranking <= 100) return 70;
    if (ranking <= 200) return 60;
    if (ranking <= 300) return 50;
    if (ranking <= 400) return 40;
    if (ranking <= 500) return 30;
    
    return 20; // Low score for rankings over 500
}

/**
 * Calculate overall university match score based on multiple factors
 * @param {object} user - User preferences object
 * @param {object} university - University data object
 * @returns {number} - Overall match score from 0 to 100
 */
function calculateOverallScore(user, university) {
    let totalScore = 0;
    let totalWeight = 0;
    
    // SAT score match (if provided)
    if (user.satVerbal && user.satMath) {
        const satScore = combinedScore(user.satVerbal, user.satMath, university);
        totalScore += satScore * 0.4; // 40% weight
        totalWeight += 0.4;
    }
    
    // Cost affordability (if provided)
    if (user.maxBudget && university.avg_annual_cost) {
        const costScore = affordabilityScore(user.maxBudget, university.avg_annual_cost);
        totalScore += costScore * 0.2; // 20% weight
        totalWeight += 0.2;
    }
    
    // Career match (if provided)
    if (user.careerInterest) {
        const careerScore = careerMatchScore(user.careerInterest, university);
        totalScore += careerScore * 0.25; // 25% weight
        totalWeight += 0.25;
    }
    
    // University ranking (always included)
    let rankScore = 0;
    if (university.rankNumber) {
        // Higher score for better rankings (lower numbers)
        if (university.rankNumber <= 50) rankScore = 100;
        else if (university.rankNumber <= 100) rankScore = 90;
        else if (university.rankNumber <= 200) rankScore = 80;
        else if (university.rankNumber <= 300) rankScore = 70;
        else if (university.rankNumber <= 400) rankScore = 60;
        else rankScore = 50;
    } else {
        rankScore = 50; // Default if no ranking
    }
    
    totalScore += rankScore * 0.15; // 15% weight
    totalWeight += 0.15;
    
    // Calculate final score (normalize by total weight used)
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
}

module.exports = {
    calculateScore,
    combinedScore,
    affordabilityScore,
    careerMatchScore,
    calculateOverallScore
};
