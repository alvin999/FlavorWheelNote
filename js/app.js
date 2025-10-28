/**
 * js/app.js
 * * 應用程式核心邏輯：資料載入、事件監聽、輸出生成。
 * * 假設：
 * 1. window.COLOR_THEMES (來自 js/colorThemes.js) 已載入。
 * 2. FlavorWheel 類別 (來自 js/flavorWheel.js) 已載入。
 * 3. window.LOCALIZATION (來自 js/localization.js) 已載入。
 */

// 應用程式狀態管理
const state = {
    currentDrink: 'coffee',
    currentLang: 'zh',
    currentTheme: 'default',
    currentOutputMode: 'list', // 'list' or 'note'
    selectedFlavors: [],       // [ {id: 'jasmine', label: {zh: '茉莉花', ...}}, ... ]
    inputOrigin: ''
};

let flavorWheelInstance = null;
let allData = {}; // 儲存所有載入的 JSON 資料 (Coffee, Tea)

// --- 資料載入與初始化 ---

/**
 * 載入 JSON 資料 (Coffee, Tea)
 */
async function loadData() {
    const loc = window.LOCALIZATION[state.currentLang];
    console.log(loc.loading_data);
    try {
        // 確保 localization 已經載入
        if (typeof window.LOCALIZATION === 'undefined') throw new Error("Localization module not loaded.");
        // 1. 載入 Coffee 資料
        const coffeeResponse = await fetch('./data/coffee_data.json');
        if (!coffeeResponse.ok) {
             // 如果檔案不存在或伺服器錯誤 (例如 404)
            throw new Error(`Failed to load coffee_data.json: ${coffeeResponse.statusText}`);
        }
        const coffeeData = await coffeeResponse.json();
        allData['coffee'] = coffeeData;

        // 2. 載入 Luxury 資料
        const luxuryResponse = await fetch('./data/luxury_data.json');
        if (!luxuryResponse.ok) {
            throw new Error(`Failed to load luxury_data.json: ${luxuryResponse.statusText}`);
        }
        const luxuryData = await luxuryResponse.json();
        allData['luxury'] = luxuryData;


        // 2. 載入 Tea 資料 (如果存在的話，這裡先用一個模擬的空載入，確保架構完整)
        // 實際部署時，您需要創建 tea_data.json
        const teaData = {
          "drink_type": "tea", "name": "Tea Flavor Wheel",
          "separator": {"zh": "、", "en": ", ", "jp": "・"},
          "templates": {
            "flavor_list": {"zh": "茶香：{{flavors}}", "en": "Tea notes: {{flavors}}", "jp": "お茶の風味：{{flavors}}"},
            "social_note": {"zh": "這壺{{origin}}的茶帶有{{flavors}}的雅韻。", "en": "This tea from {{origin}} features subtle {{flavors}} notes.", "jp": "{{origin}}産のお茶は{{flavors}}の優雅な風味を感じられます。"}
          },
          "children": [
            // 這裡應該是茶的 Layer 1 數據，先用一個佔位符
            {"id": "tea_floral", "layer": 1, "label": {"zh": "茶花香", "en": "Tea Floral", "jp": "お茶の香り"}, "color": "#a8c0c0", "index": 1, "children": [
              {"id": "fresh_flower", "layer": 2, "label": {"zh": "鮮花香", "en": "Fresh Flower", "jp": "新鮮な花"}, "children": []}
            ]}
          ]
        };
        allData['tea'] = teaData;
        
        console.log(loc.data_load_success);
        initializeApp();

    } catch (error) {
        console.error(loc.data_load_fail, error);
        // 如果載入失敗，可以嘗試使用備用/硬編碼資料來防止程式崩潰
    }
}

/**
 * 初始化應用程式和 D3 風味輪實例
 */
