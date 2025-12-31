# Influencer Finder

An application to find and filter influencers for group buying (Gonggu).

## Features

- **Search**: Filter by name, Instagram ID, or category.
- **Categories**: Fixed categories (일상, 식품, 육아, 리빙, 패션, 다이어트, 뷰티, 여행, 피트니스, 교육) for easy navigation.
- **Profile Images**: Automatically crawls profile images (with fallback strategies).
- **Direct Link**: Clickable IDs to open Instagram profiles.
- **Batch Actions**: Select multiple influencers to send DMs (opens Instagram Inbox).
- **Korean Localization**: Follower counts formatted in '만' units.

## Getting Started

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Run the development server**:
    ```bash
    npm run dev
    ```

3. **Build for production**:
    ```bash
    npm run build
    ```

## Deployment

### Deploy to Vercel (Recommended)

1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up/login.
3. Click "Add New..." -> "Project".
4. Import your GitHub repository.
5. Click "Deploy".
6. You will get a live URL (e.g., `https://influencer-finder.vercel.app`).
