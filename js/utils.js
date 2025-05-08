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

/**
 * タレントデータをシャッフルする関数
 * 
 * 全タレントをシャッフルして順番に出題するための準備をします。
 * パレデミア学園の生徒たちがランダムに紹介されるような
 * 感覚です。シャッフルアルゴリズムはフィッシャー–イェーツです。
 */
function shuffleTalents() {
    // 全タレントのインデックスを配列に保存
    const indices = Array.from({length: gameState.talents.length}, (_, i) => i);
    // インデックスをシャッフル
    shuffleArray(indices);
    // シャッフルされたインデックスを保存
    gameState.shuffledTalents = indices;
    // 出題位置をリセット
    gameState.currentIndex = 0;
}
