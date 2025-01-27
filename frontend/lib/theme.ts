export const themeConfig = {
  lightMode: {
    background: {
      DEFAULT: "var(--ds-background-100)",
      secondary: "var(--ds-background-200)",
    },
    colors: {
      gray: {
        100: "hsl(var(--ds-gray-100-value))",
        // ... through 1000
      },
      blue: {
        100: "hsl(var(--ds-blue-100-value))",
        // ... through 1000
      },
      // ... other color scales
    },
  },
};
