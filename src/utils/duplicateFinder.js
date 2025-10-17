import * as fuzz from 'fuzzball';

/**
 * Building aliases mapping
 * Maps common building abbreviations and alternate names
 */
export const buildingAliases = {
  'C': ['POB', 'Office Building C', 'MOB C'],
  'POB': ['C', 'Office Building C', 'MOB C'],
  'Office Building C': ['C', 'POB', 'MOB C'],
  'MOB C': ['C', 'POB', 'Office Building C'],
  // Add more building aliases as needed
  'A': ['Office Building A', 'MOB A'],
  'B': ['Office Building B', 'MOB B'],
};

/**
 * Normalize text by expanding building aliases
 */
export const normalizeWithAliases = (text) => {
  let normalized = text;
  
  // Replace building aliases with a standardized form
  Object.keys(buildingAliases).forEach(key => {
    const aliases = buildingAliases[key];
    const pattern = new RegExp(`\\b${key}\\b`, 'gi');
    // Keep the original and add aliases for better matching
    if (pattern.test(normalized)) {
      normalized = normalized + ' ' + aliases.join(' ');
    }
  });
  
  return normalized;
};

/**
 * Extract location information from work order text
 */
export const extractLocationInfo = (text) => {
  // Common patterns for location information
  const patterns = {
    building: /(?:Office Building|MOB|POB|Building)\s*([A-Z]|\d+)/gi,
    floor: /(\d+)(?:st|nd|rd|th)?\s*floor/gi,
    suite: /suite\s*(\d+)/gi,
    room: /room\s*(\d+)/gi,
  };

  const info = {
    buildings: [],
    floors: [],
    suites: [],
    rooms: [],
    rawText: text,
  };

  // Extract building info
  let match;
  while ((match = patterns.building.exec(text)) !== null) {
    info.buildings.push(match[1].toUpperCase());
  }

  // Extract floor info
  while ((match = patterns.floor.exec(text)) !== null) {
    info.floors.push(match[1]);
  }

  // Extract suite info
  while ((match = patterns.suite.exec(text)) !== null) {
    info.suites.push(match[1]);
  }

  // Extract room info
  while ((match = patterns.room.exec(text)) !== null) {
    info.rooms.push(match[1]);
  }

  return info;
};

/**
 * Compare two location objects for similarity
 */
export const compareLocations = (loc1, loc2) => {
  let score = 0;
  let maxScore = 0;

  // Check building match (including aliases)
  if (loc1.buildings.length > 0 && loc2.buildings.length > 0) {
    maxScore += 40;
    const building1 = loc1.buildings[0];
    const building2 = loc2.buildings[0];
    
    // Direct match
    if (building1 === building2) {
      score += 40;
    } else {
      // Check aliases
      const aliases1 = buildingAliases[building1] || [];
      const aliases2 = buildingAliases[building2] || [];
      
      if (aliases1.includes(building2) || aliases2.includes(building1)) {
        score += 40;
      }
    }
  }

  // Check floor match
  if (loc1.floors.length > 0 && loc2.floors.length > 0) {
    maxScore += 30;
    if (loc1.floors[0] === loc2.floors[0]) {
      score += 30;
    }
  }

  // Check suite match
  if (loc1.suites.length > 0 && loc2.suites.length > 0) {
    maxScore += 30;
    if (loc1.suites[0] === loc2.suites[0]) {
      score += 30;
    }
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0;
};

/**
 * Find duplicate work orders using fuzzy matching
 */
export const findDuplicates = (workOrders, threshold = 70) => {
  const duplicates = [];

  for (let i = 0; i < workOrders.length; i++) {
    for (let j = i + 1; j < workOrders.length; j++) {
      const order1 = workOrders[i];
      const order2 = workOrders[j];

      // Extract location information
      const loc1 = extractLocationInfo(order1.text);
      const loc2 = extractLocationInfo(order2.text);

      // Compare locations structurally
      const locationScore = compareLocations(loc1, loc2);

      // Normalize text with aliases
      const normalizedText1 = normalizeWithAliases(order1.text);
      const normalizedText2 = normalizeWithAliases(order2.text);

      // Use fuzzy string matching
      const fuzzyScore = fuzz.token_set_ratio(normalizedText1, normalizedText2);

      // Combine scores (prioritize location matching)
      const finalScore = locationScore > 0 
        ? (locationScore * 0.6 + fuzzyScore * 0.4)
        : fuzzyScore;

      if (finalScore >= threshold) {
        duplicates.push({
          order1,
          order2,
          score: Math.round(finalScore),
          locationScore: Math.round(locationScore),
          fuzzyScore: Math.round(fuzzyScore),
        });
      }
    }
  }

  // Sort by score descending
  return duplicates.sort((a, b) => b.score - a.score);
};
