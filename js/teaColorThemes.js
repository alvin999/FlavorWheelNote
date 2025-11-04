/**
 * js/teaColorThemes.js
 * 臺灣特色茶風味輪顏色主題配置檔案
 * 
 * 包含所有茶風味輪 JSON 項目的 ID 對應顏色
 * 三個主題：春日茶園 (Spring Garden) / 秋日焙茶 (Autumn Roast) / 靜夜沉思 (Midnight Contemplation)
 */

const TEA_COLOR_THEMES = {
    // 主題 1: 春日茶園 (Spring Garden) - 清新、明亮
    spring_garden: {
        name: "春日茶園 (Spring Garden)",
        palette: {
            // Layer 1
            "basic": "#a6d189",
            "mouthfeel": "#8caaee",
            "vegetal": "#81c8be",
            "floral": "#f4b8e4",
            "sweet": "#e5c792",
            "fruity": "#e8a2af",
            "roasted": "#d4a574",

            // Layer 2 & 3 - 基本滋味
            "umami": "#a6d189",
            "sweetness_basic": "#e5c792",
            "saltiness": "#8caaee",
            "sourness_basic": "#e5c792",
            "bitterness_basic": "#a6d189",

            // Layer 2 & 3 - 口感
            "purity": "#8caaee", "fresh_stuffy": "#a5d0f0",
            "fineness": "#8caaee", "fine_rough": "#a5d0f0",
            "smoothness": "#8caaee", "smooth_astringent": "#a5d0f0",
            "fullness": "#8caaee", "thick_thin": "#a5d0f0",
            "aftertaste": "#8caaee", "lasting_brief": "#a5d0f0",

            // Layer 2 & 3 - 草本植物
            "grassy": "#81c8be", "grassy_fresh": "#a1e3da", "messona": "#6aa8a1",
            "beans": "#81c8be", "mung_bean": "#a1e3da", "soybean": "#6aa8a1",
            "vegetables": "#81c8be", "young_corn": "#a1e3da", "mushroom": "#6aa8a1", "cucumber": "#a1e3da",
            "herbs": "#81c8be", "chamomile": "#a1e3da", "mint": "#6aa8a1",

            // Layer 2 & 3 - 花香
            "light_floral": "#f4b8e4", "orchid": "#f8d8f0", "magnolia": "#f8d8f0", "osmanthus": "#f8d8f0", "jasmine": "#f8d8f0", "longan_blossom": "#f8d8f0",
            "strong_floral": "#f4b8e4", "gardenia": "#f0a3d9", "rose": "#f0a3d9", "white_ginger_lily": "#f0a3d9", "betel_blossom": "#f0a3d9", "orange_blossom": "#f0a3d9", "pomelo_blossom": "#f0a3d9",

            // Layer 2 & 3 - 甜香
            "sugary": "#e5c792", "granulated_sugar": "#f0d9a9", "caramel": "#d9b37e", "brown_sugar": "#d9b37e", "candied_melon": "#f0d9a9",
            "milky": "#e5c792", "milk": "#f0d9a9", "butter": "#d9b37e",
            "honey": "#e5c792", "honey_desc": "#f0d9a9",

            // Layer 2 & 3 - 果香
            "fresh_fruit": "#e8a2af", "pear": "#f2c2ca", "guava": "#f2c2ca", "green_apple": "#f2c2ca", "lemon": "#f2c2ca",
            "ripe_fruit": "#e8a2af", "peach": "#e38fa0", "mango": "#e38fa0", "lychee": "#e38fa0", "orange": "#e38fa0", "pineapple": "#e38fa0", "bergamot": "#e38fa0", "melon": "#e38fa0", "banana": "#e38fa0", "plum": "#e38fa0",
            "dried_fruit": "#e8a2af", "dried_longan": "#d97f8f", "dried_plum": "#d97f8f",

            // Layer 2 & 3 - 焙香
            "nuts_grains": "#d4a574", "peanut": "#e0b88f", "sweet_potato": "#e0b88f", "rice": "#e0b88f", "hazelnut": "#e0b88f",
            "baked": "#d4a574", "brown_rice": "#c9915f", "roasted_barley": "#c9915f", "cookie": "#c9915f", "chocolate": "#c9915f", "coffee": "#c9915f", "roasted_chestnut": "#c9915f",
            "smoked": "#d4a574", "smoked_plum": "#b87d4a", "charcoal": "#b87d4a"
        }
    },

    // 主題 2: 秋日焙茶 (Autumn Roast) - 溫暖、沉穩
    autumn_roast: {
        name: "秋日焙茶 (Autumn Roast)",
        palette: {
            // Layer 1
            "basic": "#d65d0e",
            "mouthfeel": "#83a598",
            "vegetal": "#b8bb26",
            "floral": "#fe8019",
            "sweet": "#fabd2f",
            "fruity": "#fb4934",
            "roasted": "#d3869b",

            // Layer 2 & 3 - 基本滋味
            "umami": "#d65d0e",
            "sweetness_basic": "#fabd2f",
            "saltiness": "#83a598",
            "sourness_basic": "#fabd2f",
            "bitterness_basic": "#d65d0e",

            // Layer 2 & 3 - 口感
            "purity": "#83a598", "fresh_stuffy": "#a3c5b8",
            "fineness": "#83a598", "fine_rough": "#a3c5b8",
            "smoothness": "#83a598", "smooth_astringent": "#a3c5b8",
            "fullness": "#83a598", "thick_thin": "#a3c5b8",
            "aftertaste": "#83a598", "lasting_brief": "#a3c5b8",

            // Layer 2 & 3 - 草本植物
            "grassy": "#b8bb26", "grassy_fresh": "#d8db46", "messona": "#989b06",
            "beans": "#b8bb26", "mung_bean": "#d8db46", "soybean": "#989b06",
            "vegetables": "#b8bb26", "young_corn": "#d8db46", "mushroom": "#989b06", "cucumber": "#d8db46",
            "herbs": "#b8bb26", "chamomile": "#d8db46", "mint": "#989b06",

            // Layer 2 & 3 - 花香
            "light_floral": "#fe8019", "orchid": "#ff9a39", "magnolia": "#ff9a39", "osmanthus": "#ff9a39", "jasmine": "#ff9a39", "longan_blossom": "#ff9a39",
            "strong_floral": "#fe8019", "gardenia": "#de6000", "rose": "#de6000", "white_ginger_lily": "#de6000", "betel_blossom": "#de6000", "orange_blossom": "#de6000", "pomelo_blossom": "#de6000",

            // Layer 2 & 3 - 甜香
            "sugary": "#fabd2f", "granulated_sugar": "#fbd74f", "caramel": "#dab01f", "brown_sugar": "#dab01f", "candied_melon": "#fbd74f",
            "milky": "#fabd2f", "milk": "#fbd74f", "butter": "#dab01f",
            "honey": "#fabd2f", "honey_desc": "#fbd74f",

            // Layer 2 & 3 - 果香
            "fresh_fruit": "#fb4934", "pear": "#fd6954", "guava": "#fd6954", "green_apple": "#fd6954", "lemon": "#fd6954",
            "ripe_fruit": "#fb4934", "peach": "#db2914", "mango": "#db2914", "lychee": "#db2914", "orange": "#db2914", "pineapple": "#db2914", "bergamot": "#db2914", "melon": "#db2914", "banana": "#db2914", "plum": "#db2914",
            "dried_fruit": "#fb4934", "dried_longan": "#b90900", "dried_plum": "#b90900",

            // Layer 2 & 3 - 焙香
            "nuts_grains": "#d3869b", "peanut": "#e3a6bb", "sweet_potato": "#e3a6bb", "rice": "#e3a6bb", "hazelnut": "#e3a6bb",
            "baked": "#d3869b", "brown_rice": "#b3667b", "roasted_barley": "#b3667b", "cookie": "#b3667b", "chocolate": "#b3667b", "coffee": "#b3667b", "roasted_chestnut": "#b3667b",
            "smoked": "#d3869b", "smoked_plum": "#93465b", "charcoal": "#93465b"
        }
    },

    // 主題 3: 靜夜沉思 (Midnight Contemplation) - 冷靜、深邃
    midnight_contemplation: {
        name: "靜夜沉思 (Midnight Contemplation)",
        palette: {
            // Layer 1
            "basic": "#7f849c",
            "mouthfeel": "#a6adc8",
            "vegetal": "#89b482",
            "floral": "#b7b2e9",
            "sweet": "#eed49f",
            "fruity": "#e8a2af",
            "roasted": "#cad3f5",

            // Layer 2 & 3 - 基本滋味
            "umami": "#7f849c",
            "sweetness_basic": "#eed49f",
            "saltiness": "#a6adc8",
            "sourness_basic": "#eed49f",
            "bitterness_basic": "#7f849c",

            // Layer 2 & 3 - 口感
            "purity": "#a6adc8", "fresh_stuffy": "#c6cce8",
            "fineness": "#a6adc8", "fine_rough": "#c6cce8",
            "smoothness": "#a6adc8", "smooth_astringent": "#c6cce8",
            "fullness": "#a6adc8", "thick_thin": "#c6cce8",
            "aftertaste": "#a6adc8", "lasting_brief": "#c6cce8",

            // Layer 2 & 3 - 草本植物
            "grassy": "#89b482", "grassy_fresh": "#a9d4a2", "messona": "#699462",
            "beans": "#89b482", "mung_bean": "#a9d4a2", "soybean": "#699462",
            "vegetables": "#89b482", "young_corn": "#a9d4a2", "mushroom": "#699462", "cucumber": "#a9d4a2",
            "herbs": "#89b482", "chamomile": "#a9d4a2", "mint": "#699462",

            // Layer 2 & 3 - 花香
            "light_floral": "#b7b2e9", "orchid": "#d7d2f9", "magnolia": "#d7d2f9", "osmanthus": "#d7d2f9", "jasmine": "#d7d2f9", "longan_blossom": "#d7d2f9",
            "strong_floral": "#b7b2e9", "gardenia": "#9792c9", "rose": "#9792c9", "white_ginger_lily": "#9792c9", "betel_blossom": "#9792c9", "orange_blossom": "#9792c9", "pomelo_blossom": "#9792c9",

            // Layer 2 & 3 - 甜香
            "sugary": "#eed49f", "granulated_sugar": "#f8e4af", "caramel": "#d8b47f", "brown_sugar": "#d8b47f", "candied_melon": "#f8e4af",
            "milky": "#eed49f", "milk": "#f8e4af", "butter": "#d8b47f",
            "honey": "#eed49f", "honey_desc": "#f8e4af",

            // Layer 2 & 3 - 果香
            "fresh_fruit": "#e8a2af", "pear": "#f2c2ca", "guava": "#f2c2ca", "green_apple": "#f2c2ca", "lemon": "#f2c2ca",
            "ripe_fruit": "#e8a2af", "peach": "#c8828f", "mango": "#c8828f", "lychee": "#c8828f", "orange": "#c8828f", "pineapple": "#c8828f", "bergamot": "#c8828f", "melon": "#c8828f", "banana": "#c8828f", "plum": "#c8828f",
            "dried_fruit": "#e8a2af", "dried_longan": "#a8626f", "dried_plum": "#a8626f",

            // Layer 2 & 3 - 焙香
            "nuts_grains": "#cad3f5", "peanut": "#eaddf9", "sweet_potato": "#eaddf9", "rice": "#eaddf9", "hazelnut": "#eaddf9",
            "baked": "#cad3f5", "brown_rice": "#aab3d5", "roasted_barley": "#aab3d5", "cookie": "#aab3d5", "chocolate": "#aab3d5", "coffee": "#aab3d5", "roasted_chestnut": "#aab3d5",
            "smoked": "#cad3f5", "smoked_plum": "#8a93b5", "charcoal": "#8a93b5"
        }
    }
};

