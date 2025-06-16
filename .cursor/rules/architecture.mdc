---
description: 
globs: 
alwaysApply: false
---
# Project Architecture & Standards

## 1. Vision & Core Purpose

The AI Health Assistant is a Next.js application designed to provide users in Dubai with a comprehensive, AI-powered healthcare resource. It aims to clarify health concerns by offering instant advice, transparent facility and pricing information, and personalized insurance recommendations.

## 2. Core Architecture & Data Flow

The application follows a modern, server-driven architecture centered around a sophisticated API endpoint.

1.  **User Input**: The user submits a health query via the chat interface in `app/src/components/Chat.tsx`.
2.  **API Request**: The frontend sends the user's message to `app/src/app/api/chat/route.ts`.
3.  **Backend Processing (3-Step Process)**: The API route orchestrates data fetching and AI processing.
    1.  **Intent Analysis**: An initial OpenAI call extracts structured data (`isEmergency`, `serviceQuery`, `insuranceKeywords`) from the query. This step includes a fallback to ensure the process continues if the AI call fails.
    2.  **Contextual Data Fetching**: Based on the intent, the API gathers information. It prioritizes **live data** from web scraping (`app/src/lib/webSearch.ts`) and uses **robust local fallbacks** (e.g., `getContextualPricing`) to ensure the UI is never empty.
    3.  **Synthesized Response**: A final OpenAI call generates the main health advice, with a safe, context-aware default message as a fallback.
4.  **API Response**: The API returns a JSON object with `response`, `emergencyFacilities`, `pricing`, and `insurancePlans`.
5.  **UI Rendering**: `app/src/components/Chat.tsx` renders the data in a tabbed interface using standardized card components.

## 3. Frontend Development Standards

### Design Philosophy: Mobile-First and Health-Centered

-   **Mobile-First is Mandatory**: All components must be designed for mobile first, then scaled up using responsive Tailwind CSS classes.
-   **Health-Centered Aesthetic**: Use the professional, clean color palette from `app/src/app/globals.css`.
    -   **Primary**: `emerald`, `teal`, `blue`.
    -   **Urgency**: `red`, `orange`.
    -   **Neutral**: `slate`.
-   **Accessibility**: Ensure sufficient color contrast and use `focus-health` states.

### Component Architecture & Styling

-   **Card-Based UI**: Use the standardized `ProcedureCard`, `EmergencyCard`, and `InsuranceCard` components.
-   **TypeScript Interfaces**: All data passed to components MUST be strictly typed according to the interfaces defined in the component files.
-   **Utility-First Styling**: Use Tailwind CSS for all styling.
-   **No Animation Libraries**: **Do not use `framer-motion`**. Use the custom CSS animation classes (e.g., `animate-fade-in-up`) from `globals.css` to prevent build issues.

## 4. Backend Development Standards

### Type Safety and Data Consistency

-   **Strict Typing is Mandatory**: All variables must have explicit TypeScript types (e.g., `let results: Procedure[] = [];`).
-   **Data Shape Consistency**:
    -   **DO NOT use `null` for optional properties**. Omit the property (e.g., `imageUrl`) entirely if it's not present.
    -   Ensure primitive types (`string`, `number`) match the interface definitions exactly.
-   **Environment Variables**: API keys (`OPENAI_API_KEY`, `SCRAPER_API_KEY`) must be stored as environment variables and not hard-coded.

## 5. Deployment & Troubleshooting

### Standard Deployment Process

1.  Push changes to the `main` branch.
2.  Vercel will automatically trigger a deployment.
3.  Set `OPENAI_API_KEY` and `SCRAPER_API_KEY` in Vercel project settings.

### Common Build Errors & Solutions

| Error Log Snippet                                            | Cause & Solution                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Error: It's currently unsupported to use "export *"`        | **Cause**: `framer-motion` compatibility issue. <br> **Solution**: **Do not use `framer-motion`**. Use custom CSS animations from `globals.css` instead.                                                                                                                                                                                                                                                            |
| `Type error: Type '{...}' is not assignable to type '...'`   | **Cause**: Data doesn't match the TypeScript interface. <br> **Solutions**: 1. Omit optional properties instead of using `null`. 2. Ensure primitive types match (e.g., `number` vs `string`). 3. Provide explicit types for variables (`let data: MyType[] = []`).                                                                                                                                                        |
| `Error: 'variableName' is assigned a value but never used`   | **Cause**: Unused variable declaration. <br> **Solution**: Remove the unused variable.                                                                                                                                                                                                                                                                                                                             |

## 6. Key Components & Files

-   **Main Entrypoint**: `app/src/app/page.tsx`
-   **Chat Interface**: `app/src/components/Chat.tsx`
-   **Backend Logic**: `app/src/app/api/chat/route.ts`
-   **Web Scraping Logic**: `app/src/lib/webSearch.ts`
-   **Data Display Cards**: `ProcedureCard.tsx`, `EmergencyCard.tsx`, `InsuranceCard.tsx`
-   **Styling & Animations**: `app/src/app/globals.css`
-   **Insurance Data**: `app/src/lib/insurance.ts`, `app/src/data/insurancePlans.json`

