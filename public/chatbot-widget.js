(function() {
  // ================================
  // 設定
  // ================================
  const CONFIG = {
    API_ENDPOINT: 'https://afterall-chatbot.vercel.app/api/chat',
    LOGO_URL: 'https://afterall-chatbot.vercel.app/afterall_logo.png',
    TURNSTILE_SITE_KEY: 'YOUR_TURNSTILE_SITE_KEY',
};
  // ================================
  // スタイル
  // ================================
  const styles = `
    #afterall-chatbot-widget * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hiragino Sans', sans-serif;
    }
    
    #afterall-chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    #afterall-chat-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 25px rgba(0,0,0,0.25);
    }
    
    #afterall-chat-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    
    #afterall-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 550px;
      max-height: calc(100vh - 120px);
      background: #f9fafb;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 9998;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    
    #afterall-chat-window.open {
      display: flex;
    }
    
    @media (max-width: 480px) {
      #afterall-chat-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        bottom: 80px;
        right: 10px;
      }
    }
    
    #afterall-chat-header {
      background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
      padding: 16px;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #afterall-chat-header-logo {
      width: 44px;
      height: 44px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    #afterall-chat-header-logo img {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
    
    #afterall-chat-header-text h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }
    
    #afterall-chat-header-text p {
      margin: 2px 0 0;
      font-size: 12px;
      opacity: 0.9;
    }
    
    #afterall-chat-close {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    
    #afterall-chat-close:hover {
      opacity: 1;
    }
    
    #afterall-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .afterall-message {
      display: flex;
      gap: 8px;
      max-width: 85%;
    }
    
    .afterall-message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .afterall-message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .afterall-message-avatar img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    
    .afterall-message-content {
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    
    .afterall-message.assistant .afterall-message-content {
      background: white;
      color: #374151;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid #e5e7eb;
    }
    
    .afterall-message.user .afterall-message-content {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .afterall-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }
    
    .afterall-typing span {
      width: 8px;
      height: 8px;
      background: #f97316;
      border-radius: 50%;
      animation: afterall-bounce 1.4s infinite ease-in-out;
    }
    
    .afterall-typing span:nth-child(1) { animation-delay: 0s; }
    .afterall-typing span:nth-child(2) { animation-delay: 0.2s; }
    .afterall-typing span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes afterall-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
    
    #afterall-chat-suggestions {
      padding: 0 16px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .afterall-suggestion {
      background: white;
      border: 1px solid #fdba74;
      color: #ea580c;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .afterall-suggestion:hover {
      background: #fff7ed;
      border-color: #f97316;
    }
    
    #afterall-chat-input-area {
      padding: 12px 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    
    #afterall-chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    
    #afterall-chat-input:focus {
      border-color: #3b82f6;
    }
    
    #afterall-chat-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }
    
    #afterall-chat-send:hover {
      opacity: 0.9;
    }
    
    #afterall-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    #afterall-chat-send svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
    
    #afterall-chat-footer {
      padding: 8px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
    }
    
    #afterall-rate-limit-error {
      padding: 8px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      font-size: 13px;
      display: none;
    }
    
    #afterall-rate-limit-error.show {
      display: block;
    }

    /* Turnstile */
    #afterall-turnstile-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      padding: 20px;
    }
    
    #afterall-turnstile-overlay.hidden {
      display: none;
    }
    
    #afterall-turnstile-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    
    #afterall-turnstile-icon svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
    
    #afterall-turnstile-title {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }
    
    #afterall-turnstile-desc {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 20px;
      text-align: center;
    }
  `;

  // ================================
  // HTML構造
  // ================================
  const widgetHTML = `
    <div id="afterall-chatbot-widget">
      <button id="afterall-chat-button" aria-label="チャットを開く">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
        </svg>
      </button>
      
      <div id="afterall-chat-window">
        <div id="afterall-chat-header">
          <div id="afterall-chat-header-logo">
            <img src="${CONFIG.LOGO_URL}" alt="After All">
          </div>
          <div id="afterall-chat-header-text">
            <h1>After All</h1>
            <p>AIアシスタント</p>
          </div>
          <button id="afterall-chat-close" aria-label="閉じる">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div id="afterall-turnstile-overlay">
          <div id="afterall-turnstile-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <div id="afterall-turnstile-title">セキュリティ確認</div>
          <div id="afterall-turnstile-desc">チャットを開始するには、<br>以下の確認を完了してください。</div>
          <div id="afterall-turnstile-container"></div>
        </div>
        
        <div id="afterall-chat-messages"></div>
        
        <div id="afterall-rate-limit-error"></div>
        
        <div id="afterall-chat-suggestions"></div>
        
        <div id="afterall-chat-input-area">
          <input type="text" id="afterall-chat-input" placeholder="メッセージを入力...">
          <button id="afterall-chat-send" aria-label="送信">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        
        <div id="afterall-chat-footer">
          Powered by Claude AI | 株式会社After All
        </div>
      </div>
    </div>
  `;

  // ================================
  // システムプロンプト（バックエンド用、参考）
  // ================================
  const SYSTEM_PROMPT = `あなたは株式会社After Allの公式AIアシスタントです。
以下の会社情報に基づいて、丁寧かつ親しみやすく回答してください。

## 会社概要
- 会社名: 株式会社After All
- 設立: 2024年5月27日
- 所在地: 大阪府大阪市北区曽根崎新地1-13-22 御堂筋フロントタワー 1F
- 代表: 松成 亮
- 事業内容: デジタルマーケティングの総合支援、AI支援サービス

## 会社理念
- PURPOSE: 人のストーリーを彩り、進化させる
- VISION: 独自の価値を生み、共感と市場の力で広げる
- MISSION: 何が大切なのかを問い、その価値を社会とともに創る

## サービスの特徴
- 顧客継続率90%の伴走型支援
- 広告代理店の枠を超え、商品・サービス自体のブラッシュアップまで支援

## 提供サービス
1. WEB広告運用代行（月額20万円〜）
2. SEO施策
3. LP・Webサイト制作
4. SNSアカウント運用
5. LINE Lステップ構築

## AI支援サービス（NEW）
- 月額4万円から
- 対応領域: 集客、業務効率化、アプリ開発、生成AIコンテンツ制作、分析・調査など
- 「月4万円から、AIで次のステージへ」

## 実績例
- 新車販売: CV数4件→85件/月
- ロボットイベント: CV数80件→700件/月
- 債務整理: CV数60件→270件/月

回答は簡潔に、150文字程度で。`;

  // ================================
  // メインロジック
  // ================================
  class AfterAllChatbot {
    constructor() {
      this.messages = [];
      this.isLoading = false;
      this.isVerified = !CONFIG.TURNSTILE_SITE_KEY || CONFIG.TURNSTILE_SITE_KEY === 'YOUR_TURNSTILE_SITE_KEY';
      this.turnstileToken = null;
      this.requestTimestamps = [];
      this.RATE_LIMIT_MAX = 10;
      this.RATE_LIMIT_WINDOW = 60000;
      
      this.init();
    }
    
    init() {
      // スタイルを追加
      const styleEl = document.createElement('style');
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
      
      // HTMLを追加
      const container = document.createElement('div');
      container.innerHTML = widgetHTML;
      document.body.appendChild(container);
      
      // 要素を取得
      this.button = document.getElementById('afterall-chat-button');
      this.window = document.getElementById('afterall-chat-window');
      this.closeBtn = document.getElementById('afterall-chat-close');
      this.messagesEl = document.getElementById('afterall-chat-messages');
      this.suggestionsEl = document.getElementById('afterall-chat-suggestions');
      this.input = document.getElementById('afterall-chat-input');
      this.sendBtn = document.getElementById('afterall-chat-send');
      this.rateLimitError = document.getElementById('afterall-rate-limit-error');
      this.turnstileOverlay = document.getElementById('afterall-turnstile-overlay');
      
      // イベントリスナー
      this.button.addEventListener('click', () => this.toggle());
      this.closeBtn.addEventListener('click', () => this.close());
      this.sendBtn.addEventListener('click', () => this.send());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });
      
      // 初期メッセージ
      this.addMessage('assistant', 'こんにちは！株式会社After Allです。\n\nWEBマーケティングやAI支援について、なんでもお気軽にご質問ください！');
      
      // サジェスト
      this.showSuggestions();
      
      // Turnstile
      if (!this.isVerified) {
        this.loadTurnstile();
      } else {
        this.turnstileOverlay.classList.add('hidden');
      }
    }
    
    toggle() {
      this.window.classList.toggle('open');
    }
    
    close() {
      this.window.classList.remove('open');
    }
    
    addMessage(role, content) {
      this.messages.push({ role, content });
      
      const msgEl = document.createElement('div');
      msgEl.className = `afterall-message ${role}`;
      
      if (role === 'assistant') {
        msgEl.innerHTML = `
          <div class="afterall-message-avatar">
            <img src="${CONFIG.LOGO_URL}" alt="">
          </div>
          <div class="afterall-message-content">${this.escapeHtml(content)}</div>
        `;
      } else {
        msgEl.innerHTML = `
          <div class="afterall-message-content">${this.escapeHtml(content)}</div>
        `;
      }
      
      this.messagesEl.appendChild(msgEl);
      this.scrollToBottom();
    }
    
    showTyping() {
      const typingEl = document.createElement('div');
      typingEl.className = 'afterall-message assistant';
      typingEl.id = 'afterall-typing';
      typingEl.innerHTML = `
        <div class="afterall-message-avatar">
          <img src="${CONFIG.LOGO_URL}" alt="">
        </div>
        <div class="afterall-message-content">
          <div class="afterall-typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      this.messagesEl.appendChild(typingEl);
      this.scrollToBottom();
    }
    
    hideTyping() {
      const typingEl = document.getElementById('afterall-typing');
      if (typingEl) typingEl.remove();
    }
    
    showSuggestions() {
      const suggestions = [
        'どんなサービスがありますか？',
        'AI支援の料金は？',
        '実績を教えてください',
        '他社との違いは？'
      ];
      
      this.suggestionsEl.innerHTML = suggestions.map(s => 
        `<button class="afterall-suggestion">${s}</button>`
      ).join('');
      
      this.suggestionsEl.querySelectorAll('.afterall-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
          this.input.value = btn.textContent;
          this.send();
        });
      });
    }
    
    hideSuggestions() {
      this.suggestionsEl.innerHTML = '';
    }
    
    checkRateLimit() {
      const now = Date.now();
      this.requestTimestamps = this.requestTimestamps.filter(ts => now - ts < this.RATE_LIMIT_WINDOW);
      
      if (this.requestTimestamps.length >= this.RATE_LIMIT_MAX) {
        const oldest = this.requestTimestamps[0];
        const remaining = Math.ceil((this.RATE_LIMIT_WINDOW - (now - oldest)) / 1000);
        this.showRateLimitError(`送信制限中です。${remaining}秒後にお試しください。`);
        return false;
      }
      
      this.requestTimestamps.push(now);
      return true;
    }
    
    showRateLimitError(message) {
      this.rateLimitError.textContent = message;
      this.rateLimitError.classList.add('show');
      setTimeout(() => {
        this.rateLimitError.classList.remove('show');
      }, 3000);
    }
    
    async send() {
      const content = this.input.value.trim();
      if (!content || this.isLoading) return;
      
      if (!this.checkRateLimit()) return;
      
      this.hideSuggestions();
      this.addMessage('user', content);
      this.input.value = '';
      this.isLoading = true;
      this.sendBtn.disabled = true;
      this.showTyping();
      
      try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.turnstileToken && { 'X-Turnstile-Token': this.turnstileToken }),
          },
          body: JSON.stringify({
            messages: this.messages.filter(m => m.role !== 'assistant' || this.messages.indexOf(m) !== 0)
          })
        });
        
        const data = await response.json();
        this.hideTyping();
        this.addMessage('assistant', data.content || 'すみません、エラーが発生しました。');
      } catch (error) {
        this.hideTyping();
        this.addMessage('assistant', 'すみません、接続エラーが発生しました。しばらくしてからお試しください。');
      } finally {
        this.isLoading = false;
        this.sendBtn.disabled = false;
      }
    }
    
    loadTurnstile() {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = () => {
        if (window.turnstile) {
          window.turnstile.render('#afterall-turnstile-container', {
            sitekey: CONFIG.TURNSTILE_SITE_KEY,
            callback: (token) => {
              this.turnstileToken = token;
              this.isVerified = true;
              this.turnstileOverlay.classList.add('hidden');
            },
            theme: 'light',
          });
        }
      };
      document.head.appendChild(script);
    }
    
    scrollToBottom() {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML.replace(/\n/g, '<br>');
    }
  }
  
  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AfterAllChatbot());
  } else {
    new AfterAllChatbot();
  }
})();
