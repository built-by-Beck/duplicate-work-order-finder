# Quick Guide: Adding New Buildings or Aliases

This guide shows you how to add new building names or aliases to the location mapping system.

## Steps to Add a New Building

1. Open the file: `src/utils/locationMapping.js`

2. Scroll down to find this comment section:
   ```
   /**
    * ==================================================
    * ADD NEW LOCATION MAPPINGS BELOW THIS LINE
    * ==================================================
   ```

3. Add your new building entry following this template:

```javascript
'YOUR_BUILDING_KEY': {
  canonical: 'Official Building Name',
  aliases: [
    'Official Building Name',
    'Abbreviation',
    'Common Name 1',
    'Common Name 2',
    // Add as many aliases as needed
  ]
}
```

### Example: Adding a Simple Building

Let's say you want to add a new "Outpatient Center" with abbreviation "OPC":

```javascript
'OUTPATIENT_CENTER': {
  canonical: 'Outpatient Center',
  aliases: [
    'Outpatient Center',
    'OPC',
    'Outpatient Ctr',
    'Out Patient Center'
  ]
}
```

### Example: Adding a Sub-Location

If you want to add a building that's inside another building (like North Tower is inside Main Hospital):

```javascript
'EAST_WING': {
  canonical: 'East Wing',
  parentLocation: 'MAIN_HOSPITAL',  // The key of the parent building
  aliases: [
    'East Wing',
    'East',
    'EW',
    'Main Hospital East Wing'
  ]
}
```

## Important Notes

1. **Building Key**: Use UPPERCASE with underscores (e.g., `'MOB_A'`, `'NEW_BUILDING'`)
2. **Canonical Name**: The "official" or most common name for the building
3. **Aliases Array**: Include ALL variations of the building name, including:
   - The canonical name itself
   - Abbreviations
   - Old names
   - Common misspellings
   - Variations with/without punctuation

4. **Parent Location**: Only needed if this building is inside another building. Use the parent's building key.

5. **Commas**: Don't forget the comma at the end of the closing brace `},` (except for the last entry)

## Testing Your Changes

After adding a new building, test it by running:

```bash
node src/examples/usageExample.js
```

Or create your own test:

```javascript
const { normalizeBuildingName, getAllBuildings } = require('./src/utils/locationMapping');

// Test normalization
console.log(normalizeBuildingName('Your New Building Name'));

// Check if it appears in the list
console.log(getAllBuildings());
```

## Common Aliases to Include

When adding a building, consider including these variations:

- With/without punctuation: "MOB-A" vs "MOB A" vs "MOBA"
- With/without apostrophes: "Women's" vs "Womens"
- Abbreviated versions: "Center" vs "Ctr", "Building" vs "Bldg"
- Full vs. partial names: "Main Office Building A" vs "Office Building A" vs "Building A"
- Common misspellings or alternate spellings

## Need Help?

If you're unsure about adding a location:

1. Look at existing entries in `src/utils/locationMapping.js` for examples
2. Check the comments in the file for guidance
3. Test your changes with the example file

## Complete Example

Here's a complete example of adding two new buildings to the system:

```javascript
// In src/utils/locationMapping.js, add after the comment section:

'PEDIATRIC_CENTER': {
  canonical: 'Pediatric Center',
  aliases: [
    'Pediatric Center',
    'Peds Center',
    'Peds',
    'PC',
    'Pediatrics',
    'Pediatric Building',
    'Children\'s Center',
    'Childrens Center'
  ]
},

'IMAGING_CENTER': {
  canonical: 'Imaging Center',
  parentLocation: 'MOB_A',  // If it's inside MOB A
  aliases: [
    'Imaging Center',
    'Imaging',
    'IC',
    'Radiology',
    'Radiology Center',
    'MOB A Imaging'
  ]
}
```

That's it! Your new buildings are now integrated into the duplicate work order finder system.