function initializeApp() {
    // 檢查 FlavorWheel 類別是否存在
    if (typeof FlavorWheel === 'undefined') {
        const loc = window.LOCALIZATION[state.currentLang];
        console.error(loc.flavor_wheel_module_error);
        return;
    }
    
    // 1. 動態獲取容器寬度以實現響應式設計
    const container = document.getElementById('flavor-wheel');
    // 獲取 #flavor-wheel 容器的實際寬度。
    // 由於父元素 flavor-wheel-container 已移除 padding，
    // 這裡直接使用 #flavor-wheel 的 offsetWidth 即可，讓風味輪盡可能佔滿空間。
    // 使用 Math.max 確保寬度不會是負數或過小，避免 SVG viewBox 錯誤。
    const containerWidth = Math.max(100, container.offsetWidth); 

    // 2. 獲取中心文字區域的寬度，以決定風味輪的中心空白大小
    const centerDisplay = document.getElementById('center-display');
    const centerDiameter = centerDisplay.offsetWidth + 32; // 加上一些 padding

    // 3. 初始化 FlavorWheel 實例
    const initialData = allData[state.currentDrink];
    flavorWheelInstance = new FlavorWheel(
        '#flavor-wheel', 
        initialData, 
        state.currentTheme,
        containerWidth, // 使用動態寬度
        centerDiameter / 2 // 傳入計算好的中心半徑
    );
    // 讓其他模組可以存取
    window.flavorWheelInstance = flavorWheelInstance; 

    // 2. 註冊所有事件監聽器
    updateUILanguage(); // 首次載入時更新 UI 文本
    setupEventListeners();

    // 3. 初始 UI 渲染
    updateUIControls();
    populateCategorySelect();
    generateOutput();
    updateAttributionText();
}

// --- 事件處理與 UI 邏輯 ---

/**
 * 設定所有按鈕和輸入框的事件監聽器
 */
function setupEventListeners() {
    // 語言切換
    document.getElementById('lang-switch').addEventListener('click', handleLangSwitch);
    // 飲料切換
    document.getElementById('drink-switch').addEventListener('click', handleDrinkSwitch);
    // 主題切換 (來自 Step 3)
    document.getElementById('theme-switch').addEventListener('click', handleThemeSwitch);
    // 奢華主題切換
    document.getElementById('luxury-theme-switch').addEventListener('click', handleThemeSwitch);
    // 輸出模式切換
    document.getElementById('output-mode-switch').addEventListener('click', handleOutputModeSwitch);
    // 筆記設定輸入框
    document.getElementById('input-origin').addEventListener('input', handleInputOriginChange);
    // 複製按鈕
    document.getElementById('copy-btn').addEventListener('click', handleCopy);
    // Web Share API 分享按鈕 (如果支援)
    if (navigator.share) {
        document.getElementById('share-btn').classList.remove('hidden');
        document.getElementById('share-btn').addEventListener('click', handleShare);
    }

    // 自訂風味輸入
    document.getElementById('custom-flavor-input').addEventListener('input', toggleAddCustomButton);
    document.getElementById('custom-flavor-category').addEventListener('change', toggleAddCustomButton);
    document.getElementById('add-custom-flavor-btn').addEventListener('click', handleAddCustomFlavor);
    // 監聽 D3 模組發出的風味選取事件
    document.addEventListener('flavorSelected', handleFlavorSelection);
    // 監聽選取風味標籤的點擊事件 (用於刪除)
    document.getElementById('selected-flavors').addEventListener('click', handleRemoveFlavorTag);
}

// --- 事件處理函式 ---

function handleLangSwitch(event) {
    const langButton = event.target.closest('button[data-lang]');
    if (langButton) {
        const newLang = langButton.dataset.lang;
        if (state.currentLang !== newLang) {
            state.currentLang = newLang;
            updateUIControls();
            updateUILanguage(); // 更新所有 UI 文本
            updateAttributionText();
            flavorWheelInstance.updateLanguage(newLang); // 通知 D3 模組更新語言
        }
    }
}

