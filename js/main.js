/**
 * パレデミア学園 寮生記憶ゲーム - メインスクリプト
 * 
 * アプリケーションの初期化と全体の制御を行うファイルです。
 * 他のモジュールを調整して、ゲーム全体がスムーズに動作するよう
 * 心がけました。モジュール分割により保守性が大幅に向上しています。
 */

// ゲームの状態を管理するオブジェクト
const gameState = {
    mode: 'image-select', // デフォルトは画像選択モード
    optionsCount: 3, // デフォルトを3つの選択肢に変更
    difficulty: 'easy', // デフォルトは難易度低
    talents: [], // JSONから読み込まれるタレントデータ
    currentQuestion: null,
    answerHistory: [], // 正解/不正解の履歴を保存
    isWaitingForNext: false, // 次の問題への移行待ちかどうか
    streakCount: 0, // 連続正解数を追跡
    totalAnswers: 0, // 総回答数
    correctAnswers: 0, // 正解数
    incorrectAnswers: 0, // 不正解数
    recentlyUsedTalents: [] // 最近出題したタレントを記録
};

// DOMが読み込まれたら初期化
document.addEventListener('DOMContentLoaded', initialize);

// ゲームの初期化
function initialize() {
    loadTalents();
    setupEventListeners();
    setupAccordion(); // アコーディオン機能のセットアップを追加
    
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
            gameState.difficulty = difficulty;
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
}
