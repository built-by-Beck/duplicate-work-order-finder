# Location Mapping System

This directory contains utilities for mapping building names and searching work orders based on location.

## Overview

The location mapping system provides comprehensive handling of building name variations and aliases to enable accurate duplicate work order detection. It accounts for:

- Multiple names for the same building (e.g., "WMP", "Womens Medical Plaza", "MOB A", "Building A")
- Parent-child location relationships (e.g., "North Tower" is inside "Main Hospital")
- Normalized building name lookups for consistent comparisons

## Files

### `locationMapping.js`

Core location mapping functionality that provides:

- **Building mappings**: Complete list of all buildings with their aliases
- **Normalization functions**: Convert any building name to its canonical form
- **Comparison functions**: Check if two building names refer to the same location
- **Relationship functions**: Handle parent-child location relationships

#### Key Functions

- `normalizeBuildingName(buildingName)` - Converts any building name/alias to canonical form
- `areSameBuilding(building1, building2)` - Checks if two names refer to same building
- `getBuildingAliases(buildingName)` - Gets all known aliases for a building
- `getParentLocation(buildingName)` - Gets parent location if building is a sub-location
- `areRelatedBuildings(building1, building2)` - Checks if buildings are related (same or parent-child)
- `getAllBuildings()` - Returns list of all canonical building names

### `workOrderSearch.js`

Work order search and comparison utilities that use the location mapping system:

#### Key Functions

- `findDuplicateWorkOrders(targetWorkOrder, workOrderList, options)` - Finds potential duplicate work orders
- `groupWorkOrdersByLocation(workOrderList)` - Groups work orders by normalized location
- `findWorkOrdersByLocation(workOrderList, locationName)` - Finds all work orders for a specific location
- `compareWorkOrderLocations(workOrder1, workOrder2, options)` - Compares locations of two work orders

## Building List

The system currently maps these buildings:

1. **MOB A** (Main Office Building A / Women's Medical Plaza / WMP)
2. **MOB B** (Main Office Building B / Ambulatory Care Center / ACC)
3. **MOB C** (Main Office Building C / Professional Office Building / POB)
4. **MOB D** (Main Office Building D / Brookwood Medical Plaza / BMP)
5. **MOB D Parking Deck**
6. **WMC** (Women's Medical Center)
7. **Main Hospital** (includes North Tower and Psych/Mental Health Center)
   - **North Tower** (sub-location)
   - **Psych** (Mental Health Center - sub-location)
8. **Visitor Parking Deck**
9. **Employee Parking Deck**
10. **FED** (Freestanding Emergency Department - Highway 280 location)

## Adding New Buildings or Aliases

To add a new building or alias, edit `locationMapping.js` and add a new entry in the `LOCATION_MAPPINGS` object following the existing format:

```javascript
'NEW_BUILDING_KEY': {
  canonical: 'Official Building Name',
  parentLocation: 'PARENT_KEY', // Optional: if this is a sub-location
  aliases: [
    'Official Building Name',
    'Abbreviation',
    'Alternative Name 1',
    'Alternative Name 2'
    // Add more aliases as needed
  ]
}
```

Look for the comment section marked "ADD NEW LOCATION MAPPINGS BELOW THIS LINE" in the file.

## Usage Examples

See `src/examples/usageExample.js` for comprehensive examples of:

- Normalizing building names
- Checking if buildings are the same
- Finding duplicate work orders
- Grouping work orders by location
- Handling parent-child relationships
- And more...

To run the examples:

```bash
node src/examples/usageExample.js
```

## Integration

To use these utilities in your React components:

```javascript
import { 
  normalizeBuildingName, 
  areSameBuilding 
} from './utils/locationMapping';

import { 
  findDuplicateWorkOrders 
} from './utils/workOrderSearch';

// In your component
const checkDuplicates = (workOrder, allWorkOrders) => {
  const duplicates = findDuplicateWorkOrders(workOrder, allWorkOrders);
  return duplicates;
};
```
