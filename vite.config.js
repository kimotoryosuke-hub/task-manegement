import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Reactの場合。Vueならここが違います

export default defineConfig({
  plugins: [react()],
  base: '/task-manegement/', // ←ここを追加！必ず / で囲んでリポジトリ名を書く
})

