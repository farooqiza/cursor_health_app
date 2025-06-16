---
description:
globs:
alwaysApply: false
---
# Frontend Development Standards

This document outlines the best practices for frontend development in the Health Assistant application. All new frontend code should adhere to these guidelines.

## 1. Design Philosophy: Mobile-First and Health-Centered

-   **Mobile-First is Mandatory**: All components and layouts MUST be designed for mobile screens first, then scaled up for desktop. Use responsive Tailwind CSS classes (e.g., `sm:`, `md:`) to adapt layouts for larger screens.
-   **Health-Centered Aesthetic**: The UI should feel professional, clean, and reassuring. Use the established color palette from `app/src/app/globals.css`.
    -   **Primary Colors**: Use the `emerald`, `teal`, and `blue` color families for primary actions, gradients, and highlights.
    -   **Urgency Colors**: Use `red` and `orange` for emergency-related components and notifications (e.g., `EmergencyCard`).
    -   **Neutral Colors**: Use the `slate` color family for text and backgrounds.
-   **Accessibility**: Ensure sufficient color contrast, provide focus states (`focus-health`), and respect user preferences (`prefers-reduced-motion`).

## 2. Component Architecture

-   **Single Responsibility**: Each component should have a single, well-defined purpose.
-   **Card-Based UI**: Data is primarily displayed using a set of standardized card components:
    -   `ProcedureCard`: For displaying medical services, procedures, and pharmacy information.
    -   `EmergencyCard`: For displaying emergency facilities. It has a distinct, high-urgency design.
    -   `InsuranceCard`: For displaying insurance plan details.
-   **TypeScript Interfaces**: All data passed to components MUST be strictly typed. The interfaces for the card components are defined directly within their respective files (e.g., `interface Procedure` in `ProcedureCard.tsx`).

## 3. Styling with Tailwind CSS & Custom Animations

-   **Utility-First**: Use Tailwind CSS for all styling. Avoid writing custom CSS in component files.
-   **Custom Animations**: All animations are handled via custom CSS classes defined in `app/src/app/globals.css`.
    -   **DO NOT use animation libraries like `framer-motion`** to avoid build compatibility issues with Next.js.
    -   Use classes like `animate-fade-in-up`, `animate-scale-in`, and `animate-slide-up`.
    -   Use `animation-delay-*` classes for staggered animations.
-   **Example Implementation**:
    ```tsx
    // ✅ DO: Use custom CSS animation classes
    <div className="animate-fade-in-up animation-delay-200">
      Your content here
    </div>

    // ❌ DON'T: Use Framer Motion or other animation libraries
    // <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    //   Your content here
    // </motion.div>
    ```

## 4. Chat Interface (`Chat.tsx`)

-   **Tabbed Navigation**: The assistant's response is organized into three tabs: `Health Advice`, `Facilities & Pricing`, and `Insurance`. These tabs must always be present.
-   **Touch-Friendly**: Tab buttons must have a minimum height of 44px to be easily tappable on mobile devices.
-   **Efficient Use of Space**: Use responsive text sizes, compact spacing, and a `max-h-[60vh]` (mobile) / `max-h-[50vh]` (desktop) with vertical scrolling to ensure the chat interface fits well on all screens.
