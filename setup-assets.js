const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\d7539055-2518-4c4c-ba1c-7463fde40b0b';
const destDir = path.join(__dirname, 'src', 'renderer', 'assets', 'tutorial');
const logFile = path.join(__dirname, 'setup.log');

function log(msg) {
    try {
        fs.appendFileSync(logFile, msg + '\n');
        console.log(msg);
    } catch (e) {
        console.error('Log failed:', e);
    }
}

log(`Starting setup. Script dir: ${__dirname}`);
log(`Target dir: ${destDir}`);

try {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        log(`Created directory: ${destDir}`);
    } else {
        log(`Directory already exists: ${destDir}`);
    }

    const files = [
        { src: 'tutorial_shortcuts_1764943913223.png', dest: 'shortcuts.png' },
        { src: 'tutorial_ai_analysis_1764943932168.png', dest: 'ai_analysis.png' },
        { src: 'tutorial_productivity_1764943967344.png', dest: 'productivity.png' }
    ];

    files.forEach(file => {
        const srcPath = path.join(srcDir, file.src);
        const destPath = path.join(destDir, file.dest);

        if (fs.existsSync(srcPath)) {
            try {
                fs.copyFileSync(srcPath, destPath);
                log(`Copied ${file.src} to ${file.dest}`);
            } catch (err) {
                log(`Error copying ${file.src}: ${err.message}`);
            }
        } else {
            log(`Source file not found: ${srcPath}`);
        }
    });
    log('Done.');
} catch (err) {
    log(`Fatal error: ${err.message}`);
}
