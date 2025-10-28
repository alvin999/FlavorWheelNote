/**
 * js/luxuryColorThemes.js
 * 高級咖啡風味輪奢華版顏色主題配置檔案
 * 
 * 包含所有奢華版 JSON 項目的 ID 對應顏色
 * 三個主題：Luxury Gold / Rose Gold / Platinum
 */

const LUXURY_COLOR_THEMES = {
    // 主題 1: 奢華金色 (Luxury Gold) - 溫暖奢華
    luxury_gold: {
        name: "奢華金色 (Luxury Gold)",
        palette: {
            // Layer 1 - 主要分類
            "exotic_fruits": "#e74c3c",
            "floral_bouquet": "#f5a9d0",
            "gourmet_sweets": "#d4af37",
            "spice_elegance": "#d4915a",
            "premium_nuts": "#b8956a",
            "aromatic_warmth": "#8b6f47",
            "refined_elegance": "#c9a961",

            // Layer 2 & 3 - 異國水果
            "tropical_berries": "#fb6b6b",
            "passion_fruit": "#ff6b9d",
            "dragon_fruit": "#ff8fab",
            "acai_berry": "#9c27b0",
            "goji_berry": "#d32f2f",
            "pomegranate_juice": "#c71585",
            "lychee": "#ff69b4",
            "stone_fruits": "#ff8c42",
            "ripe_peach": "#ffa07a",
            "apricot_nectar": "#ffb347",
            "plum_jam": "#c71585",
            "cherry_cordial": "#dc143c",
            "citrus_elegance": "#ffd700",
            "bergamot": "#f4d03f",
            "seville_orange": "#ff9800",
            "grapefruit_blush": "#ff69b4",
            "yuzu": "#ffeb3b",
            "blood_orange": "#ff5722",
            "fine_dried_fruits": "#d4915a",
            "sultana_raisins": "#8b4513",
            "dried_apricot": "#cd853f",
            "date_paste": "#a0522d",
            "dried_fig": "#6f4e37",

            // Layer 2 & 3 - 花束芬芳
            "fine_florals": "#f5a9d0",
            "rose_petal": "#e91e63",
            "peony": "#ff69b4",
            "orchid": "#da70d6",
            "jasmine_absolute": "#f5bde6",
            "gardenia": "#ffe4e1",
            "perfume_florals": "#f5a9d0",
            "tuberose": "#ffc0cb",
            "violet_leaf": "#ee82ee",
            "lilac": "#dda0dd",
            "hyacinth": "#da70d6",
            "herbal_florals": "#e8d8f0",
            "chamomile_bliss": "#f5deb3",
            "lavender_fields": "#e6e6fa",
            "geranium": "#f08080",

            // Layer 2 & 3 - 美食甜感
            "artisan_chocolate": "#6f4e37",
            "belgian_dark_chocolate": "#3d2817",
            "cacao_nibs": "#5c4033",
            "cocoa_butter": "#8b6f47",
            "milk_chocolate_velvet": "#a0826d",
            "premium_caramel": "#d4af37",
            "salted_caramel": "#cd853f",
            "butterscotch": "#daa520",
            "dulce_de_leche": "#c9a961",
            "luxury_honey": "#ffd700",
            "manuka_honey": "#ffd700",
            "acacia_honey": "#f4d03f",
            "chestnut_honey": "#daa520",
            "vanilla_luxury": "#f5deb3",
            "madagascar_vanilla": "#ffe4b5",
            "tahitian_vanilla": "#ffefd5",
            "vanilla_cream": "#f5f5dc",

            // Layer 2 & 3 - 香料優雅
            "warm_spices": "#d4915a",
            "ceylon_cinnamon": "#d97f4f",
            "nutmeg_freshly_grated": "#c9a961",
            "clove_bud": "#8b4513",
            "cardamom": "#a0826d",
            "exotic_spices": "#d4915a",
            "star_anise": "#cd853f",
            "vanilla_spice": "#daa520",
            "saffron": "#ffd700",
            "galangal": "#c9a961",

            // Layer 2 & 3 - 頂級堅果
            "roasted_luxury_nuts": "#b8956a",
            "marcona_almond": "#d4af37",
            "roasted_hazelnut": "#a0826d",
            "macadamia_nut": "#daa520",
            "pecan": "#8b6f47",
            "walnut_oil": "#6f4e37",
            "nut_butters": "#c9a961",
            "almond_butter": "#cd853f",
            "pistachio_paste": "#7cb342",
            "tahini": "#daa520",

            // Layer 2 & 3 - 香氛溫暖
            "wood_resins": "#8b6f47",
            "sandalwood": "#a0826d",
            "cedar_wood": "#6f4e37",
            "incense_oud": "#5c4033",
            "vetiver": "#7cb342",
            "amber_notes": "#d4af37",
            "ambroxan": "#daa520",
            "labdanum": "#cd853f",
            "musk": "#c9a961",
            "toasted_grains": "#c9a961",
            "malted_barley": "#a0826d",
            "toasted_cereal": "#c9a961",
            "graham_cracker": "#daa520",

            // Layer 2 & 3 - 精緻優雅
            "luxury_accords": "#c9a961",
            "floral_citrus": "#f5bde6",
            "rose_woody": "#d4af37",
            "amber_floral": "#daa520",
            "sensual_musk": "#c9a961",
            "tea_infusion": "#8b7355",
            "black_tea_elegant": "#3d2817",
            "green_tea_fresh": "#7cb342",
            "white_tea": "#e6d5c3",
            "mineral_silk": "#c0c0c0",
            "chalky_mineral": "#d3d3d3",
            "silky_mouthfeel": "#f5f5f5"
        }
    },

    // 主題 2: 玫瑰金色 (Rose Gold) - 優雅浪漫
    rose_gold: {
        name: "玫瑰金色 (Rose Gold)",
        palette: {
            // Layer 1 - 主要分類
            "exotic_fruits": "#c74560",
            "floral_bouquet": "#e8a8c8",
            "gourmet_sweets": "#d9a8a8",
            "spice_elegance": "#c8936b",
            "premium_nuts": "#b8866b",
            "aromatic_warmth": "#a68080",
            "refined_elegance": "#c0a8a0",

            // Layer 2 & 3 - 異國水果
            "tropical_berries": "#e8696b",
            "passion_fruit": "#e868a0",
            "dragon_fruit": "#d96b9d",
            "acai_berry": "#a85da8",
            "goji_berry": "#c73636",
            "pomegranate_juice": "#b71585",
            "lychee": "#e869a8",
            "stone_fruits": "#d89054",
            "ripe_peach": "#d8987a",
            "apricot_nectar": "#d8a878",
            "plum_jam": "#b81585",
            "cherry_cordial": "#c83636",
            "citrus_elegance": "#d8b56b",
            "bergamot": "#d8a868",
            "seville_orange": "#d8936b",
            "grapefruit_blush": "#e868a0",
            "yuzu": "#d8b854",
            "blood_orange": "#d8735a",
            "fine_dried_fruits": "#c88062",
            "sultana_raisins": "#856545",
            "dried_apricot": "#b8754f",
            "date_paste": "#8c4540",
            "dried_fig": "#654538",
            "rose_petal": "#c83860",
            "peony": "#e868a0",
            "orchid": "#c868a8",
            "jasmine_absolute": "#d898c8",
            "gardenia": "#e8c8d0",

            // Layer 2 & 3 - 花束芬芳
            "fine_florals": "#e8a8c8",
            "perfume_florals": "#e8a8c8",
            "tuberose": "#e8a0c0",
            "violet_leaf": "#c868a8",
            "lilac": "#c898c8",
            "hyacinth": "#b868a8",
            "herbal_florals": "#d8b8d0",
            "chamomile_bliss": "#d8c4a0",
            "lavender_fields": "#d8c8d8",
            "geranium": "#d8798a",

            // Layer 2 & 3 - 美食甜感
            "artisan_chocolate": "#5c4540",
            "belgian_dark_chocolate": "#3d2e28",
            "cacao_nibs": "#4c3d38",
            "cocoa_butter": "#7a6860",
            "milk_chocolate_velvet": "#8c7a70",
            "premium_caramel": "#c8956b",
            "salted_caramel": "#b8856b",
            "butterscotch": "#c8956b",
            "dulce_de_leche": "#b88a70",
            "luxury_honey": "#d8b56b",
            "manuka_honey": "#d8b56b",
            "acacia_honey": "#d8a86b",
            "chestnut_honey": "#c88c62",
            "vanilla_luxury": "#d8c8a8",
            "madagascar_vanilla": "#d8c8a8",
            "tahitian_vanilla": "#e8d8b8",
            "vanilla_cream": "#e8e0d8",

            // Layer 2 & 3 - 香料優雅
            "warm_spices": "#c8936b",
            "ceylon_cinnamon": "#c87a62",
            "nutmeg_freshly_grated": "#b8856b",
            "clove_bud": "#7a5c45",
            "cardamom": "#8c7a70",
            "exotic_spices": "#c8936b",
            "star_anise": "#b8856b",
            "vanilla_spice": "#c8956b",
            "saffron": "#d8b56b",
            "galangal": "#b8856b",

            // Layer 2 & 3 - 頂級堅果
            "roasted_luxury_nuts": "#b8866b",
            "marcona_almond": "#c8956b",
            "roasted_hazelnut": "#8c7a70",
            "macadamia_nut": "#c88c62",
            "pecan": "#7a6860",
            "walnut_oil": "#5c4540",
            "nut_butters": "#b8856b",
            "almond_butter": "#b8856b",
            "pistachio_paste": "#6c8c4a",
            "tahini": "#c88c62",

            // Layer 2 & 3 - 香氛溫暖
            "wood_resins": "#7a6860",
            "sandalwood": "#8c7a70",
            "cedar_wood": "#5c4540",
            "incense_oud": "#4c3d38",
            "vetiver": "#6c8c4a",
            "amber_notes": "#c8956b",
            "ambroxan": "#c88c62",
            "labdanum": "#b8856b",
            "musk": "#b8856b",
            "toasted_grains": "#b8856b",
            "malted_barley": "#8c7a70",
            "toasted_cereal": "#b8856b",
            "graham_cracker": "#c88c62",

            // Layer 2 & 3 - 精緻優雅
            "luxury_accords": "#b8856b",
            "floral_citrus": "#d898c8",
            "rose_woody": "#c8956b",
            "amber_floral": "#c88c62",
            "sensual_musk": "#b8856b",
            "tea_infusion": "#7a6860",
            "black_tea_elegant": "#3d2e28",
            "green_tea_fresh": "#6c8c4a",
            "white_tea": "#d8c8c0",
            "mineral_silk": "#b8b0a8",
            "chalky_mineral": "#c8c0b8",
            "silky_mouthfeel": "#e8e0d8"
        }
    },

    // 主題 3: 鉑金色 (Platinum) - 冷調優雅
    platinum: {
        name: "鉑金色 (Platinum)",
        palette: {
            // Layer 1 - 主要分類
            "exotic_fruits": "#d42d3f",
            "floral_bouquet": "#e8bcd8",
            "gourmet_sweets": "#d4bcd8",
            "spice_elegance": "#c4a8b4",
            "premium_nuts": "#a8a0ac",
            "aromatic_warmth": "#999099",
            "refined_elegance": "#b4a8b8",

            // Layer 2 & 3 - 異國水果
            "tropical_berries": "#d84d5f",
            "passion_fruit": "#d86da8",
            "dragon_fruit": "#d475b0",
            "acai_berry": "#9c5db0",
            "goji_berry": "#c84050",
            "pomegranate_juice": "#b83094",
            "lychee": "#d875b0",
            "stone_fruits": "#c898a8",
            "ripe_peach": "#d4a8b4",
            "apricot_nectar": "#d4a8a8",
            "plum_jam": "#b83094",
            "cherry_cordial": "#c84050",
            "citrus_elegance": "#d8c8a8",
            "bergamot": "#d4bca8",
            "seville_orange": "#d4b094",
            "grapefruit_blush": "#d86da8",
            "yuzu": "#d8c898",
            "blood_orange": "#d89080",
            "fine_dried_fruits": "#b4948a",
            "sultana_raisins": "#7c6c68",
            "dried_apricot": "#a4827c",
            "date_paste": "#7c5c60",
            "dried_fig": "#544450",

            // Layer 2 & 3 - 花束芬芳
            "fine_florals": "#e8bcd8",
            "rose_petal": "#d84d80",
            "peony": "#d875b0",
            "orchid": "#b870b8",
            "jasmine_absolute": "#d8a8c8",
            "gardenia": "#e8d4e0",
            "perfume_florals": "#e8bcd8",
            "tuberose": "#e0a8c0",
            "violet_leaf": "#b870b8",
            "lilac": "#c898d0",
            "hyacinth": "#a870b8",
            "herbal_florals": "#d4b8d4",
            "chamomile_bliss": "#d8c4b0",
            "lavender_fields": "#d0c8d8",
            "geranium": "#d47a98",

            // Layer 2 & 3 - 美食甜感
            "artisan_chocolate": "#544450",
            "belgian_dark_chocolate": "#352d38",
            "cacao_nibs": "#443840",
            "cocoa_butter": "#6c6468",
            "milk_chocolate_velvet": "#7c7480",
            "premium_caramel": "#c4a8b4",
            "salted_caramel": "#b4989c",
            "butterscotch": "#c4a8a0",
            "dulce_de_leche": "#b4949c",
            "luxury_honey": "#d4b4a8",
            "manuka_honey": "#d4b4a8",
            "acacia_honey": "#d4a8a0",
            "chestnut_honey": "#c4968c",
            "vanilla_luxury": "#d8c4b0",
            "madagascar_vanilla": "#d8c4b0",
            "tahitian_vanilla": "#e0d4c4",
            "vanilla_cream": "#e4dcd8",

            // Layer 2 & 3 - 香料優雅
            "warm_spices": "#c4a8b4",
            "ceylon_cinnamon": "#b8898a",
            "nutmeg_freshly_grated": "#a8949c",
            "clove_bud": "#704c58",
            "cardamom": "#7c7480",
            "exotic_spices": "#c4a8b4",
            "star_anise": "#a8949c",
            "vanilla_spice": "#c4a8a0",
            "saffron": "#d4b4a8",
            "galangal": "#a8949c",

            // Layer 2 & 3 - 頂級堅果
            "roasted_luxury_nuts": "#a8a0ac",
            "marcona_almond": "#c4a8b4",
            "roasted_hazelnut": "#7c7480",
            "macadamia_nut": "#b4948c",
            "pecan": "#6c6468",
            "walnut_oil": "#544450",
            "nut_butters": "#a8949c",
            "almond_butter": "#a8949c",
            "pistachio_paste": "#6c8c6c",
            "tahini": "#b4948c",

            // Layer 2 & 3 - 香氛溫暖
            "wood_resins": "#6c6468",
            "sandalwood": "#7c7480",
            "cedar_wood": "#544450",
            "incense_oud": "#443840",
            "vetiver": "#6c8c6c",
            "amber_notes": "#c4a8b4",
            "ambroxan": "#b4948c",
            "labdanum": "#a8949c",
            "musk": "#a8949c",
            "toasted_grains": "#a8949c",
            "malted_barley": "#7c7480",
            "toasted_cereal": "#a8949c",
            "graham_cracker": "#b4948c",

            // Layer 2 & 3 - 精緻優雅
            "luxury_accords": "#a8949c",
            "floral_citrus": "#d8a8c8",
            "rose_woody": "#c4a8b4",
            "amber_floral": "#b4948c",
            "sensual_musk": "#a8949c",
            "tea_infusion": "#6c6468",
            "black_tea_elegant": "#352d38",
            "green_tea_fresh": "#6c8c6c",
            "white_tea": "#d4c8c4",
            "mineral_silk": "#a8a0ac",
            "chalky_mineral": "#b8b0b8",
            "silky_mouthfeel": "#dcd4d8"
        }
    }
};

