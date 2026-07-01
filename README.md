# WòFlix — Entertainment Web App

## Overview

WòFlix is a high-performance media-discovery platform built with **React 19**, **TypeScript**, and **Tailwind CSS**. It provides a Netflix-like experience for browsing movies and TV series, featuring user authentication, personalized bookmarking, watch history, and rich content discovery powered by **The Movie Database (TMDB) API**.

## Features

### Content Discovery
- **Trending Carousel** — Auto-sliding, swipeable carousel of trending movies and shows with a Top 10 numbered badge
- **Genre Rows** — Dedicated horizontal rows for Action, Comedy, Drama, Sci-Fi, and more
- **Top Rated & New Releases** — Curated sections for popular and recently released content
- **Infinite Scroll** — Seamless loading of additional content on Movies and Series pages
- **Genre Filtering** — Filter movies and TV series by genre with chip-style buttons

### User Features
- **User Authentication** — Secure sign-up and login powered by Firebase Auth with persistent sessions
- **Bookmarks (My List)** — Save content to a personalized list with category tabs (All / Movies / Series) and an empty-state guide
- **Continue Watching** — Automatically tracks in-progress items with a visual progress bar
- **Watch History** — Full browsing history with the ability to revisit any item
- **Dark Mode** — Toggle between dark and light themes from the Profile page

### Search
- **Global Search** — Context-aware search that prioritizes results based on the current view
- **URL-Persisted Queries** — Search state is preserved in the URL, surviving navigation and page reloads

### Detail Pages
- **Full-Screen Trailer Hero** — Auto-playing YouTube trailer with mute toggle and full opacity
- **Cast & Crew** — Scrollable cast row with character details
- **Similar & Recommendations** — Related content suggestions powered by TMDB
- **Watch Now** — In-app streaming with season/episode selector for TV series

### Technical Highlights
- **Responsive Design** — Mobile-first layout with adaptive grid and carousel breakpoints
- **Optimized Performance** — Vite for fast builds, TanStack Query for efficient caching and server-state management
- **PWA Support** — Service worker caching and installable web app manifest

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Isaacayomi/Entertainment-web-app.git
cd Entertainment-web-app
npm install
```

### Environment Variables

Create a `.env` file in the root directory with your Firebase and TMDB credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=woflix
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Usage

1. **Sign Up / Login** — Create an account or log in to access the dashboard
2. **Browse** — The Home page features Trending (auto-sliding carousel), Continue Watching, Genre Rows, Top Rated, and New Releases
3. **Filter** — Use genre chips on Movies and Series pages to narrow down content
4. **Search** — Use the top search bar to find titles by name across all categories
5. **Bookmark** — Click the bookmark icon on any card to save it to "My List"
6. **Watch** — Click any card to view the detail page with trailer, cast, and similar recommendations
7. **Track** — Your watch progress is automatically saved under Continue Watching
8. **History** — Access your full watch history from the sidebar

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Vite 7** | Build Tool |
| **Firebase** | Authentication & Database |
| **TanStack Query 5** | Server-State Management |
| **Tailwind CSS 3** | Styling |
| **React Router 6** | Routing |
| **Swiper 12** | Carousel Components |
| **React Hook Form 7** | Form Handling |
| **React Hot Toast** | Notifications |
| **TMDB API** | Content Data |

## Author

**Isaacayomi**

- LinkedIn: [https://www.linkedin.com/in/isaac-ayomide-okunlola-3568b7275/](https://www.linkedin.com/in/isaac-ayomide-okunlola-3568b7275/)
- Twitter: [https://x.com/_devPRIME](https://x.com/_devPRIME)

---

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
