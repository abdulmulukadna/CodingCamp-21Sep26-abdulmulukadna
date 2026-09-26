# Implementation Plan: Expense & Budget Visualizer MVP

## Overview

This implementation plan breaks down the Expense & Budget Visualizer MVP into discrete coding tasks. The application is a client-side web application using vanilla JavaScript (ES6+), HTML5, CSS3, and Chart.js for visualization. The architecture follows the MVC pattern with clear separation of concerns.

**Technical Stack:**
- HTML5 with semantic markup
- CSS3 with CSS variables (design tokens)
- Vanilla JavaScript ES6+ (no frameworks)
- Chart.js 4.4.0 (via CDN)
- Local Storage API for persistence

**Key Files:**
- `index.html` - Main HTML structure
- `css/styles.css` - All styles in single file
- `js/app.js` - All JavaScript in single file (module-based)

## Tasks

- [x] 1. Set up project structure and base HTML
  - Create project directory structure (root, css/, js/)
  - Create `index.html` with DOCTYPE, meta tags, and semantic HTML5 structure
  - Add Chart.js 4.4.0 CDN link in head
  - Link `css/styles.css` and `js/app.js` (type="module")
  - Add header with title "💰 Expense Tracker" and subtitle
  - Create main container with sections: form-section, dashboard-section, transaction-list-section
  - Add footer with copyright
  - Include all necessary ARIA labels and accessibility attributes
  - _Requirements: 1.1, 1.2, 13.1, 13.3_

- [x] 2. Implement HTML form structure
  - [x] 2.1 Create transaction form with id="transaction-form" and novalidate attribute
    - Add error container with role="alert" and aria-live="polite"
    - Create form-group for transaction name input (text, maxlength=100, required)
    - Create form-group for amount input (number, step=0.01, min=0.01, max=999999.99, required)
    - Create form-group for category select with options: Food, Transport, Fun
    - Add submit button with class="btn btn-primary"
    - Include field-level error spans with ids (name-error, amount-error, category-error)
    - Link inputs to error spans using aria-describedby
    - _Requirements: 1.1, 13.1, 13.2, 13.3, 14.2_

  - [x] 2.2 Create dashboard section HTML
    - Add balance-card div with h2 "Total Expenses"
    - Add balance-amount div with id="total-balance" and aria-live="polite"
    - Add chart-card div with h2 "Spending by Category"
    - Add chart-container with canvas element (id="expense-chart", role="img")
    - Add chart-empty-message div (initially hidden)
    - _Requirements: 1.4, 1.5_

  - [x] 2.3 Create transaction list section HTML
    - Add section with h2 "Transaction History"
    - Add transaction-list div with id="transaction-list", role="list", aria-live="polite"
    - Add initial empty-message div inside transaction list
    - _Requirements: 1.2_

- [x] 3. Implement CSS design tokens and reset styles
  - Define CSS variables in :root for all design tokens
  - Include color palette (primary, semantic colors, neutrals, category colors)
  - Define spacing scale (xs through 2xl)
  - Define typography variables (font family, sizes, weights, line heights)
  - Define border radius variables (sm, md, lg, full)
  - Define shadow variables (sm, md, lg)
  - Define transition variables (fast, base, slow)
  - Define layout variables (container-max-width, content-max-width)
  - Add CSS reset and base styles (box-sizing, margin, padding, font-family)
  - _Requirements: 11.5_

- [x] 4. Implement CSS layout and typography
  - [x] 4.1 Style container, header, main, and footer layout
    - Container: max-width, centering, responsive padding
    - Header: text alignment, spacing
    - Main: grid layout for responsive design
    - Footer: styling and positioning
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 4.2 Style form components
    - Form-group: spacing and layout
    - Inputs and select: full width, padding, borders, transitions
    - Focus states: outline with primary color
    - Labels: display, font weight, spacing
    - Required indicators: color and aria-label
    - Buttons: padding, colors, hover states, transitions
    - _Requirements: 11.4, 13.3, 13.4_

  - [x] 4.3 Style error and success states
    - Error container: background, border, colors, display toggle
    - Field-level errors: color, font size, display toggle
    - Input error state: border color, background color
    - Success state: green colors and styling
    - _Requirements: 14.1, 14.2, 14.3_

