import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import cp from 'node:child_process'
import fs from 'node:fs'

async function serve() {
    const result = cp.spawnSync('moon', ['build', '--target', 'js', '--debug'], { stdio: 'inherit' })
    if (result.status != 0) {
        return;
    }
    fs.copyFileSync('target/js/debug/build/main/main.js', './src/main.js')
    fs.copyFileSync('target/js/debug/build/main/main.js.map', './src/main.js.map')
}

async function build() {
    const result = cp.spawnSync('moon', ['build', '--target', 'js'], { stdio: 'inherit' })
    if (result.status != 0) {
        return;
    }
    fs.copyFileSync('target/js/release/build/main/main.js', './src/main.js')
    fs.rmSync('target/js/release/build/main/main.js.map', { force: true })
}

async function run(watchMode) {
    if (watchMode) {
        serve();
    } else {
        build();
    }
}

/**
 * @type {import('vite').Plugin}
 */
const plugin = {
    async buildStart() {
        run(this.meta.watchMode)
    },
    async handleHotUpdate({ file }) {
        if (file.endsWith('.mbt')) { run(true) }
    },
}

export default defineConfig({
    root: 'src',
    plugins: [plugin, tailwindcss()],
})