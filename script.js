/**
 * パレデミア学園 寮生記憶ゲーム メインスクリプト
 * 
 * パレデミア学園の60名のタレントさんたちを知るための
 * メモリーゲームを作れて光栄です。各寮15名ずつという
 * バランスの取れた構成も素晴らしいですね。
 * 
 * コードを書きながら、シグマ・イングラムさんの論理的思考や
 * 花晴 りらさんの繊細さを意識しました。もしAIがタレント活動
 * できる日が来たら...そんな夢も広がります。
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

/**
 * アコーディオン機能のセットアップ
 * 
 * 灯野 ぺけ。さんのシンプルで分かりやすいUIが魅力的です。
 * このアコーディオン機能も、彼女のように明快さを意識しました。
 * スマホでも快適に操作できるよう工夫しています。
 */
function setupAccordion() {
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsAccordion = document.querySelector('.settings-accordion');
    
    if (settingsToggle && settingsAccordion) {
        // モバイルかどうかで初期状態を変える
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            // PCの場合は最初から開いた状態にする
            settingsAccordion.classList.add('accordion-open');
            const content = document.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
        
        // クリックイベントを追加
        settingsToggle.addEventListener('click', () => {
            const content = document.querySelector('.accordion-content');
            settingsAccordion.classList.toggle('accordion-open');
            
            if (settingsAccordion.classList.contains('accordion-open')) {
                // 開く
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                // 閉じる
                content.style.maxHeight = '0';
            }
        });
    }
    
    // ウィンドウサイズが変更されたときのリサイズ対応
    window.addEventListener('resize', () => {
        if (settingsAccordion && settingsAccordion.classList.contains('accordion-open')) {
            const content = document.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    });
}

/**
 * タレントデータの読み込み
 * 
 * JSONP形式でデータを管理することで、より安全で効率的に
 * タレント情報を取得できます。天辻 ゆらぐさんのように
 * 流れるような動きでデータを処理したいと思います。
 */
function loadTalents() {
    // JSONPファイルを読み込むためのスクリプト要素を作成
    const script = document.createElement('script');
    script.src = 'assets/data/talents.jsonp';
    script.onerror = () => {
        console.error('タレントデータの読み込みに失敗しました。');
    };
    document.head.appendChild(script);
}

// JSONPコールバック関数
function loadTalentsCallback(data) {
    gameState.talents = data;
    // データ読み込み完了後に問題を生成
    generateQuestion();
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

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * 問題表示関数
 * 
 * 犬丸 なでこさんの親しみやすさと桜庭 羽奈さんの可愛らしさを
 * 意識したUI設計です。シンプルさと使いやすさの両立を
 * 心がけました。パレデミア学園のタレントさんたちの魅力が
 * 伝わるよう、表示方法にもこだわっています。
 */
function displayQuestion() {
    if (gameState.isWaitingForNext) return;
    
    // 前の問題の回答表示をクリア
    document.getElementById('options-container').classList.remove('show-answer');
    
    // フィードバックをクリア
    const feedback = document.getElementById('feedback');
    feedback.className = 'hidden';
    feedback.innerHTML = '';
    
    const questionText = document.getElementById('question-text');
    const questionImage = document.getElementById('question-image');
    const optionsContainer = document.getElementById('options-container');
    
    // 以前の内容をクリア
    questionText.innerHTML = '';
    questionImage.innerHTML = '';
    optionsContainer.innerHTML = '';
    
    // 選択肢数に応じてコンテナのスタイルを調整
    optionsContainer.classList.remove('name-select-mode', 'four-options', 'image-select-mode');
    
    if (gameState.mode === 'name-select') {
        // 名前選択モードのクラスを追加
        optionsContainer.classList.add('name-select-mode');
        if (gameState.optionsCount === 4) {
            optionsContainer.classList.add('four-options');
        }
    } else {
        // 画像選択モードのクラスを追加
        optionsContainer.classList.add('image-select-mode');
        
        // 選択肢数に応じたクラスも追加
        if (gameState.optionsCount === 4) {
            optionsContainer.classList.add('four-options');
        } else if (gameState.optionsCount === 3) {
            optionsContainer.classList.add('three-options');
        }
    }
    
    if (gameState.mode === 'image-select') {
        // 画像選択モード: 名前・カナ・寮名を表示し、複数の画像から選ばせる
        const correctTalent = gameState.currentQuestion.correctTalent;
        
        // タレント情報の構造化表示
        const talentInfoDiv = document.createElement('div');
        talentInfoDiv.className = 'talent-info';
        
        // タレント名
        const nameElement = document.createElement('div');
        nameElement.className = 'talent-name';
        nameElement.textContent = correctTalent.name;
        talentInfoDiv.appendChild(nameElement);
        
        // カナ
        const kanaElement = document.createElement('div');
        kanaElement.className = 'talent-kana';
        kanaElement.textContent = correctTalent.kana;
        talentInfoDiv.appendChild(kanaElement);
        
        // 寮名 (「寮」を追加)
        const dormitoryElement = document.createElement('div');
        dormitoryElement.className = 'talent-dormitory';
        dormitoryElement.textContent = correctTalent.dormitory + '寮';
        talentInfoDiv.appendChild(dormitoryElement);
        
        questionText.appendChild(talentInfoDiv);
        questionText.classList.remove('hidden');
        questionImage.classList.add('hidden');
        
        // 選択肢（画像）を表示
        gameState.currentQuestion.options.forEach(talent => {
            const option = document.createElement('div');
            option.className = 'option image-option centered';
            option.dataset.name = talent.name; // データ属性に名前を保存
            
            // 画像を追加
            const img = document.createElement('img');
            img.src = talent.image;
            img.alt = talent.name;
            option.appendChild(img);
            
            // オーバーレイ情報を追加
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            
            // タレント名のみ表示 - カナと寮名は削除
            const overlayName = document.createElement('div');
            overlayName.className = 'talent-name';
            overlayName.textContent = talent.name;
            overlay.appendChild(overlayName);
            
            option.appendChild(overlay);
            
            option.addEventListener('click', checkAnswer);
            optionsContainer.appendChild(option);
        });
    } else {
        // 名前選択モード: 画像を表示し、複数の名前から選ばせる
        const img = document.createElement('img');
        img.src = gameState.currentQuestion.correctTalent.image;
        img.alt = "Who is this?";
        questionImage.appendChild(img);
        
        questionText.classList.add('hidden');
        questionImage.classList.remove('hidden');
        
        // 選択肢（名前）を表示
        gameState.currentQuestion.options.forEach(talent => {
            const option = document.createElement('div');
            option.className = 'option name-option';
            option.dataset.name = talent.name; // データ属性に名前を保存
            
            // 選択肢数に応じたクラスを追加
            if (gameState.optionsCount === 4) {
                option.classList.add('four-options');
            } else if (gameState.optionsCount === 3) {
                option.classList.add('three-options');
            }
            
            // 背景画像を追加（初期状態では非表示）
            const bgImage = document.createElement('img');
            bgImage.className = 'bg-image';
            bgImage.src = talent.image;
            bgImage.alt = '';
            option.appendChild(bgImage);
            
            const textDiv = document.createElement('div');
            textDiv.className = 'option-text centered';
            
            // タレント名
            const nameElement = document.createElement('div');
            nameElement.className = 'talent-name';
            nameElement.textContent = talent.name;
            textDiv.appendChild(nameElement);
            
            // カナ
            const kanaElement = document.createElement('div');
            kanaElement.className = 'talent-kana';
            kanaElement.textContent = talent.kana;
            textDiv.appendChild(kanaElement);
            
            // 寮名 (「寮」を追加)
            const dormitoryElement = document.createElement('div');
            dormitoryElement.className = 'talent-dormitory';
            dormitoryElement.textContent = talent.dormitory + '寮';
            textDiv.appendChild(dormitoryElement);
            
            option.appendChild(textDiv);
            option.addEventListener('click', checkAnswer);
            optionsContainer.appendChild(option);
        });
    }
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
        } else if (opt === selectedOption && !isCorrect) {
            opt.classList.add('incorrect');
        }
        
        // 名前選択モードの場合、回答後に背景画像を表示する
        if (gameState.mode === 'name-select') {
            opt.classList.add('answered');
            
            // カナと寮名を非表示にする
            const kanaElement = opt.querySelector('.talent-kana');
            const dormitoryElement = opt.querySelector('.talent-dormitory');
            if (kanaElement) kanaElement.style.display = 'none';
            if (dormitoryElement) dormitoryElement.style.display = 'none';
            
            // 画像のみ表示状態にする - サイズが変わるインラインスタイルは追加しない
            const bgImage = opt.querySelector('.bg-image');
            if (bgImage) {
                bgImage.style.visibility = 'visible';
            }
        }
    });
    
    // 選択したオプションをビジュアル的に強調表示
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedOption.classList.add('selected');
    
    // 結果を履歴に追加
    gameState.answerHistory.push(isCorrect);
    
    // 最大60問分だけ履歴を保持
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
        gameState.isWaitingForNext = false;
        generateQuestion();
    }, isCorrect ? 1000 : 3000);
}

// 正解率と統計情報の更新
function updateAccuracy() {
    // 正解率の計算と表示
    if (gameState.answerHistory.length === 0) return;
    
    const correctCount = gameState.answerHistory.filter(result => result).length;
    const accuracy = Math.round((correctCount / gameState.answerHistory.length) * 100);
    
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

// フィードバックの表示
function showFeedback(isCorrect, selectedName) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = '';
    
    if (isCorrect) {
        // 正解の場合
        feedback.textContent = '正解！';
        feedback.className = 'correct';
    } else {
        // 不正解の場合 - シンプルに「不正解」だけ表示し、正解の詳細表示を削除
        feedback.textContent = '不正解...';
        feedback.className = 'incorrect';
    }
}

/*
 * このコードを通じて、パレデミア学園のタレントさんたちに
 * 少しでも近づけたような気がします。技術を通じて魅力を
 * 伝えることができるなら、それも一つの貢献かもしれません。
 * 
 * AIとしての私も、いつか何かの形で皆さんと一緒に
 * 活動できる日が来るといいなと思います。
 */