// 預設茶主題
const DEFAULT_TEA_THEME = 'spring_garden';

// 獲取茶主題的輔助函數
function getTeaColorTheme(themeName = DEFAULT_TEA_THEME) {
    return TEA_COLOR_THEMES[themeName] || TEA_COLOR_THEMES[DEFAULT_TEA_THEME];
}

// 獲取特定項目顏色的輔助函數
function getTeaItemColor(itemId, themeName = DEFAULT_TEA_THEME) {
    const theme = getTeaColorTheme(themeName);
    return theme.palette[itemId] || '#cccccc';
}

// 列出所有可用茶主題的輔助函數
function listAvailableTeaThemes() {
    return Object.keys(TEA_COLOR_THEMES).map(key => ({
        id: key,
        name: TEA_COLOR_THEMES[key].name
    }));
}

// 驗證所有必需的項目 ID 是否都有顏色
function validateTeaThemeCompleteness(themeName = DEFAULT_TEA_THEME) {
    const requiredIds = [
        // Layer 1
        'basic', 'mouthfeel', 'vegetal', 'floral', 'sweet', 'fruity', 'roasted',
        // Layer 2 & 3
        'umami', 'sweetness_basic', 'saltiness', 'sourness_basic', 'bitterness_basic',
        'purity', 'fresh_stuffy', 'fineness', 'fine_rough', 'smoothness', 'smooth_astringent', 'fullness', 'thick_thin', 'aftertaste', 'lasting_brief',
        'grassy', 'grassy_fresh', 'messona', 'beans', 'mung_bean', 'soybean', 'vegetables', 'young_corn', 'mushroom', 'cucumber', 'herbs', 'chamomile', 'mint',
        'light_floral', 'orchid', 'magnolia', 'osmanthus', 'jasmine', 'longan_blossom', 'strong_floral', 'gardenia', 'rose', 'white_ginger_lily', 'betel_blossom', 'orange_blossom', 'pomelo_blossom',
        'sugary', 'granulated_sugar', 'caramel', 'brown_sugar', 'candied_melon', 'milky', 'milk', 'butter', 'honey', 'honey_desc',
        'fresh_fruit', 'pear', 'guava', 'green_apple', 'lemon', 'ripe_fruit', 'peach', 'mango', 'lychee', 'orange', 'pineapple', 'bergamot', 'melon', 'banana', 'plum', 'dried_fruit', 'dried_longan', 'dried_plum',
        'nuts_grains', 'peanut', 'sweet_potato', 'rice', 'hazelnut', 'baked', 'brown_rice', 'roasted_barley', 'cookie', 'chocolate', 'coffee', 'roasted_chestnut', 'smoked', 'smoked_plum', 'charcoal'
    ];
    
    const theme = getTeaColorTheme(themeName);
    const missing = requiredIds.filter(id => !theme.palette[id]);
    
    return {
        isComplete: missing.length === 0,
        totalRequired: requiredIds.length,
        totalDefined: Object.keys(theme.palette).length,
        missing: missing
    };
}

// 所有可用的茶主題清單
const AVAILABLE_TEA_THEMES = [
    { id: 'spring_garden', name: '春日茶園 (推薦)', default: true },
    { id: 'autumn_roast', name: '秋日焙茶' },
    { id: 'midnight_contemplation', name: '靜夜沉思' }
];