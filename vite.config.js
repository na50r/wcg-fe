export default {
    base: "/wcg-fe",
    server: {
        proxy: {
            '/events': {
                target: 'http://localhost:3030',
                changeOrigin: true,
            },
        },
    },
};