function handleDrinkSwitch(event) {
    const drinkButton = event.target.closest('button[data-type]');
    if (drinkButton) {
        const newDrink = drinkButton.dataset.type;
        populateCategorySelect();
        if (state.currentDrink !== newDrink) {
            // 如果從非奢華切換到奢華，或反之，需要重設主題
            if (newDrink === 'luxury' && state.currentDrink !== 'luxury') {
                state.currentTheme = DEFAULT_LUXURY_THEME; // 預設奢華主題
            } else if (newDrink !== 'luxury' && state.currentDrink === 'luxury') {
                state.currentTheme = 'default'; // 預設一般主題
            }

            state.currentDrink = newDrink;
            updateUIControls();
            // 通知 D3 模組更新資料集
            updateAttributionText();
            flavorWheelInstance.updateTheme(state.currentTheme); // 切換 drink type 時也更新主題
            flavorWheelInstance.updateData(allData[newDrink]);
            // 清空選取狀態 (FlavorWheel.updateData 內部也會做)
            state.selectedFlavors = []; 
            generateOutput();
        }
    }
}

function handleThemeSwitch(event) {
    const themeButton = event.target.closest('button[data-theme]');
    if (themeButton) {
        const newTheme = themeButton.dataset.theme;
        if (state.currentTheme !== newTheme) {
            state.currentTheme = newTheme;
            updateUIControls();
            flavorWheelInstance.updateTheme(newTheme); // 通知 D3 模組更新主題
        }
    }
}

function handleOutputModeSwitch(event) {
    const modeButton = event.target.closest('button[data-mode]');
    if (modeButton) {
        const newMode = modeButton.dataset.mode;
        if (state.currentOutputMode !== newMode) {
            state.currentOutputMode = newMode;
            updateUIControls();
            generateOutput(); // 重新生成輸出
        }
    }
}

function handleInputOriginChange(event) {
    state.inputOrigin = event.target.value.trim();
    if (state.currentOutputMode === 'note') {
        generateOutput(); // 只有在筆記模式下才需要即時更新
    }
}

function handleFlavorSelection(event) {
    // 1. 從目前的選取列表中，篩選出所有「自訂風味」
    const customFlavors = state.selectedFlavors.filter(f => f.isCustom);

    // 2. 取得 D3 模組傳來的「風味輪選取」結果
    const d3SelectedFlavors = event.detail.selected;

    // 3. 將兩者合併，形成新的完整選取列表
    // 確保 D3 選取的風味中，不會包含任何意外的自訂風味，但理論上不會發生。
    state.selectedFlavors = [
        ...customFlavors,           // 保留所有自訂風味
        ...d3SelectedFlavors        // 加上所有 D3 選取的風味
    ];
    
    // 4. 更新 UI 和輸出
    updateSelectedFlavorsDisplay();
    generateOutput();
}

function handleCopy() {
    const textarea = document.getElementById('output-textarea');
    textarea.select();
    const loc = window.LOCALIZATION[state.currentLang];
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? loc.copy_success : loc.copy_fail;
        alert(msg);
    } catch (err) {
        navigator.clipboard.writeText(textarea.value)
            .then(() => alert(loc.copy_success))
            .catch(err => alert(`${loc.copy_fail}: ${err}`));
    }
}

function handleShare() {
    const text = document.getElementById('output-textarea').value;
    if (navigator.share) {
        navigator.share({
            title: window.LOCALIZATION[state.currentLang].app_title, // 使用本地化的應用程式標題
            text: text,
            url: window.location.href,
        }).catch((error) => console.log(window.LOCALIZATION[state.currentLang].share_fail, error));

    }
}

/**
 * 檢查輸入和選擇是否有效，以啟用/禁用新增按鈕
 */
function toggleAddCustomButton() {
    const nameInput = document.getElementById('custom-flavor-input').value.trim();
    const categorySelect = document.getElementById('custom-flavor-category').value;
    const addButton = document.getElementById('add-custom-flavor-btn');

    if (nameInput && categorySelect) {
        addButton.disabled = false;
    } else {
        addButton.disabled = true;
    }
}

