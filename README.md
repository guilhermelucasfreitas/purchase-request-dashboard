# Task Management Dashboard

A modern, responsive, and accessible task management application built with Angular 20 and Angular Material.

## Overview

This project is a comprehensive dashboard for managing tasks. It allows users to view, create, edit, delete, and filter tasks based on various criteria such as status, priority, and assignee. The interface is designed to be clean, intuitive, and fully accessible, following ARIA best practices to ensure a great experience for all users.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Angular CLI](https://angular.io/cli) (v20 or later)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/guilhermelucasfreitas/purchase-request-dashboard.git>
    cd purchase-request-dashboard
    ```

2.  **Install dependencies:**
    Run the following command in the project's root directory to install all the necessary packages.

    ```bash
    npm install
    ```

3.  **Start the development server:**
    Run the command below to start the application. The app will automatically reload if you change any of the source files.
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/` in your browser.

---

## Testing

The project is configured with both unit and end-to-end tests to ensure code quality and application stability.

### Unit Tests (Karma & Jasmine)

Unit tests are set up to verify the functionality of individual components. The primary focus for unit testing in this project was the **Filter Component**, ensuring all filtering logic and events work as expected.

To run the unit tests, execute the following command:

```bash
ng test
```

This will launch the Karma test runner and execute the tests in a browser.

### End-to-End Tests (Playwright)

E2E tests are implemented using Playwright to simulate user interactions and test critical application flows from start to finish.

1.  **Install Playwright browsers:**
    If this is your first time running Playwright, you may need to install the necessary browser binaries.

    ```bash
    npx playwright install
    ```

2.  **Run E2E tests:**
    To execute the full suite of E2E tests in headless mode, use:
    ```bash
    npm run e2e
    ```
    Or, to run the tests in a headed browser to see the interactions, use:
    ```bash
    npm run e2e:headed
    ```

---