- [x] 5. Implement CSS for dashboard and transaction list
  - [x] 5.1 Style balance card and chart card
    - Card styling: background, padding, border-radius, shadows
    - Balance amount: font size, color, weight
    - Chart container: aspect ratio, responsive behavior
    - Empty message: text alignment, padding, color
    - _Requirements: 11.6_

  - [x] 5.2 Style transaction list and transaction items
    - Transaction item: flexbox layout, spacing, borders, hover effects
    - Transaction info: nested layout for header and meta
    - Transaction name, amount, date: typography and colors
    - Category badges: colors matching chart, padding, border-radius
    - Delete button: styling, hover state, touch target size (≥44px)
    - Empty state message: centered text, padding
    - _Requirements: 11.4_

  - [x] 5.3 Add responsive breakpoints
    - Mobile base styles (320px+): single column, full width
    - Tablet styles (768px+): two-column grid for main sections
    - Desktop styles (1024px+): max-width container, centered layout
    - Ensure chart resizes proportionally at all breakpoints
    - Test all layouts at breakpoints
    - _Requirements: 11.1, 11.2, 11.3, 11.6_

- [x] 6. Implement JavaScript constants and utility functions
  - Define CONFIG object with all configuration constants
  - Include STORAGE_KEY, STORAGE_VERSION, CATEGORIES array
  - Include CATEGORY_COLORS and CATEGORY_ICONS objects
  - Include MAX_AMOUNT and MAX_NAME_LENGTH
  - Implement escapeHTML(str) function for XSS prevention
  - Implement formatDate(isoString) function for readable date display
  - Implement formatCurrency(amount) function for dollar amounts
  - _Requirements: 1.1, 1.6, 14.1_

- [x] 7. Implement ValidationService class
  - [x] 7.1 Create ValidationService class structure and name validation
    - Define class constructor
    - Implement validateName(name) method
    - Check for empty/whitespace-only names
    - Check for names exceeding MAX_NAME_LENGTH (100 characters)
    - Return {valid: boolean, message: string} format
    - _Requirements: 1.1, 1.6, 14.2_

  - [x] 7.2 Implement amount validation
    - Implement validateAmount(amount) method
    - Parse to float and check isNaN
    - Check for values <= 0
    - Check for values > MAX_AMOUNT (999999.99)
    - Validate maximum 2 decimal places
    - Return {valid: boolean, message: string} format
    - _Requirements: 1.1, 1.6, 14.2_

  - [x] 7.3 Implement category validation and complete validation
    - Implement validateCategory(category) method
    - Check for empty/whitespace-only category
    - Validate category exists in CONFIG.CATEGORIES array
    - Implement validateTransaction(data) method to combine all validations
    - Return {valid: boolean, errors: array} format
    - Implement sanitizeInput(input) method for trimming
    - _Requirements: 1.1, 1.6, 14.2_

- [~] 8. Implement StorageService class
  - [ ] 8.1 Create StorageService constructor and basic structure
    - Define constructor accepting storageKey parameter
    - Initialize version property from CONFIG.STORAGE_VERSION
    - Initialize lastError property as null
    - Define _getDefaultData() private method returning initial data structure
    - Structure: {version, lastModified, transactions: [], settings: {nextId: 1}}
    - _Requirements: 1.6_

  - [ ] 8.2 Implement save and load methods
    - Implement save(data) method with try-catch
    - Add version and lastModified metadata to data before saving
    - Use JSON.stringify and localStorage.setItem
    - Implement load() method with JSON.parse and localStorage.getItem
    - Return default data if no data exists
    - Handle null/undefined cases gracefully
    - _Requirements: 1.6, 4.1, 4.2, 4.3, 4.4_

  - [ ] 8.3 Implement error handling and validation
    - Add error handling in save() for QuotaExceededError and SecurityError
    - Store errors in lastError property and log to console
    - Implement _validateData(data) private method to check data structure
    - Validate transactions array, settings object, nextId number
    - Implement getLastError() method to return lastError
    - Implement clear() method to remove data from localStorage
    - Implement isAvailable() method to test localStorage availability
    - _Requirements: 4.6, 4.7, 4.8, 14.4, 14.5_

