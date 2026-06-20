# 🌍 EcoTrack: AI-Powered Carbon Footprint Tracker

**Built for Google Prompt Wars 2026**

EcoTrack is a modern, responsive web application designed to help users track, visualize, and reduce their daily carbon footprint. Built under a strict 5-hour hackathon timeline, this MVP demonstrates the power of AI-assisted "vibe coding" combined with solid frontend architecture.

## ✨ Key Features
*   **Daily Activity Logging:** Clean UI to input daily commute, electricity usage, and dietary choices.
*   **Real-Time Carbon Calculation:** Instant conversion of daily activities into CO2 emissions (in kg).
*   **2030 Doomsday Forecast:** A data visualization chart using `recharts` that projects the user's current habits into a yearly timeline, comparing it against global sustainability targets.
*   **Gamification:** Users receive a 'Top 10% Eco-Warrior' badge for keeping daily emissions below 5kg.
*   **AI 'Eco-Advisor':** Dynamic, actionable tips generated to help users lower their specific high-emission categories.

## 🛠️ Tech Stack
*   **Frontend:** ReactJS, Vite, Tailwind CSS
*   **Data Visualization:** Recharts
*   **State Management:** React Hooks & Browser LocalStorage

## 🚀 How I Built This (The 5-Hour Sprint)
Building this MVP required prioritizing high-impact features using agile project management principles. 
1.  **Ideation & Prompting:** Utilized advanced AI prompting to quickly generate the initial boilerplate and UI components in React and Tailwind.
2.  **Component Refinement:** Refactored the AI-generated code to ensure a clean, maintainable component hierarchy and seamless state management.
3.  **Data Logic:** Implemented the emission calculation logic and connected it to the UI and LocalStorage for data persistence.

## 🔮 Future Scope
While this MVP currently utilizes LocalStorage for speed during the hackathon, the system is architected to be easily upgraded into a full-stack solution integrating a Node.js backend and a SQL database for persistent, cross-device user accounts and advanced analytics.