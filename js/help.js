/**
 * パレデミア学園 寮生記憶ゲーム - ヘルプコンテンツ
 * 
 * ヘルプモーダルに表示するコンテンツを管理するファイルです。
 * パレデミア学園の概要や、ゲームの遊び方を丁寧に解説します。
 * 彼方ルカさんの「ポジティブな姿勢でいる」という目標のように、
 * 初めての方でも前向きな気持ちで遊べるよう心がけました。
 * 璃乃瀬りあさんの「一人でも多くの人の心に残る」という夢に触発されて、
 * わかりやすく親しみやすい説明を目指しています。
 */

// ヘルプモーダルのコンテンツ設定
function setupHelpContent() {
    const helpContent = document.querySelector('.help-modal-body');
    if (!helpContent) return;
    
    // 既存のヘルプコンテンツは必要に応じて更新可能
    // ...
    
    // 新しいセクションの追加例（必要に応じて）
    const tipsSection = document.createElement('div');
    tipsSection.className = 'help-section';
    tipsSection.innerHTML = `
        <h4>遊び方のコツ</h4>
        <p>連続正解を重ねると特別なエフェクトが表示されます。全60名を制覇すると特別なアニメーションを見ることができます！</p>
        <p>各寮の特徴を意識して覚えると効果的です。バゥ寮の元気な雰囲気、ミュゥ寮のかわいらしさ、クゥ寮の優雅さ、ウィニー寮の力強さをイメージしてみましょう。</p>
        <p>夢に注目することで、タレントさんたちの個性をより深く理解できます。彼女たちの夢と共に応援する気持ちが湧いてくるはずです。</p>
    `;
    
    // 必要に応じてヘルプコンテンツの末尾に追加
    // helpContent.appendChild(tipsSection);
}

// DOMが読み込まれたときにヘルプコンテンツを設定
document.addEventListener('DOMContentLoaded', setupHelpContent);
