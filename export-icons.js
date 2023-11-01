import './src/lib/icons/icons.js';

import { getIcon, listIcons } from 'iconify-icon';

import { promises as fs } from 'fs';
import svg2img from 'svg2img';

import {
    IconSet,
    importDirectory,
    cleanupSVG,
    runSVGO,
    parseColors,
    isEmptyColor,
} from '@iconify/tools';

// Load icons we want to export
const iconSet = new IconSet({
    prefix: 'hid',
    icons: {
        'rocket': getIcon('majesticons:rocket-3-start-line'),
        'car-off': getIcon('mdi:car-off'),
        'car': getIcon('mdi:car'),
        'bolt': getIcon('fa6-solid:bolt'),
        'error': getIcon('fluent:shield-error-24-filled'),
        'ban': getIcon('fa6-solid:ban'),
    }
});


(async () => {
    await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') {
            return;
        }

        const svg = iconSet.toSVG(name);
        if (!svg) {
            // Invalid icon
            iconSet.remove(name);
            return;
        }

        // Clean up and optimise icons
        try {
            // Cleanup icon code
            await cleanupSVG(svg);

            // Assume icon is monotone: replace color with currentColor, add if missing
            // If icon is not monotone, remove this code
            //await parseColors(svg, {
            //    defaultColor: 'currentColor',
            //    callback: (attr, colorStr, color) => {
            //        return !color || isEmptyColor(color) ? colorStr : 'currentColor';
            //    },
            //});

            // Optimise
            await runSVGO(svg);
        } catch (err) {
            // Invalid icon
            console.error(`Error parsing ${name}:`, err);
            iconSet.remove(name);
            return;
        }

        // Update icon
        iconSet.fromSVG(name, svg);
    });

    // Export all icons
    await iconSet.forEach(async (name) => {
        const svg = iconSet.toString(name);
        if (!svg) {
            return;
        }

        // Save SVG to file
        // await fs.writeFile(`output/${name}.svg`, svg, 'utf8');
        // console.log(`Saved output/${name}.svg (${svg.length} bytes)`);

        svg2img(svg, {
                resvg: {
                    fitTo: {
                        mode: 'width', // or height
                        value: 24,
                    },
                }
            },
            function (error, buffer) {
                // returns a Buffer
                fs.writeFile(`output/${name}.png`, buffer);
                console.log(`Saved output/${name}.png (${buffer.length} bytes)`);
            });
    });
})();
