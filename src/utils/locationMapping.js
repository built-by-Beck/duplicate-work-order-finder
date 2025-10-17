/**
 * Location Mapping System for Duplicate Work Order Finder
 * 
 * This module provides comprehensive mapping of building names and their aliases
 * to enable accurate duplicate work order detection across different naming conventions.
 */

/**
 * Building location mappings with all known aliases
 * Each entry maps various building names to a canonical building identifier
 */
const LOCATION_MAPPINGS = {
  // MOB A (Main Office Building A / Women's Medical Plaza)
  'MOB_A': {
    canonical: 'MOB A',
    aliases: [
      'MOB A',
      'MOB-A',
      'MOBA',
      'Main Office Building A',
      'Office Building A',
      'Building A',
      'WMP',
      'Womens Medical Plaza',
      "Women's Medical Plaza",
      'Womens Med Plaza',
      "Women's Med Plaza"
    ]
  },

  // MOB B (Main Office Building B / Ambulatory Care Center)
  'MOB_B': {
    canonical: 'MOB B',
    aliases: [
      'MOB B',
      'MOB-B',
      'MOBB',
      'Main Office Building B',
      'Office Building B',
      'Building B',
      'ACC',
      'Ambulatory Care Center',
      'Ambulatory Care Ctr'
    ]
  },

  // MOB C (Main Office Building C / Professional Office Building)
  'MOB_C': {
    canonical: 'MOB C',
    aliases: [
      'MOB C',
      'MOB-C',
      'MOBC',
      'Main Office Building C',
      'Office Building C',
      'Building C',
      'POB',
      'Professional Office Building',
      'Professional Office Bldg'
    ]
  },

  // MOB D (Main Office Building D / Brookwood Medical Plaza)
  'MOB_D': {
    canonical: 'MOB D',
    aliases: [
      'MOB D',
      'MOB-D',
      'MOBD',
      'Main Office Building D',
      'Office Building D',
      'Building D',
      'BMP',
      'Brookwood Medical Plaza',
      'Brookwood Med Plaza'
    ]
  },

  // MOB D Parking Deck
  'MOB_D_PARKING': {
    canonical: 'MOB D Parking Deck',
    aliases: [
      'MOB D Parking Deck',
      'MOB D Parking',
      'MOB-D Parking Deck',
      'MOB-D Parking',
      'MOBD Parking Deck',
      'MOBD Parking',
      'Building D Parking Deck',
      'Building D Parking',
      'BMP Parking Deck',
      'BMP Parking',
      'Brookwood Medical Plaza Parking Deck',
      'Brookwood Medical Plaza Parking'
    ]
  },

  // WMC (Women's Medical Center)
  'WMC': {
    canonical: 'WMC',
    aliases: [
      'WMC',
      "Women's Medical Center",
      'Womens Medical Center',
      'Women Medical Center',
      'Womens Med Center',
      "Women's Med Center"
    ]
  },

  // Main Hospital (includes North Tower and Psych/Mental Health Center)
  'MAIN_HOSPITAL': {
    canonical: 'Main Hospital',
    aliases: [
      'Main Hospital',
      'Main',
      'Hospital',
      'Main Building'
    ]
  },

  // North Tower (part of Main Hospital)
  'NORTH_TOWER': {
    canonical: 'North Tower',
    parentLocation: 'MAIN_HOSPITAL',
    aliases: [
      'North Tower',
      'North',
      'NT',
      'Main Hospital North Tower',
      'Main North Tower'
    ]
  },

  // Psych / Mental Health Center (part of Main Hospital)
  'PSYCH': {
    canonical: 'Psych',
    parentLocation: 'MAIN_HOSPITAL',
    aliases: [
      'Psych',
      'Mental Health Center',
      'Mental Health',
      'MHC',
      'Psych Center',
      'Psychiatric Center',
      'Main Hospital Psych',
      'Main Psych'
    ]
  },

  // Visitor Parking Deck
  'VISITOR_PARKING': {
    canonical: 'Visitor Parking Deck',
    aliases: [
      'Visitor Parking Deck',
      'Visitor Parking',
      'Visitor Deck',
      'Visitors Parking Deck',
      'Visitors Parking'
    ]
  },

  // Employee Parking Deck
  'EMPLOYEE_PARKING': {
    canonical: 'Employee Parking Deck',
    aliases: [
      'Employee Parking Deck',
      'Employee Parking',
      'Employee Deck',
      'Employees Parking Deck',
      'Employees Parking',
      'Staff Parking Deck',
      'Staff Parking'
    ]
  },

  // FED (Freestanding Emergency Department - Highway 280 location)
  'FED': {
    canonical: 'FED',
    aliases: [
      'FED',
      'Freestanding Emergency Department',
      'Freestanding ED',
      'Free Standing Emergency Department',
      'Free Standing ED',
      'Highway 280',
      'Hwy 280',
      'HWY 280',
      '280 Location',
      'FED 280'
    ]
  }

  /**
   * ==================================================
   * ADD NEW LOCATION MAPPINGS BELOW THIS LINE
   * ==================================================
   * 
   * To add a new location or alias, follow this format:
   * 
   * 'LOCATION_KEY': {
   *   canonical: 'Official Building Name',
   *   parentLocation: 'PARENT_KEY', // Optional: if this is a sub-location
   *   aliases: [
   *     'Building Name Variation 1',
   *     'Building Name Variation 2',
   *     'Abbreviation',
   *     // Add more aliases as needed
   *   ]
   * }
   * 
   * Example:
   * 'NEW_BUILDING': {
   *   canonical: 'New Building',
   *   aliases: [
   *     'New Building',
   *     'NB',
   *     'New Bldg',
   *     'The New Building'
   *   ]
   * }
   * 
   * ==================================================
   */
};

