export default {
    server: {
        proxy: {
            '/events/messages': {
                target: 'http://localhost:3030',
                changeOrigin: true,
            },
            '/events/lobbies': {
                target: 'http://localhost:3030',
                changeOrigin: true,
            },
        },
    },
};
