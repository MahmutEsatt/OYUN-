const SVGGraphics = {
    // Cute Minik Tilki (Little Fox)
    getFoxSVG: function(width = 140, height = 140) {
        return `
        <svg width="${width}" height="${height}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Tail -->
            <path d="M 140 140 Q 185 120 160 80 Q 140 110 130 130 Z" fill="#E65100" stroke="#BF360C" stroke-width="4"/>
            <path d="M 160 80 Q 170 95 160 110 Q 148 100 160 80 Z" fill="#FFFFFF"/>
            
            <!-- Body -->
            <ellipse cx="100" cy="140" rx="45" ry="38" fill="#FF7043" stroke="#D84315" stroke-width="4"/>
            <ellipse cx="100" cy="142" rx="25" ry="24" fill="#FFF3E0"/>
            
            <!-- Ears -->
            <polygon points="60,80 40,25 85,55" fill="#FF7043" stroke="#D84315" stroke-width="4"/>
            <polygon points="60,75 48,38 78,58" fill="#3E2723"/>
            
            <polygon points="140,80 160,25 115,55" fill="#FF7043" stroke="#D84315" stroke-width="4"/>
            <polygon points="140,75 152,38 122,58" fill="#3E2723"/>
            
            <!-- Head -->
            <path d="M 45 90 Q 100 50 155 90 Q 100 150 45 90 Z" fill="#FF7043" stroke="#D84315" stroke-width="4"/>
            
            <!-- White cheeks -->
            <path d="M 47 90 Q 75 125 100 125 Q 125 125 153 90 Q 100 140 47 90 Z" fill="#FFFFFF"/>
            
            <!-- Cute Eyes -->
            <circle cx="78" cy="88" r="8" fill="#212121"/>
            <circle cx="81" cy="85" r="3" fill="#FFFFFF"/>
            
            <circle cx="122" cy="88" r="8" fill="#212121"/>
            <circle cx="125" cy="85" r="3" fill="#FFFFFF"/>
            
            <!-- Nose -->
            <ellipse cx="100" cy="110" rx="9" ry="6" fill="#3E2723"/>
            <ellipse cx="98" cy="108" rx="3" ry="2" fill="#FFFFFF"/>
            
            <!-- Rosy Cheeks -->
            <circle cx="62" cy="102" r="8" fill="#FF8A80" opacity="0.6"/>
            <circle cx="138" cy="102" r="8" fill="#FF8A80" opacity="0.6"/>
        </svg>
        `;
    },

    // Shapes (Circle, Square, Triangle, Star)
    getShapeSVG: function(type, color = "#FF7B54", width = 60, height = 60) {
        if (type === 'circle') {
            return `<svg width="${width}" height="${height}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${color}" stroke="#333" stroke-width="4"/></svg>`;
        } else if (type === 'square') {
            return `<svg width="${width}" height="${height}" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" rx="10" fill="${color}" stroke="#333" stroke-width="4"/></svg>`;
        } else if (type === 'triangle') {
            return `<svg width="${width}" height="${height}" viewBox="0 0 100 100"><polygon points="50,12 12,88 88,88" fill="${color}" stroke="#333" stroke-width="4"/></svg>`;
        } else if (type === 'star') {
            return `<svg width="${width}" height="${height}" viewBox="0 0 100 100"><polygon points="50,10 63,38 93,42 71,63 77,93 50,77 23,93 29,63 7,42 37,38" fill="${color}" stroke="#333" stroke-width="4"/></svg>`;
        }
        return '';
    },

    // Shadow shapes
    getShadowSVG: function(type, width = 60, height = 60) {
        return this.getShapeSVG(type, "#A0A0A0", width, height);
    },

    // Butterfly
    getButterflySVG: function(color = "#E91E63", width = 80, height = 80) {
        return `
        <svg width="${width}" height="${height}" viewBox="0 0 100 100">
            <ellipse cx="32" cy="38" rx="24" ry="20" fill="${color}" opacity="0.9"/>
            <ellipse cx="68" cy="38" rx="24" ry="20" fill="${color}" opacity="0.9"/>
            <ellipse cx="36" cy="65" rx="18" ry="15" fill="${color}" opacity="0.8"/>
            <ellipse cx="64" cy="65" rx="18" ry="15" fill="${color}" opacity="0.8"/>
            <ellipse cx="50" cy="50" rx="6" ry="30" fill="#3E2723"/>
            <circle cx="50" cy="22" r="6" fill="#3E2723"/>
        </svg>
        `;
    }
};
