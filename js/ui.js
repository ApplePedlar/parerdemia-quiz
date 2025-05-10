/**
 * パレデミア学園 寮生記憶ゲーム - UI処理
 * 
 * ユーザーインターフェースに関する機能を集めたファイルです。
 * モーダル機能や問題表示など、ユーザー体験を向上させる
 * 要素を実装しています。犬丸なでこさんの親しみやすさを
 * 意識したデザインにしました。
 */

/**
 * 設定モーダル機能のセットアップ
 * 
 * 灯野ぺけ。さんのシンプルで分かりやすいUIが魅力的です。
 * このモーダル機能は、彼女のように明快さを意識しました。
 * スマホでも快適に操作できるよう工夫しています。
 */
function setupSettingsModal() {
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsButton = document.getElementById('settings-button'); // 別のIDもサポート
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.getElementById('close-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const settingsStatusBar = document.querySelector('.settings-status-bar'); // 追加: 設定ステータスバーの取得
    
    // モーダルが見つからない場合は終了
    if (!settingsModal) {
        console.error('Settings modal not found');
        return;
    }
    
    // 設定ステータスバー全体のクリックイベントを追加
    if (settingsStatusBar) {
        settingsStatusBar.addEventListener('click', (e) => {
            // すでに処理されたイベントの場合は何もしない
            if (e.target === settingsToggle || (settingsToggle && settingsToggle.contains(e.target))) {
                return;
            }
            console.log('Settings status bar clicked'); // デバッグ用
            settingsModal.classList.add('show');
            settingsModal.classList.add('open');
            updateSettingsDisplay();
        });
    }
    
    // settings-toggleボタンのイベントリスナー
    if (settingsToggle) {
        settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // イベント伝播を停止
            console.log('Settings toggle clicked'); // デバッグ用
            settingsModal.classList.add('show');
            settingsModal.classList.add('open');
            updateSettingsDisplay();
        });
    }
    
    // settings-buttonボタンのイベントリスナー（別のID用）
    if (settingsButton) {
        settingsButton.addEventListener('click', (e) => {
            e.stopPropagation(); // イベント伝播を停止
            settingsModal.classList.add('show');
            settingsModal.classList.add('open');
            updateSettingsDisplay();
        });
    }
    
    // 閉じるボタンのイベントリスナー
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.stopPropagation(); // イベント伝播を停止
            settingsModal.classList.remove('show');
            settingsModal.classList.remove('open');
        });
    }
    
    // 別の閉じるボタンのイベントリスナー
    if (closeModalButton) {
        closeModalButton.addEventListener('click', (e) => {
            e.stopPropagation(); // イベント伝播を停止
            settingsModal.classList.remove('show');
            settingsModal.classList.remove('open');
        });
    }
    
    // モーダルの外側をクリックしても閉じる
    settingsModal.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove('show');
            settingsModal.classList.remove('open');
        }
    });
    
    // 初期表示時に現在の設定をステータスバーに反映
    updateSettingsDisplay();
}

/**
 * 現在の設定をステータスバーに表示
 */
function updateSettingsDisplay() {
    const currentMode = document.getElementById('current-mode');
    const currentDifficulty = document.getElementById('current-difficulty');
    const currentOptions = document.getElementById('current-options');
    
    if (currentMode) {
        if (gameState.mode === 'image-select') {
            currentMode.textContent = '顔当て';
        } else if (gameState.mode === 'name-select') {
            currentMode.textContent = '名前当て';
        } else if (gameState.mode === 'dream-select') {
            currentMode.textContent = '誰の夢？';
        }
    }
    
    if (currentDifficulty) {
        currentDifficulty.textContent = 
            gameState.difficulty === 'easy' ? '低' : 
            gameState.difficulty === 'hard' ? '高' : '鬼';
    }
    
    if (currentOptions) {
        currentOptions.textContent = gameState.optionsCount;
    }
    
    // 設定変更後に次の問題の画像をプリロード
    if (gameState.nextQuestion) {
        const imagesToPreload = extractImageUrls(gameState.nextQuestion);
        preloadImages(imagesToPreload);
    }
}

/**
 * 問題表示関数
 * 
 * 犬丸なでこさんの親しみやすさと桜庭羽奈さんの可愛らしさを
 * 意識したUI設計です。シンプルさと使いやすさの両立を
 * 心がけました。パレデミア学園のタレントさんたちの魅力が
 * 伝わるよう、表示方法にもこだわっています。
 */
