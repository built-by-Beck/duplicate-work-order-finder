/**
 * Usage Examples for Location Mapping and Work Order Search
 * 
 * This file demonstrates how to use the location mapping and search utilities
 * to find duplicate work orders and normalize building names.
 */

const {
  normalizeBuildingName,
  areSameBuilding,
  getBuildingAliases,
  getParentLocation,
  areRelatedBuildings,
  getAllBuildings
} = require('../utils/locationMapping');

const {
  findDuplicateWorkOrders,
  groupWorkOrdersByLocation,
  findWorkOrdersByLocation,
  compareWorkOrderLocations
} = require('../utils/workOrderSearch');

// ========================================
// EXAMPLE 1: Normalizing Building Names
// ========================================
console.log('=== Example 1: Normalizing Building Names ===\n');

// Different ways people might refer to the same building
const buildingVariations = [
  'WMP',
  'Womens Medical Plaza',
  'MOB A',
  'Building A',
  'Office Building A'
];

console.log('All these names refer to the same building:');
buildingVariations.forEach(name => {
  const normalized = normalizeBuildingName(name);
  console.log(`  "${name}" → "${normalized}"`);
});

console.log('\n');

// ========================================
// EXAMPLE 2: Checking if Buildings are Same
// ========================================
console.log('=== Example 2: Checking if Buildings are Same ===\n');

console.log('Is "ACC" the same as "MOB B"?', areSameBuilding('ACC', 'MOB B')); // true
console.log('Is "BMP" the same as "Building D"?', areSameBuilding('BMP', 'Building D')); // true
console.log('Is "POB" the same as "WMP"?', areSameBuilding('POB', 'WMP')); // false

console.log('\n');

// ========================================
// EXAMPLE 3: Getting Building Aliases
// ========================================
console.log('=== Example 3: Getting All Aliases for a Building ===\n');

const aliases = getBuildingAliases('ACC');
console.log('All aliases for "ACC" (Ambulatory Care Center):');
aliases.forEach(alias => console.log(`  - ${alias}`));

console.log('\n');

// ========================================
// EXAMPLE 4: Parent-Child Relationships
// ========================================
console.log('=== Example 4: Parent-Child Relationships ===\n');

console.log('Parent of "North Tower":', getParentLocation('North Tower'));
console.log('Parent of "Psych":', getParentLocation('Psych'));
console.log('Parent of "MOB A":', getParentLocation('MOB A')); // null (no parent)

console.log('\nAre "North Tower" and "Main Hospital" related?', 
  areRelatedBuildings('North Tower', 'Main Hospital')); // true

console.log('\n');

// ========================================
// EXAMPLE 5: Working with Work Orders
// ========================================
console.log('=== Example 5: Finding Duplicate Work Orders ===\n');

// Sample work orders with different location naming conventions
const sampleWorkOrders = [
  { id: 1, location: 'WMP', description: 'Fix leaky faucet', priority: 'Medium' },
  { id: 2, location: 'Womens Medical Plaza', description: 'Repair door', priority: 'Low' },
  { id: 3, location: 'MOB A', description: 'HVAC issue', priority: 'High' },
  { id: 4, location: 'ACC', description: 'Electrical problem', priority: 'High' },
  { id: 5, location: 'MOB B', description: 'Lighting repair', priority: 'Low' },
  { id: 6, location: 'North Tower', description: 'Plumbing issue', priority: 'Medium' },
  { id: 7, location: 'Main Hospital', description: 'Door repair', priority: 'Low' },
  { id: 8, location: 'BMP', description: 'Window repair', priority: 'Medium' },
  { id: 9, location: 'Building D', description: 'Paint touch-up', priority: 'Low' }
];

// Find duplicates for a work order in "Building A"
const targetWorkOrder = { id: 10, location: 'Building A', description: 'Water leak', priority: 'High' };

const duplicates = findDuplicateWorkOrders(targetWorkOrder, sampleWorkOrders);

console.log(`Finding duplicates for work order at "${targetWorkOrder.location}":`);
console.log(`Found ${duplicates.length} work orders in the same building:\n`);

duplicates.forEach(({ workOrder, matchDetails }) => {
  console.log(`  ID: ${workOrder.id}`);
  console.log(`  Location: ${workOrder.location} → ${matchDetails.location2}`);
  console.log(`  Description: ${workOrder.description}`);
  console.log(`  Match Type: ${matchDetails.matchType}`);
  console.log('');
});

// ========================================
// EXAMPLE 6: Grouping Work Orders by Location
// ========================================
console.log('=== Example 6: Grouping Work Orders by Location ===\n');

const groupedWorkOrders = groupWorkOrdersByLocation(sampleWorkOrders);

console.log('Work orders grouped by normalized location:');
for (const [location, orders] of Object.entries(groupedWorkOrders)) {
  console.log(`\n${location} (${orders.length} work orders):`);
  orders.forEach(order => {
    console.log(`  - ID ${order.id}: ${order.description} (original: "${order.location}")`);
  });
}

console.log('\n');

// ========================================
// EXAMPLE 7: Finding Work Orders by Location
// ========================================
console.log('=== Example 7: Finding Work Orders by Location ===\n');

// Search using an alias
const pobWorkOrders = findWorkOrdersByLocation(sampleWorkOrders, 'POB');
console.log(`Work orders in "POB" (Professional Office Building / MOB C): ${pobWorkOrders.length}`);

// Search using another alias for the same building
const mobCWorkOrders = findWorkOrdersByLocation(sampleWorkOrders, 'MOB C');
console.log(`Work orders in "MOB C": ${mobCWorkOrders.length}`);

console.log('\n');

// ========================================
// EXAMPLE 8: Comparing Work Order Locations
// ========================================
console.log('=== Example 8: Comparing Work Order Locations ===\n');

const order1 = { location: 'Brookwood Medical Plaza' };
const order2 = { location: 'Building D' };
const order3 = { location: 'ACC' };

const comparison1 = compareWorkOrderLocations(order1, order2);
console.log('Comparing "Brookwood Medical Plaza" vs "Building D":');
console.log(`  Match: ${comparison1.isMatch}`);
console.log(`  Reason: ${comparison1.reason}`);

const comparison2 = compareWorkOrderLocations(order1, order3);
console.log('\nComparing "Brookwood Medical Plaza" vs "ACC":');
console.log(`  Match: ${comparison2.isMatch}`);
console.log(`  Reason: ${comparison2.reason}`);

console.log('\n');

// ========================================
// EXAMPLE 9: Parent-Child Location Matching
// ========================================
console.log('=== Example 9: Parent-Child Location Matching ===\n');

const mainOrder = { location: 'Main Hospital' };
const northTowerOrder = { location: 'North Tower' };

const relatedComparison = compareWorkOrderLocations(mainOrder, northTowerOrder);
console.log('Comparing "Main Hospital" vs "North Tower":');
console.log(`  Match: ${relatedComparison.isMatch}`);
console.log(`  Match Type: ${relatedComparison.matchType}`);
console.log(`  Reason: ${relatedComparison.reason}`);

console.log('\n');

// ========================================
// EXAMPLE 10: List All Buildings
// ========================================
console.log('=== Example 10: List All Buildings ===\n');

const allBuildings = getAllBuildings();
console.log('Complete list of all buildings in the system:');
allBuildings.forEach((building, index) => {
  console.log(`  ${index + 1}. ${building}`);
});

console.log('\n');
console.log('=== Examples Complete ===');
