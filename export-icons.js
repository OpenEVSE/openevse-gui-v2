import './src/lib/icons/icons.js';

import { getIcon, listIcons } from 'iconify-icon';
import pkg from 'convert-svg-to-png';
const { convert } = pkg;
import 'fs';
import { IconSet } from '@iconify/tools';


const icons = listIcons();
console.log(icons);

let icon = getIcon('fa6-solid:bolt');
console.log(icon);

const iconSet = new IconSet({
    prexix: 'hid',
    icons: {
        'bolt': {
            body: getIcon('fa6-solid:bolt').body
        }
    }
});

let svg = iconSet.getSVG('bolt');
let png = await convert(svg);

// save the PNG
fs.writeFileSync('bolt.png', png);
