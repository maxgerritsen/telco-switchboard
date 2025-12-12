# Telco Switchboard

A tool to compare household telecommunication contracts side-by-side. It calculates the financial impact of switching providers over distinct timeframes (Contract End, +1 Year, +2 Years).

## Features

-   **Smart Comparison**: Instantly see the cost difference between your current setup and potential new plans.
-   **Timeline Projections**: View projected savings at the end of your contract, and see how they evolve 1 and 2 years into the future.

## Tech Stack

-   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

-   **Node.js**
-   **npm**

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/maxgerritsen/telco-switchboard.git
    cd telco-switchboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

-   `src/components`: UI components.
-   `src/hooks`: Custom React hooks.
-   `src/store`: Zustand state management stores.
-   `src/lib`: Utility functions and comparison logic.
-   `src/types.ts`: TypeScript definitions used across the app.

---

Made by [Max Gerritsen](https://www.linkedin.com/in/maxgerritsen/)
