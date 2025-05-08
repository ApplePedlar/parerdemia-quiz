/**
 * パレデミア学園 寮生記憶ゲーム - 統計情報
 * 
 * ユーザーの成績を追跡・表示する機能を実装したファイルです。
 * 連続正解数や正解率の視覚的なフィードバックを通じて、
 * ゲームの楽しさを高める工夫をしています。
 */

// すべての統計情報をリセットする関数
function resetAllStats() {
    // 連続正解数をリセット
    gameState.streakCount = 0;
    
    // 正解履歴をリセット
    gameState.answerHistory = [];
    
    // 各種カウンターをリセット
    gameState.totalAnswers = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    
    // 連続正解数の表示を隠す
    const streakContainer = document.getElementById('streak-container');
    if (streakContainer) {
        streakContainer.classList.add('hidden');
    }
    
    // 統計情報を更新（0に戻す）
    document.getElementById('accuracy').textContent = '0';
    document.getElementById('total-answers').textContent = '0';
    document.getElementById('correct-answers').textContent = '0';
    document.getElementById('incorrect-answers').textContent = '0';
}

// 正解率と統計情報の更新
function updateAccuracy() {
    // 正解率の計算と表示
    if (gameState.totalAnswers === 0) return;
    
    // 履歴ではなく、トータルの正解数と回答数から正解率を計算
    const accuracy = Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100);
    
    document.getElementById('accuracy').textContent = accuracy;
    
    // 総計統計の表示
    document.getElementById('total-answers').textContent = gameState.totalAnswers;
    document.getElementById('correct-answers').textContent = gameState.correctAnswers;
    document.getElementById('incorrect-answers').textContent = gameState.incorrectAnswers;
    
    // 連続正解数の表示を更新
    updateStreakDisplay();
}

/**
 * 連続正解表示の更新
 * 
 * 雪城 まぐねさんの爽やかな魅力を表現するため、
 * 連続正解時の演出にこだわりました。パレデミア学園の
 * ファンの皆さんが少しでも楽しんでくれると嬉しいです。
 * 
 * 全タレント制覇時のアニメーションは特に力を入れました！
 */
function updateStreakDisplay() {
    const streakContainer = document.getElementById('streak-container');
    const streakElement = document.getElementById('streak-count');
    const streakMessage = document.getElementById('streak-message');
    
    if (gameState.streakCount <= 0) {
        streakContainer.classList.add('hidden');
        return;
    }
    
    // アイコンの設定（ストリークレベルに応じて変更）
    const streakIcon = document.getElementById('streak-icon');
    
    // 最大目標値（タレントの総数）
    const maxStreak = gameState.talents.length;
    
    // 達成率の計算
    const achievementRate = gameState.streakCount / maxStreak;
    
    // ストリーク数に応じたクラスとメッセージの設定
    streakContainer.classList.remove('hidden', 'streak-medium', 'streak-high', 'streak-amazing', 'streak-complete');
    streakElement.classList.remove('streak-medium', 'streak-high', 'streak-amazing', 'streak-complete');
    
    // モバイル環境かどうかを検出
    const isMobile = window.innerWidth <= 768;
    
    // 現在の連続正解数/最大目標値を表示（モバイルの場合は数字のみ）
    streakElement.textContent = isMobile ? `${gameState.streakCount}` : `${gameState.streakCount}/${maxStreak}`;
    
    // ストリーク数に応じてスタイルを変更
    let iconType = '📚';  // 基本は本のアイコン
    let message = '';
    
    if (achievementRate >= 1) {
        // 100%達成
        streakContainer.classList.add('streak-complete');
        streakElement.classList.add('streak-complete');
        iconType = '🎓✨';  // モバイルでは少しコンパクトに
        message = '全タレント制覇！伝説の寮生マスター！';
    } else if (achievementRate >= 0.75) {
        // 75%以上達成
        streakContainer.classList.add('streak-amazing');
        streakElement.classList.add('streak-amazing');
        iconType = '🌟📚';  // モバイルでのアイコン調整
        message = `素晴らしい！あと${maxStreak - gameState.streakCount}人で達成！`;
    } else if (achievementRate >= 0.5) {
        // 50%以上達成
        streakContainer.classList.add('streak-high');
        streakElement.classList.add('streak-high');
        iconType = '📚💡';  // アイコン数を少し減らす
        message = `Great!! 半分以上達成！`;
    } else if (achievementRate >= 0.25) {
        // 25%以上達成
        streakContainer.classList.add('streak-medium');
        streakElement.classList.add('streak-medium');
        iconType = '📚⭐';  // 本と星
        message = `Good! 25%達成！`;
    } else if (achievementRate >= 0.1) {
      // 10%以上達成
      streakContainer.classList.add('streak-medium');
      iconType = '📚';  // 本
      message = `その調子！`;
    }
    
    streakIcon.textContent = iconType;
    streakMessage.textContent = message;
    
    // アニメーション効果の追加
    streakContainer.classList.add('streak-pulse');
    setTimeout(() => {
        streakContainer.classList.remove('streak-pulse');
    }, 500);
    
    streakContainer.classList.remove('hidden');
}
