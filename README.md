# Playwright Automation Framework

## Overview

This is a scalable **Playwright + TypeScript automation framework** designed for:

* UI Testing
* API Testing
* Database Validation
* Accessibility Testing

It follows a **modular, maintainable, and enterprise-ready architecture** using Page Object Model (POM) and reusable utilities.

---

## 🏗️ Project Structure

```
├── api/
│   ├── apiActions/        # API business logic
│   ├── apiRegistry/       # Endpoint management
│   └── base/              # Base API setup (auth, headers)
│
├── pageFactory/
│   ├── pageRepository/    # Page Objects
│   └── objectRepository/  # Locators (if separated)
│
├── lib/
│   ├── BaseTest.ts        # Central fixture management
│   ├── WebActions.ts      # Reusable UI utilities
│   └── DBActions.ts       # Database operations
│
├── tests/
│   └── functional/        # Test cases
│
├── utils/
│   └── functional/        # Helpers & JSON comparison
│
├── environments/          # Environment configs (.env)
├── test-data/             # Test data files
├── playwright.config.ts   # Playwright configuration
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### 3️⃣ Configure Environment

Create `.env` file inside `environments/` folder:

```
BASE_URL=
API_USER=
API_PASS=
UI_USER=
UI_PASS=
```

---

## ▶️ Running Tests

### Run Single Test

```bash
npm run test:single
```

### Run Smoke Tests

```bash
npm run test:parallel
```

### Run in Serial Mode

```bash
npm run test:serial
```

### Run Specific File

```bash
TEST_FILE=tests/functional/Login.test.ts npm run test:mac
```

---

## Test Types Supported

### UI Testing

* Page Object Model
* Reusable actions
* Cross-browser support

### API Testing

* Token-based authentication
* Dynamic endpoint handling
* Payload customization

### Database Testing

* SQL Server integration
* Query validation

### Accessibility Testing

* Axe-core integration

---

##  Key Features

* ✔ Modular architecture
* ✔ Environment-based execution
* ✔ Custom logging (Winston)
* ✔ JSON comparison utility
* ✔ CI/CD ready (Azure Pipelines)
* ✔ Multiple reporters (HTML, Allure, JUnit)

---

## Reporting

After execution:

* HTML Report → `html-report/`
* Allure Report → `allure-results/`
* JUnit Report → `junit-results/`

Run Allure report:

```bash
allure serve
```

---

## Best Practices

* Do not hardcode credentials
* Use environment variables
* Keep locators inside page objects
* Reuse utilities from `lib/`
* Avoid hard waits

---

## CI/CD Integration

Framework supports Azure Pipeline:

* Dynamic test execution
* Environment-based runs
* Automated report publishing

---

## Contribution Guidelines

1. Follow project structure
2. Write reusable code
3. Add proper logging
4. Ensure test stability
5. Update documentation if needed

---


---

##  Support

For issues or improvements, raise a ticket or contact the framework owner.

---

✨ Happy Testing!
