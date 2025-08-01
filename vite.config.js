import { defineConfig, loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        server: {
            proxy: {
                '/events': {
                    target: env.VITE_API,
                    changeOrigin: true,
                },
            },
        },
    };
});
