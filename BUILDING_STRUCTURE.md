# Building Structure and Relationships

## Building Hierarchy

This diagram shows all buildings and their relationships:

```
Main Campus (On-Site)
├── MOB A / WMP / Women's Medical Plaza / Building A / Office Building A
│   └── (standalone building)
│
├── MOB B / ACC / Ambulatory Care Center / Building B / Office Building B
│   └── (standalone building)
│
├── MOB C / POB / Professional Office Building / Building C / Office Building C
│   └── (standalone building)
│
├── MOB D / BMP / Brookwood Medical Plaza / Building D / Office Building D
│   └── (standalone building)
│
├── MOB D Parking Deck
│   └── (parking structure for MOB D)
│
├── WMC / Women's Medical Center
│   └── (standalone building)
│
├── Main Hospital
│   ├── Main Hospital (main section)
│   ├── North Tower (sub-location inside Main Hospital)
│   └── Psych / Mental Health Center (sub-location inside Main Hospital)
│
├── Visitor Parking Deck
│   └── (parking structure)
│
└── Employee Parking Deck
    └── (parking structure)

Off-Site Location
└── FED / Freestanding Emergency Department
    └── Highway 280 / Hwy 280 / HWY 280 location
```

## Building Alias Reference Chart

### MOB A (Building A)
| Alias | Type |
|-------|------|
| MOB A | Official |
| WMP | Abbreviation |
| Women's Medical Plaza | Full Name |
| Womens Medical Plaza | Alt Spelling |
| Building A | Common Name |
| Office Building A | Common Name |
| Main Office Building A | Full Official |

### MOB B (Building B)
| Alias | Type |
|-------|------|
| MOB B | Official |
| ACC | Abbreviation |
| Ambulatory Care Center | Full Name |
| Building B | Common Name |
| Office Building B | Common Name |
| Main Office Building B | Full Official |

### MOB C (Building C)
| Alias | Type |
|-------|------|
| MOB C | Official |
| POB | Abbreviation |
| Professional Office Building | Full Name |
| Building C | Common Name |
| Office Building C | Common Name |
| Main Office Building C | Full Official |

### MOB D (Building D)
| Alias | Type |
|-------|------|
| MOB D | Official |
| BMP | Abbreviation |
| Brookwood Medical Plaza | Full Name |
| Building D | Common Name |
| Office Building D | Common Name |
| Main Office Building D | Full Official |

### Main Hospital Complex
| Location | Parent | Aliases |
|----------|--------|---------|
| Main Hospital | None | Main, Hospital, Main Building |
| North Tower | Main Hospital | North, NT, Main Hospital North Tower |
| Psych | Main Hospital | Mental Health Center, MHC, Psychiatric Center |

### Other Locations
| Building | Type | Aliases |
|----------|------|---------|
| WMC | Standalone | Women's Medical Center, Womens Medical Center |
| FED | Off-Site | Freestanding Emergency Department, Highway 280, Hwy 280 |
| Visitor Parking Deck | Parking | Visitor Parking, Visitor Deck |
| Employee Parking Deck | Parking | Employee Parking, Staff Parking |
| MOB D Parking Deck | Parking | MOB D Parking, BMP Parking |

## Location Counts

- **Main Buildings**: 8 (7 on-site + 1 off-site)
- **Sub-Locations**: 2 (North Tower, Psych - both inside Main Hospital)
- **Parking Structures**: 3 (Visitor, Employee, MOB D)
- **Total Distinct Locations**: 12

## Understanding the Mapping

### Scenario 1: Different Names, Same Building
```
Work Order 1: Location = "WMP"
Work Order 2: Location = "Building A"
Work Order 3: Location = "Womens Medical Plaza"

→ All THREE are at MOB A (same building)
```

### Scenario 2: Parent-Child Relationships
```
Work Order 1: Location = "North Tower"
Work Order 2: Location = "Main Hospital"

→ North Tower is INSIDE Main Hospital (related locations)
```

### Scenario 3: Completely Different Buildings
```
Work Order 1: Location = "ACC"
Work Order 2: Location = "POB"

→ ACC is MOB B, POB is MOB C (different buildings)
```

## Search Behavior

### Exact Match Mode
- "WMP" matches "Building A" ✓ (same building)
- "North Tower" matches "Main Hospital" ✗ (different levels)

### Related Match Mode (default)
- "WMP" matches "Building A" ✓ (same building)
- "North Tower" matches "Main Hospital" ✓ (parent-child)

## Quick Reference: Finding Building by Abbreviation

| Looking For | It's Actually | Key |
|-------------|---------------|-----|
| WMP | MOB A | MOB_A |
| ACC | MOB B | MOB_B |
| POB | MOB C | MOB_C |
| BMP | MOB D | MOB_D |
| WMC | Women's Medical Center | WMC |
| FED | Freestanding Emergency Dept | FED |
| NT | North Tower | NORTH_TOWER |
| MHC | Psych / Mental Health | PSYCH |

## Usage in Code

```javascript
// All these return the same canonical name "MOB A":
normalizeBuildingName("WMP");
normalizeBuildingName("Building A");
normalizeBuildingName("Womens Medical Plaza");

// These are the same building:
areSameBuilding("ACC", "MOB B"); // true
areSameBuilding("BMP", "Building D"); // true

// These are related (parent-child):
areRelatedBuildings("North Tower", "Main Hospital"); // true
getParentLocation("North Tower"); // returns "Main Hospital"
```
