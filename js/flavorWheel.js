/**
 * FlavorWheel.js
 * * 核心 D3.js 模組：負責繪製 Sunburst Chart、處理互動及選取邏輯。
 */
class FlavorWheel {
    constructor(selector, initialData, theme, width = 700, centerDiameter = 200) {
        // 確保 D3.js 存在
        if (typeof d3 === 'undefined') {
            console.error("D3.js library is not loaded.");
            return;
        }

        // 根據風味輪寬度動態計算中心半徑，使其在不同裝置上比例更協調
        // 在大螢幕上中心區域較大，在小螢幕上則相對縮小，讓環狀區域有更多空間
        const dynamicCenterRadius = Math.max(60, Math.min(width * 0.15, 100));

        this.selector = selector;
        this.width = width;
        this.radius = this.width / 2;
        this.centerRadius = dynamicCenterRadius; // 使用動態計算的中心半徑
        this.data = initialData;
        this.currentLang = 'zh'; // 預設語言
        this.currentTheme = theme || 'default';
        this.selectedFlavors = new Map(); // 用來存儲選取的風味: {id: data_object}
        
        // 繪圖所需的 D3 函式
        this.partition = d3.partition().size([2 * Math.PI, this.radius]);
        this.arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            // 內外半徑控制：讓 Layer 1 靠近中心，Layer 3 靠近邊緣
            .innerRadius(d => this.getInnerRadius(d))
            .outerRadius(d => this.getOuterRadius(d));

        this.initSVG();
        this.draw(this.data);
    }

    /**
     * 根據層級 (Layer) 決定環的內半徑
     * @param {Object} d - D3 階層節點資料
     */
    getInnerRadius(d) {
        // 定義一個較小的中心圓半徑，讓風味環有更多空間
        const layer = d.data.layer || 1;
        const totalLayers = 3;
        // 將剩餘空間分配給各層
        const ringWidth = (this.radius - this.centerRadius) / totalLayers;
        return this.centerRadius + (layer - 1) * ringWidth;
    }

    /**
     * 根據層級 (Layer) 決定環的外半徑
     * @param {Object} d - D3 階層節點資料
     */
    getOuterRadius(d) {
        const layer = d.data.layer || 1;
        const totalLayers = 3;
        const ringWidth = (this.radius - this.centerRadius) / totalLayers;
        return this.centerRadius + layer * ringWidth;
    }