/**
 * 處理新增自訂風味按鈕點擊
 */
function handleAddCustomFlavor() {
    const nameInput = document.getElementById('custom-flavor-input');
    const categorySelect = document.getElementById('custom-flavor-category');
    
    const flavorName = nameInput.value.trim();
    const categoryId = categorySelect.value;

    if (!flavorName || !categoryId) return; // 再次檢查

    // 1. 找到對應的 Layer 1 類別數據
    const currentData = allData[state.currentDrink];
    const categoryData = currentData.children.find(c => c.id === categoryId);

    // 2. 創建一個模擬的風味數據物件
    const customFlavor = {
        id: `custom-${Date.now()}`, // 給予獨特的 ID
        layer: 2, // 視為 Layer 2 風味
        isCustom: true,
        // 標籤只包含當前語言（或所有語言複製一份）
        label: {
            [state.currentLang]: flavorName,
            en: flavorName, // 簡化處理：英文也用輸入的文字
            zh: flavorName,
            jp: flavorName 
        },
        // 儲存 L1 ID 以便於顏色查找和輸出顯示
        L1_id: categoryId 
    };

    // 3. 加入到選取列表
    state.selectedFlavors.push(customFlavor);

    // 4. 清空輸入並更新輸出
    nameInput.value = '';
    categorySelect.value = '';
    toggleAddCustomButton(); // 禁用按鈕
    
    updateSelectedFlavorsDisplay();
    generateOutput();
    
    alert(`"${flavorName}" ${window.LOCALIZATION[state.currentLang].flavor_added_alert}`);
}

/**
 * 處理從「選取風味列表」中點擊標籤以移除風味的事件
 * @param {MouseEvent} event
 */
function handleRemoveFlavorTag(event) {
    // 使用事件委派，只處理點擊到帶有 data-id 的 span 元素
    const tag = event.target.closest('span[data-id]');
    if (!tag) return;

    const flavorIdToRemove = tag.dataset.id;

    // 1. 從 state.selectedFlavors 中找到並移除該風味
    const flavorIndex = state.selectedFlavors.findIndex(f => f.id === flavorIdToRemove);
    if (flavorIndex > -1) {
        const removedFlavor = state.selectedFlavors.splice(flavorIndex, 1)[0];

        // 2. 更新 UI
        updateSelectedFlavorsDisplay();
        generateOutput();

        // 3. 如果移除的是非自訂風味，需要通知 D3 風味輪更新其視覺狀態
        if (!removedFlavor.isCustom && flavorWheelInstance) {
            // 這裡我們直接呼叫 flavorWheelInstance 的內部方法來取消選取
            flavorWheelInstance.deselectFlavorById(flavorIdToRemove);
        }
    }
}

// --- 視覺與輸出更新 ---

/**
 * 根據當前語言更新所有 UI 文本
 */
function updateUILanguage() {
    // 檢查 luxuryColorThemes.js 是否已載入
    if (typeof LUXURY_COLOR_THEMES === 'undefined') {
        console.error("luxuryColorThemes.js module not loaded.");
        // 可以在這裡提供一個後備方案，例如禁用奢華選項
        document.querySelector('button[data-type="luxury"]').disabled = true;
    }
    // 檢查 colorThemes.js 是否已載入
    if (typeof COLOR_THEMES === 'undefined') {
        console.error("colorThemes.js module not loaded.");
        // 禁用一般選項
        document.querySelector('button[data-type="coffee"]').disabled = true;
        document.querySelector('button[data-type="tea"]').disabled = true;
    }

    const lang = state.currentLang;
    const loc = window.LOCALIZATION[lang];

    // Update document title
    document.title = loc.app_title;

    // Update elements with data-i18n attribute for textContent
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (loc[key]) {
            element.textContent = loc[key];
        }
    });

    // Update elements with data-i18n-placeholder attribute for placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder; // dataset keys are camelCase
        if (loc[key]) {
            element.placeholder = loc[key];
        }
    });

    // Update the "Click to select flavor" message
    document.getElementById('center-display').querySelector('p:last-child').textContent = loc.click_to_select_flavor;

    populateCategorySelect(); // 重新填充類別選擇器以更新預設選項
}

