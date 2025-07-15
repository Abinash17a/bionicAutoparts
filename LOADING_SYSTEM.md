# Loading System Documentation

## Overview
This loading system provides a beautiful animated loading experience for page transitions and manual loading states throughout the Bionics Autoparts application.

## Features
- **Initial Page Load**: 2-second loading delay for smooth first-time experience
- **Automatic Page Transitions**: Shows loading animation when navigating between pages
- **Manual Loading Control**: Ability to trigger loading states for specific actions
- **Animated Logo**: Company logo with smooth animations
- **Progress Bar**: Visual progress indicator using NProgress
- **Image Loading Optimization**: Prevents flickering of images (especially trust-payment-delivery.png)
- **Responsive Design**: Works on all screen sizes
- **Custom Styling**: Matches the app's design system

## Components

### 1. PageTransitionLoader
The main loading component that displays:
- Animated company logo
- Spinning loader with multiple layers
- Loading text with fade effects
- Progress bar animation

### 2. LoadingContext
Global context that manages loading state across the application.

### 3. usePageLoading Hook
Custom hook for manual loading control in components.

## Usage

### Automatic Page Transitions
The loading system automatically shows when navigating between pages. No additional setup required.

### Manual Loading Control

```tsx
import { usePageLoading } from '@/app/hooks/usePageLoading';

const MyComponent = () => {
  const { isLoading, startLoading, stopLoading, withLoading } = usePageLoading();

  // Method 1: Manual control
  const handleAsyncAction = async () => {
    startLoading();
    try {
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  // Method 2: Using withLoading wrapper
  const handleAsyncActionWithWrapper = async () => {
    const result = await withLoading(async () => {
      return await someAsyncOperation();
    });
    // Loading automatically stops after operation completes
  };

  return (
    <div>
      <button onClick={handleAsyncAction}>Load Data</button>
    </div>
  );
};
```

### Example: Form Submission with Loading

```tsx
import { usePageLoading } from '@/app/hooks/usePageLoading';

const ContactForm = () => {
  const { withLoading } = usePageLoading();

  const handleSubmit = async (formData: FormData) => {
    await withLoading(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Submit form data
      await submitForm(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

## Customization

### Changing Loading Duration
Edit the timeout in `LoadingContext.tsx`:
```tsx
// For initial page load (first time)
const timer = setTimeout(() => {
  setIsLoading(false);
  setIsInitialLoad(false);
}, 2000); // Change this value (in milliseconds)

// For page transitions
const timer = setTimeout(() => {
  setIsLoading(false);
}, 800); // Change this value (in milliseconds)
```

### Customizing NProgress Styles
Modify the styles in `globals.css`:
```css
#nprogress .bar {
  background: linear-gradient(90deg, #your-color, #your-color);
  height: 4px; /* Change height */
}
```

### Customizing Loading Animation
Edit the `PageTransitionLoader.tsx` component to modify:
- Logo size and animation
- Spinner colors and speed
- Text content and styling
- Progress bar appearance

## Files Structure
```
src/app/
├── components/
│   ├── LoadingSpinner.tsx          # Basic loading spinner
│   ├── PageTransitionLoader.tsx    # Enhanced loading with animations
│   ├── Companyslider.tsx           # Updated with image loading optimization
│   └── Footer.tsx                  # Updated with optimized image loading
├── context/
│   └── LoadingContext.tsx          # Global loading state management
├── hooks/
│   └── usePageLoading.ts           # Custom hook for manual loading
└── layout.tsx                      # Root layout with LoadingProvider
```

## Dependencies
- `framer-motion`: For smooth animations
- `nprogress`: For progress bar functionality
- `tailwindcss`: For styling

## Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Framer Motion animations work in all modern browsers
- NProgress is compatible with all major browsers

