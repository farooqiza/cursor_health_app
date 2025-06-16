---
description:
globs:
alwaysApply: false
---
# Backend Development Standards

This document outlines the architecture and best practices for the backend logic of the Health Assistant application, primarily centered around the `app/src/app/api/chat/route.ts` file.

## 1. API Architecture: The 3-Step Process

The main API endpoint follows a structured, three-step process to handle user queries. All new features should integrate into this pattern.

1.  **Intent Analysis**: The first step is to understand the user's query.
    -   An initial call is made to the OpenAI API (`gpt-4-turbo`) with a specific system prompt to extract structured data: `isEmergency`, `serviceQuery`, and `insuranceKeywords`.
    -   **Critical**: This step must have a fallback mechanism. If the OpenAI call fails, the API should infer a basic intent from the user's message to ensure the process can continue.

2.  **Contextual Data Fetching**: Based on the intent, the API gathers information from multiple sources.
    -   **Live Data First**: Prioritize fetching live data via `app/src/lib/webSearch.ts`.
    -   **Robust Fallbacks**: If a live data source (web scrape) fails or returns no results, the system MUST fall back to a local, curated data source (e.g., `getContextualFacilities`, `getContextualPricing`). This ensures the UI never shows empty sections.
    -   **Data Aggregation**: The API aggregates data from different sources. For example, the "Pricing" data includes results from both procedure searches and pharmacy recommendations (`getPharmacyRecommendations`).

3.  **Synthesized Response**: The final step is to generate the main health advice text.
    -   A second call is made to the OpenAI API, providing the original message to generate a comprehensive, empathetic, and safe response.
    -   **Critical**: This step must also have a fallback. If the AI call fails, a safe, context-aware default message should be returned (e.g., providing generic wound care advice if the query contained "cut").

## 2. Type Safety and Data Consistency

-   **Strict Typing is Mandatory**: All variables, especially arrays that hold fetched data, must have explicit TypeScript types. This prevents build-time errors.
    -   `emergencyResults: EmergencyFacility[]`
    -   `pricingResults: Procedure[]`
    -   `insuranceResults: InsurancePlan[]`
-   **Data Shape Consistency**: Data returned from functions must match the TypeScript interfaces defined in the components or libraries.
    -   **DO NOT use `null` for optional properties**. If a property like `imageUrl` is optional (`imageUrl?: string`), omit the property entirely from the object instead of setting it to `null`.
    -   **Example**:
        ```typescript
        // ✅ DO: Omit the optional property
        const facility = {
          name: "Example Clinic",
          address: "123 Main St"
          // imageUrl is omitted
        };

        // ❌ DON'T: Use null for optional properties
        const facility_bad = {
          name: "Example Clinic",
          address: "123 Main St",
          imageUrl: null // This will cause a type error
        };
        ```
-   **Primitive Type Consistency**: Ensure that primitive types match the interface. For example, if `InsurancePlan.premium` is a `number`, all functions must return it as a `number`, not a string.

## 3. Environment Variables & API Keys

-   All API keys (`OPENAI_API_KEY`, `SCRAPER_API_KEY`) must be stored as environment variables.
-   Do not hard-code sensitive keys in the source code. Refer to the project's deployment guide for instructions on setting these up in Vercel.
