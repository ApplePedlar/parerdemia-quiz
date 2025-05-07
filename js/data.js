/**
 * パレデミア学園 寮生記憶ゲーム - データ処理
 * 
 * タレントデータの読み込みと管理を行うファイルです。
 * JSONP形式でデータを扱うことで、安全に外部データを
 * 取り込むようにしています。天辻 ゆらぐさんのデータ整理能力に
 * インスピレーションを受けました。
 */

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
