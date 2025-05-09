/**
 * パレデミア学園 寮生記憶ゲーム - UI処理
 * 
 * ユーザーインターフェースに関する機能を集めたファイルです。
 * アコーディオン機能や問題表示など、ユーザー体験を向上させる
 * 要素を実装しています。犬丸なでこさんの親しみやすさを
 * 意識したデザインにしました。
 */

/**
 * アコーディオン機能のセットアップ
 * 
 * 灯野ぺけ。さんのシンプルで分かりやすいUIが魅力的です。
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
                // 以前のフィードバッククリア関連コードを削除
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
