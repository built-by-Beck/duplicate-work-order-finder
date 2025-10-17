# Quick Start Guide

Get up and running with the Duplicate Work Order Finder location mapping system in 5 minutes!

## Installation

```bash
# Clone the repository
git clone https://github.com/built-by-Beck/duplicate-work-order-finder.git
cd duplicate-work-order-finder

# Install dependencies (when available)
npm install
```

## Running the Examples

```bash
# See the location mapping system in action
node src/examples/usageExample.js
```

## Basic Usage

### 1. Normalize a Building Name

```javascript
const { normalizeBuildingName } = require('./src/utils/locationMapping');

// Convert any building name to its canonical form
const building = normalizeBuildingName('WMP');
console.log(building); // Output: "MOB A"
```

### 2. Check if Two Buildings are the Same

```javascript
const { areSameBuilding } = require('./src/utils/locationMapping');

// Returns true because BMP and Building D are the same
const isSame = areSameBuilding('BMP', 'Building D');
console.log(isSame); // Output: true
```

### 3. Find Duplicate Work Orders

```javascript
const { findDuplicateWorkOrders } = require('./src/utils/workOrderSearch');

const myWorkOrder = {
  id: 1,
  location: 'Building A',
  description: 'Fix leaky faucet'
};

const allWorkOrders = [
  { id: 2, location: 'WMP', description: 'Repair door' },
  { id: 3, location: 'MOB B', description: 'Fix window' }
];

const duplicates = findDuplicateWorkOrders(myWorkOrder, allWorkOrders);
console.log(duplicates);
// Output: [{ workOrder: {...}, matchDetails: {...} }]
```

## Common Building Names Cheat Sheet

| If you see... | It means... |
|---------------|-------------|
| WMP | MOB A |
| ACC | MOB B |
| POB | MOB C |
| BMP | MOB D |
| Building A | MOB A |
| Building B | MOB B |
| Building C | MOB C |
| Building D | MOB D |
| Psych | Mental Health Center (inside Main Hospital) |
| North Tower | Part of Main Hospital |
| FED | Freestanding Emergency Dept (Highway 280) |

## Adding a New Building

1. Open `src/utils/locationMapping.js`
2. Find the comment: `ADD NEW LOCATION MAPPINGS BELOW THIS LINE`
3. Add your building:

```javascript
'MY_NEW_BUILDING': {
  canonical: 'My New Building',
  aliases: [
    'My New Building',
    'MNB',
    'New Bldg'
  ]
}
```

For more details, see [ADDING_LOCATIONS.md](ADDING_LOCATIONS.md)

## File Structure Overview

```
src/
├── utils/
│   ├── locationMapping.js    # Core mapping logic (READ THIS FIRST)
│   ├── workOrderSearch.js    # Search functions
│   └── README.md             # Detailed docs
└── examples/
    └── usageExample.js       # Working examples (RUN THIS FIRST)
```

## Key Functions to Know

### Location Mapping Functions
- `normalizeBuildingName(name)` - Convert any name to canonical form
- `areSameBuilding(name1, name2)` - Check if two names are the same building
- `getBuildingAliases(name)` - Get all aliases for a building
- `getAllBuildings()` - List all buildings

### Work Order Search Functions
- `findDuplicateWorkOrders(workOrder, list)` - Find potential duplicates
- `groupWorkOrdersByLocation(list)` - Group work orders by building
- `findWorkOrdersByLocation(list, location)` - Find all work orders for a building

## Testing Your Code

```javascript
// Quick test
const { normalizeBuildingName } = require('./src/utils/locationMapping');

console.log(normalizeBuildingName('WMP'));           // "MOB A"
console.log(normalizeBuildingName('Building A'));     // "MOB A"
console.log(normalizeBuildingName('ACC'));           // "MOB B"
```

## Need Help?

- **Understanding the mappings**: See [BUILDING_STRUCTURE.md](BUILDING_STRUCTURE.md)
- **Adding locations**: See [ADDING_LOCATIONS.md](ADDING_LOCATIONS.md)
- **Detailed documentation**: See [src/utils/README.md](src/utils/README.md)
- **Implementation details**: See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

## What's Working

✅ All 8 main buildings mapped with aliases  
✅ Sub-locations (North Tower, Psych) properly configured  
✅ Parent-child relationships working  
✅ Duplicate detection functioning  
✅ Examples running successfully  
✅ Documentation complete  

## Next Steps

1. **Run the examples**: `node src/examples/usageExample.js`
2. **Read the docs**: Start with `src/utils/README.md`
3. **Explore the code**: Look at `src/utils/locationMapping.js`
4. **Try it out**: Create your own test cases
5. **Extend it**: Add new buildings as needed

## Quick Example: Complete Flow

```javascript
// Import what you need
const { normalizeBuildingName, areSameBuilding } = require('./src/utils/locationMapping');
const { findDuplicateWorkOrders } = require('./src/utils/workOrderSearch');

// Sample data
const workOrders = [
  { id: 1, location: 'WMP', description: 'Leaky faucet', priority: 'High' },
  { id: 2, location: 'Building A', description: 'Broken door', priority: 'Medium' },
  { id: 3, location: 'ACC', description: 'Light out', priority: 'Low' },
];

// Normalize building names
workOrders.forEach(wo => {
  console.log(`${wo.location} → ${normalizeBuildingName(wo.location)}`);
});

// Find duplicates for a new work order
const newWorkOrder = { id: 4, location: 'Womens Medical Plaza', description: 'Water leak' };
const duplicates = findDuplicateWorkOrders(newWorkOrder, workOrders);

console.log(`Found ${duplicates.length} potential duplicates`);
duplicates.forEach(d => {
  console.log(`- ID ${d.workOrder.id}: ${d.workOrder.description}`);
});
```

That's it! You're ready to start using the location mapping system. 🚀
