/**
 * Work Order Search Utilities
 * 
 * This module provides search and comparison functionality for work orders,
 * utilizing the location mapping system to identify potential duplicates
 * even when different building name variations are used.
 */

const {
  normalizeBuildingName,
  areSameBuilding,
  areRelatedBuildings
} = require('./locationMapping');

/**
 * Extracts building/location information from a work order
 * 
 * @param {Object} workOrder - Work order object
 * @param {string} workOrder.location - Location field from work order
 * @returns {string|null} - Normalized building name or null
 */
function extractLocation(workOrder) {
  if (!workOrder || !workOrder.location) {
    return null;
  }
  
  return normalizeBuildingName(workOrder.location);
}

/**
 * Compares two work orders to determine if they might be duplicates
 * based on location matching
 * 
 * @param {Object} workOrder1 - First work order
 * @param {Object} workOrder2 - Second work order
 * @param {Object} options - Comparison options
 * @param {boolean} options.exactLocationOnly - If true, only match exact locations (default: false)
 * @param {boolean} options.includeRelated - If true, also match related locations like parent-child (default: true)
 * @returns {Object} - Comparison result with match status and details
 */
function compareWorkOrderLocations(workOrder1, workOrder2, options = {}) {
  const {
    exactLocationOnly = false,
    includeRelated = true
  } = options;
  
  const location1 = workOrder1?.location;
  const location2 = workOrder2?.location;
  
  if (!location1 || !location2) {
    return {
      isMatch: false,
      reason: 'Missing location information',
      location1: location1 || 'Unknown',
      location2: location2 || 'Unknown'
    };
  }
  
  // Check if locations refer to the same building
  const sameBuilding = areSameBuilding(location1, location2);
  
  if (sameBuilding) {
    return {
      isMatch: true,
      matchType: 'exact',
      reason: 'Same building',
      location1: normalizeBuildingName(location1),
      location2: normalizeBuildingName(location2)
    };
  }
  
  // If exact location only is required, stop here
  if (exactLocationOnly) {
    return {
      isMatch: false,
      reason: 'Different buildings (exact match required)',
      location1: normalizeBuildingName(location1) || location1,
      location2: normalizeBuildingName(location2) || location2
    };
  }
  
  // Check if locations are related (parent-child relationship)
  if (includeRelated && areRelatedBuildings(location1, location2)) {
    return {
      isMatch: true,
      matchType: 'related',
      reason: 'Related buildings (parent-child relationship)',
      location1: normalizeBuildingName(location1) || location1,
      location2: normalizeBuildingName(location2) || location2
    };
  }
  
  // No match found
  return {
    isMatch: false,
    reason: 'Different buildings',
    location1: normalizeBuildingName(location1) || location1,
    location2: normalizeBuildingName(location2) || location2
  };
}

/**
 * Searches for potential duplicate work orders based on location and other criteria
 * 
 * @param {Object} targetWorkOrder - The work order to find duplicates for
 * @param {Array<Object>} workOrderList - List of work orders to search through
 * @param {Object} options - Search options
 * @param {boolean} options.exactLocationOnly - Only match exact locations (default: false)
 * @param {boolean} options.includeRelated - Include related locations in search (default: true)
 * @param {Function} options.additionalFilter - Optional additional filter function
 * @returns {Array<Object>} - Array of potential duplicate work orders with match details
 */
function findDuplicateWorkOrders(targetWorkOrder, workOrderList, options = {}) {
  if (!targetWorkOrder || !Array.isArray(workOrderList)) {
    return [];
  }
  
  const {
    exactLocationOnly = false,
    includeRelated = true,
    additionalFilter = null
  } = options;
  
  const duplicates = [];
  
  for (const workOrder of workOrderList) {
    // Skip if it's the same work order (by ID or reference)
    if (workOrder.id && targetWorkOrder.id && workOrder.id === targetWorkOrder.id) {
      continue;
    }
    
    // Compare locations
    const comparisonResult = compareWorkOrderLocations(
      targetWorkOrder,
      workOrder,
      { exactLocationOnly, includeRelated }
    );
    
    if (comparisonResult.isMatch) {
      // Apply additional filter if provided
      if (additionalFilter && !additionalFilter(targetWorkOrder, workOrder)) {
        continue;
      }
      
      duplicates.push({
        workOrder,
        matchDetails: comparisonResult
      });
    }
  }
  
  return duplicates;
}

/**
 * Groups work orders by normalized location
 * 
 * @param {Array<Object>} workOrderList - List of work orders to group
 * @returns {Object} - Object with normalized location names as keys and arrays of work orders as values
 */
function groupWorkOrdersByLocation(workOrderList) {
  if (!Array.isArray(workOrderList)) {
    return {};
  }
  
  const groups = {};
  
  for (const workOrder of workOrderList) {
    const normalizedLocation = extractLocation(workOrder);
    
    if (!normalizedLocation) {
      // Group unknown locations separately
      if (!groups['Unknown']) {
        groups['Unknown'] = [];
      }
      groups['Unknown'].push(workOrder);
      continue;
    }
    
    if (!groups[normalizedLocation]) {
      groups[normalizedLocation] = [];
    }
    
    groups[normalizedLocation].push(workOrder);
  }
  
  return groups;
}

/**
 * Finds all work orders for a specific location (including aliases)
 * 
 * @param {Array<Object>} workOrderList - List of work orders to search
 * @param {string} locationName - Location name to search for (can be any alias)
 * @returns {Array<Object>} - Array of work orders matching the location
 */
function findWorkOrdersByLocation(workOrderList, locationName) {
  if (!Array.isArray(workOrderList) || !locationName) {
    return [];
  }
  
  const normalizedTarget = normalizeBuildingName(locationName);
  
  if (!normalizedTarget) {
    return [];
  }
  
  return workOrderList.filter(workOrder => {
    const workOrderLocation = extractLocation(workOrder);
    return workOrderLocation === normalizedTarget;
  });
}

// Export functions
module.exports = {
  extractLocation,
  compareWorkOrderLocations,
  findDuplicateWorkOrders,
  groupWorkOrdersByLocation,
  findWorkOrdersByLocation
};
