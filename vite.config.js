export default {
    base: "/wc-fe",
    server: {
        proxy: {
            '/events': {
                target: 'http://localhost:3030',
                changeOrigin: true,
            },
        },
    },
};

