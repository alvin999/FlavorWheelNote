const COLOR_THEMES = {
    // 主題 1: 預設 (SCA) - 精品咖啡協會官方色系
    default: {
        name: "Default",
        palette: {
            // Layer 1 - 主要分類 (自然瑜伽風格 - 增強版)
            "fruity": "#D05663", // 鮭魚粉/珊瑚紅 - 活力
            "floral": "#B1A0B8", // 灰紫色 - 優雅、芬芳
            "sour": "#E0C8A0", // 柔和黃 - 明亮、酸質
            "green_vegetative": "#748B6F", // 灰綠色/鼠尾草綠 - 自然、平和
            "sweet": "#B48A78", // 陶土色 - 溫暖、甜美
            "nutty_cocoa": "#A89984", // 大地棕 - 溫和、樸實
            "spices": "#D87B56", // 橘紅色 - 溫暖、辛香
            "roasted": "#928374", // 深大地棕 - 烘焙、沉穩
            "papery_musty": "#80A29C", // 灰調松綠色 - 沉靜、塵封
            "other": "#A0B0C0", // 藍灰色 - 其他、化學感

            // Layer 2 & 3 - 水果 (鮭魚粉/珊瑚紅系)
            "berry": "#D05663",
            "blueberry": "#A0B0C0", // 藍灰色
            "raspberry": "#E07683",
            "blackberry": "#B03643",
            "strawberry": "#E07683",
            "red_currant": "#E07683", // 紅醋栗使用與覆盆子/草莓相同的亮紅色
            "black_currant": "#B03643", // 黑醋栗使用與黑莓相同的深紅色
            "dried_fruit": "#B03643",
            "raisin": "#B03643",
            "prune": "#B03643",
            "citrus_fruit": "#E0C8A0", // 柔和黃
            "lemon": "#E8D8B8",
            "lime": "#94A890",
            "orange": "#E0C8A0",
            "grapefruit": "#E07683",
            "other_fruit": "#D05663",
            "apple": "#D05663",
            "peach": "#E07683",
            "apricot": "#E0C8A0",
            "pear": "#94A890",
            "pineapple": "#E0C8A0",
            "passion_fruit": "#E0C8A0",
            "cherry": "#B03643",
            "pomegranate": "#B03643",
            "grape": "#A0B0C0",
            "coconut": "#D8C8B8",

            // Layer 2 & 3 - 花香 (灰紫色系)
            "rose": "#B1A0B8",
            "jasmine": "#C4B8CC",
            "chamomile": "#E0C8A0", // 柔和黃
            "lemongrass": "#94A890",
            "osmanthus": "#C4B8CC",
            "orange_blossom": "#C4B8CC",
            "lavender": "#A490AC",
            "hibiscus": "#D05663",

            // Layer 2 & 3 - 酸味 (柔和黃系)
            "fermented": "#E0C8A0",
            "winey": "#B03643",
            "fermented_taste": "#E8D8B8",
            "alcohol": "#E8D8B8",
            "sour_aromatics": "#E0C8A0",
            "acetic_acid": "#E8D8B8",
            "butyric_acid": "#D8C0A0",
            "citric_acid": "#E8D8B8",
            "isovaleric_acid": "#D8C0A0",
            "malic_acid": "#E0C8A0",
            "overripe_underripe": "#E0C8A0",
            "overripe": "#D87B56",
            "under_ripe": "#94A890",
            "peapod": "#748B6F",

            // Layer 2 & 3 - 綠色/蔬菜 (灰綠色/鼠尾草綠系)
            "fresh": "#94A890",
            "dark_green": "#5A7057",
            "vegetative": "#748B6F",
            "hay_like": "#B4C4B0",
            "herb_like": "#748B6F",
            "olive_oil": "#5A7057",

            // Layer 2 & 3 - 甜感 (陶土色系)
            "brown_sugar": "#B48A78",
            "caramelized": "#C4A090",
            "honey": "#E0C8A0", // 柔和黃
            "molasses": "#A47A68",
            "maple_syrup": "#B48A78",
            "brown_sugar_taste": "#B48A78",
            "vanilla": "#D8C8B8", // 亞麻色
            "vanilla_flavor": "#E0D8C8",
            "vanillin": "#E0D8C8",
            "overall_sweet": "#B48A78",
            "sweet_aromatics": "#C4A090",

            // Layer 2 & 3 - 堅果/可可 (大地棕系)
            "nutty": "#A89984",
            "almond": "#B8A99A",
            "hazelnut": "#B8A99A",
            "peanuts": "#A89984",
            "cocoa": "#A89984",
            "cocoa_flavor": "#928374", // 深大地棕
            "dark_chocolate": "#928374",
            "chocolate": "#928374",

            // Layer 2 & 3 - 香料 (橘紅色系)
            "brown_spice": "#D87B56",
            "cinnamon": "#E09B76",
            "nutmeg": "#C86B46",
            "clove": "#C86B46",
            "anise": "#E09B76",
            "pepper": "#D05663",

            // Layer 2 & 3 - 烘焙 (深大地棕系)
            "cereal": "#A89984", // 大地棕
            "grain": "#B8A99A",
            "malt": "#B8A99A",
            "brown_roast": "#928374",
            "smoky": "#928374",
            "ashy": "#C8C0B8", // 亞麻色
            "tobacco": "#928374",
            "pipe_tobacco": "#928374",
            "tobacco_flavor": "#928374",

            // Layer 2 & 3 - 紙味/霉味 (灰調松綠色系)
            "stale": "#80A29C",
            "cardboard": "#90B2AC",
            "papery": "#A0C2BC",
            "moldy_damp": "#70928C",
            "musty_dusty": "#80A29C",
            "musty_earthy": "#748B6F", // 維持灰綠色，與植物連結
            "woody": "#928374", // 改為深大地棕，與烘焙/堅果連結

            // Layer 2 & 3 - 其他 (藍灰色系)
            "black_tea": "#928374",
            "phenolic": "#D05663",
            "bitter": "#A0B0C0",
            "salty": "#B0C0D0",
            "medicinal": "#B0C0D0",
            "petroleum": "#748B6F",
            "meaty_brothy": "#5A7057",
            "animalic": "#A89984",
            "acrid": "#D05663",
            "burnt": "#928374",
            "pungent": "#D87B56",
            "rubbery": "#748B6F",
            "kunkry": "#A89984",
            "raw": "#748B6F",
            "beany": "#94A890",
            "chemical": "#A0B0C0"
        }
    },

    // 主題 2: Catppuccin Latte - 冷調現代風格
    catppuccin: {
        name: "貓布奇諾拿鐵 (Catppuccin Latte)",
        palette: {
            // Layer 1 - 主要分類
            "fruity": "#d20f39",
            "floral": "#ea76cb",
            "sour": "#179299",
            "green_vegetative": "#40a02b",
            "sweet": "#d4af37",
            "nutty_cocoa": "#fe640b",
            "spices": "#8c4001",
            "roasted": "#d5597b",
            "papery_musty": "#7c7f93",
            "other": "#6c6f86",

            // Layer 2 & 3 - 水果
            "berry": "#d81b60",
            "blueberry": "#5e60ba",
            "raspberry": "#d20f39",
            "blackberry": "#9c2d54",
            "strawberry": "#e64980",
            "red_currant": "#d20f39", // 紅醋栗使用與覆盆子相同的紅色
            "black_currant": "#9c2d54", // 黑醋栗使用與黑莓相同的深紫色
            "dried_fruit": "#d81b60",
            "raisin": "#8c3f50",
            "prune": "#6a2d42",
            "citrus_fruit": "#dfa612",
            "lemon": "#f4d35e",
            "lime": "#a8d5ba",
            "orange": "#fe640b",
            "grapefruit": "#f0ad4e",
            "other_fruit": "#d20f39",
            "apple": "#d81b60",
            "peach": "#fe640b",
            "apricot": "#fe640b",
            "pear": "#d4af37",
            "pineapple": "#f4d35e",
            "passion_fruit": "#dfa612",
            "cherry": "#d20f39",
            "pomegranate": "#c2185b",
            "grape": "#7b2cbf",
            "coconut": "#a8d5ba",

            // Layer 2 & 3 - 花香
            "rose": "#ea76cb",
            "jasmine": "#f5bde6",
            "chamomile": "#f2d5cf",
            "lemongrass": "#a6e3a1",
            "osmanthus": "#fab387",
            "orange_blossom": "#f9e2af",
            "lavender": "#b4befe",
            "hibiscus": "#f38ba8",

            // Layer 2 & 3 - 酸味
            "fermented": "#179299",
            "winey": "#8ecae6",
            "fermented_taste": "#457b9d",
            "alcohol": "#1d3557",
            "sour_aromatics": "#dfa612",
            "acetic_acid": "#f4d35e",
            "butyric_acid": "#ee964b",
            "citric_acid": "#f0ad4e",
            "isovaleric_acid": "#e76f51",
            "malic_acid": "#d62828",
            "overripe_underripe": "#dfa612",
            "overripe": "#d4af37",
            "under_ripe": "#a8d5ba",
            "peapod": "#40a02b",

            // Layer 2 & 3 - 綠色/蔬菜
            "fresh": "#40a02b",
            "dark_green": "#2d6a4f",
            "vegetative": "#52b788",
            "hay_like": "#95b8d1",
            "herb_like": "#b7e4c7",
            "olive_oil": "#95b8d1",

            // Layer 2 & 3 - 甜感
            "brown_sugar": "#d4af37",
            "caramelized": "#f4d35e",
            "honey": "#ffd60a",
            "molasses": "#d9680f",
            "maple_syrup": "#fe640b",
            "brown_sugar_taste": "#d4af37",
            "vanilla": "#f2d5cf",
            "vanilla_flavor": "#fcd5ce",
            "vanillin": "#f7d8d3",
            "overall_sweet": "#d4af37",
            "sweet_aromatics": "#f5bde6",

            // Layer 2 & 3 - 堅果/可可
            "nutty": "#fe640b",
            "almond": "#fed049",
            "hazelnut": "#d8955c",
            "peanuts": "#8c4001",
            "cocoa": "#8c4001",
            "cocoa_flavor": "#704030",
            "dark_chocolate": "#4a2511",
            "chocolate": "#6f4e37",

            // Layer 2 & 3 - 香料
            "brown_spice": "#8c4001",
            "cinnamon": "#d9680f",
            "nutmeg": "#c1666b",
            "clove": "#8c4001",
            "anise": "#d4a574",
            "pepper": "#c1666b",

            // Layer 2 & 3 - 烘焙
            "cereal": "#d4af37",
            "grain": "#f4d35e",
            "malt": "#d9680f",
            "brown_roast": "#8c4001",
            "smoky": "#5a4a42",
            "ashy": "#7c7f93",
            "tobacco": "#6c6f86",
            "pipe_tobacco": "#5c5f78",
            "tobacco_flavor": "#4c4f6a",

            // Layer 2 & 3 - 紙味/霉味
            "stale": "#7c7f93",
            "cardboard": "#9b9faf",
            "papery": "#7c7f93",
            "moldy_damp": "#5a5d72",
            "musty_dusty": "#4c4f6a",
            "musty_earthy": "#5c5f78",
            "woody": "#6c6f86",

            // Layer 2 & 3 - 其他
            "black_tea": "#1e66f5",
            "phenolic": "#8c3f50",
            "bitter": "#6c6f86",
            "salty": "#7c7f93",
            "medicinal": "#5a5d72",
            "petroleum": "#4c4f6a",
            "meaty_brothy": "#8c4001",
            "animalic": "#6f4e37",
            "acrid": "#d20f39",
            "burnt": "#8c3f50",
            "pungent": "#c1666b",
            "rubbery": "#5a5d72",
            "kunkry": "#4c4f6a",
            "raw": "#d20f39",
            "beany": "#fe640b",
            "chemical": "#1e66f5"
        }
    },

    // 主題 3: Gruvbox Dark - 溫暖對比強烈
    gruvbox: {
        name: "格魯夫盒深色 (Gruvbox Dark)",
        palette: {
            // Layer 1 - 主要分類
            "fruity": "#fb4934",
            "floral": "#fe8019",
            "sour": "#fabd2f",
            "green_vegetative": "#b8bb26",
            "sweet": "#d4af37",
            "nutty_cocoa": "#d3869b",
            "spices": "#8ec07c",
            "roasted": "#d65d0e",
            "papery_musty": "#928374",
            "other": "#a89984",

            // Layer 2 & 3 - 水果
            "berry": "#fb4934",
            "blueberry": "#83a598",
            "raspberry": "#fb4934",
            "blackberry": "#8f3f71",
            "strawberry": "#fe8019",
            "red_currant": "#fb4934", // 紅醋栗使用 Gruvbox 的標誌性紅色
            "black_currant": "#8f3f71", // 黑醋栗使用與黑莓相同的紫色
            "dried_fruit": "#d3869b",
            "raisin": "#a89984",
            "prune": "#928374",
            "citrus_fruit": "#fabd2f",
            "lemon": "#f4d35e",
            "lime": "#b8bb26",
            "orange": "#fe8019",
            "grapefruit": "#fabd2f",
            "other_fruit": "#fb4934",
            "apple": "#fb4934",
            "peach": "#fe8019",
            "apricot": "#fe8019",
            "pear": "#fabd2f",
            "pineapple": "#f4d35e",
            "passion_fruit": "#fabd2f",
            "cherry": "#fb4934",
            "pomegranate": "#d3869b",
            "grape": "#8ec07c",
            "coconut": "#b8bb26",

            // Layer 2 & 3 - 花香
            "rose": "#d3869b",
            "jasmine": "#fe8019",
            "chamomile": "#fabd2f",
            "lemongrass": "#b8bb26",
            "osmanthus": "#fe8019",
            "orange_blossom": "#fabd2f",
            "lavender": "#d3869b",
            "hibiscus": "#fb4934",

            // Layer 2 & 3 - 酸味
            "fermented": "#b8bb26",
            "winey": "#fabd2f",
            "fermented_taste": "#fe8019",
            "alcohol": "#d65d0e",
            "sour_aromatics": "#fabd2f",
            "acetic_acid": "#f4d35e",
            "butyric_acid": "#fe8019",
            "citric_acid": "#fabd2f",
            "isovaleric_acid": "#d65d0e",
            "malic_acid": "#fb4934",
            "overripe_underripe": "#b8bb26",
            "overripe": "#8ec07c",
            "under_ripe": "#b8bb26",
            "peapod": "#b8bb26",

            // Layer 2 & 3 - 綠色/蔬菜
            "fresh": "#b8bb26",
            "dark_green": "#8ec07c",
            "vegetative": "#689d6a",
            "hay_like": "#83a598",
            "herb_like": "#8ec07c",
            "olive_oil": "#b8bb26",

            // Layer 2 & 3 - 甜感
            "brown_sugar": "#d4af37",
            "caramelized": "#fabd2f",
            "honey": "#f4d35e",
            "molasses": "#d65d0e",
            "maple_syrup": "#fe8019",
            "brown_sugar_taste": "#d4af37",
            "vanilla": "#fabd2f",
            "vanilla_flavor": "#fe8019",
            "vanillin": "#f4d35e",
            "overall_sweet": "#d4af37",
            "sweet_aromatics": "#fabd2f",

            // Layer 2 & 3 - 堅果/可可
            "nutty": "#d3869b",
            "almond": "#8f3f71",
            "hazelnut": "#a89984",
            "peanuts": "#928374",
            "cocoa": "#8f3f71",
            "cocoa_flavor": "#704030",
            "dark_chocolate": "#4a2511",
            "chocolate": "#6f4e37",

            // Layer 2 & 3 - 香料
            "brown_spice": "#d65d0e",
            "cinnamon": "#fe8019",
            "nutmeg": "#d3869b",
            "clove": "#a89984",
            "anise": "#fabd2f",
            "pepper": "#fb4934",

            // Layer 2 & 3 - 烘焙
            "cereal": "#fabd2f",
            "grain": "#f4d35e",
            "malt": "#fe8019",
            "brown_roast": "#d65d0e",
            "smoky": "#928374",
            "ashy": "#a89984",
            "tobacco": "#8f3f71",
            "pipe_tobacco": "#704030",
            "tobacco_flavor": "#6f4e37",

            // Layer 2 & 3 - 紙味/霉味
            "stale": "#928374",
            "cardboard": "#a89984",
            "papery": "#928374",
            "moldy_damp": "#7c6f64",
            "musty_dusty": "#928374",
            "musty_earthy": "#a89984",
            "woody": "#8f3f71",

            // Layer 2 & 3 - 其他
            "black_tea": "#83a598",
            "phenolic": "#d3869b",
            "bitter": "#928374",
            "salty": "#a89984",
            "medicinal": "#8f3f71",
            "petroleum": "#704030",
            "meaty_brothy": "#a89984",
            "animalic": "#928374",
            "acrid": "#fb4934",
            "burnt": "#d65d0e",
            "pungent": "#fe8019",
            "rubbery": "#8f3f71",
            "kunkry": "#704030",
            "raw": "#fb4934",
            "beany": "#fabd2f",
            "chemical": "#83a598"
        }
    }
};