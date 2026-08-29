var require = createRequire(import.meta.url);
var module = { exports: {} };

module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // The path to your React components/files
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
