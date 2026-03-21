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

        // 全域指標事件 (用於拖拽/縮放)
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
        window.addEventListener('pointerup', () => this.onPointerUp());
        
        // 視窗縮放監聽
        window.addEventListener('resize', () => this.updateScale());

        // 點擊畫布空白處取消選取
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas || e.target === document.getElementById('editor-bg-layer')) {
                this.selectSticker(null);
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
        this.updateScale(); // 開啟時重新計算縮放
        this.populateFlavors();
        this.stickerContainer.innerHTML = ''; // 清空舊貼紙
        this.selectSticker(null);

        // 如果主畫面已有自訂背景，同步過來
        if (state.customBg) {
            this.setBg(state.customBg);
        }
    },

    close() {
        document.getElementById('editor-modal').classList.add('hidden');
    },

    /**
     * 生成側邊欄風味按鈕
     */
    populateFlavors() {
        const list = document.getElementById('editor-flavor-list');
        list.innerHTML = '';
        const lang = state.currentLang;

        state.selectedFlavors.forEach(flavor => {
            const btn = document.createElement('button');
            const label = flavor.label[lang] || flavor.label.en;
            btn.className = 'py-2 px-3 bg-[#504945] hover:bg-[#fe8019] rounded-lg text-xs transition truncate';
            btn.textContent = `+ ${label}`;
            btn.onclick = () => this.addSticker(flavor);
            list.appendChild(btn);
        });
    },

    /**
     * 新增貼紙到畫布
     */
    addSticker(flavor) {
        const lang = state.currentLang;
        const label = flavor.label[lang] || flavor.label.en;

        const sticker = document.createElement('div');
        sticker.className = 'editor-sticker';
        sticker.textContent = label;
        sticker.style.left = '50px';
        sticker.style.top = '50px';
        sticker.style.fontSize = '16px';
        sticker.dataset.scale = '1';

        // 縮放手把
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        sticker.appendChild(handle);

        // 事件監聽
        sticker.addEventListener('pointerdown', (e) => this.onStickerDown(e, sticker));
        handle.addEventListener('pointerdown', (e) => this.onHandleDown(e, sticker));

        this.stickerContainer.append(sticker);
        this.selectSticker(sticker);
    },

    selectSticker(sticker) {
        if (this.activeSticker) this.activeSticker.classList.remove('selected');
        this.activeSticker = sticker;
        if (sticker) sticker.classList.add('selected');
    },

    onStickerDown(e, sticker) {
        if (this.isResizing) return;
        e.stopPropagation();
        this.selectSticker(sticker);
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startLeft = parseInt(sticker.style.left);
        this.startTop = parseInt(sticker.style.top);
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

    onPointerMove(e) {
        if (!this.activeSticker) return;

        // 位移量需除以當前縮放比例，以還原到 360x640 的座標系
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
        this.currentBg = url;
        this.canvas.style.backgroundImage = `url(${url})`;
        document.getElementById('editor-bg-layer').style.display = 'none'; // 有圖就隱藏遮罩
    },

    async exportImage() {
        const btn = document.getElementById('save-editor-btn');
        const originalText = btn.textContent;
        btn.textContent = '⏳ 導出中...';
        btn.disabled = true;

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
                height: 640
            });

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `FlavorSticker_${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Editor Export Error:', err);
            alert('導出失敗，請重試。');
        } finally {
            this.selectSticker(prevActive);
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => Editor.init());
