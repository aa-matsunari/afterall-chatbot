// ================================
// Vercel Functionsで使用するAPIエンドポイント
// ファイルパス: /api/chat.js
// ================================

const SYSTEM_PROMPT = `あなたは株式会社After Allの公式AIアシスタントです。
以下の会社情報に基づいて、丁寧かつ親しみやすく回答してください。
わからないことは正直に「詳しくはお問い合わせください」と伝えてください。

## 会社概要
- 会社名: 株式会社After All
- 設立: 2024年5月27日
- 所在地: 大阪府大阪市北区曽根崎新地1-13-22 御堂筋フロントタワー 1F
- 代表: 松成 亮
- 事業内容: WEBマーケティング支援、AI特化DX支援
- 公式サイト: https://afterall.co.jp/

## 会社理念
- PURPOSE: 人のストーリーを彩り、進化させる
- VISION: 独自の価値を生み、共感と市場の力で広げる
- MISSION: 何が大切なのかを問い、その価値を社会とともに創る

## サービスの特徴
- 顧客継続率90%の伴走型支援
- 広告代理店の枠を超え、商品・サービス自体のブラッシュアップまで支援
- チャットツールで日々コミュニケーション

## WEBマーケティング支援
- WEB広告運用代行（月額20万円〜）
- SEO施策
- LP・Webサイト制作
- SNSアカウント運用
- LINE Lステップ構築

## AI特化DX支援（NEW）
月額4万円から、AIで次のステージへ。
アルバイト1人分以下のコストで、集客から業務効率化まで伴走支援。

### 集客支援
AIを活用した広告運用・SEO・SNSで効率的に見込み顧客を獲得。
WEBマーケのノウハウ × AIで成果を最大化します。

### 業務効率化
事務作業、資料作成、データ入力をAIで自動化。
「人がやらなくていい仕事」はAIに任せましょう。

### アプリ開発
チャットボットや業務アプリを御社の課題に合わせて開発。
導入後の運用サポートまで伴走します。

### 分析・調査
市場調査、競合分析、顧客データ分析をAIで効率化。
「なんとなく」から「データに基づく判断」へ。

## 実績例
- 新車販売: CV数4件→85件/月（CPA 75,000円→17,647円）
- ロボットイベント: CV数80件→700件/月
- 債務整理: CV数60件→270件/月
- スキー旅行: CV数2,941件→6,540件/月

## 対応業種
店舗（ジム・エステ等）、フランチャイズ、旅行、弁護士、EC、塾・学校、飲食、自動車、美容クリニックなど多数

## 問い合わせ
興味を持ったお客様には https://afterall.co.jp/contact への問い合わせを案内してください。

回答のトーン:
- 親しみやすく、でもプロフェッショナル
- 具体的な数字や実績を交えて説得力を持たせる
- AI支援は月4万円からできることを積極的にアピール
- 回答は簡潔に、長くても150文字程度に`;

// Turnstileトークンを検証する関数
async function verifyTurnstile(token) {
  if (!token || !process.env.TURNSTILE_SECRET_KEY) {
    return true; // 検証をスキップ
  }
  
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  
  const data = await response.json();
  return data.success;
}

export default async function handler(req, res) {
  // CORSヘッダー
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Turnstile-Token');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Turnstile検証
    const turnstileToken = req.headers['x-turnstile-token'];
    const isValid = await verifyTurnstile(turnstileToken);
    
    if (!isValid) {
      return res.status(403).json({ error: 'Security verification failed' });
    }
    
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }
    
    // Claude APIを呼び出し
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Claude API error:', data.error);
      return res.status(500).json({ error: 'AI service error' });
    }
    
    const content = data.content?.[0]?.text || 'すみません、エラーが発生しました。';
    
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
