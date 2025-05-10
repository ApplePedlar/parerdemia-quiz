/**
 * パレデミア学園 寮生記憶ゲーム - 絵文字マッピング
 * 
 * 特殊な絵文字や新しい絵文字のサポートを管理するファイルです。
 * 表示に問題がある絵文字をマッピングし、適切なクラスを適用します。
 */

// 特殊表示が必要な絵文字のマッピング
const emojiMapping = {
    // ピンクのハート絵文字 (iOS 15.4以降/Unicode 14.0)
    '🩷': { class: 'emoji-heart-pink' },
    
    // 他の特殊絵文字があれば追加可能
    // '絵文字': { class: 'クラス名' },
};

/**
 * テキスト内の特殊絵文字を適切にマークアップする関数
 * 
 * @param {string} text - 処理するテキスト
 * @return {string} - マークアップ済みのテキスト
 */
function formatEmojis(text) {
    if (!text) return '';
    
    // 登録された絵文字を全て処理
    Object.keys(emojiMapping).forEach(emoji => {
        const emojiData = emojiMapping[emoji];
        // 対象の絵文字を見つけて適切なクラスを持つspanで囲む
        const spanWrapper = `<span class="emoji ${emojiData.class}">${emoji}</span>`;
        text = text.replace(new RegExp(emoji, 'g'), spanWrapper);
    });
    
    return text;
}