- [ ] 9. Implement ChartService class
  - [ ] 9.1 Create ChartService constructor and initialization
    - Define constructor accepting canvasElement and config parameters
    - Store canvas reference and config
    - Initialize chart property as null
    - Get reference to chart-empty-message element
    - Implement initialize() method to create Chart.js pie chart instance
    - Set chart type to 'pie' with empty initial data
    - _Requirements: 1.5_

  - [ ] 9.2 Implement chart configuration and options
    - Define _getChartOptions() private method
    - Configure responsive: true, maintainAspectRatio: true, aspectRatio: 1.5
    - Configure legend position 'bottom' with padding and font size
    - Configure tooltip with backgroundColor, padding, cornerRadius
    - Implement custom tooltip callback to show "Category: $amount (percentage%)"
    - Set usePointStyle: true for legend items
    - _Requirements: 1.5, 5.5_

  - [ ] 9.3 Implement chart data update and empty state handling
    - Implement _hasData(categoryTotals) private method
    - Check if categoryTotals Map has any non-zero values
    - Implement updateData(categoryTotals) method
    - If no data, hide canvas and show empty message
    - If data exists, show canvas and hide empty message
    - Convert Map to arrays for Chart.js (labels, data, colors)
    - Update chart.data.labels, chart.data.datasets[0].data, and backgroundColor
    - Call chart.update('active') for animation
    - Implement destroy() method to clean up chart instance
    - _Requirements: 1.5, 5.6_

- [ ] 10. Implement TransactionModel class
  - [ ] 10.1 Create TransactionModel constructor and initialization
    - Define constructor accepting storageService parameter
    - Initialize storageService, transactions array, and nextId counter
    - Implement loadFromStorage() method
    - Call storageService.load() to get data
    - Populate transactions array and nextId from loaded data
    - Call loadFromStorage() in constructor to load initial data
    - _Requirements: 1.2, 1.6_

  - [ ] 10.2 Implement addTransaction and _generateId methods
    - Implement _generateId() private method to return and increment nextId
    - Implement addTransaction(transactionData) method
    - Create transaction object with generated id
    - Add name, amount, category from transactionData
    - Add createdAt with new Date().toISOString()
    - Push transaction to transactions array
    - Call _saveToStorage() immediately
    - Return the created transaction object
    - _Requirements: 1.1, 1.6_

  - [ ] 10.3 Implement transaction retrieval and deletion
    - Implement getTransactions() method to return copy of transactions array
    - Implement getTransactionById(id) method to find and return transaction
    - Return null if transaction not found
    - Implement deleteTransaction(id) method
    - Find index of transaction with given id
    - Use splice() to remove from array
    - Call _saveToStorage() immediately
    - Return true if deleted, false if not found
    - _Requirements: 1.2, 1.3_

  - [ ] 10.4 Implement calculation methods and storage
    - Implement getTotalBalance() method
    - Use reduce() to sum all transaction amounts
    - Return total with proper decimal handling
    - Implement getCategoryTotals() method
    - Return Map with category names as keys and totals as values
    - Iterate through transactions and sum by category
    - Implement _saveToStorage() private method
    - Build data object with transactions and settings {nextId}
    - Call storageService.save(data)
    - Check for errors with getLastError() and log if present
    - _Requirements: 1.4, 1.5, 1.6_