    /**
     * 初始化 SVG 容器
     */
    initSVG() {
        // 清除舊的 SVG
        d3.select(this.selector).select("svg").remove();

        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.width}`)
            .attr("width", "100%") // 讓它能響應式縮放
            .attr("height", "100%")
            .append("g")
            .attr("transform", `translate(${this.radius}, ${this.radius})`); // 移到中心
    }

    /**
     * 將原始 JSON 資料轉換為 D3 可用的階層結構
     * 並加入排序邏輯 (依 Layer 1 的 index)
     * @param {Object} data - 原始 JSON 資料
     */
    prepareData(data) {
        // 我們保留 .sum() 來計算節點權重，以便大部分類別能按風味數量排序。
        const root = d3.hierarchy(data).sum(d => (d && d.children && d.children.length > 0) ? 0 : 1);

        // 使用一個更智能的排序函式
        /*
        root.sort((a, b) => {
            // 規則 1: Layer 1 永遠按照 JSON 中的 "index" 排序
            if (a.depth === 1 && b.depth === 1) {
                return a.data.index - b.data.index;
            }
            // 規則 2: 如果父節點是 "fruity" (水果)，則不進行排序，維持 JSON 原始順序。
            // 我們透過比較它們在父節點 children 陣列中的原始索引來達成。
            if (a.parent && a.parent.data.id === 'fruity') {
                return a.parent.children.indexOf(a) - a.parent.children.indexOf(b);
            }
            // 規則 3: 其他所有層級，都按照預設的權重（風味數量）從大到小排序
            return b.value - a.value;
        });
        */
        return this.partition(root);
    }

    /**
     * 繪製 Sunburst 圖
     * @param {Object} data - 原始 JSON 資料
     */
    draw(data) {
        const transitionDuration = 500; // 動畫時間 (毫秒)
        const root = this.prepareData(data);
        const arcs = root.descendants();

        // --- 1. 繪製弧形 (Arcs) ---
        this.svg.selectAll("path.flavor-arc") // 選擇所有帶有 flavor-arc class 的 path
            .data(arcs, d => d.data.id) // 使用 d.data.id 作為 key 進行資料綁定，實現物件恆定性
            .join(
                enter => enter.append("path")
                    .attr("class", d => `flavor-arc layer-${d.data.layer || 1} ${this.selectedFlavors.has(d.data.id) ? 'selected' : ''}`)
                    .attr("fill", d => this.getArcColor(d))
                    .attr("d", this.arc) // 初始形狀
                    .style("fill-opacity", 0) // 從透明開始
                    .on("mouseover", (event, d) => this.handleHover(d, true)) // 事件監聽器只在進入時綁定一次
                    .on("mouseout", (event, d) => this.handleHover(d, false))
                    .on("click", (event, d) => this.handleClick(d))
                    .call(enter => enter.transition().duration(transitionDuration)
                        .style("fill-opacity", d => (d.depth === 0 ? 0 : 1))), // 淡入新元素

                update => update
                    // 更新 class (例如 selected 狀態)
                    .attr("class", d => `flavor-arc layer-${d.data.layer || 1} ${this.selectedFlavors.has(d.data.id) ? 'selected' : ''}`)
                    .call(update => update.transition().duration(transitionDuration)
                        .attr("fill", d => this.getArcColor(d)) // 過渡顏色
                        .attr("d", this.arc) // 過渡到新形狀/位置
                        .style("fill-opacity", d => (d.depth === 0 ? 0 : 1))), // 確保透明度正確

                exit => exit.transition().duration(transitionDuration)
                    .style("fill-opacity", 0) // 淡出舊元素
                    .remove() // 移除
            );
            // 移除這裡重複的事件監聽器，因為它們已經在 enter selection 中綁定
            /*
            .on("mouseover", (event, d) => this.handleHover(d, true))
            .on("mouseout", (event, d) => this.handleHover(d, false))
            .on("click", (event, d) => this.handleClick(d));
            */

        // --- 2. 繪製文字標籤 (Labels) ---
        const self = this;
        let fontSize;
        if (this.currentLang === 'jp') {
            fontSize = this.width >= 768 ? 20 : 3;
        } else {
            fontSize = this.width >= 768 ? 20 : 5;
        }

        this.svg.selectAll("g.label-group")
            .data(arcs.filter(d => d.depth > 0), d => d.data.id) // 同樣使用 key 進行綁定
            .join(
                enter => {
                    // 為新標籤建立群組，並設定初始位置和透明度
                    const group = enter.append("g")
                        .attr("class", "label-group")
                        .style("opacity", 0)
                        .attr("transform", d => `translate(${this.arc.centroid(d)}) rotate(${this.getLabelAngle(d)})`);

                    group.append("text")
                        .attr("class", "flavor-label")
                        .attr("dy", "0.35em")
                        .attr("text-anchor", "middle")
                        .attr("font-size", `${fontSize}px`)
                        .text(d => d.data.label[self.currentLang] || d.data.label.en);

                    // 淡入新標籤
                    group.transition().duration(transitionDuration).style("opacity", 1);
                    return group;
                },
                update => {
                    // 為了實現文字的交叉淡入淡出效果，我們需要更精細的控制
                    const textUpdate = update.select("text");

                    // 1. 先讓舊文字淡出
                    textUpdate.transition().duration(transitionDuration / 2)
                        .style("opacity", 0)
                        // 2. 在淡出動畫結束時，更新文字內容，並立即將其設為透明
                        .end().then(() => {
                            textUpdate.text(d => d.data.label[self.currentLang] || d.data.label.en)
                                // 3. 接著讓新文字淡入
                                .transition().duration(transitionDuration / 2).style("opacity", 1);
                        });
                    // 同時，讓整個標籤群組平滑移動到新位置
                    update.transition().duration(transitionDuration)
                        .attr("transform", d => `translate(${this.arc.centroid(d)}) rotate(${this.getLabelAngle(d)})`);
                    return update;
                },
                exit => exit.transition().duration(transitionDuration).style("opacity", 0).remove() // 淡出並移除舊標籤
            );

        // 更新中央顯示 (初始狀態)
        this.updateCenterDisplay({data: {label: {zh: '風味輪', en: 'Flavor Wheel', jp: '風味の輪'}, layer: 0}}, 'center');
    }
    
    /**
     * 取得弧形顏色
     * @param {Object} d - D3 階層節點資料
     */
    getArcColor(d) {
        if (d.depth === 0) {
            return 'transparent'; // 中心節點
        }

        // 判斷當前主題屬於哪種類型 (茶、奢華、或一般)
        const isTeaTheme = Object.keys(TEA_COLOR_THEMES).includes(this.currentTheme);
        const isLuxuryTheme = Object.keys(LUXURY_COLOR_THEMES).includes(this.currentTheme);
        
        let themeSource, defaultThemeId;

        if (isTeaTheme) {
            themeSource = TEA_COLOR_THEMES;
            defaultThemeId = DEFAULT_TEA_THEME;
        } else if (isLuxuryTheme) {
            themeSource = LUXURY_COLOR_THEMES;
            defaultThemeId = DEFAULT_LUXURY_THEME;
        } else {
            themeSource = COLOR_THEMES;
            defaultThemeId = 'default';
        }
        const themePalette = themeSource[this.currentTheme]?.palette || themeSource[defaultThemeId].palette;

        // 智慧型顏色查找：
        // 1. 優先使用自身 ID 查找顏色。
        // 2. 如果找不到，則向上查找父節點的顏色，直到根節點。
        // 3. 如果都找不到，回退到一個預設顏色。
        let currentNode = d;
        let baseColor = null;

        while (currentNode && !baseColor) {
            baseColor = themePalette[currentNode.data.id];
            currentNode = currentNode.parent;
        }

        // 如果遍歷完都沒找到顏色，給一個預設值
        return baseColor || '#cccccc';
    }

    /**
     * 計算標籤的旋轉角度
     * @param {Object} d - D3 階層節點資料
     */
    getLabelAngle(d) {
        const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI - 90;
        // 將位於左半邊的文字翻轉 180 度，避免倒置
        return (angle > 90 && angle < 270) ? angle + 180 : angle;
    }

    /**
    * 更新顏色主題並重繪
    * @param {string} newTheme - 新的主題 ID (如 'catppuccin')
    */
    updateTheme(newTheme) {
        // 檢查新主題是否存在於任一個主題配置中
        const themeExists = COLOR_THEMES[newTheme] || LUXURY_COLOR_THEMES[newTheme] || TEA_COLOR_THEMES[newTheme];

        if (this.currentTheme !== newTheme && themeExists) {
            this.currentTheme = newTheme;
            // 由於顏色變了，我們需要重繪所有的弧形
            this.svg.selectAll("path.flavor-arc")
                .transition() // 增加過渡效果，讓切換更平滑
                .duration(500)
                .attr("fill", d => this.getArcColor(d));

            const themeName = themeExists.name;
            console.log(`主題已切換至: ${themeName}`);
        }
    }
    /**
     * 處理滑鼠懸停 (Hover) 或 Tap 模擬
     * @param {Object} d - D3 階層節點資料
     * @param {boolean} isHovering - 是否正在懸停
     */
    handleHover(d, isHovering) {
        if (d.depth === 0) return;

        if (isHovering) {
            // 根據層級決定顯示類型
            const displayType = d.data.layer === 1 ? 'hover-category' : 'hover';
            this.updateCenterDisplay(d, displayType);

            this.svg.selectAll('path.flavor-arc')
                .style('fill-opacity', p => (d === p || d.ancestors().includes(p) || d.descendants().includes(p)) ? 1 : 0.6);
        } else {
            // 恢復所有弧形的透明度，並更新中央顯示為中心或選取的風味
            this.svg.selectAll('path.flavor-arc')
                .style('fill-opacity', 1);
            
            // 如果有選取的風味，顯示最後一個選取的；否則顯示中心文字
            const lastSelected = Array.from(this.selectedFlavors.values()).pop();
            if (lastSelected) {
                this.updateCenterDisplay({data: lastSelected}, 'selected');
            } else {
                this.updateCenterDisplay({data: {label: {zh: '風味輪', en: 'Flavor Wheel', jp: '風味の輪'}, layer: 0}}, 'center');
            }
        }
    }

    /**
     * 處理點擊 (Click) 或 Tap 確認選取
     * @param {Object} d - D3 階層節點資料
     */
    handleClick(d) {
        if (d.depth === 0) return; // 忽略根節點

        const flavorId = d.data.id;
        
        if (this.selectedFlavors.has(flavorId)) {
            // 如果已選取，則取消選取
            this.selectedFlavors.delete(flavorId);
        } else {
            // 如果未選取，則加入選取
            // 確保選取的風味至少在 Layer 2 以上 (Layer 1 通常是類別)
            if (d.data.layer >= 2) {
                 // 儲存原始資料物件，便於後續生成筆記
                this.selectedFlavors.set(flavorId, d.data);
            } else if (d.data.layer === 1) {
                // 如果點擊 Layer 1，直接提示使用者
                // const categoryName = d.data.label[this.currentLang] || d.data.label.en;
                // alert(`「${categoryName}」是一個大類別，無法選取。請點選更細項的風味。`);
                return; // 點擊 Layer 1 不加入選取列表
            }
        }

        // 更新視覺狀態
        this.svg.selectAll('path.flavor-arc')
            .classed('selected', p => this.selectedFlavors.has(p.data.id));
        
        // 更新中央顯示
        if (this.selectedFlavors.has(flavorId)) {
            this.updateCenterDisplay(d, 'selected');
        } else {
            this.updateCenterDisplay(d, 'unselected');
        }

        // 通知外部應用程式選取列表已更新
        document.dispatchEvent(new CustomEvent('flavorSelected', {
            detail: {
                selected: Array.from(this.selectedFlavors.values()),
                lang: this.currentLang
            }
        }));
    }

    /**
     * 更新風味輪中心的顯示文字
     * @param {Object} d - D3 階層節點資料
     * @param {string} type - 顯示類型: 'center', 'hover', 'hover-category', 'selected', 'unselected'
     */
    updateCenterDisplay(d, type) {
        const categoryElement = document.getElementById('current-category');
        const flavorElement = document.getElementById('current-flavor');

        // 修正：區分初始狀態和互動狀態的字體大小
        // 初始狀態 (type === 'center') 使用固定的 16px，避免 "Flavor Wheel" 等長文字在小螢幕或日文版溢出
        if (type === 'center') {
            flavorElement.style.fontSize = '16px';
        } else {
            // 互動時才使用動態計算，讓風味名稱可以放大顯示
            const centerFontSize = Math.max(8, Math.min(this.width / 30, 26));
            flavorElement.style.fontSize = `${centerFontSize}px`;
        }
        if (!d || !d.data.label) {
            categoryElement.textContent = '';
            // flavorElement.textContent = '風味輪載入中...'; // 移除此行，因為語言切換是同步的，不需要載入提示
            return;
        }

        const loc = window.LOCALIZATION[this.currentLang];
        const label = d.data.label[this.currentLang] || d.data.label.en || d.data.id;
        let parentLabel = '';
        
        if (d.data.layer > 1 && d.parent) {
            parentLabel = d.parent.data.label[this.currentLang] || d.parent.data.label.en;
        } else if (d.data.layer === 1) {
            // 使用本地化的「大類別」標籤
            parentLabel = loc.layer1_category_label;
        }

        if (type === 'hover-category') {
            categoryElement.textContent = `[${label}]`;
            flavorElement.textContent = loc.select_finer_flavor; // 使用本地化文字
        } else if (type === 'selected') {
            categoryElement.textContent = parentLabel ? `[${parentLabel}]` : '';
            flavorElement.textContent = `${label} (${loc.flavor_added})`; // 使用本地化文字
        } else {
            categoryElement.textContent = parentLabel ? `[${parentLabel}]` : '';
            flavorElement.textContent = label;
        }

        // 視覺回饋：如果被選取，給予不同顏色
        if (type === 'selected' || type === 'hover-category') {
             flavorElement.className = 'font-bold text-[#b8bb26] dark:text-[#b8bb26] transition'; // Gruvbox Green
        } else if (type === 'hover') {
             flavorElement.className = 'font-bold text-[#fabd2f] dark:text-[#fabd2f] transition'; // Gruvbox Yellow
        } else {
            flavorElement.className = 'font-bold text-gray-800 dark:text-[#ebdbb2] transition';
        }
    }

    /**
     * 重新繪製風味輪 (用於切換資料集或響應式調整)
     * @param {Object} newData - 新的 JSON 資料
     */
    updateData(newData) {
        this.data = newData;
        // 清空選取列表，因為資料集已切換
        // 改成手動清空，讓風味輪切換不影響已選取
        // this.selectedFlavors.clear(); 
        // 不再重新初始化 SVG，而是讓 D3 處理現有元素的更新。
        // initSVG() 僅在 FlavorWheel 實例化時呼叫一次。
        this.draw(this.data);
        
        // 通知外部應用程式，讓它用目前保留的風味列表來更新 UI
        document.dispatchEvent(new CustomEvent('flavorSelected', {
            detail: { 
                selected: Array.from(this.selectedFlavors.values()), // <--- 傳遞當前已選的風味
                lang: this.currentLang 
            }
        }));
    }

    /** 
     * 根據 ID 從外部取消選取一個風味
     * @param {string} flavorId - 要取消選取的風味 ID
     */
    deselectFlavorById(flavorId) {
        if (this.selectedFlavors.has(flavorId)) {
            this.selectedFlavors.delete(flavorId);

            // 更新對應弧形的 'selected' class
            this.svg.selectAll('path.flavor-arc')
                .filter(p => p.data.id === flavorId)
                .classed('selected', false);
        }
    }

    /**
     * 從外部清空所有選取狀態
     */
    clearSelection() {
        this.selectedFlavors.clear();
        // 移除所有弧形的 'selected' class
        this.svg.selectAll('path.flavor-arc').classed('selected', false);
        // 將中央顯示恢復到預設狀態
        this.updateCenterDisplay({data: {label: {zh: '風味輪', en: 'Flavor Wheel', jp: '風味の輪'}, layer: 0}}, 'center');
    }


    /**
     * 更新顯示語言
     * @param {string} newLang - 新的語言代碼 (zh, en, jp)
     */
    updateLanguage(newLang) {
        this.currentLang = newLang;

        // 重新呼叫 draw 函式，用現有的資料和新的語言設定來更新標籤。
        this.draw(this.data);

        // 重新觸發一次選取事件，讓外部的列表和輸出重新生成
        document.dispatchEvent(new CustomEvent('flavorSelected', {
            detail: {
                selected: Array.from(this.selectedFlavors.values()),
                lang: this.currentLang
            }
        }));
    }
}