/**
 * 更新所有控制項按鈕的選取狀態 (視覺回饋)
 */
function updateUIControls() {
    const isLuxury = state.currentDrink === 'luxury';

    // 根據是否為奢華模式，顯示/隱藏對應的主題切換器
    document.getElementById('theme-switch').classList.toggle('hidden', isLuxury);
    document.getElementById('luxury-theme-switch').classList.toggle('hidden', !isLuxury);

    // 決定當前要操作的主題容器 ID 和高亮顏色
    const currentThemeContainerId = isLuxury ? 'luxury-theme-switch' : 'theme-switch';
    const activeThemeClass = isLuxury ? 'bg-yellow-200 text-gray-800' : 'bg-pink-200 text-gray-800';

    // Helper function to update button classes
    const updateButtons = (containerId, dataAttr, currentState, activeClass, inactiveClass) => {
        document.querySelectorAll(`#${containerId} button`).forEach(btn => {
            if (btn.dataset[dataAttr] === currentState) {
                btn.className = `p-2 rounded-md ${activeClass} font-semibold transition`;
            } else {
                btn.className = `p-2 rounded-md ${inactiveClass} transition`;
            }
        });
    };

    // 飲料切換
    updateButtons('drink-switch', 'type', state.currentDrink, 'bg-amber-200 text-gray-800', 'text-gray-500 hover:bg-gray-100');
    // 語言切換
    updateButtons('lang-switch', 'lang', state.currentLang, 'bg-teal-200 text-gray-800', 'text-gray-500 hover:bg-gray-100');
    // 主題切換 (根據當前模式更新對應的切換器)
    updateButtons(currentThemeContainerId, 'theme', state.currentTheme, activeThemeClass, 'text-gray-500 hover:bg-gray-100');
    // 輸出模式切換
    updateButtons('output-mode-switch', 'mode', state.currentOutputMode, 'bg-lime-200 text-gray-800', 'text-gray-500 hover:bg-white');
}

/**
 * 更新選取風味列表 (底下的標籤視覺化)
 */
function updateSelectedFlavorsDisplay() {
    const container = document.getElementById('selected-flavors');
    container.innerHTML = '';
    const loc = window.LOCALIZATION[state.currentLang];

    if (state.selectedFlavors.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-400">${loc.no_flavors_selected}</p>`;
        return;
    }
    
    state.selectedFlavors.forEach(flavor => {
        // 取得 Layer 1 的顏色 (我們需要知道它的父類別 ID)
        let parentId = '';
        if (flavorWheelInstance) {
            let L1_ID = flavor.L1_id; // <-- 優先使用自訂風味的 L1_id
            
            // 如果是 D3 點擊的風味 (沒有 L1_id 屬性)
            if (!L1_ID && flavorWheelInstance) {
                // 透過 ID 在 D3 數據中向上尋找 Layer 1 類別 ID
                L1_ID = flavorWheelInstance.data.children.find(c => 
                    c.children.some(l2 => l2.id === flavor.id || l2.children.some(l3 => l3.id === flavor.id))
                )?.id;
            } 
            // 根據當前主題，決定從哪個顏色配置物件中查找
            const isLuxuryTheme = Object.keys(LUXURY_COLOR_THEMES).includes(state.currentTheme);
            const themeSource = isLuxuryTheme ? LUXURY_COLOR_THEMES : COLOR_THEMES;

            const themePalette = themeSource[state.currentTheme].palette;
            const baseColor = themePalette[L1_ID] || '#ccc';
            
            // 由於 Tailwind CSS 難以動態使用變數，這裡使用 style 屬性
            const flavorLabel = flavor.label[state.currentLang] || flavor.label.en;
            
            const tag = document.createElement('span');
            // 加上 cursor-pointer 和 hover 效果，並在文字後方加上刪除圖示
            tag.className = 'inline-block px-3 py-1 text-sm font-medium rounded-full mr-2 mb-2 text-gray-800 cursor-pointer hover:opacity-80 transition-opacity';
            tag.style.backgroundColor = baseColor;
            tag.dataset.id = flavor.id; // 加上 data-id 以便識別
            tag.textContent = `${flavorLabel} ⓧ`; // 加上刪除圖示
            
            container.appendChild(tag);
        }
    });
}

