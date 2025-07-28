export default {
    base: "/wcg-fe",
    server: {
        proxy: {
            '/events': {
                target: 'https://wcg-be.onrender.com',
                changeOrigin: true,
            },
        },
    },
};