- [ ] 11. Implement TransactionView class
  - [ ] 11.1 Create TransactionView constructor and DOM references
    - Define constructor accepting chartService parameter
    - Store chartService reference
    - Implement _getElements() method to get all DOM element references
    - Store references: form, nameInput, amountInput, categorySelect
    - Store references: transactionList, totalDisplay, chartCanvas, errorContainer
    - Call _getElements() in constructor
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [ ] 11.2 Implement form data retrieval and clearing
    - Implement getFormValues() method
    - Return object with name, amount (parsed as float), and category
    - Trim whitespace from name
    - Implement clearForm() method
    - Reset form using form.reset()
    - Clear any lingering error states
    - _Requirements: 1.1_

  - [ ] 11.3 Implement error display methods
    - Implement clearErrors() method
    - Query all .field-error elements and clear text/classes
    - Query all .error inputs and remove error class and aria-invalid
    - Clear error container text and classes
    - Implement showError(field, message) method
    - Get error element by id (field-error)
    - Set textContent to message and add 'visible' class
    - Get input element and add 'error' class and aria-invalid="true"
    - Implement showSuccess(message) method
    - Display success message in error container with 'success' class
    - Auto-hide after 3 seconds with setTimeout
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ] 11.4 Implement transaction list rendering
    - Implement _createEmptyStateHTML() private method
    - Return HTML string for empty state message
    - Implement _createTransactionHTML(transaction) private method
    - Build HTML string for transaction item with proper structure
    - Use escapeHTML() for transaction name to prevent XSS
    - Include category icon from CONFIG.CATEGORY_ICONS
    - Format amount using toFixed(2) for currency display
    - Format date using formatDate() utility
    - Add delete button with data-id attribute and aria-label
    - Implement renderTransactions(transactions) method
    - If empty, set innerHTML to empty state
    - Otherwise, map transactions to HTML strings and join
    - Set transactionList innerHTML
    - _Requirements: 1.2, 1.3_

  - [ ] 11.5 Implement balance, chart updates, and event binding
    - Implement renderTotalBalance(total) method
    - Format total as currency with dollar sign
    - Set totalDisplay textContent
    - Implement updateChart(categoryTotals) method
    - Call chartService.updateData(categoryTotals)
    - Implement bindAddTransaction(handler) method
    - Add submit event listener to form
    - Call preventDefault() and invoke handler
    - Implement bindDeleteTransaction(handler) method
    - Use event delegation on transactionList
    - Check if clicked element has btn-delete class
    - Show confirm dialog before calling handler with transaction id
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [ ] 12. Implement TransactionController class
  - [ ] 12.1 Create TransactionController constructor and initialization
    - Define constructor accepting model, view, and validator parameters
    - Store references to all three components
    - Implement init() method
    - Call model.loadFromStorage() to ensure data is loaded
    - Call _updateView() to render initial state
    - Bind view event handlers to controller methods
    - Call view.bindAddTransaction with handleAddTransaction.bind(this)
    - Call view.bindDeleteTransaction with handleDeleteTransaction.bind(this)
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 12.2 Implement handleAddTransaction method
    - Clear existing errors with view.clearErrors()
    - Get form values from view.getFormValues()
    - Validate using validator.validateTransaction(formData)
    - If validation fails, loop through errors and call view.showError for each
    - Return early if validation failed
    - Wrap in try-catch for storage errors
    - Call model.addTransaction(formData) if valid
    - Check for storage errors with model.storageService.getLastError()
    - If storage error exists, throw it to be caught
    - If successful, call _updateView() and view.clearForm()
    - Show success message with view.showSuccess()
    - In catch block, handle storage errors with user-friendly messages
    - Show alert with appropriate error message based on error type
    - _Requirements: 1.1, 1.6, 14.1, 14.2, 14.4_

  - [ ] 12.3 Implement handleDeleteTransaction and view update methods
    - Implement handleDeleteTransaction(id) method
    - Call model.deleteTransaction(id)
    - Call _updateView() to refresh display
    - Implement _updateView() private method
    - Get transactions from model.getTransactions()
    - Call view.renderTransactions(transactions)
    - Get total from model.getTotalBalance()
    - Call view.renderTotalBalance(total)
    - Call _refreshChart() to update visualization
    - Implement _refreshChart() private method
    - Get categoryTotals Map from model.getCategoryTotals()
    - Call view.updateChart(categoryTotals)
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ] 13. Implement application initialization
  - Add DOMContentLoaded event listener in app.js
  - Create StorageService instance with CONFIG.STORAGE_KEY
  - Check storage availability with storageService.isAvailable()
  - If not available, show alert warning about data persistence
  - Create ValidationService instance
  - Get canvas element by id 'expense-chart'
  - Create ChartService instance with canvas and CONFIG
  - Create TransactionModel instance with storageService
  - Create TransactionView instance with chartService
  - Create TransactionController instance with model, view, and validator
  - Call controller.init() to start the application
  - _Requirements: 1.6, 4.6, 14.4_

