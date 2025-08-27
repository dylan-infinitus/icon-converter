// svg-to-png.cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IN_DIR = process.argv[2] || 'node_modules/lucide-static/icons';
const OUT_BASE = process.argv[3] || 'icons-png';
const sizes = process.argv.slice(4).map(s => parseInt(s, 10)).filter(Boolean);
if (sizes.length === 0) sizes.push(48);

if (!fs.existsSync(OUT_BASE)) fs.mkdirSync(OUT_BASE, { recursive: true });

const files = fs.readdirSync(IN_DIR).filter(f => f.toLowerCase().endsWith('.svg'));

(async () => {
    console.log(`Converting ${files.length} SVGs → ${OUT_BASE} at sizes: ${sizes.join(', ')}`);
    for (const file of files) {
        const name = path.basename(file, '.svg');
        const svgBuffer = fs.readFileSync(path.join(IN_DIR, file));

        for (const size of sizes) {
            const outDir = sizes.length > 1 ? path.join(OUT_BASE, String(size)) : OUT_BASE;
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

            const outPath = path.join(outDir, `${name}.png`);
            await sharp(svgBuffer, { density: 300 })
                .resize(size, size)
                .png()
                .toFile(outPath);
        }
    }
    console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });
