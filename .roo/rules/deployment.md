---
description:
globs:
alwaysApply: false
---
# Deployment & Troubleshooting Guide

This document provides instructions and best practices for deploying the Health Assistant application to Vercel. It also includes a "lessons learned" section for common build errors we have encountered and solved.

## 1. Standard Deployment Process

1.  Push your changes to the main branch of the GitHub repository.
2.  Vercel will automatically trigger a new deployment.
3.  Monitor the build logs in the Vercel dashboard for any errors.

## 2. Environment Variables

Ensure the following environment variables are set correctly in the Vercel project settings:

-   `OPENAI_API_KEY`: Your API key for OpenAI.
-   `SCRAPER_API_KEY`: Your API key for ScraperAPI.

## 3. Common Build Errors & Solutions

This section documents the build errors we have faced and how to resolve them. Before starting a long debugging session, check if your issue is listed here.

### Issue: `framer-motion` Compatibility Error

-   **Error Log**: `Error: It's currently unsupported to use "export *" in a client boundary.`
-   **Cause**: A compatibility issue between `framer-motion` and Next.js 15's handling of client components.
-   **Solution**: **Do not use `framer-motion`**. All animations have been replaced with custom CSS animations defined in `app/src/app/globals.css`.
    -   Remove the library from `package.json`.
    -   Replace all `<motion.div>` components with `<div>` and use the custom animation classes (e.g., `animate-fade-in-up`).
    -   Reference `frontend.md` for the correct animation usage.

### Issue: TypeScript Type Mismatches

-   **Error Log**: `Type error: Type '{...}' is not assignable to type '...'. Types of property '...' are incompatible.`
-   **Cause**: This is a general error that occurs when the data being passed to a component or assigned to a variable does not match its TypeScript interface. We have seen specific instances of this:
    1.  **Optional Properties as `null`**: A function returns an object with a property set to `null` (e.g., `imageUrl: null`) when the interface defines it as optional (`imageUrl?: string`).
    2.  **Incorrect Primitive Types**: A function returns a property as a `string` (e.g., `premium: "450"`) when the interface expects a `number` (`premium: number`).
    3.  **Implicit `any[]` Type**: A variable is initialized as an empty array (`let results = []`) and TypeScript cannot infer its type, leading to an error.
-   **Solution**:
    1.  **For optional properties, omit them instead of setting to `null`**. If an image URL doesn't exist, don't include the `imageUrl` key in the object.
    2.  **Ensure all primitive types match the interface definitions**. Convert strings to numbers where required.
    3.  **Always provide explicit types for variables**, especially empty arrays. Example: `let emergencyResults: EmergencyFacility[] = [];`.
    -   Reference `backend.md` for data consistency rules.

### Issue: ESLint Unused Variables

-   **Error Log**: `Error: 'variableName' is assigned a value but never used.`
-   **Cause**: A variable or state hook (e.g., from `useState`) is declared but never used in the component. This often happens during refactoring.
-   **Solution**: Simply remove the unused variable declaration. It cleans up the code and resolves the build error.
