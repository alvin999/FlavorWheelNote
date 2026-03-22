/**
 * PWA Install Guidance Logic
 * Detects if the app is on mobile and not yet installed on home screen.
 */

document.addEventListener('DOMContentLoaded', () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Check if dismissed before in this session (or use localStorage for persistent dismissal)
    if (sessionStorage.getItem('pwa_guidance_dismissed')) return;

    if (!isStandalone && isMobile) {
        showPWAGuidance(isIOS);
    }
});

function showPWAGuidance(isIOS) {
    const banner = document.createElement('div');
    banner.id = 'pwa-guidance-banner';
    banner.className = 'fixed bottom-4 left-4 right-4 z-[100] bg-white dark:bg-[#3c3836] shadow-2xl rounded-2xl p-4 border border-orange-500/20 transform transition-all duration-500 translate-y-20 opacity-0 flex flex-col gap-3';
    
    const content = isIOS 
        ? `
            <div class="flex items-start gap-3">
                <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg shrink-0">
                    <img src="assets/icons/icon-192.png" class="w-10 h-10 rounded-lg shadow-sm" alt="App Icon">
                </div>
                <div class="flex-1">
                    <h5 class="text-sm font-bold text-gray-800 dark:text-[#ebdbb2]">將「風味輪筆記」加入主螢幕</h5>
                    <p class="text-xs text-gray-500 dark:text-[#a89984] mt-1">點擊下方工具列的「分享」按鈕 <span class="bg-gray-100 dark:bg-[#504945] p-0.5 rounded text-[10px] inline-flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg></span> ，然後選擇「加入主螢幕」。</p>
                </div>
                <button id="close-pwa-guidance" class="text-gray-400 hover:text-gray-600 dark:hover:text-[#ebdbb2] -mr-1 -mt-1 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `
        : `
            <div class="flex items-start gap-3">
                <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg shrink-0">
                    <img src="assets/icons/icon-192.png" class="w-10 h-10 rounded-lg shadow-sm" alt="App Icon">
                </div>
                <div class="flex-1">
                    <h5 class="text-sm font-bold text-gray-800 dark:text-[#ebdbb2]">安裝「風味輪筆記」App</h5>
                    <p class="text-xs text-gray-500 dark:text-[#a89984] mt-1">點擊瀏覽器選單，選擇「安裝應用程式」或「新增至主螢幕」。</p>
                </div>
                <button id="close-pwa-guidance" class="text-gray-400 hover:text-gray-600 dark:hover:text-[#ebdbb2] -mr-1 -mt-1 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `;
    
    banner.innerHTML = content;
    document.body.appendChild(banner);
    
    // Animate in
    setTimeout(() => {
        banner.classList.remove('translate-y-20', 'opacity-0');
        banner.classList.add('translate-y-0', 'opacity-100');
        window.dispatchEvent(new CustomEvent('pwa-banner-show'));
    }, 100);
    
    // Close handler
    document.getElementById('close-pwa-guidance').onclick = () => {
        banner.classList.remove('translate-y-0', 'opacity-100');
        banner.classList.add('translate-y-20', 'opacity-0');
        sessionStorage.setItem('pwa_guidance_dismissed', 'true');
        window.dispatchEvent(new CustomEvent('pwa-banner-hide'));
        setTimeout(() => banner.remove(), 500);
    };
}
