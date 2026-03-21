/**
 * voiceControl.js - 語音辨識與操作邏輯
 * 負責處理 Web Speech API 互動與風味輪連動
 */

let recognition = null;

function initVoiceControl() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        console.warn('Speech Recognition not supported');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
        state.isListening = true;
        updateVoiceUI();
    };

    recognition.onend = () => {
        state.isListening = false;
        setTimeout(() => updateVoiceUI(), 1000);
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const statusText = document.getElementById('voice-status-text');
        if (statusText) {
            statusText.innerHTML = `
                <span class="final-text">${finalTranscript}</span>
                <span class="interim-text">${interimTranscript}</span>
            `;
        }

        if (finalTranscript) {
            matchFlavorFromVoice(finalTranscript.toLowerCase());
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        
        let errorMsg = `語音辨識發生錯誤 (${event.error})：\n`;
        switch (event.error) {
            case 'network':
                errorMsg += '無法連線到語音辨識服務。如果您使用的是 Brave 或開源版 Chromium，可能不支援此功能，建議使用 Google Chrome 或 Edge。';
                break;
            case 'not-allowed':
                errorMsg += '請確認是否已允許麥克風權限。';
                break;
            case 'audio-capture':
                errorMsg += '找不到麥克風，請檢查系統 (如 PulseAudio/PipeWire) 麥克風設定。';
                break;
            default:
                errorMsg += '請檢查瀏覽器支援度或麥克風權限。';
        }
        alert(errorMsg);

        state.isListening = false;
        updateVoiceUI();
    };

    // 綁定按鈕點擊
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.onclick = handleVoiceToggle;
    }
}

/**
 * 切換語音監聽狀態
 */
function handleVoiceToggle() {
    if (!recognition) {
        alert('您的瀏覽器不支援語音辨識功能。');
        return;
    }

    if (state.isListening) {
        recognition.stop();
    } else {
        const statusText = document.getElementById('voice-status-text');
        if (statusText) statusText.textContent = '正在聆聽中...';
        
        const langMap = { 'zh': 'zh-TW', 'en': 'en-US', 'ja': 'ja-JP' };
        recognition.lang = langMap[state.currentLang] || 'en-US';
        recognition.start();
    }
}

/**
 * 更新語音相關 UI
 */
function updateVoiceUI() {
    const voiceBtn = document.getElementById('voice-btn');
    const statusBar = document.getElementById('voice-status-bar');
    
    if (!voiceBtn || !statusBar) return;

    if (state.isListening) {
        voiceBtn.classList.add('voice-pulse-active');
        voiceBtn.classList.replace('text-orange-500', 'text-white');
        voiceBtn.classList.replace('bg-white/80', 'bg-orange-500');
        statusBar.classList.remove('hidden');
    } else {
        voiceBtn.classList.remove('voice-pulse-active');
        voiceBtn.classList.replace('text-white', 'text-orange-500');
        voiceBtn.classList.replace('bg-orange-500', 'bg-white/80');
        statusBar.classList.add('hidden');
    }
}

/**
 * 將識別出的文字與風味資料庫比對
 */
function matchFlavorFromVoice(transcript) {
    const currentData = allData[state.currentDrink];
    if (!currentData || !flavorWheelInstance) return;

    const matchedFlavors = [];
    const lang = state.currentLang;

    const searchFlavors = (node) => {
        if (node.layer >= 2) {
            const label = (node.label[lang] || node.label.en || '').toLowerCase();
            if (label && transcript.includes(label)) {
                matchedFlavors.push(node);
            }
        }
        if (node.children) {
            node.children.forEach(searchFlavors);
        }
    };

    searchFlavors(currentData);

    if (matchedFlavors.length > 0) {
        matchedFlavors.forEach(flavor => {
            if (!state.selectedFlavors.some(f => f.id === flavor.id)) {
                const node = flavorWheelInstance.findNodeById(flavor.id);
                if (node) {
                    flavorWheelInstance.handleClick(node);
                }
            }
        });
    }
}

// 啟動初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceControl);
} else {
    initVoiceControl();
}
