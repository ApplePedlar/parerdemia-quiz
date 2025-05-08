/**
 * パレデミア学園 寮生記憶ゲーム - ゲームロジック
 * 
 * ゲームのコア機能を実装したファイルです。
 * 問題の生成から回答判定まで、ゲームの中心となる処理を
 * 担当しています。実装しながらタレントさんたちの魅力を
 * 再発見できました。
 */

// ゲームモードの設定
function setGameMode(mode) {
    if (gameState.isWaitingForNext) return;
    
    gameState.mode = mode;
    
    // ボタンの見た目を更新
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'image-select') {
        document.getElementById('image-select-mode').classList.add('active');
    } else {
        document.getElementById('name-select-mode').classList.add('active');
    }
    
    // すべての統計情報をリセット
    resetAllStats();
    
    generateQuestion();
}

// 選択肢数の設定
function setOptionsCount(count) {
    if (gameState.isWaitingForNext) return;
    
    gameState.optionsCount = count;
    
    // ボタンの見た目を更新
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`option-${count}`).classList.add('active');
    
    // すべての統計情報をリセット
    resetAllStats();
    
    generateQuestion();
}

/**
 * 難易度の設定
 * 
 * 難易度「高」は同じ髪色のタレントから選ぶ必要があり、
 * 黒鋼 亜華さんのような鋭い観察力が求められます。
 * タレントの特徴をより深く知る機会になればと思います。
 */
function setDifficulty(difficulty) {
    if (gameState.isWaitingForNext) return;
    
    gameState.difficulty = difficulty;
    
    // ボタンの見た目を更新
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    
    const buttonId = difficulty === 'easy' ? 'easy-mode' : 'hard-mode';
    document.getElementById(buttonId).classList.add('active');
    
    // すべての統計情報をリセット
    resetAllStats();
    
    generateQuestion();
}

// 問題の生成
function generateQuestion() {
    if (gameState.isWaitingForNext) return;
    
    // 前の問題の回答表示をクリア
    document.getElementById('options-container').classList.remove('show-answer');
    
    // フィードバックをクリア
    const feedback = document.getElementById('feedback');
    feedback.className = 'hidden';
    feedback.innerHTML = '';
    
    /**
     * 最近出題したタレントを避けて、新しいタレントを選択
     * 
     * この機能で同じタレントが短期間に何度も出題されることを防ぎます。
     * プレイヤーにとって新鮮な問題が続くので、より多くのパレデミア学園の
     * タレントと出会う機会が増えるはず！記憶力を鍛えるのに最適です。
     */
    // 出題可能なタレントのインデックスのリストを作成
    const availableIndices = [];
    const halfTalentsCount = Math.floor(gameState.talents.length / 2);
    
    // 最近出題されていないタレントのインデックスを集める
    for (let i = 0; i < gameState.talents.length; i++) {
        if (!gameState.recentlyUsedTalents.includes(i)) {
            availableIndices.push(i);
        }
    }
    
    // 出題可能なタレントがない場合は、最も古く出題されたタレントを使用可能にする
    if (availableIndices.length === 0) {
        const oldestTalentIndex = gameState.recentlyUsedTalents.shift();
        availableIndices.push(oldestTalentIndex);
    }
    
    // 出題可能なタレントからランダムに選択
    const randomAvailableIndex = Math.floor(Math.random() * availableIndices.length);
    const correctIndex = availableIndices[randomAvailableIndex];
    const correctTalent = gameState.talents[correctIndex];
    
    // 選択したタレントを最近出題したリストに追加
    gameState.recentlyUsedTalents.push(correctIndex);
    
    // リストが全タレント数の半分より長くなったら、古いものから削除
    while (gameState.recentlyUsedTalents.length > halfTalentsCount) {
        gameState.recentlyUsedTalents.shift();
    }
    
    // 他の選択肢を生成（重複なし）
    const otherOptions = [];
    const usedIndices = new Set([correctIndex]);
    
    if (gameState.difficulty === 'easy') {
        // 難易度低: 完全ランダムな選択肢生成（既存のロジック）
        while (otherOptions.length < gameState.optionsCount - 1) {
            const randomIndex = Math.floor(Math.random() * gameState.talents.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                otherOptions.push(gameState.talents[randomIndex]);
            }
        }
    } else {
        // 難易度高: 同じ髪色のタレントを優先的に選択肢に含める
        const correctHairColor = correctTalent.hairColor;
        
        // 同じ髪色のタレントをフィルタリング
        const sameHairColorTalents = [];
        gameState.talents.forEach((talent, index) => {
            if (index !== correctIndex && talent.hairColor === correctHairColor) {
                sameHairColorTalents.push({talent, index});
            }
        });
        
        // 同じ髪色のタレントをシャッフル
        shuffleArray(sameHairColorTalents);
        
        // 同じ髪色のタレントから可能な限り選択肢に追加
        for (const {talent, index} of sameHairColorTalents) {
            if (otherOptions.length < gameState.optionsCount - 1) {
                usedIndices.add(index);
                otherOptions.push(talent);
            } else {
                break;
            }
        }
        
        // 足りない場合は他の髪色から追加
        while (otherOptions.length < gameState.optionsCount - 1) {
            const randomIndex = Math.floor(Math.random() * gameState.talents.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                otherOptions.push(gameState.talents[randomIndex]);
            }
        }
    }
    
    // 全選択肢をシャッフル
    const allOptions = [correctTalent, ...otherOptions];
    shuffleArray(allOptions);
    
    // 現在の問題を保存
    gameState.currentQuestion = {
        correctTalent,
        options: allOptions,
    };
    
    // 問題を表示
    displayQuestion();
}

