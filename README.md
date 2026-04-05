# 100 Перших Продуктів — Baby Food Checklist

A production-grade **Expo + React Native + TypeScript** mobile app for tracking your baby's first 100 foods journey. Supports Ukrainian and English, dark/light themes, backend API integration with JWT authentication, and full progress statistics.

---

## Features

- ✅ **126+ pre-loaded foods** across 8 categories (vegetables, fruits, dairy, meat, grains, nuts/seeds, fish, spices)
- 🔐 **JWT Authentication** — register/login with multi-user data isolation
- 🌐 **Backend-first** — all data stored on the API server (no local-only storage)
- 📊 **Statistics screen** with progress tracking by category
- ❤️ **Favorites & Ratings** (liked / neutral / disliked) per food
- 📝 **Reaction notes** for allergy tracking
- 🌍 **Bilingual** — Ukrainian (uk) + English (en)
- ➕ **Custom products** (user-added items via API)
- 🤖 **MCP Server** — AI assistant integration for nutrition advice
- 🔔 **Expo Router** file-based navigation with tabs

---

## Tech Stack

| Tech | Version |
|------|---------|
| Expo SDK | ~52.0.0 |
| Expo Router | ~4.0.0 |
| React Native | 0.76.9 |
| TypeScript | ^5.3.3 |
| Zustand | ^5.0.2 |
| React Native Paper | ^5.12.3 |
| i18next | ^23.7.16 |
| Backend API | [baby-food-checklist-api](https://github.com/romanferents/baby-food-checklist-api) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- [Expo Go](https://expo.dev/client) app on your phone, or an Android/iOS simulator
- **Backend API** running locally — see [baby-food-checklist-api](https://github.com/romanferents/baby-food-checklist-api)

### Installation

```bash
git clone https://github.com/romanferents/baby-food-checklist-ui.git
cd baby-food-checklist-ui
npm install
```

### Starting the Backend API

```bash
# In a separate terminal — clone and start the backend
git clone https://github.com/romanferents/baby-food-checklist-api.git
cd baby-food-checklist-api
docker-compose up postgres -d
dotnet run --project src/BabyFoodChecklist.API
```

The API runs at **http://localhost:5247** by default.

### Running the App

```bash
npm start
```

1. Scan the QR code with **Expo Go**
2. Register a new account on the Register screen
3. Go to **Settings → API Server** and enter your API URL (e.g., `http://192.168.x.x:5247`)
4. Tap **Sync Now** to load all products from the backend

---

## Architecture — Backend-First

This app uses the **backend API** as the single source of truth for all data:

| Feature | How it works |
|---------|-------------|
| **Products** | Fetched from `GET /odata/v1/Products` (126+ default products are seeded by the API) |
| **Entries** (tried, rating, notes, favorite) | Fetched from `GET /odata/v1/Entries`, created/updated via `POST /api/v1/entries` (upsert) |
| **Custom products** | Created via `POST /api/v1/products`, deleted via `DELETE /api/v1/products/{id}` |
| **Statistics** | Fetched from `GET /api/v1/statistics` |
| **Authentication** | JWT via `POST /api/v1/auth/login` and `POST /api/v1/auth/register` |

All API endpoints (except auth) require `Authorization: Bearer <token>` header. The `authenticatedFetch` wrapper in `src/services/api.ts` handles this automatically and logs the user out on 401 responses.

---

## MCP Server Integration

The project includes configuration for the **Baby Food Checklist MCP Server**, which gives AI assistants (GitHub Copilot, Claude, etc.) direct access to your baby food data.

### Setup

1. Make sure the backend API + PostgreSQL are running
2. The MCP server config is already in `.vscode/mcp.json`
3. Open this project in VS Code with GitHub Copilot

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_all_products` | List all 126+ products with bilingual names, grouped by category |
| `get_product_by_name` | Search products by Ukrainian or English name (partial match) |
| `get_products_by_category` | Get all products in a specific category |
| `get_statistics` | Get overall + per-category progress with visual progress bars |
| `get_tried_foods` | List all foods baby has tried, with ratings, dates, and notes |
| `get_untried_foods` | List foods not yet tried, optionally filtered by category |
| `get_food_entries_with_reactions` | Get entries with reaction notes (allergy tracking) |
| `suggest_next_foods` | Age-appropriate food suggestions based on current progress |
| `get_allergen_info` | Allergen risks and safety guidelines for a specific food |
| `analyze_diet_balance` | Identify nutritional gaps across food categories |
| `get_introduction_schedule` | Generate a weekly plan for introducing new foods |
| `get_category_recommendations` | Detailed recommendations for a specific food category |

### Sample Prompts for MCP Server

Here are example prompts you can use with GitHub Copilot (or Claude) once the MCP server is running:

#### 📊 Progress & Statistics
```
"Show me our baby food progress — how many foods have we tried so far?"
"What's our progress in each food category?"
"Which categories are we falling behind in?"
```

#### 🥦 Discovering Foods
```
"What fruits hasn't my baby tried yet?"
"Search for products that contain 'rice'"
"Show me all foods in the dairy category"
```

#### 🍽 Meal Planning
```
"My baby is 8 months old — what should we try next?"
"Create a 2-week schedule for introducing new foods"
"Suggest 5 new foods from categories we haven't explored much"
```

#### ⚠️ Allergy & Safety
```
"Show me all foods where we noted a reaction"
"What are the allergen risks for introducing peanut butter?"
"Is our diet balanced? What food groups are we missing?"
```

#### 📝 Tracking
```
"List all foods we've marked as 'liked'"
"Show recently tried foods with their ratings"
"Which foods did we mark as disliked?"
```

---

## Development

### Project Structure

```
app/                    # Expo Router screens
  (tabs)/               # Tab navigator screens
    index.tsx           # Products list
    statistics.tsx      # Statistics
    settings.tsx        # Settings (API URL, language, baby info, etc.)
  login.tsx             # Login screen
  register.tsx          # Registration screen
  product/[id].tsx      # Product detail (tried toggle, rating, notes)
  add-product.tsx       # Add custom product (POST to API)
src/
  components/           # Reusable UI components
  features/
    auth/               # Auth store, hooks, types (JWT token persistence)
    products/           # Products store (API-backed), selectors, hooks
  services/
    api.ts              # Complete backend API integration layer
    backup.ts           # Export/import helpers
  i18n/                 # Translations (uk, en)
  theme/                # React Native Paper theme
  hooks/                # Custom React hooks
  utils/                # Date, categories helpers
  constants/            # App-wide constants
__tests__/              # Jest tests
```

### Scripts

```bash
npm test          # Run tests
npm run lint      # ESLint
npm run typecheck # TypeScript type check
```

### Adding a Translation

Add the key to both `src/i18n/locales/uk.json` and `src/i18n/locales/en.json`:

```json
// uk.json
{ "myKey": "Мій текст" }

// en.json
{ "myKey": "My text" }
```

Use in component: `const { t } = useTranslation(); t('myKey')`

---

## Building for Production

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

### Local Build

```bash
# Android APK
npx expo run:android --variant release

# iOS (macOS only)
npx expo run:ios --configuration Release
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npx jest --watchAll

# Run with coverage
npx jest --coverage
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT © Roman Ferents

---

## Links

- [Expo Documentation](https://docs.expo.dev)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Expo Router](https://expo.github.io/router/docs)