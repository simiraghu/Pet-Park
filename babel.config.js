module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // You can add other plugins here if needed
    'react-native-reanimated/plugin', // ✅ This MUST be last
  ],
};
