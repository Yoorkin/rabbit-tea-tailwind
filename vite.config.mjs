import { defineConfig } from 'vite'
import chokidar from 'chokidar'
import cp from 'node:child_process'
import fs from 'node:fs'

/**
 * @type {import('vite').Plugin}
 */
var moonProcess = null
const plugin = {
    buildStart() {
        fs.rmSync('target/web', { recursive: true, force: true })
        fs.mkdirSync('target/web', { recursive: true })

        moonProcess = cp.spawn('moon', ['build', '--target', 'js', '--watch'], { stdio: 'ignore' });

        function build() {
            // cp.execSync('moon build --target js')            
            cp.execSync('tailwindcss -i src/styles.css -o target/web/styles.css')

            fs.copyFileSync('target/js/release/build/main/main.js', 'target/web/main.js')
            fs.copyFileSync('src/index.html', 'target/web/index.html')
        }

        build()

        chokidar.watch([
            'target/js/release/build/main/main.js',
            'src/main/index.html',
            'src/main/styles.css'], 
            { ignoreInitial: true }).on('all', (event, path) => {
                build()
            })
    },
    closeBundle() {
        if (moonProcess) {
            moonProcess.kill()
            console.log('moon process exited.')
        }
    }
}

export default defineConfig({
    root: 'target/web',
    plugins: [plugin],
})