export default {
    base: '/',
    server: {
        proxy: {
            '/events': {
                target: 'https://wcg-be.onrender.com',
                changeOrigin: true,
            },
        },
    },
};
