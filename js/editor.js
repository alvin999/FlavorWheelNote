/**
 * editor.js - 進階圖卡編輯器實作
 * 支援標籤拖拽、縮放、自訂背景與匯出
 */

const Editor = {
    canvas: null,
    stickerContainer: null,
    activeSticker: null,
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startLeft: 0,
    startTop: 0,
    currentBg: null,
    currentScale: 1,
    bgScale: 1,
    bgX: 0,
    bgY: 0,
    isDraggingBg: false,
    startBgX: 0,
    startBgY: 0,

    init() {
        this.canvas = document.getElementById('editor-canvas');
        this.stickerContainer = document.getElementById('sticker-container');
        this.bindEvents();
        this.updateScale();
    },

    bindEvents() {
        // 開啟/關閉編輯器
        document.getElementById('open-editor-btn').addEventListener('click', () => this.open());
        document.getElementById('close-editor-btn').addEventListener('click', () => this.close());

        // 背景上傳
        document.getElementById('editor-upload-bg-btn').addEventListener('click', () => {
            document.getElementById('editor-bg-input').click();
        });
        document.getElementById('editor-bg-input').addEventListener('change', (e) => this.handleBgUpload(e));

        // 匯出圖片
        document.getElementById('save-editor-btn').addEventListener('click', () => this.exportImage());

        // 分享圖片
        const shareBtn = document.getElementById('share-editor-btn');
        if (shareBtn) {
            if (navigator.share && navigator.canShare) {
                shareBtn.classList.remove('hidden');
                shareBtn.addEventListener('click', () => this.shareImage());
            } else {
                shareBtn.classList.add('hidden');
            }
        }

        // 全域指標事件 (用於拖拽/縮放)
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
        window.addEventListener('pointerup', () => this.onPointerUp());
        
        // 視窗縮放監聽
        window.addEventListener('resize', () => this.updateScale());

        // 背景調整事件
        const zoomSlider = document.getElementById('bg-zoom-slider');
        const xSlider = document.getElementById('bg-x-slider');
        const ySlider = document.getElementById('bg-y-slider');
        const resetBtn = document.getElementById('reset-bg-adj-btn');

        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                this.bgScale = parseFloat(e.target.value);
                const zoomValDisp = document.getElementById('bg-zoom-val');
                if (zoomValDisp) zoomValDisp.textContent = `${Math.round(this.bgScale * 100)}%`;
                this.updateBgTransform();
            });
        }
        if (xSlider) {
            xSlider.addEventListener('input', (e) => {
                this.bgX = parseInt(e.target.value);
                this.updateBgTransform();
            });
        }
        if (ySlider) {
            ySlider.addEventListener('input', (e) => {
                this.bgY = parseInt(e.target.value);
                this.updateBgTransform();
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetBgAdjust());
        }

        // 畫布背景拖拽事件
        this.canvas.addEventListener('pointerdown', (e) => this.onCanvasDown(e));

        // 點擊畫布空白處取消選取 (pointerdown 已處理一部分，click 保留用於行動端純點擊)
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas || e.target === document.getElementById('editor-bg-layer')) {
                if (!this.isDraggingBg) this.selectSticker(null);
            }
        });
    },

    updateScale() {
        const scaler = document.getElementById('canvas-scaler');
        if (!scaler || !this.canvas) return;

        // 計算縮放比例，保留 16px 邊距
        const scale = Math.min(
            (scaler.offsetWidth - 32) / 360,
            (scaler.offsetHeight - 32) / 640,
            1
        );

        this.currentScale = scale;
        this.canvas.style.transform = `scale(${scale})`;
    },

    open() {
        const modal = document.getElementById('editor-modal');
        modal.classList.remove('hidden');
        this.updateScale(); 
        
        // 直接加入一個包含所有選取風味的合併貼紙
        this.stickerContainer.innerHTML = ''; 
        this.addAllStickers();
        this.selectSticker(null);

        if (state.customBg) {
            this.setBg(state.customBg);
        }
    },

    close() {
        document.getElementById('editor-modal').classList.add('hidden');
    },

    // 移除 populateFlavors 邏輯，改為自動加入
    

    /**
     * 批次新增（現在改為合併為一個貼紙物件）
     */
    addAllStickers() {
        if (state.selectedFlavors.length === 0) return;
        this.createSticker(state.selectedFlavors);
    },

    /**
     * 建立包含多個獨立樣式標籤的合併貼紙
     */
    createSticker(flavors) {
        if (!this.stickerContainer) {
            this.stickerContainer = document.getElementById('sticker-container');
        }
        if (!this.stickerContainer) return;

        const lang = state.currentLang;
        
        const sticker = document.createElement('div');
        sticker.className = 'editor-sticker';
        
        // 畫布中心位置
        sticker.style.left = '50px';
        sticker.style.top = '100px';
        sticker.style.fontSize = '20px'; 
        sticker.dataset.scale = '1';

        // 依序加入每個標籤
        flavors.forEach(flavor => {
            const label = flavor.label[lang] || flavor.label.en || flavor.id;
            const span = document.createElement('span');
            span.className = 'sticker-tag';
            span.textContent = label;

            // 取得顏色邏輯
            let L1_ID = flavor.L1_id;
            if (!L1_ID && typeof flavorWheelInstance !== 'undefined') {
                const node = flavorWheelInstance.findNodeById(flavor.id);
                if (node && node.parent && node.parent.depth > 0) {
                    let ancestor = node;
                    while (ancestor.depth > 1) { ancestor = ancestor.parent; }
                    L1_ID = ancestor.data.id;
                }
            }
            if (L1_ID) {
                const isTeaTheme = Object.keys(TEA_COLOR_THEMES).includes(state.currentTheme);
                const isLuxuryTheme = Object.keys(LUXURY_COLOR_THEMES).includes(state.currentTheme);
                let themeSource = COLOR_THEMES;
                let defaultThemeId = 'default';
                
                if (isTeaTheme) {
                    themeSource = TEA_COLOR_THEMES; defaultThemeId = DEFAULT_TEA_THEME;
                } else if (isLuxuryTheme) {
                    themeSource = LUXURY_COLOR_THEMES; defaultThemeId = DEFAULT_LUXURY_THEME;
                }
                
                const themePalette = themeSource[state.currentTheme]?.palette || themeSource[defaultThemeId].palette;
                const baseColor = themePalette[L1_ID] || '#fe8019';
                span.style.backgroundColor = baseColor;
            } else {
                span.style.backgroundColor = '#504945'; // fallback 灰色
            }
            sticker.appendChild(span);
        });

        // 縮放手把
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        sticker.appendChild(handle);

        // 事件監聽
        sticker.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.onStickerDown(e, sticker);
        }, { passive: false });

        handle.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.onHandleDown(e, sticker);
        }, { passive: false });

        this.stickerContainer.append(sticker);
        this.selectSticker(sticker);
    },

    selectSticker(sticker) {
        // 如果點選的是目前已選取的貼紙，則取消選取 (Toggle)
        if (sticker && this.activeSticker === sticker) {
            sticker.classList.remove('selected');
            this.activeSticker = null;
            return;
        }

        // 清除舊的選取狀態
        if (this.activeSticker) {
            this.activeSticker.classList.remove('selected');
        }

        // 設定新的選取狀態
        this.activeSticker = sticker;
        if (sticker) {
            sticker.classList.add('selected');
            // 確保被選取的貼紙置於最上層
            this.stickerContainer.appendChild(sticker);
        }
    },

    onStickerDown(e, sticker) {
        e.stopPropagation();
        if (this.isResizing) return;
        
        this.selectSticker(sticker);
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startLeft = parseInt(sticker.style.left) || 0;
        this.startTop = parseInt(sticker.style.top) || 0;
        sticker.setPointerCapture(e.pointerId);
    },

    onHandleDown(e, sticker) {
        e.stopPropagation();
        this.isResizing = true;
        this.activeSticker = sticker;
        this.startX = e.clientX;
        this.startWidth = sticker.offsetWidth;
        this.startFontSize = parseFloat(sticker.style.fontSize);
        sticker.setPointerCapture(e.pointerId);
    },

    onCanvasDown(e) {
        // 如果點擊的是背景圖層或畫布本身 (排除貼紙)
        if (e.target === this.canvas || e.target === document.getElementById('editor-bg-layer') || e.target.id === 'editor-bg-img') {
            this.isDraggingBg = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.startBgX = this.bgX;
            this.startBgY = this.bgY;
            this.canvas.setPointerCapture(e.pointerId);
            this.selectSticker(null);
        }
    },

    onPointerMove(e) {
        // 背景拖拽邏輯
        if (this.isDraggingBg) {
            const dx = (e.clientX - this.startX) / this.currentScale;
            const dy = (e.clientY - this.startY) / this.currentScale;
            this.bgX = this.startBgX + dx;
            this.bgY = this.startBgY + dy;
            this.updateBgTransform();
            this.syncBgControls();
            return;
        }

        if (!this.activeSticker) return;

        // 貼紙位移量需除以當前縮放比例，以還原到 360x640 的座標系
        const dx = (e.clientX - this.startX) / this.currentScale;
        const dy = (e.clientY - this.startY) / this.currentScale;

        if (this.isDragging) {
            this.activeSticker.style.left = `${this.startLeft + dx}px`;
            this.activeSticker.style.top = `${this.startTop + dy}px`;
        } else if (this.isResizing) {
            // 縮放邏輯也套用位移修正
            const newScale = 1 + (dx / 100);
            const clampedScale = Math.max(0.5, Math.min(4, newScale));
            const newFontSize = 16 * clampedScale;
            this.activeSticker.style.fontSize = `${newFontSize}px`;
            this.activeSticker.style.padding = `${0.5 * clampedScale}rem ${1.25 * clampedScale}rem`;
        }
    },

    onPointerUp() {
        this.isDragging = false;
        this.isResizing = false;
        this.isDraggingBg = false;
    },

    syncBgControls() {
        const zoomSlider = document.getElementById('bg-zoom-slider');
        const xSlider = document.getElementById('bg-x-slider');
        const ySlider = document.getElementById('bg-y-slider');
        const zoomValDisp = document.getElementById('bg-zoom-val');

        if (zoomSlider) zoomSlider.value = this.bgScale;
        if (xSlider) xSlider.value = this.bgX;
        if (ySlider) ySlider.value = this.bgY;
        if (zoomValDisp) zoomValDisp.textContent = `${Math.round(this.bgScale * 100)}%`;
    },

    handleBgUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => this.setBg(ev.target.result);
            reader.readAsDataURL(file);
        }
    },

    setBg(url) {
        const bgImg = document.getElementById('editor-bg-img');
        const bgLayer = document.getElementById('editor-bg-layer');
        const controls = document.getElementById('bg-adjust-controls');

        this.currentBg = url;
        
        if (bgImg) {
            // 使用 Image 物件獲取原始尺寸
            const tempImg = new Image();
            tempImg.onload = () => {
                // 計算「剛好填滿畫布」的初始比例 (Cover)
                const scaleX = 360 / tempImg.width;
                const scaleY = 640 / tempImg.height;
                const initialScale = Math.max(scaleX, scaleY);

                this.bgScale = initialScale;
                this.bgX = 0;
                this.bgY = 0;
                
                bgImg.src = url;
                bgImg.style.display = 'block';
                bgLayer.style.display = 'none';
                if (controls) controls.classList.remove('hidden');
                
                // 動態調整滑動條範圍
                const zoomSlider = document.getElementById('bg-zoom-slider');
                if (zoomSlider) {
                    zoomSlider.min = initialScale;
                    zoomSlider.max = initialScale * 4;
                    zoomSlider.step = initialScale / 100;
                    zoomSlider.value = initialScale;
                }

                this.syncBgControls();
                this.updateBgTransform();
            };
            tempImg.src = url;
        }
    },

    updateBgTransform() {
        const bgImg = document.getElementById('editor-bg-img');
        if (bgImg) {
            // 先 translate(-50%, -50%) 居中，再套用位移與縮放
            bgImg.style.transform = `translate(-50%, -50%) translate(${this.bgX}px, ${this.bgY}px) scale(${this.bgScale})`;
        }
    },

    resetBgAdjust() {
        // 重設時重新觸發 setBg 的計算邏輯，或者直接用當前圖片重新計算
        if (this.currentBg) {
            this.setBg(this.currentBg);
        }
    },

    /**
     * 核心畫布產生邏輯 (供匯出與分享共用)
     */
    async _generateCanvas() {
        // 暫時移除選取框以免被截圖
        const prevActive = this.activeSticker;
        this.selectSticker(null);

        try {
            // 使用較大的 scale 以獲得 1080x1920 (360 * 3 = 1080)
            const canvas = await html2canvas(this.canvas, {
                scale: 3, 
                backgroundColor: '#1d2021',
                useCORS: true,
                allowTaint: true,
                width: 360,
                height: 640,
                scrollX: 0,
                scrollY: 0,
                x: 0,
                y: 0,
                onclone: (clonedDoc) => {
                    // 在克隆的 DOM 中重置縮放，確保 html2canvas 能精確捕捉 360x640 區域
                    const clonedCanvas = clonedDoc.getElementById('editor-canvas');
                    if (clonedCanvas) {
                        clonedCanvas.style.transform = 'none';
                        clonedCanvas.style.position = 'absolute';
                        clonedCanvas.style.left = '0';
                        clonedCanvas.style.top = '0';
                    }
                }
            });
            return canvas;
        } finally {
            // 恢復選取狀態
            this.selectSticker(prevActive);
        }
    },

    async exportImage() {
        const btn = document.getElementById('save-editor-btn');
        const iconDefault = document.getElementById('save-icon-default');
        const iconSpinner = document.getElementById('save-icon-spinner');
        
        const originalText = btn.textContent;
        if (iconSpinner) iconSpinner.classList.remove('hidden');
        if (iconDefault) iconDefault.classList.add('hidden');
        btn.disabled = true;

        try {
            const canvas = await this._generateCanvas();
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `FlavorSticker_${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Editor Export Error:', err);
            const loc = window.LOCALIZATION[state.currentLang];
            alert(loc.copy_fail || '導出失敗');
        } finally {
            if (iconSpinner) iconSpinner.classList.add('hidden');
            if (iconDefault) iconDefault.classList.remove('hidden');
            btn.disabled = false;
        }
    },

    async shareImage() {
        const btn = document.getElementById('share-editor-btn');
        const iconDefault = document.getElementById('share-icon-default');
        const iconSpinner = document.getElementById('share-icon-spinner');
        
        if (iconSpinner) iconSpinner.classList.remove('hidden');
        if (iconDefault) iconDefault.classList.add('hidden');
        btn.disabled = true;

        try {
            const canvas = await this._generateCanvas();
            
            // 將 Canvas 轉換為 Blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], `FlavorWheel_${Date.now()}.png`, { type: 'image/png' });

            const shareData = {
                title: window.LOCALIZATION[state.currentLang].app_title,
                text: 'Check out my flavor profile!',
                files: [file]
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share API not supporting files on this browser');
            }
        } catch (err) {
            console.error('Editor Share Error:', err);
            // 如果是使用者取消分享，不跳彈窗
            if (err.name !== 'AbortError') {
                const loc = window.LOCALIZATION[state.currentLang];
                alert(loc.share_fail || '分享失敗');
            }
        } finally {
            if (iconSpinner) iconSpinner.classList.add('hidden');
            if (iconDefault) iconDefault.classList.remove('hidden');
            btn.disabled = false;
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => Editor.init());
