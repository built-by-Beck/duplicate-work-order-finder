# Duplicate Work Order Finder

A React.js web application that intelligently searches through uploaded work order files to find similar and potentially duplicate entries. The app uses advanced fuzzy matching algorithms and building alias recognition to identify work orders that reference the same location.

## Features

- **Multiple File Format Support**: Upload and parse work orders in various formats:
  - PDF files
  - Word documents (DOC, DOCX)
  - Excel spreadsheets (XLS, XLSX)
  - CSV files
  - Text files (TXT)
  - HTML files (HTM, HTML)

- **Intelligent Matching**: 
  - Fuzzy text matching to find similar content
  - Building alias recognition (e.g., "C" = "POB" = "Office Building C" = "MOB C")
  - Location-based comparison (building, floor, suite/room numbers)
  - Adjustable similarity threshold

- **User-Friendly Interface**:
  - Drag-and-drop file upload
  - Real-time duplicate detection
  - Visual similarity scores
  - Side-by-side comparison of potential duplicates
  - Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/built-by-Beck/duplicate-work-order-finder.git
cd duplicate-work-order-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000)

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Usage

1. **Upload Files**: Click or drag-and-drop work order files into the upload area
2. **Review Uploaded Orders**: See all uploaded work orders with preview text
3. **Adjust Threshold**: Use the slider to adjust the similarity threshold (50-100%)
4. **View Duplicates**: Review potential duplicate pairs with match scores
5. **Compare Details**: Click on any duplicate pair to see side-by-side comparison

## How It Works

### Building Alias Recognition

The application includes a configurable alias system that recognizes different names for the same building. For example:
- "Office Building C" = "C" = "POB" = "MOB C"

This ensures that work orders referring to the same location with different naming conventions are identified as potential duplicates.

### Matching Algorithm

The duplicate detection uses a multi-faceted approach:

1. **Location Extraction**: Identifies buildings, floors, and suite/room numbers
2. **Alias Expansion**: Expands building names with known aliases
3. **Structural Comparison**: Compares extracted location components (60% weight)
4. **Fuzzy Text Matching**: Uses token-based fuzzy matching for overall text similarity (40% weight)
5. **Scoring**: Combines scores and filters based on the selected threshold

### Similarity Scores

Each potential duplicate is shown with three scores:
- **Overall Score**: Combined match score (used for threshold filtering)
- **Location Score**: How well the location information matches
- **Text Score**: Fuzzy text similarity score

## Customization

### Adding Building Aliases

Edit `src/utils/duplicateFinder.js` to add or modify building aliases:

```javascript
export const buildingAliases = {
  'C': ['POB', 'Office Building C', 'MOB C'],
  'A': ['Office Building A', 'MOB A'],
  // Add more aliases as needed
};
```

### Adjusting Matching Logic

The matching algorithm can be customized in `src/utils/duplicateFinder.js`:
- Modify regular expressions for location extraction
- Adjust scoring weights in the `findDuplicates` function
- Add custom matching rules

## Technologies Used

- **React**: UI framework
- **PDF.js**: PDF text extraction
- **Mammoth.js**: Word document parsing
- **SheetJS (xlsx)**: Excel file parsing
- **PapaParse**: CSV parsing
- **Fuzzball**: Fuzzy string matching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
