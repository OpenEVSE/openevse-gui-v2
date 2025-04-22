import './src/lib/icons/icons.js';

import { getIcon, listIcons } from 'iconify-icon';

import { promises as fs } from 'fs';
import svg2img from 'svg2img';

import {
    IconSet,
    cleanupSVG,
    runSVGO,
    parseColors,
    isEmptyColor,
    scaleSVG,
} from '@iconify/tools';
import {
    wrapSVGContent,
    parseSVGContent,
    convertParsedSVG,
} from '@iconify/utils';

// Load icons we want to export
const iconSet = new IconSet({
    prefix: 'hid',
    icons: {
        'start': getIcon('majesticons:rocket-3-start-line'),
        'not_connected': getIcon('fa6-solid:hourglass-half'),
        'connected': getIcon('fa6-solid:thumbs-up'),
        'charging': getIcon('fa6-solid:bolt'),
        'error': getIcon('fluent:shield-error-24-filled'),
        'sleeping': getIcon('fa6-solid:ban'),
        'disabled': getIcon('fa6-solid:circle-xmark'),
        'car_disconnected': getIcon('mdi:car-off'),
        'car_connected': getIcon('mdi:car'),
    }
});

const is_info = '#32b3d4';
const is_primary = '#3fd290';
const is_dark = '#116a88';
const is_danger = '#f14668';
const has_text_white = '#ffffff';
const has_text_warning = '#ebe009';

const iconColours = {
    'start': {
        'fill': is_info,
        'color': has_text_white
    },
    'not_connected': {
        'fill': is_primary,
        'color': has_text_white
    },
    'connected': {
        'fill': is_primary,
        'color': has_text_white
    },
    'charging': {
        'fill': is_primary,
        'color': has_text_warning
    },
    'error': {
        'fill': is_danger,
        'color': has_text_white
    },
    'sleeping': {
        'fill': is_dark,
        'color': has_text_white
    },
    'disabled': {
        'fill': is_dark,
        'color': has_text_white
    },
    'car_disconnected': {
        'fill': is_dark,
        'color': has_text_white
    },
    'car_connected': {
        'fill': is_primary,
        'color': has_text_white
    }
};

(async () => {
    await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') {
            return;
        }

        let svg = iconSet.toSVG(name);
        if (!svg) {
            // Invalid icon
            iconSet.remove(name);
            return;
        }

        // Clean up and optimise icons
        try {
            // Cleanup icon code
            await cleanupSVG(svg);

            // Assume icon is monotone: replace color with #ff, add if missing
            await parseColors(svg, {
                defaultColor: iconColours[name].color,
                callback: (attr, colorStr, color) => {
                    return !color || isEmptyColor(color) ? colorStr : iconColours[name].color;
                },
            });

            scaleSVG(svg, 20 / svg.viewBox.height);

            // Optimise
            await runSVGO(svg);

            const parsed = parseSVGContent(svg.$svg.html());
            if (!parsed) {
               throw new Error('Invalid icon')
            }

            // Validate and clean up attributes, return object with attributes and body
            const icon = convertParsedSVG(parsed);
            if (!icon) {
               throw new Error('Invalid icon')
            }

            const x = (46 - icon.width) / 2;

            const newIcon = {
                ...icon,
                width: 46,
                height: 34,
                body: wrapSVGContent(icon.body, `<rect x="0" y="0" rx="4" ry="4" width="46" height="34" style="fill:${iconColours[name].fill};" />
                <g transform="translate(${x}, 7)">`, '</g>')
             }

            // update SVG from new icon
            const tempIconSet = new IconSet({
                prefix: 'temp',
                icons: {
                    'temp': newIcon
                }
            });

            svg = tempIconSet.toSVG('temp');

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
                    background: '#ffffff',
                }
            },
            function (error, buffer) {
                // returns a Buffer
                let file = `gui-tft/${name}.png`;
                fs.writeFile(file, buffer);
                console.log(`Saved ${file} (${buffer.length} bytes)`);
            });
    });
})();
