# Cypress Task Amazon

## Overview

This project is a Cypress-based end-to-end test suites for Amazon user flows, including cart management, customer service, and visual regression testing.  
It features modular suites, reusable utilities, and visual comparison using screenshots.

---

## Project Structure

```
cypress-task-amazon/
│
├── cypress.config.js                # Cypress config and custom Node.js tasks
├── package.json                     # Dependencies and scripts
├── e2e/
│   ├── suites/
│   │   ├── customer_service_suite.js    # Customer service suite
│   │   └── cart_flow_suite.js           # Cart flow suite
│   ├── customer_service/
│   │   ├── main_menu.cy.js              # Main menu tests
│   │   └── track_package.cy.js          # Track package tests
│   ├── cart_flow/
│   │   ├── add_to_cart.cy.js            # Cart management tests
│   ├── common/
│   │   └── test_config.js               # Shared constants
│   ├── utils/
│   │   |── commands.js
|   |   └── functionals.js              # Utility functions and custom Cypress commands
│   └── screenshots/                    # Baseline screenshots for visual tests
│                
└── ...
```

---

## Key Features

### Suites
- **customer_service_suite.js**: Runs all customer service related tests.
- **cart_flow_suite.js**: Runs all cart management and cart flow tests.

### Utilities (`e2e/utils/functionals.js`)
- **openPage(url)**: Opens and reloads a page until key elements are visible.
- **clickUntilGone(selector)**: Clicks elements until none remain.
- **validateListItemsVisibility(element, itemsList)**: Asserts visibility of multiple items.
- **compareScreenshots(selector, fileName)**:  
  - Takes a screenshot of a DOM element.
  - Moves it to a custom folder.
  - Compares it to a baseline using a Cypress task and pixelmatch.
  - Fails if the diff exceeds the threshold.

### Visual Regression
- **Baseline screenshots**: Stored in `e2e/data/screenshots/`.
- **Comparison logic**: Implemented as a Cypress task in `cypress.config.js` using `pixelmatch` and `pngjs`.

---

## How Visual Comparison Works

1. **Screenshot**: Cypress takes a screenshot of a specific element and saves it to a custom folder.
2. **Compare**: Another Cypress task compares the actual screenshot to the baseline using pixelmatch.
3. **Diff**: If the difference exceeds the threshold, the test fails and a diff image is saved.

---

## Scripts

- **Run Customer Service Suite:**  
  ```bash
  npm run test:customer
  ```
- **Run Cart Flow Suite:**  
  ```bash
  npm run test:cart
  ```
- **Run Both Suites in Parallel:**  
  ```bash
  npm run test:parallel
  ```

---

## Setup & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run tests:**
   Use the scripts above to run specific suites or all in parallel.

3. **Review Diff Images:**
   If a visual test fails, check `e2e/data/temp/diff/` for the generated diff image.

---

## Extending the Project

- Add new suites and test files under `e2e/suites/` and `e2e/cart_flow/` or `e2e/customer_service/`.
- Add new utility functions and commands to `e2e/utils/functionals.js` or `e2e/utils/commands.js`.
- Add new custom tasks to `cypress.config.js` as needed.

---

## License

This project is for educational and demonstration purposes.