function displayQuestion() {
    // すでに待機中なら何もしない（ただし設定変更時は例外）
    if (gameState.isWaitingForNext && gameState.feedbackTimer) return;
    
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
    optionsContainer.classList.remove('name-select-mode', 'four-options', 'image-select-mode', 'dream-select-mode');
    
    if (gameState.mode === 'name-select') {
        // 名前選択モード
        optionsContainer.classList.add('name-select-mode');
        if (gameState.optionsCount === 4) {
            optionsContainer.classList.add('four-options');
        }
    } else if (gameState.mode === 'dream-select') {
        // 誰の夢？モード - 名前表示付き
        optionsContainer.classList.add('dream-select-mode');
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
        
        // カナ（先に表示するように変更）
        const kanaElement = document.createElement('div');
        kanaElement.className = 'talent-kana';
        kanaElement.textContent = correctTalent.kana;
        talentInfoDiv.appendChild(kanaElement);
        
        // タレント名（カナの後に表示するように変更）
        const nameElement = document.createElement('div');
        nameElement.className = 'talent-name';
        nameElement.textContent = correctTalent.name;
        talentInfoDiv.appendChild(nameElement);
        
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
            
            overlay.appendChild(overlayName); // 修正：overlayNameを追加する
            
            option.appendChild(overlay);
            
            option.addEventListener('click', checkAnswer);
            optionsContainer.appendChild(option);
        });
    } else if (gameState.mode === 'dream-select') {
        // 誰の夢？モード: 夢を表示し、複数の顔から選ばせる
        // 顔当てモードと基本的に同じだが、夢を表示する
        
        const correctTalent = gameState.currentQuestion.correctTalent;
        
        // タレント情報の構造化表示（夢を表示）
        const talentInfoDiv = document.createElement('div');
        talentInfoDiv.className = 'talent-info';
        
        // 夢を表示
        const dreamElement = document.createElement('div');
        dreamElement.className = 'talent-dream';
        dreamElement.textContent = correctTalent.dream;
        
        // 夢の文字数に応じてフォントサイズを調整
        adjustDreamFontSize(dreamElement, correctTalent.dream);
        
        talentInfoDiv.appendChild(dreamElement);
        
        questionText.appendChild(talentInfoDiv);
        questionText.classList.remove('hidden');
        questionImage.classList.add('hidden');
        
        // 選択肢（画像）を表示 - タレント名も一緒に表示する
        gameState.currentQuestion.options.forEach(talent => {
            const option = document.createElement('div');
            option.className = 'option image-option centered dream-option';
            option.dataset.name = talent.name; // データ属性に名前を保存
            
            // 画像を追加
            const img = document.createElement('img');
            img.src = talent.image;
            img.alt = talent.name;
            option.appendChild(img);
            
            // オーバーレイ情報を追加（画像に重なる半透明の帯）
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay dream-name-overlay';
            
            // タレント名を表示
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
            
            // カナ（先に表示するように変更）
            const kanaElement = document.createElement('div');
            kanaElement.className = 'talent-kana';
            kanaElement.textContent = talent.kana;
            textDiv.appendChild(kanaElement);
            
            // タレント名（カナの後に表示するように変更）
            const nameElement = document.createElement('div');
            nameElement.className = 'talent-name';
            nameElement.textContent = talent.name;
            textDiv.appendChild(nameElement);
            
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
 * 夢の文字数に応じてフォントサイズを調整する関数
 * 
 * 文字数が多い場合は小さく、少ない場合は大きくすることで
 * 視認性を向上させます。パレデミア学園の寮生たちの夢は
 * 短いものから長いものまで様々なため、それぞれの夢を
 * 最適な形で表示するための工夫です。
 * すべての夢テキストは太字で表示されます。
 * 
 * @param {HTMLElement} element - 夢のテキストを表示する要素
 * @param {string} dreamText - 夢のテキスト
 */
function adjustDreamFontSize(element, dreamText) {
    const length = dreamText.length;
    
    // 文字数に応じてフォントサイズを設定（太字は.talent-dreamとクラスで保証）
    if (length <= 10) {
        // 非常に短い夢（例：「年収1000万」）
        element.style.fontSize = '24px';
        element.classList.add('dream-text-short');
    } else if (length <= 30) {
        // 短い夢
        element.style.fontSize = '22px';
        element.classList.add('dream-text-medium-short');
    } else if (length <= 60) {
        // 中程度の夢
        element.style.fontSize = '18px'; // デフォルトサイズ
        element.classList.add('dream-text-medium');
    } else if (length <= 100) {
        // やや長い夢
        element.style.fontSize = '16px';
        element.classList.add('dream-text-medium-long');
    } else if (length <= 200) {
        // 長い夢
        element.style.fontSize = '14px';
        element.classList.add('dream-text-long');
    } else {
        // 非常に長い夢（例：天辻ゆらぐさんの夢）
        element.style.fontSize = '12px';
        element.classList.add('dream-text-very-long');
    }
}

// フィードバックの表示
function showFeedback(isCorrect, selectedName) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = '';
    
    if (isCorrect) {
        // 正解の場合
        feedback.textContent = '正解！';
        feedback.className = 'correct feedback-animation';
    } else {
        // 不正解の場合
        feedback.textContent = '不正解...';
        feedback.className = 'incorrect feedback-animation';
    }
}
