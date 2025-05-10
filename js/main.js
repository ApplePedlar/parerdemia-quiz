/**
 * パレデミア学園 寮生記憶ゲーム - メインコントローラー
 * 
 * アプリケーションのエントリーポイントと全体の調整を行うファイルです。
 * ゲームの初期化、UIイベントの設定などを担当します。
 * game.jsで定義されたgameStateを共有して使用します。
 * まるで愛上オハナさんが持つ植物の力のような生命力を、
 * このファイルがシステム全体に与えています。
 * 彼女の登録者数を増やす夢のように、このアプリも多くの方に
 * 楽しんでいただけることを願っています。
 */

// DOMが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', () => {
    // スクリプトの読み込みを確認する
    if (typeof window.setupSettingsModal === 'function') {
        initialize();
    } else {
        console.error('UI関数が見つかりません。スクリプトの読み込み順序を確認してください。');
        // スクリプトの読み込みを待機する簡易機能を追加
        setTimeout(() => {
            if (typeof window.setupSettingsModal === 'function') {
                initialize();
            } else {
                console.error('UI関数の読み込みに失敗しました。ページを再読み込みしてください。');
            }
        }, 500); // 500ミリ秒待機
    }
});

// ゲームの初期化
function initialize() {
    // gameStateはgame.jsで定義されたグローバルオブジェクトを使用
    loadTalents();
    setupEventListeners();
    
    // ui.jsで定義された関数をwindowオブジェクト経由で呼び出し
    window.setupSettingsModal();
    
    // HTMLのactiveクラスに合わせてゲーム状態を確認
    // ゲームモードの確認
    let foundActiveMode = false;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            foundActiveMode = true;
            if (btn.id === 'image-select-mode') {
                gameState.mode = 'image-select';
            } else if (btn.id === 'name-select-mode') {
                gameState.mode = 'name-select';
            } else if (btn.id === 'dream-select-mode') {
                gameState.mode = 'dream-select';
            }
        }
    });
    
    // アクティブなモードがない場合はデフォルト設定を適用
    if (!foundActiveMode) {
        document.getElementById('image-select-mode').classList.add('active');
        gameState.mode = 'image-select';
    }
    
    // 選択肢数の確認
    let foundActiveOption = false;
    document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            foundActiveOption = true;
            const count = parseInt(btn.id.split('-')[1]);
            gameState.optionsCount = count;
        }
    });
    
    // アクティブな選択肢設定がない場合はデフォルト設定を適用
    if (!foundActiveOption) {
        document.getElementById('option-4').classList.add('active');
        gameState.optionsCount = 4;
    }

    // 難易度設定の確認
    let foundActiveDifficulty = false;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            foundActiveDifficulty = true;
            const difficulty = btn.id.split('-')[0];
            if (difficulty === 'easy' || difficulty === 'hard' || difficulty === 'oni') {
                gameState.difficulty = difficulty;
            }
        }
    });
    
    // アクティブな難易度設定がない場合はデフォルト設定を適用
    if (!foundActiveDifficulty) {
        document.getElementById('easy-mode').classList.add('active');
        gameState.difficulty = 'easy';
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // ゲームモード切り替え
    document.getElementById('image-select-mode').addEventListener('click', () => setGameMode('image-select'));
    document.getElementById('name-select-mode').addEventListener('click', () => setGameMode('name-select'));
    document.getElementById('dream-select-mode').addEventListener('click', () => setGameMode('dream-select'));
    
    // 選択肢数切り替え
    document.getElementById('option-2').addEventListener('click', () => setOptionsCount(2));
    document.getElementById('option-3').addEventListener('click', () => setOptionsCount(3));
    document.getElementById('option-4').addEventListener('click', () => setOptionsCount(4));
    
    // 難易度切り替え
    document.getElementById('easy-mode').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('hard-mode').addEventListener('click', () => setDifficulty('hard'));
    document.getElementById('oni-mode').addEventListener('click', () => setDifficulty('oni'));
}