- [ ] 14. Add global error handlers
  - Add window 'error' event listener for unhandled errors
  - Log error to console
  - Show user-friendly alert suggesting page refresh
  - Add window 'unhandledrejection' event listener for promise rejections
  - Log rejection reason to console
  - _Requirements: 14.1, 14.5_

- [ ] 15. Checkpoint - Test core functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Cross-browser testing and accessibility validation
  - [ ] 16.1 Test in Chrome, Firefox, Safari, and Edge
    - Verify application loads without console errors in all browsers
    - Test add transaction flow in each browser
    - Test delete transaction flow in each browser
    - Verify chart renders correctly in all browsers
    - Test Local Storage persistence (add transaction, refresh, verify data persists)
    - Test form validation in all browsers
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ] 16.2 Validate responsive design at all breakpoints
    - Test at mobile width 320px: verify single column layout, no horizontal scroll
    - Test at mobile width 375px: verify layout adapts properly
    - Test at tablet width 768px: verify two-column grid layout appears
    - Test at desktop width 1024px+: verify max-width container and centering
    - Test touch target sizes on mobile (all interactive elements ≥44px)
    - Verify chart resizes proportionally at all breakpoints
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ] 16.3 Perform accessibility testing
    - Test keyboard navigation: Tab through all elements in logical order
    - Verify visible focus indicators on all interactive elements
    - Test form submission using only keyboard (Enter key)
    - Test transaction deletion using only keyboard (Space/Enter on delete button)
    - Verify all form inputs have associated labels
    - Verify error messages are announced properly (check with browser dev tools)
    - Test that chart has proper role="img" and descriptive aria-label
    - Verify color contrast using browser DevTools (minimum 4.5:1 for text)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

- [ ] 17. Edge case and error scenario testing
  - [ ] 17.1 Test input validation edge cases
    - Test empty transaction name submission (should show error)
    - Test transaction name with 100 characters (should accept)
    - Test transaction name with 101 characters (should show error)
    - Test amount of 0 (should show error)
    - Test negative amount (should show error)
    - Test amount with 3+ decimal places like 10.999 (should show error)
    - Test amount of 0.01 (minimum valid, should accept)
    - Test amount of 999999.99 (maximum valid, should accept)
    - Test submitting without selecting category (should show error)
    - _Requirements: 1.1, 1.6, 14.2_

  - [ ] 17.2 Test XSS prevention and special characters
    - Test transaction name with `<script>alert('xss')</script>` (should render as text)
    - Test transaction name with HTML entities like `<b>Test</b>` (should render as text)
    - Test transaction name with special characters: `Café & Restaurant 🍕` (should accept)
    - Test transaction name with leading/trailing spaces (should trim)
    - Verify all user input is properly escaped in rendered HTML
    - _Requirements: 1.1, 14.1_

  - [ ] 17.3 Test data persistence and storage errors
    - Add several transactions, refresh page, verify all persist
    - Delete a transaction, refresh page, verify deletion persists
    - Test in private/incognito mode (should show warning about persistence)
    - Clear browser data (localStorage), refresh, verify empty state shown
    - Test with localStorage disabled (mock unavailable), verify error handling
    - _Requirements: 1.6, 4.1, 4.2, 4.3, 4.4, 4.6, 14.4_

