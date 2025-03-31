import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import cp from 'node:child_process'
import fs from 'node:fs'

async function buildMoon() {
    await new Promise((resolve, reject) => {
        const moonProcess = cp.spawn('moon', ['build', '--target', 'js']);

        moonProcess.on('exit', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error('moon build failed'))
            }
        })
    })

    fs.copyFileSync('target/js/release/build/main/main.js', './src/main.js')
}

/**
 * @type {import('vite').Plugin}
 */
const plugin = {
    async buildStart() {
        await buildMoon()
    },
    async handleHotUpdate({ file }) {
        if (file.endsWith('.mbt')) {
            await buildMoon()
        }
    },
}

export default defineConfig({
    root: 'src',
    plugins: [plugin, tailwindcss()],
})