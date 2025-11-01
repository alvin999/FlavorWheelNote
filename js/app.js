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
    inputOrigin: '',
    isDarkMode: false // 1. 新增暗黑模式狀態
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
    // 使用 setTimeout 給瀏覽器一點時間來完成渲染和尺寸計算
    // 這是處理行動裝置上 `offsetWidth` 可能為 0 的一個穩健作法
    setTimeout(() => {
        console.log("偵錯：setTimeout 內的初始化程式碼開始執行。");

        // 初始化時，根據 <html> class 同步 state
        state.isDarkMode = document.documentElement.classList.contains('dark');

        // 檢查 FlavorWheel 類別是否存在
        if (typeof FlavorWheel === 'undefined') {
            const loc = window.LOCALIZATION[state.currentLang];
            console.error(loc.flavor_wheel_module_error);
            return;
        }
        
        // 1. 動態獲取容器寬度以實現響應式設計
        const container = document.getElementById('flavor-wheel');
        const containerWidth = Math.max(100, container.offsetWidth); 

        // 2. 獲取中心文字區域的寬度，以決定風味輪的中心空白大小
        const centerDisplay = document.getElementById('center-display');
        const centerDiameter = centerDisplay.offsetWidth + 32; // 加上一些 padding

        console.log(`偵錯：計算出的容器寬度 containerWidth = ${containerWidth}`);
        console.log(`偵錯：計算出的中心直徑 centerDiameter = ${centerDiameter}`);

        // 3. 初始化 FlavorWheel 實例
        console.log("偵錯：準備建立 FlavorWheel 實例...");
        const initialData = allData[state.currentDrink];
        flavorWheelInstance = new FlavorWheel(
            '#flavor-wheel', 
            initialData, 
            state.currentTheme,
            containerWidth,
            centerDiameter / 2
        );
        window.flavorWheelInstance = flavorWheelInstance; 
        console.log("偵錯：FlavorWheel 實例建立成功！");

        // 4. 註冊所有事件監聽器
        console.log("偵錯：準備設定事件監聽器 (setupEventListeners)...");
        setupEventListeners();
        console.log("偵錯：事件監聽器設定完成！");

        // 5. 執行初始 UI 渲染
        updateUILanguage();
        updateUIControls();
        populateCategorySelect();
        generateOutput();
        updateAttributionText();
        console.log("偵錯：首次 UI 渲染完成。");

    }, 0); // 使用 0 毫秒延遲，讓它在下一個事件循環中執行
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
    // 重設風味列表按鈕
    document.getElementById('reset-flavors-btn').addEventListener('click', handleResetFlavors);
    // 監聽選取風味標籤的點擊事件 (用於刪除)
    document.getElementById('selected-flavors').addEventListener('click', handleRemoveFlavorTag);
    // 暗黑模式切換
    document.getElementById('dark-mode-toggle').addEventListener('click', handleDarkModeToggle);
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
            
            // 切換風味輪後，不再自動清空列表，而是重新整理顯示和輸出
            updateSelectedFlavorsDisplay();
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
 * 處理暗黑模式切換
 */
