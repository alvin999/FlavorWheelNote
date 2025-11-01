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
        
        return this.partition(root);
    }

    /**
     * 繪製 Sunburst 圖
     * @param {Object} data - 原始 JSON 資料
     */
    draw(data) {
        const root = this.prepareData(data);
        const arcs = root.descendants();

        // 綁定資料並繪製弧形
        const path = this.svg.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("class", d => `flavor-arc layer-${d.data.layer || 1} ${this.selectedFlavors.has(d.data.id) ? 'selected' : ''}`)
            .attr("fill", d => this.getArcColor(d))
            .attr("d", this.arc)
            .style("fill-opacity", d => d.depth === 0 ? 0 : 1) // 隱藏最中心根節點
            // 設定透明度：中心隱藏，最外層淡出，其餘正常
            .style("fill-opacity", d => {
                if (d.depth === 0) return 0; // 隱藏中心根節點
                if (d.data.layer === 3) return 0.8; // 最外層淡出效果
                return 1; // 其他層級正常顯示
            })
            .on("mouseover", (event, d) => this.handleHover(d, true))
            .on("mouseout", (event, d) => this.handleHover(d, false))
            .on("click", (event, d) => this.handleClick(d));

        // 繪製所有風味的文字標籤
        this.drawLabels();

        // 更新中央顯示 (初始狀態)
        this.updateCenterDisplay({data: {label: {zh: '風味輪', en: 'Flavor Wheel', jp: '風味の輪'}, layer: 0}}, 'center');
    }

    /**
     * 繪製弧形上的文字標籤
     */
    
    drawLabels() {
        this.svg.selectAll("g.label-group").remove(); // 清除舊的標籤群組

        // 根據裝置寬度決定一個統一的字體大小，邏輯更簡單
        // 桌面版使用 20px，行動裝置版使用 12px
        const fontSize = this.width >= 768 ? 20 : 4;

        const self = this;
        this.svg.selectAll("path.flavor-arc")
            .filter(d => d.depth > 0) // 只處理可見的弧形
            .each(function(d) {
                const labelText = d.data.label[self.currentLang] || d.data.label.en;
                if (!labelText) return;
                
                // 繪製最終的標籤
                const [centroidX, centroidY] = self.arc.centroid(d);
                const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI - 90;
                // 將位於左半邊的文字翻轉 180 度，避免倒置
                const finalAngle = (angle > 90 && angle < 270) ? angle + 180 : angle;

                const labelGroup = self.svg.append("g")
                    .attr("class", "label-group") // 為群組加上 class
                    .attr("transform", `translate(${centroidX}, ${centroidY}) rotate(${finalAngle})`);

                // 使用統一計算好的字體大小
                labelGroup.append("text")
                    .attr("class", "flavor-label")
                    .attr("dy", "0.35em")
                    .attr("text-anchor", "middle")
                    .attr("font-size", `${fontSize}px`)
                    .text(labelText);
            });
    }
    
    /**
     * 取得弧形顏色
     * @param {Object} d - D3 階層節點資料
     */
    getArcColor(d) {
        if (d.depth === 0) {
            return 'transparent'; // 中心節點
        }

        // 判斷當前主題是屬於一般主題還是奢華主題
        const isLuxuryTheme = Object.keys(LUXURY_COLOR_THEMES).includes(this.currentTheme);
        const themeSource = isLuxuryTheme ? LUXURY_COLOR_THEMES : COLOR_THEMES;
        const defaultTheme = isLuxuryTheme ? DEFAULT_LUXURY_THEME : 'default';

        const themePalette = themeSource[this.currentTheme]?.palette || themeSource[defaultTheme].palette;

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
    * 更新顏色主題並重繪
    * @param {string} newTheme - 新的主題 ID (如 'catppuccin')
    */
    updateTheme(newTheme) {
        // 檢查新主題是否存在於任一個主題配置中
        const themeExists = COLOR_THEMES[newTheme] || LUXURY_COLOR_THEMES[newTheme];

        if (this.currentTheme !== newTheme && themeExists) {
            this.currentTheme = newTheme;
            // 由於顏色變了，我們需要重繪所有的弧形
            this.svg.selectAll("path.flavor-arc")
                .transition() // 增加過渡效果，讓切換更平滑
                .duration(500)
                .attr("fill", d => this.getArcColor(d));

            // 主題更新時，標籤顏色可能也需要更新，這裡直接重繪
            this.drawLabels();

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
            const centerFontSize = Math.max(16, Math.min(this.width / 20, 28));
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
             flavorElement.className = 'font-bold text-green-600 dark:text-green-400 transition';
        } else if (type === 'hover') {
             flavorElement.className = 'font-bold text-amber-600 dark:text-amber-400 transition';
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
        
        // 重新初始化 SVG 並繪圖
        this.initSVG();
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
        
        // 重新更新中央顯示和所有選取風味的標籤
        // 修正：在語言切換時，中心顯示應恢復為預設的「風味輪」文字，而不是顯示「載入中」。
        this.updateCenterDisplay(
            {data: {label: {zh: '風味輪', en: 'Flavor Wheel', jp: '風味の輪'}, layer: 0}},
            'center');

        // 重新觸發一次選取事件，讓外部的列表和輸出重新生成
        document.dispatchEvent(new CustomEvent('flavorSelected', {
            detail: {
                selected: Array.from(this.selectedFlavors.values()),
                lang: this.currentLang
            }
        }));

        // 語言切換後，重繪標籤
        this.drawLabels();
    }
}