/**
 * Creates a reverse lookup map from aliases to canonical building identifiers
 * This enables fast O(1) lookup when normalizing building names
 * 
 * @returns {Map} Map of lowercase alias to building key
 */
function createAliasLookupMap() {
  const aliasMap = new Map();
  
  for (const [buildingKey, buildingData] of Object.entries(LOCATION_MAPPINGS)) {
    // Add canonical name
    aliasMap.set(buildingData.canonical.toLowerCase(), buildingKey);
    
    // Add all aliases
    buildingData.aliases.forEach(alias => {
      aliasMap.set(alias.toLowerCase(), buildingKey);
    });
  }
  
  return aliasMap;
}

// Initialize the alias lookup map
const ALIAS_LOOKUP_MAP = createAliasLookupMap();

/**
 * Normalizes a building name to its canonical form
 * 
 * @param {string} buildingName - The building name to normalize (can be any alias)
 * @returns {string|null} - The canonical building name, or null if not found
 */
function normalizeBuildingName(buildingName) {
  if (!buildingName || typeof buildingName !== 'string') {
    return null;
  }
  
  // Clean and normalize the input
  const cleanedName = buildingName.trim();
  const lookupKey = cleanedName.toLowerCase();
  
  // Look up the building key
  const buildingKey = ALIAS_LOOKUP_MAP.get(lookupKey);
  
  if (!buildingKey) {
    return null;
  }
  
  // Return the canonical name
  return LOCATION_MAPPINGS[buildingKey].canonical;
}

/**
 * Gets the building key for a given building name
 * 
 * @param {string} buildingName - The building name (can be any alias)
 * @returns {string|null} - The building key, or null if not found
 */
function getBuildingKey(buildingName) {
  if (!buildingName || typeof buildingName !== 'string') {
    return null;
  }
  
  const cleanedName = buildingName.trim();
  const lookupKey = cleanedName.toLowerCase();
  
  return ALIAS_LOOKUP_MAP.get(lookupKey) || null;
}

/**
 * Checks if two building names refer to the same building
 * 
 * @param {string} building1 - First building name
 * @param {string} building2 - Second building name
 * @returns {boolean} - True if both refer to the same building, false otherwise
 */
function areSameBuilding(building1, building2) {
  const key1 = getBuildingKey(building1);
  const key2 = getBuildingKey(building2);
  
  if (!key1 || !key2) {
    return false;
  }
  
  return key1 === key2;
}

/**
 * Gets all known aliases for a given building name
 * 
 * @param {string} buildingName - The building name (can be any alias)
 * @returns {Array<string>} - Array of all aliases for the building, or empty array if not found
 */
function getBuildingAliases(buildingName) {
  const buildingKey = getBuildingKey(buildingName);
  
  if (!buildingKey) {
    return [];
  }
  
  return [...LOCATION_MAPPINGS[buildingKey].aliases];
}

/**
 * Gets the parent location of a building (if it's a sub-location)
 * 
 * @param {string} buildingName - The building name (can be any alias)
 * @returns {string|null} - The canonical name of the parent location, or null if no parent
 */
function getParentLocation(buildingName) {
  const buildingKey = getBuildingKey(buildingName);
  
  if (!buildingKey) {
    return null;
  }
  
  const buildingData = LOCATION_MAPPINGS[buildingKey];
  
  if (!buildingData.parentLocation) {
    return null;
  }
  
  return LOCATION_MAPPINGS[buildingData.parentLocation].canonical;
}

/**
 * Checks if a building is related to another building (same building or parent-child relationship)
 * 
 * @param {string} building1 - First building name
 * @param {string} building2 - Second building name
 * @returns {boolean} - True if buildings are related, false otherwise
 */
function areRelatedBuildings(building1, building2) {
  // Check if they are the same building
  if (areSameBuilding(building1, building2)) {
    return true;
  }
  
  const key1 = getBuildingKey(building1);
  const key2 = getBuildingKey(building2);
  
  if (!key1 || !key2) {
    return false;
  }
  
  const data1 = LOCATION_MAPPINGS[key1];
  const data2 = LOCATION_MAPPINGS[key2];
  
  // Check if building1 is a parent of building2
  if (data2.parentLocation === key1) {
    return true;
  }
  
  // Check if building2 is a parent of building1
  if (data1.parentLocation === key2) {
    return true;
  }
  
  return false;
}

/**
 * Gets a list of all canonical building names
 * 
 * @returns {Array<string>} - Array of all canonical building names
 */
function getAllBuildings() {
  return Object.values(LOCATION_MAPPINGS).map(data => data.canonical);
}

// Export functions and data
module.exports = {
  LOCATION_MAPPINGS,
  normalizeBuildingName,
  getBuildingKey,
  areSameBuilding,
  getBuildingAliases,
  getParentLocation,
  areRelatedBuildings,
  getAllBuildings
};
