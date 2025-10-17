# Duplicate Work Order Finder

React.js web app that will find duplicate work orders... hopefully!

## Overview

This application helps identify potential duplicate work orders by intelligently matching building locations, even when different naming conventions are used.

## Key Features

### Location Mapping System

The app includes a comprehensive location mapping system that:

- **Normalizes building names**: Converts any building name variation to a standard format
- **Handles aliases**: Recognizes that "WMP", "Womens Medical Plaza", "MOB A", and "Building A" all refer to the same location
- **Manages relationships**: Understands that "North Tower" and "Psych" are part of "Main Hospital"
- **Enables accurate searching**: Finds duplicate work orders even when different building names are used

### Supported Buildings

The system currently supports 8 main buildings (7 on-site + 1 off-site):

1. **MOB A** / WMP (Women's Medical Plaza) / Building A
2. **MOB B** / ACC (Ambulatory Care Center) / Building B
3. **MOB C** / POB (Professional Office Building) / Building C
4. **MOB D** / BMP (Brookwood Medical Plaza) / Building D
5. **MOB D Parking Deck**
6. **WMC** (Women's Medical Center)
7. **Main Hospital** (includes North Tower and Psych/Mental Health Center)
8. **Visitor Parking Deck**
9. **Employee Parking Deck**
10. **FED** (Freestanding Emergency Department - Highway 280)

## Project Structure

```
src/
├── utils/
│   ├── locationMapping.js      # Core location mapping and normalization
│   ├── workOrderSearch.js      # Search and duplicate detection logic
│   └── README.md               # Detailed documentation for utilities
├── examples/
│   └── usageExample.js         # Example usage and demonstrations
```

## Getting Started

### Installation

```bash
npm install
```

### Running Examples

To see the location mapping and search utilities in action:

```bash
node src/examples/usageExample.js
```

### Adding New Buildings or Aliases

To add new building names or aliases, edit `src/utils/locationMapping.js` and add entries in the marked section. See `src/utils/README.md` for detailed instructions.

## Usage

### Normalizing Building Names

```javascript
const { normalizeBuildingName } = require('./src/utils/locationMapping');

// All return "MOB A"
normalizeBuildingName('WMP');
normalizeBuildingName('Womens Medical Plaza');
normalizeBuildingName('Building A');
normalizeBuildingName('MOB A');
```

### Finding Duplicate Work Orders

```javascript
const { findDuplicateWorkOrders } = require('./src/utils/workOrderSearch');

const workOrder = { id: 1, location: 'Building A', description: 'Fix door' };
const allWorkOrders = [
  { id: 2, location: 'WMP', description: 'Repair lock' },
  { id: 3, location: 'MOB B', description: 'Fix window' }
];

const duplicates = findDuplicateWorkOrders(workOrder, allWorkOrders);
// Returns work order #2 because "Building A" and "WMP" are the same location
```

## Documentation

For detailed documentation on the location mapping system and search utilities, see:

- `src/utils/README.md` - Complete utility documentation
- `src/examples/usageExample.js` - Working examples and demonstrations  
