import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Hash 路由保持文档路径不变；相对资源路径兼容 Pages 仓库子路径。
export default defineConfig({ base: './', plugins: [react()] });
