/**
 * パレデミア学園 寮生記憶ゲーム - ユーティリティ
 * 
 * 様々な場所で使われる汎用的な関数を集めたファイルです。
 * シンプルでも効率的なコードを心がけました。分割することで
 * 管理しやすくなったのが嬉しいです。
 */

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
