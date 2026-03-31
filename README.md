# 100 Перших Продуктів — Baby Food Checklist

A production-grade **Expo + React Native + TypeScript** mobile app for tracking your baby's first 100 foods journey. Supports Ukrainian and English, dark/light themes, offline-first data storage, and full progress statistics.

---

## Features

- ✅ **126 pre-loaded foods** across 7 categories (vegetables, fruits, dairy, meat, grains, nuts/seeds, fish)
- 📊 **Statistics screen** with progress tracking by category
- ❤️ **Favorites & Ratings** (liked / neutral / disliked) per food
- 📝 **Reaction notes** for allergy tracking
- 🌍 **Bilingual** — Ukrainian (uk) + English (en)
- 🌙 **Dark / Light mode** (follows system)
- 💾 **Offline-first** with Zustand + AsyncStorage + SQLite
- ➕ **Custom products** (up to 50 user-added items)
- 📤 **Export / Import** JSON backup
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
| expo-sqlite | ~15.0.4 |
| i18next | ^23.7.16 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- [Expo Go](https://expo.dev/client) app on your phone, or an Android/iOS simulator

### Installation

```bash
git clone https://github.com/romanferents/baby-food-checklist-ui.git
cd baby-food-checklist-ui
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

Scan the QR code in your terminal with the **Expo Go** app on your phone.

---

## Windows Setup

1. Install [Node.js LTS](https://nodejs.org) (v20+)
2. Install [Git for Windows](https://git-scm.com/download/win)
3. Open **PowerShell** or **Windows Terminal**:

```powershell
git clone https://github.com/romanferents/baby-food-checklist-ui.git
cd baby-food-checklist-ui
npm install
npm start
```

4. Install **Expo Go** from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [App Store](https://apps.apple.com/app/expo-go/id982107779)
5. Scan the QR code shown in the terminal

---

## Development

### Project Structure

```
app/                    # Expo Router screens
  (tabs)/               # Tab navigator screens
    index.tsx           # Products list
    statistics.tsx      # Statistics
    settings.tsx        # Settings
  product/[id].tsx      # Product detail
  add-product.tsx       # Add custom product
src/
  components/           # Reusable UI components
  features/products/    # Zustand store, data, selectors, hooks
  services/             # SQLite, API, backup
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

### Adding a New Food Product

1. Open `src/features/products/products.data.ts`
2. Add a new `makeProduct(...)` call with the next sequential ID:

```typescript
makeProduct('p127', 'Назва українською', 'English Name', 'category'),
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