function populateCategorySelect() {
    const select = document.getElementById('custom-flavor-category');
    const loc = window.LOCALIZATION[state.currentLang];
    select.innerHTML = `<option value="">${loc.select_category_default}</option>`; // 清空並重設預設
    
    const currentData = allData[state.currentDrink];
    if (!currentData || !currentData.children) return;

    // 填充 Layer 1 類別作為選項
    currentData.children.forEach(category => {
        if (category.layer === 1) {
            const option = document.createElement('option');
            // 使用 Layer 1 的 ID 作為值 (value)
            option.value = category.id; 
            // 顯示當前語言的標籤
            option.textContent = category.label[state.currentLang] || category.label.en;
            select.appendChild(option);
        }
    });
}

/**
 * 更新頁腳的資料來源說明文字
 */
function updateAttributionText() {
    const attributionElement = document.getElementById('attribution-text');
    if (!attributionElement) return;

    const data = allData[state.currentDrink];
    // 檢查 attribution 是否為物件且包含當前語言
    if (data && typeof data.attribution === 'object' && data.attribution !== null) {
        attributionElement.textContent = data.attribution[state.currentLang] || data.attribution.en || '';
    } else {
        attributionElement.textContent = ''; // 如果沒有資料來源說明，則清空
    }
}

/**
 * 根據當前模式和選取狀態生成輸出文字
 */
function generateOutput() {
    const data = allData[state.currentDrink];
    const lang = state.currentLang;
    const flavorLabels = state.selectedFlavors.map(f => f.label[lang] || f.label.en);
    const loc = window.LOCALIZATION[lang];
    
    let outputText = "";

    // 取得分隔符號
    const separator = data.separator[lang] || data.separator.en; 
    const flavorsString = flavorLabels.join(separator);

    let finalOutput = "";

    if (state.currentOutputMode === 'list') {
        // 1️⃣ 純風味文字模式
        // 直接輸出以分隔符號連接的風味字串，不使用模板
        outputText = flavorsString;
        finalOutput = outputText;
    } else if (state.currentOutputMode === 'note') {
        // 2️⃣ 社群／筆記分享模式
        const template = data.templates.social_note[lang] || data.templates.social_note.en;
        
        outputText = template 
            .replace('{{origin}}', state.inputOrigin || '')
            .replace('{{drink}}', data.drink_type === 'coffee' ? loc.coffee_drink_type : loc.tea_drink_type) // 本地化飲料類型
            .replace('{{flavors}}', flavorsString);
        
        const aiFriendlyHeader = loc.ai_friendly_header;
        const aiFriendlyInfo = `${loc.ai_friendly_drink}: ${data.drink_type}\n${loc.ai_friendly_origin}: ${state.inputOrigin || 'N/A'}\n${loc.ai_friendly_flavors} (${lang}): ${flavorsString}\n---\n`;
        finalOutput = aiFriendlyHeader + aiFriendlyInfo + outputText;
    }
    
    document.getElementById('output-textarea').value = finalOutput;
}


// --- 啟動程式 ---

// DOM 內容完全載入後，開始載入資料並初始化
document.addEventListener('DOMContentLoaded', loadData);