// 預設奢華主題
const DEFAULT_LUXURY_THEME = 'luxury_gold';

// 獲取奢華主題的輔助函數
function getLuxuryColorTheme(themeName = DEFAULT_LUXURY_THEME) {
    return LUXURY_COLOR_THEMES[themeName] || LUXURY_COLOR_THEMES[DEFAULT_LUXURY_THEME];
}

// 獲取特定項目顏色的輔助函數
function getLuxuryItemColor(itemId, themeName = DEFAULT_LUXURY_THEME) {
    const theme = getLuxuryColorTheme(themeName);
    return theme.palette[itemId] || '#cccccc';
}

// 列出所有可用奢華主題的輔助函數
function listAvailableLuxuryThemes() {
    return Object.keys(LUXURY_COLOR_THEMES).map(key => ({
        id: key,
        name: LUXURY_COLOR_THEMES[key].name
    }));
}

// 驗證所有必需的項目 ID 是否都有顏色
function validateLuxuryThemeCompleteness(themeName = DEFAULT_LUXURY_THEME) {
    const requiredIds = [
        // Layer 1
        'exotic_fruits', 'floral_bouquet', 'gourmet_sweets', 'spice_elegance',
        'premium_nuts', 'aromatic_warmth', 'refined_elegance',
        // Layer 2 & 3 - 異國水果
        'tropical_berries', 'passion_fruit', 'dragon_fruit', 'acai_berry', 'goji_berry', 'pomegranate_juice', 'lychee',
        'stone_fruits', 'ripe_peach', 'apricot_nectar', 'plum_jam', 'cherry_cordial',
        'citrus_elegance', 'bergamot', 'seville_orange', 'grapefruit_blush', 'yuzu', 'blood_orange',
        'fine_dried_fruits', 'sultana_raisins', 'dried_apricot', 'date_paste', 'dried_fig',
        // Layer 2 & 3 - 花束芬芳
        'fine_florals', 'rose_petal', 'peony', 'orchid', 'jasmine_absolute', 'gardenia',
        'perfume_florals', 'tuberose', 'violet_leaf', 'lilac', 'hyacinth',
        'herbal_florals', 'chamomile_bliss', 'lavender_fields', 'geranium',
        // Layer 2 & 3 - 美食甜感
        'artisan_chocolate', 'belgian_dark_chocolate', 'cacao_nibs', 'cocoa_butter', 'milk_chocolate_velvet',
        'premium_caramel', 'salted_caramel', 'butterscotch', 'dulce_de_leche',
        'luxury_honey', 'manuka_honey', 'acacia_honey', 'chestnut_honey',
        'vanilla_luxury', 'madagascar_vanilla', 'tahitian_vanilla', 'vanilla_cream',
        // Layer 2 & 3 - 香料優雅
        'warm_spices', 'ceylon_cinnamon', 'nutmeg_freshly_grated', 'clove_bud', 'cardamom',
        'exotic_spices', 'star_anise', 'vanilla_spice', 'saffron', 'galangal',
        // Layer 2 & 3 - 頂級堅果
        'roasted_luxury_nuts', 'marcona_almond', 'roasted_hazelnut', 'macadamia_nut', 'pecan', 'walnut_oil',
        'nut_butters', 'almond_butter', 'pistachio_paste', 'tahini',
        // Layer 2 & 3 - 香氛溫暖
        'wood_resins', 'sandalwood', 'cedar_wood', 'incense_oud', 'vetiver',
        'amber_notes', 'ambroxan', 'labdanum', 'musk',
        'toasted_grains', 'malted_barley', 'toasted_cereal', 'graham_cracker',
        // Layer 2 & 3 - 精緻優雅
        'luxury_accords', 'floral_citrus', 'rose_woody', 'amber_floral', 'sensual_musk',
        'tea_infusion', 'black_tea_elegant', 'green_tea_fresh', 'white_tea',
        'mineral_silk', 'chalky_mineral', 'silky_mouthfeel'
    ];
    
    const theme = getLuxuryColorTheme(themeName);
    const missing = requiredIds.filter(id => !theme.palette[id]);
    
    return {
        isComplete: missing.length === 0,
        totalRequired: requiredIds.length,
        totalDefined: Object.keys(theme.palette).length,
        missing: missing
    };
}

// 所有可用的奢華主題清單
const AVAILABLE_LUXURY_THEMES = [
    { id: 'luxury_gold', name: '奢華金色 (推薦)', default: true },
    { id: 'rose_gold', name: '玫瑰金色' },
    { id: 'platinum', name: '鉑金色' }
];