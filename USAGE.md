# Usage Guide

## Quick Start

1. **Start the application**
   ```bash
   npm install
   npm start
   ```
   The app will open at http://localhost:3000

2. **Upload work order files**
   - Click or drag-and-drop files into the upload area
   - Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, HTML

3. **Review duplicates**
   - The app automatically finds and displays potential duplicates
   - Each duplicate pair shows three scores:
     - **Overall Score**: Combined match percentage
     - **Loc Score**: Location match percentage
     - **Text Score**: Text similarity percentage

4. **Adjust sensitivity**
   - Use the threshold slider to filter results
   - Higher threshold = fewer, more certain matches
   - Lower threshold = more results, including less certain matches

5. **Compare details**
   - Click on any duplicate pair to see side-by-side comparison
   - Review the full text of both work orders

## Understanding Building Aliases

The application recognizes that different naming conventions can refer to the same building:

- "Office Building C" = "C" = "POB" = "MOB C"
- "Office Building A" = "A" = "MOB A"
- "Office Building B" = "B" = "MOB B"

### Adding Custom Aliases

Edit `src/utils/duplicateFinder.js` to add your building aliases:

```javascript
export const buildingAliases = {
  'C': ['POB', 'Office Building C', 'MOB C'],
  'D': ['POB South', 'Office Building D', 'MOB D'],
  // Add your aliases here
};
```

## Example Work Orders

The app successfully identifies these as duplicates (94% match):

**Work Order 1:**
```
Location: Office Building C - 1st floor - suite 115
Description: Replace HVAC filter
```

**Work Order 2:**
```
Location: MOB C - 1st floor - suite 115
Description: Filter replacement for HVAC
```

Despite different building names ("Office Building C" vs "MOB C") and description wording, the app recognizes these as the same location with the same issue.

## Tips for Best Results

1. **Consistent formatting**: While the app handles variations well, more consistent formatting yields better results
2. **Include location details**: Building, floor, and suite/room numbers help identify duplicates
3. **Adjust threshold**: Start at 70% and adjust based on your results
4. **Review carefully**: Always review the matched pairs - the scores are guidance, not certainty

## File Format Notes

- **PDF**: Text extraction works best with text-based PDFs (not scanned images)
- **Word/Excel**: All modern formats supported (.doc, .docx, .xls, .xlsx)
- **CSV**: Automatically parsed and converted to text
- **HTML**: HTML tags are removed, only text content is analyzed
- **TXT**: Plain text, no special processing needed

## Troubleshooting

**Files not uploading?**
- Check file format is supported
- Ensure files are not corrupted
- Try a smaller file first

**No duplicates found?**
- Lower the threshold slider
- Check that location information is present in work orders
- Verify building aliases are configured correctly

**Too many false positives?**
- Raise the threshold slider
- Review and customize the matching algorithm in `src/utils/duplicateFinder.js`

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `build/` folder, ready to deploy to any static hosting service.