- [ ] 18. Performance and usability testing
  - [ ] 18.1 Test with various data volumes
    - Test with 0 transactions (verify empty state messages)
    - Test with 1 transaction (verify chart shows single category)
    - Test with 10 transactions across all categories (verify proper display)
    - Test with 50 transactions (verify list scrolling is smooth)
    - Test with 100 transactions (verify no performance degradation)
    - Measure page load time (should be under 2 seconds)
    - Measure form submission response time (should be under 500ms)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ] 18.2 Test chart visualization with different data distributions
    - Test with all transactions in single category (100% pie slice)
    - Test with even distribution across all categories (33% each)
    - Test with uneven distribution (e.g., 50% Food, 30% Transport, 20% Fun)
    - Hover over each chart section, verify tooltip shows correct data
    - Verify tooltip format: "Category: $amount (percentage%)"
    - Verify chart legend displays correctly at bottom
    - Verify chart colors match category colors (Food=#FF6384, Transport=#36A2EB, Fun=#FFCE56)
    - _Requirements: 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 18.3 Test balance calculation accuracy
    - Test with single transaction, verify balance equals transaction amount
    - Test with multiple transactions, manually calculate expected total
    - Verify balance updates immediately after adding transaction
    - Verify balance updates immediately after deleting transaction
    - Test with amounts having various decimal places (10.5, 10.99, 10.01)
    - Verify proper currency formatting with dollar sign and 2 decimal places
    - _Requirements: 1.4_

- [ ] 19. Final integration and polish
  - Review all code for console.log statements and remove or update as needed
  - Verify all error messages are user-friendly and grammatically correct
  - Test complete user flow: open app → add 5 transactions → delete 2 → refresh → verify persistence
  - Verify empty states display correctly (no transactions, no chart data)
  - Verify all transitions and animations are smooth
  - Check that all configuration constants are used consistently
  - Verify category icons appear correctly (🍔 Food, 🚗 Transport, 🎉 Fun)
  - Test form reset after successful submission
  - Verify success message appears and auto-hides after 3 seconds
  - _Requirements: All_

- [ ] 20. Create documentation
  - Add code comments explaining complex logic in JavaScript
  - Document all class methods with JSDoc-style comments
  - Add inline comments for non-obvious CSS rules
  - Create README.md with project overview and setup instructions
  - Document known limitations (Local Storage size limits, single user, no backend)
  - Document browser requirements (ES6+ support, Local Storage API)
  - Add instructions for local development (how to run HTTP server)
  - List all features implemented and reference requirements document
  - _Requirements: All_

- [ ] 21. Final checkpoint - Complete application validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks reference specific requirements from the requirements document for traceability
- Implementation follows MVC architecture pattern as specified in design document
- No property-based testing is included as the design assessment determined PBT is not applicable for this UI-centric MVP
- Testing is primarily manual with comprehensive test scenarios in tasks 16-18
- Single file approach for CSS and JavaScript simplifies deployment (no build process required)
- Chart.js is loaded via CDN, no local installation needed
- Focus on accessibility throughout implementation (ARIA labels, keyboard navigation, color contrast)
- All validation happens client-side with immediate user feedback
- Data persistence uses Local Storage with comprehensive error handling
- No optional test sub-tasks are included since manual testing approach is used

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "3"] },
    { "id": 2, "tasks": ["4.1", "4.2", "4.3", "6"] },
    { "id": 3, "tasks": ["5.1", "5.2", "7.1"] },
    { "id": 4, "tasks": ["5.3", "7.2"] },
    { "id": 5, "tasks": ["7.3", "8.1"] },
    { "id": 6, "tasks": ["8.2", "9.1"] },
    { "id": 7, "tasks": ["8.3", "9.2", "10.1"] },
    { "id": 8, "tasks": ["9.3", "10.2"] },
    { "id": 9, "tasks": ["10.3", "11.1"] },
    { "id": 10, "tasks": ["10.4", "11.2"] },
    { "id": 11, "tasks": ["11.3", "11.4"] },
    { "id": 12, "tasks": ["11.5", "12.1"] },
    { "id": 13, "tasks": ["12.2"] },
    { "id": 14, "tasks": ["12.3", "13"] },
    { "id": 15, "tasks": ["14"] },
    { "id": 16, "tasks": ["16.1"] },
    { "id": 17, "tasks": ["16.2", "16.3", "17.1"] },
    { "id": 18, "tasks": ["17.2", "17.3", "18.1"] },
    { "id": 19, "tasks": ["18.2", "18.3"] },
    { "id": 20, "tasks": ["19"] },
    { "id": 21, "tasks": ["20"] }
  ]
}
```
