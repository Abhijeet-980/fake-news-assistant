/**
 * Date Analyzer Module
 * Extracts dates from content and checks for outdated information
 */

/**
 * Extract dates from text content
 * Supports multiple date formats
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of extracted dates
 */
function extractDates(text) {
    const dates = [];

    // Pattern 1: "December 27, 2024" or "Dec 27, 2024"
    const pattern1 = /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi;

    // Pattern 2: "27 December 2024" or "27 Dec 2024"
    const pattern2 = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\b/gi;

    // Pattern 3: "2024-12-27" (ISO format)
    const pattern3 = /\b(\d{4})-(\d{2})-(\d{2})\b/g;

    // Pattern 4: "12/27/2024" or "27/12/2024"
    const pattern4 = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;

    // Pattern 5: Relative dates with years - "in 2020", "back in 2019"
    const pattern5 = /\b(?:in|from|since|during)\s+(\d{4})\b/gi;

    // Pattern 6: Year mentions - "2020 report", "2019 study"
    const pattern6 = /\b(20[0-2]\d)\s+(?:report|study|article|news|data|research|survey)\b/gi;

    const monthMap = {
        'jan': 0, 'january': 0,
        'feb': 1, 'february': 1,
        'mar': 2, 'march': 2,
        'apr': 3, 'april': 3,
        'may': 4,
        'jun': 5, 'june': 5,
        'jul': 6, 'july': 6,
        'aug': 7, 'august': 7,
        'sep': 8, 'september': 8,
        'oct': 9, 'october': 9,
        'nov': 10, 'november': 10,
        'dec': 11, 'december': 11
    };

    let match;

    // Extract Pattern 1: "December 27, 2024"
    while ((match = pattern1.exec(text)) !== null) {
        const month = monthMap[match[1].toLowerCase().substring(0, 3)];
        const day = parseInt(match[2]);
        const year = parseInt(match[3]);
        if (month !== undefined && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
            dates.push(new Date(year, month, day));
        }
    }

    // Extract Pattern 2: "27 December 2024"
    while ((match = pattern2.exec(text)) !== null) {
        const day = parseInt(match[1]);
        const month = monthMap[match[2].toLowerCase().substring(0, 3)];
        const year = parseInt(match[3]);
        if (month !== undefined && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
            dates.push(new Date(year, month, day));
        }
    }

    // Extract Pattern 3: "2024-12-27"
    while ((match = pattern3.exec(text)) !== null) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        if (year >= 1900 && year <= 2100 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            dates.push(new Date(year, month, day));
        }
    }

    // Extract Pattern 4: "12/27/2024" (assuming MM/DD/YYYY for US format)
    while ((match = pattern4.exec(text)) !== null) {
        const first = parseInt(match[1]);
        const second = parseInt(match[2]);
        const year = parseInt(match[3]);
        if (year >= 1900 && year <= 2100) {
            // Try MM/DD/YYYY first
            if (first <= 12 && second <= 31) {
                dates.push(new Date(year, first - 1, second));
            }
            // Try DD/MM/YYYY
            else if (second <= 12 && first <= 31) {
                dates.push(new Date(year, second - 1, first));
            }
        }
    }

    // Extract Pattern 5 & 6: Year mentions
    while ((match = pattern5.exec(text)) !== null) {
        const year = parseInt(match[1]);
        if (year >= 1900 && year <= 2100) {
            dates.push(new Date(year, 6, 1)); // Mid-year estimate
        }
    }

    while ((match = pattern6.exec(text)) !== null) {
        const year = parseInt(match[1]);
        if (year >= 1900 && year <= 2100) {
            dates.push(new Date(year, 6, 1)); // Mid-year estimate
        }
    }

    return dates;
}

/**
 * Calculate age of content in days
 * @param {Date} date - Date to check
 * @returns {number} - Age in days
 */
function getAgeInDays(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format age as human readable string
 * @param {number} days - Age in days
 * @returns {string} - Human readable age
 */
function formatAge(days) {
    if (days < 1) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

/**
 * Analyze content for date/age issues
 * @param {string} text - Text to analyze
 * @returns {Object} - Date analysis result
 */
function analyzeDateRelevance(text) {
    const extractedDates = extractDates(text);
    const now = new Date();

    const result = {
        datesFound: extractedDates.length,
        dates: [],
        oldestDate: null,
        newestDate: null,
        ageInDays: null,
        isOutdated: false,
        isVeryOld: false,
        score: 0, // Bonus/penalty score
        reason: null
    };

    if (extractedDates.length === 0) {
        result.reason = {
            type: 'info',
            title: 'No Publication Date Found',
            description: 'No dates were detected in the content. Consider checking when this was originally published.'
        };
        return result;
    }

    // Sort dates
    const sortedDates = extractedDates.sort((a, b) => a - b);
    result.oldestDate = sortedDates[0];
    result.newestDate = sortedDates[sortedDates.length - 1];

    // Convert dates to readable format
    result.dates = sortedDates.map(d => ({
        date: d.toISOString().split('T')[0],
        ageInDays: getAgeInDays(d),
        humanAge: formatAge(getAgeInDays(d))
    }));

    // Calculate age based on newest date (likely publication date)
    const newestAge = getAgeInDays(result.newestDate);
    const oldestAge = getAgeInDays(result.oldestDate);
    result.ageInDays = newestAge;

    // Check if content is outdated
    if (oldestAge > 365 * 2) {
        // Content references something 2+ years old
        result.isVeryOld = true;
        result.score = -10; // Penalty for very old content
        result.reason = {
            type: 'warning',
            title: 'Outdated Content Detected',
            description: `This content references information from ${formatAge(oldestAge)}. Verify if the information is still current and relevant.`
        };
    } else if (oldestAge > 365) {
        // Content is over 1 year old
        result.isOutdated = true;
        result.score = -5; // Small penalty
        result.reason = {
            type: 'warning',
            title: 'Older Content',
            description: `This content appears to be from ${formatAge(oldestAge)}. Check if more recent information is available.`
        };
    } else if (newestAge <= 7) {
        // Very recent content
        result.score = 5; // Bonus for fresh content
        result.reason = {
            type: 'positive',
            title: 'Recent Publication',
            description: `This content appears to be from ${formatAge(newestAge)}, suggesting it contains current information.`
        };
    } else if (newestAge <= 30) {
        // Recent content (within a month)
        result.score = 3;
        result.reason = {
            type: 'positive',
            title: 'Recent Content',
            description: `Published approximately ${formatAge(newestAge)}. The information should be relatively current.`
        };
    } else {
        // Content is a few months old
        result.reason = {
            type: 'info',
            title: 'Content Age',
            description: `This content appears to be from ${formatAge(newestAge)}. Consider whether the topic requires more recent updates.`
        };
    }

    return result;
}

module.exports = {
    extractDates,
    getAgeInDays,
    formatAge,
    analyzeDateRelevance
};