/**
 * 答えのチェック
 * 
 * 神童 めしあさんの天才的な判断力を讃えて、
 * 厳密かつ公平な正誤判定を行います。
 */
function checkAnswer(event) {
    if (gameState.isWaitingForNext) return;
    
    const selectedOption = event.currentTarget;
    const selectedName = selectedOption.dataset.name;
    const correctName = gameState.currentQuestion.correctTalent.name;
    const isCorrect = selectedName === correctName;
    
    // オーバーレイを表示するためのクラスを追加
    document.getElementById('options-container').classList.add('show-answer');
    
    // 全選択肢に正解・不正解の情報を表示
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        const optName = opt.dataset.name;
        if (optName === correctName) {
            opt.classList.add('correct', 'correct-highlight');
            
            // 正解アニメーションを適用
            opt.classList.add('correct-animation', 'animated-feedback');
            
            // 画像のみ表示状態にする
            const bgImage = opt.querySelector('.bg-image');
            if (bgImage) {
                bgImage.style.visibility = 'visible';
                // 名前選択モードの場合は完全に不透明に
                if (gameState.mode === 'name-select') {
                    bgImage.style.opacity = '1';
                }
            }
        } else if (opt === selectedOption && !isCorrect) {
            opt.classList.add('incorrect');
            // 不正解アニメーションを適用
            opt.classList.add('incorrect-animation', 'animated-feedback');
            
            // 名前選択モードの場合は選択した不正解も画像を表示
            if (gameState.mode === 'name-select') {
                const bgImage = opt.querySelector('.bg-image');
                if (bgImage) {
                    bgImage.style.visibility = 'visible';
                    bgImage.style.opacity = '1';
                }
            }
        }
        
        // 名前選択モードの場合、回答後に背景画像を表示する
        if (gameState.mode === 'name-select') {
            opt.classList.add('answered');
            
            // カナと寮名を非表示にする
            const kanaElement = opt.querySelector('.talent-kana');
            const dormitoryElement = opt.querySelector('.talent-dormitory');
            if (kanaElement) kanaElement.style.display = 'none';
            if (dormitoryElement) dormitoryElement.style.display = 'none';
        }
    });
    
    // 選択したオプションをビジュアル的に強調表示
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedOption.classList.add('selected');
    
    // 結果を履歴に追加
    gameState.answerHistory.push(isCorrect);
    
    // 最大60問分だけ履歴を保持（将来的な使用のため維持）
    if (gameState.answerHistory.length > 60) {
        gameState.answerHistory.shift();
    }
    
    // 統計情報の更新
    gameState.totalAnswers++;
    
    // 前のstreakCount値を保存
    const prevStreakCount = gameState.streakCount;
    
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.streakCount++;
    } else {
        gameState.incorrectAnswers++;
        gameState.streakCount = 0;
    }
    
    // 正解率と統計情報を更新
    updateAccuracy();
    
    // フィードバックを表示
    showFeedback(isCorrect, selectedName);
    
    // 次の問題への移行タイマーをセット
    gameState.isWaitingForNext = true;
    setTimeout(() => {
        // アニメーションクラスを削除
        options.forEach(opt => {
            opt.classList.remove('correct-animation', 'incorrect-animation', 'animated-feedback');
        });
        
        gameState.isWaitingForNext = false;
        generateQuestion();
    }, isCorrect ? 1200 : 3000);
}
