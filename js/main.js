/**
 * パレデミア学園 寮生記憶ゲーム - メインコントローラー
 * 
 * アプリケーションのエントリーポイントと全体の調整を行うファイルです。
 * ゲームの初期化、UIイベントの設定などを担当します。
 * game.jsで定義されたgameStateを共有して使用します。
 */

// DOMが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

// ゲームの初期化
function initialize() {
    // gameStateはgame.jsで定義されたグローバルオブジェクトを使用
    loadTalents();
    setupEventListeners();
    setupAccordion();
    
    // HTMLのactiveクラスに合わせてゲーム状態を確認
    document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            const count = parseInt(btn.id.split('-')[1]);
            gameState.optionsCount = count;
        }
    });

    // 難易度設定の確認
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            const difficulty = btn.id.split('-')[0];
            if (difficulty === 'easy' || difficulty === 'hard' || difficulty === 'oni') {
                gameState.difficulty = difficulty;
            }
        }
    });
}

// イベントリスナーの設定
function setupEventListeners() {
    // ゲームモード切り替え
    document.getElementById('image-select-mode').addEventListener('click', () => setGameMode('image-select'));
    document.getElementById('name-select-mode').addEventListener('click', () => setGameMode('name-select'));
    
    // 選択肢数切り替え
    document.getElementById('option-2').addEventListener('click', () => setOptionsCount(2));
    document.getElementById('option-3').addEventListener('click', () => setOptionsCount(3));
    document.getElementById('option-4').addEventListener('click', () => setOptionsCount(4));
    
    // 難易度切り替え
    document.getElementById('easy-mode').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('hard-mode').addEventListener('click', () => setDifficulty('hard'));
    document.getElementById('oni-mode').addEventListener('click', () => setDifficulty('oni'));
}