function handleDarkModeToggle() {
    // 2. 更新 state
    state.isDarkMode = !state.isDarkMode; 

    const html = document.documentElement;
    if (state.isDarkMode) {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    }
    // 3. 呼叫中央 UI 更新函式
    updateUIControls();
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
 * 處理手動重設風味列表的按鈕點擊
 */
function handleResetFlavors() {
    // 1. 清空應用程式狀態中的選取列表
    state.selectedFlavors = [];

    // 2. 通知 D3 風味輪實例清空其內部選取狀態並更新視覺
    if (flavorWheelInstance) {
        flavorWheelInstance.clearSelection();
    }

    // 3. 更新 UI 顯示和輸出
    updateSelectedFlavorsDisplay();
    generateOutput();
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

    // Helper function to update button classes
    const updateButtons = (containerId, dataAttr, currentState, activeClass, inactiveClass, hoverClass) => {
        document.querySelectorAll(`#${containerId} button`).forEach(btn => {
            if (btn.dataset[dataAttr] === currentState) {
                btn.className = `p-2 rounded-md ${activeClass} font-semibold transition`;
            } else {
                // 修正：同時包含 inactiveClass 和 hoverClass，確保 dark: 樣式不會被覆蓋
                btn.className = `p-2 rounded-md ${inactiveClass} ${hoverClass} transition`;
            }
        });
    };

    // 根據暗黑模式狀態決定非選取按鈕的樣式
    const inactiveClass = 'text-gray-500 dark:text-gray-400';
    const hoverClass = state.isDarkMode 
        ? 'dark:hover:bg-gray-700' // 修正：為暗黑模式的 hover 加上 dark: 前綴
        : 'hover:bg-gray-100';

    // 飲料切換
    updateButtons('drink-switch', 'type', state.currentDrink, 'bg-[#fe8019] text-white', inactiveClass, hoverClass);
    // 語言切換
    updateButtons('lang-switch', 'lang', state.currentLang, 'bg-[#458588] text-white', inactiveClass, hoverClass);
    // 主題切換 (根據當前模式更新對應的切換器)
    updateButtons('theme-switch', 'theme', state.currentTheme, 'bg-[#d3869b] text-white', inactiveClass, hoverClass);
    updateButtons('luxury-theme-switch', 'theme', state.currentTheme, 'bg-[#fabd2f] text-[#3c3836]', inactiveClass, hoverClass);
    // 輸出模式切換
    const outputModeInactiveClass = 'text-gray-500 dark:text-gray-400'; // 輸出模式有自己的背景，分開處理
    const outputModeHoverClass = state.isDarkMode
        ? 'dark:hover:bg-[#504945]' // 修正：為暗黑模式的 hover 加上 dark: 前綴
        : 'hover:bg-gray-100';
    updateButtons('output-mode-switch', 'mode', state.currentOutputMode, 'bg-[#8ec07c] text-[#3c3836]', outputModeInactiveClass, outputModeHoverClass);

    // 4. 集中管理暗黑模式圖示更新
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    sunIcon.classList.toggle('hidden', state.isDarkMode);
    moonIcon.classList.toggle('hidden', !state.isDarkMode);
}

/**
 * 更新選取風味列表 (底下的標籤視覺化)
 */
function updateSelectedFlavorsDisplay() {
    const container = document.getElementById('selected-flavors');
    const resetButton = document.getElementById('reset-flavors-btn');
    container.innerHTML = '';
    const loc = window.LOCALIZATION[state.currentLang];

    if (state.selectedFlavors.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-400 dark:text-[#a89984]">${loc.no_flavors_selected}</p>`;
        resetButton.classList.add('hidden');
        return;
    }
    
    resetButton.classList.remove('hidden'); // 顯示重設按鈕

    state.selectedFlavors.forEach(flavor => {
        const flavorLabel = flavor.label[state.currentLang] || flavor.label.en;
        const tag = document.createElement('span');
        tag.dataset.id = flavor.id;
        tag.textContent = `${flavorLabel} ⓧ`;

        // --- 孤兒風味標示法 ---
        // 檢查此風味是否存在於當前的風味輪資料中
        const isFlavorInCurrentWheel = flavor.isCustom || flavorWheelInstance.findNodeById(flavor.id);

        if (isFlavorInCurrentWheel) {
            // 風味存在於當前輪，或為自訂風味，正常上色
            let L1_ID = flavor.L1_id; // 自訂風味的 L1 ID
            if (!L1_ID) {
                // 從風味輪實例中向上查找 L1 ID
                const node = flavorWheelInstance.findNodeById(flavor.id);
                if (node && node.parent && node.parent.depth > 0) {
                    // 找到其 Layer 1 的祖先
                    let ancestor = node;
                    while (ancestor.depth > 1) {
                        ancestor = ancestor.parent;
                    }
                    L1_ID = ancestor.data.id;
                }
            }

            if (L1_ID) {
                const isLuxuryTheme = Object.keys(LUXURY_COLOR_THEMES).includes(state.currentTheme);
                const themeSource = isLuxuryTheme ? LUXURY_COLOR_THEMES : COLOR_THEMES;
                const themePalette = themeSource[state.currentTheme]?.palette || themeSource['default'].palette;
                const baseColor = themePalette[L1_ID] || '#E5E7EB'; // 找不到顏色也給個灰色
                tag.style.backgroundColor = baseColor;
            } else {
                tag.style.backgroundColor = '#E5E7EB'; // 找不到 L1_ID，設為灰色
            }
            // 加上 cursor-pointer 和 hover 效果，並在文字後方加上刪除圖示
            tag.className = 'inline-block px-3 py-1 text-sm font-medium rounded-full mr-2 mb-2 text-gray-800 dark:text-[#282828] cursor-pointer hover:opacity-80 transition-opacity';
        } else {
            // 風味不存在於當前輪 (孤兒風味)
            tag.className = 'inline-block px-3 py-1 text-sm font-medium rounded-full mr-2 mb-2 text-gray-400 bg-gray-200 border border-dashed border-gray-400 cursor-pointer hover:opacity-80 transition-opacity dark:bg-[#504945] dark:text-[#bdae93] dark:border-[#7c6f64]';
        }

        container.appendChild(tag);
    });
}

function populateCategorySelect() {
    const select = document.getElementById('custom-flavor-category');
    const loc = window.LOCALIZATION[state.currentLang];
    select.innerHTML = `<option value="" class="text-gray-500">${loc.select_category_default}</option>`; // 清空並重設預設
    
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

// 在 FlavorWheel 類別中新增一個輔助方法
FlavorWheel.prototype.findNodeById = function(id) {
    let foundNode = null;
    // d3.hierarchy 建立的 root 物件有 .each 方法可以遍歷所有節點
    const root = this.prepareData(this.data);
    root.each(node => {
        if (node.data.id === id) {
            foundNode = node;
        }
    });
    return foundNode;
};