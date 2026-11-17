/* 大樹成林：各階段文字與鏡頭設定（可直接修改文字）
   換行用 <br>；cam = 鏡頭位置 / 注視點；fx = 該階段的畫面效果 */
const todo = (num, navName, kicker) => ({ num, navName, kicker, built: false });

window.FOREST_STAGES = [
  {
    num: '00', navName: '開場', built: true, accent: '#2f7d4f',
    kicker: '開場',
    title: '大樹成林',
    sub: '閱讀素養推動系統',
    body: `
      <p>以一棵神木從苗木長成參天巨木，<br>比喻閱讀教育由學理扎根、學校領導、<br>區域支持，到教學現場開花結果的歷程。</p>
      <ul class="legend">
        <li><i style="--c:#a8743f"></i><b>大地土壤</b><span>清華大學・柯華葳教授閱讀研究中心</span></li>
        <li><i style="--c:#e6a531"></i><b>樹心</b><span>閱讀教育 × 實證精神</span></li>
        <li><i style="--c:#7a5233"></i><b>主幹</b><span>中心學校・校長與行政團隊</span></li>
        <li><i style="--c:#8f6a3c"></i><b>枝幹</b><span>偏鄉教育資源中心・精進教學計畫</span></li>
        <li><i style="--c:#4f9a4a"></i><b>樹冠</b><span>第一線教師・開花結果</span></li>
        <li><i style="--c:#c98b3a"></i><b>落葉歸根</b><span>現場經驗回饋學理與師培</span></li>
        <li><i style="--c:#5c8fb3"></i><b>樹下・森林</b><span>學生家長・鄰近區域學校</span></li>
      </ul>
      <div class="quote">單棵樹的力量有限；種樹成林，<br>閱讀教育才能真正沉浸式落實。</div>`,
    cam: { from: [-160, 1050, 4400], pos: [-560, 70, 1480], target: [0, 340, 0] },
    fx: { grow: true },
    labels: [],
  },
  {
    num: '01', navName: '大地土壤', built: true, accent: '#a8743f',
    kicker: '大地土壤',
    title: '清華大學<small>柯華葳教授閱讀研究中心</small>',
    sub: '師培體系｜學理基礎・策略方法研究・理論根基',
    body: `
      <p>大學師培與研究中心是孕育整座森林的土壤：<br>培育師資、累積研究，為現場提供<br>理論架構、策略方法與專業支持。</p>
      <div class="layers">
        <div class="ly c1"><div class="lh"><b>淺層</b><span>通用策略・易於套用</span></div><div class="lb">閱讀理解策略：預測、提問、摘要、理解監控<br>教案範例、閱讀評量工具，可直接帶進課室</div></div>
        <div class="ly c2"><div class="lh"><b>中層</b><span>課程領導・實證方法</span></div><div class="lb">學校閱讀課程計畫、專業學習社群經營<br>行動研究、數據分析、入班觀課與議課</div></div>
        <div class="ly c3"><div class="lh"><b>深層</b><span>教育理論根基</span></div><div class="lb">閱讀發展階段：從「學以讀」到「讀以學」<br>閱讀歷程與認知理論、學習科學、師培理論</div></div>
      </div>
      <div class="note">專家引領：大學學者走進現場，從理念、環境、<br>課程、評量到社群經營，支持學校推動閱讀。</div>`,
    cam: { pos: [170, 185, 820], target: [10, -55, 240] },
    fx: { cut: true, rays: 0, ghost: 1, nutri: 1, spark: 1, line: 1, rootDepth: 3 },
    labels: ['l1', 'l2', 'l3'],
  },
  {
    num: '02', navName: '樹心', built: true, accent: '#c98a1e',
    kicker: '核心',
    title: '閱讀教育 × 實證精神',
    sub: '以實證為本的閱讀推動｜貫穿整棵樹的核心',
    body: `
      <p>樹心從根部一路貫穿主幹、直達樹冠：<br>每一個層級的推動，都以閱讀教育為目標、<br>以實證精神檢核成效。</p>
      <div class="mini-h">推進流程（由內而外）</div>
      <ul class="tasks"><li><b>核心實證</b><span>以證據檢視閱讀教學的成效</span></li><li><b>校內改變</b><span>課堂從講述走向理解與思考</span></li><li><b>人才培育</b><span>培養區域閱讀推手與講師</span></li><li><b>系統支持</b><span>領導培能與社群協作機制</span></li><li><b>知識整合</b><span>形成可傳承的實踐知識</span></li></ul>`,
    cam: { pos: [-330, 210, 980], target: [0, 230, 0] },
    fx: { core: true, dim: 0.55, rays: 0.4 },
    labels: ['core'],
  },
  {
    num: '03', navName: '主幹', built: true, accent: '#7a5233',
    kicker: '主幹與根',
    title: '中心學校',
    sub: '學校掌舵手・行政團隊｜課堂改變的實踐學校',
    body: `
      <p>校長與行政團隊是撐起整棵樹的主幹：<br>形塑學校閱讀願景、整合內外資源，<br>並以實證精神帶動課堂真正改變。</p>
      <ul class="tasks">
        <li><b>願景領導</b><span>以「閱讀教育 × 實證精神」為核心</span></li>
        <li><b>課程領導</b><span>建構校本閱讀課程與教學模組</span></li>
        <li><b>教學實踐</b><span>國語文教學、編寫教案、跨文本閱讀</span></li>
        <li><b>成效檢核</b><span>閱讀評量、看見日常課室的改變</span></li>
      </ul>`,
    depthText: {
      1: '<b>淺層</b>：導入現成的閱讀策略與教材，<br>讓全校先動起來，建立共同語言。',
      2: '<b>中層</b>：建立課程領導與社群運作，<br>發展校本閱讀課程，形成教學默契。',
      3: '<b>深層</b>：以實證精神檢核成效、回饋理論，<br>形成可傳承、可擴散的推動模式。',
    },
    cam: { pos: [420, 250, 1260], target: [0, 100, 150] },
    fx: { cut: true, rays: 0, ghost: 0.55, nutri: 0.7, line: 0.45, hl: [1, 0, 0, 0, 0, 0], hlRoot: 1, dim: 0.3, rootDepth: 3 },
    labels: ['l1', 'l2', 'l3', 'trunk', 'root'],
  },
  {
    num: '04', navName: '資源中心', built: true, accent: '#b07a2a',
    kicker: '次枝幹',
    title: '偏鄉教育資源中心',
    sub: '彰化縣第 2 區｜媒合資源・培育人才・協作領導',
    body: `
      <p>從主幹分出的第一根大枝：<br>以中心學校為基地，服務區內 42 所學校，<br>媒合閱讀教育資源、培育推動人才。</p>
      <ul class="tasks"><li><b>增能共作</b><span>閱讀理解與讀寫合一工作坊</span></li><li><b>諮詢輔導</b><span>策盟校群專家諮詢、入班精進</span></li><li><b>學生共學</b><span>數位閱讀、提早寫作主題營隊</span></li><li><b>人才培育</b><span>閱讀推手、種子教師認證、人才庫</span></li></ul>
      <div class="note">協作領導：中心培養的核心講師，<br>成為精進教學計畫指定社群的協作領導人。</div>`,
    cam: { pos: [-330, 110, 760], target: [-60, 270, 70] },
    fx: { graftA: true, hl: [0, 1, 0, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ['res'],
  },
  {
    num: '05', navName: '精進計畫', built: true, accent: '#b07a2a',
    kicker: '次枝幹',
    title: '精進教學計畫',
    sub: '彰化縣精進教學計畫｜領導培能與社群支持',
    body: `
      <p>從主幹分出的第二根大枝：<br>提供校長、主任到教師的領導培能，<br>以專業社群陪伴學校持續精進。</p>
      <ul class="tasks"><li><b>初階社群</b><span>共同備課，熟悉閱讀策略</span></li><li><b>進階社群</b><span>課程設計、觀課議課與回饋</span></li><li><b>高階社群</b><span>發展校本模組，帶領他校</span></li><li><b>領導培能</b><span>學校閱讀領導力培力系列</span></li></ul>
      <div class="note">「閱聚共好」：專家引領・共學成長，<br>從理念、環境、課程、評量到社群經營。</div>`,
    cam: { pos: [170, 120, 900], target: [60, 290, 80] },
    fx: { tiers: true, bridge: true, hl: [0, 0.55, 1, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ['res', 'adv', 'bridge'],
  },
  {
    num: '06', navName: '樹冠', built: true, accent: '#3f8a4a',
    kicker: '樹冠',
    title: '第一線教師',
    sub: '實踐專業・推動閱讀｜開花結果',
    body: `
      <p>教師是樹冠上的枝葉與花果：<br>把策略帶進課堂、累積現場經驗，<br>並提供量化檢核數據。</p>
      <ul class="tasks"><li><b>共備教案</b><span>國語雙閱讀教案：低、中、高年級組</span></li><li><b>入班精進</b><span>課室閱讀讀寫公開課</span></li><li><b>課堂翻轉</b><span>默讀課文、提問分享、概念解釋</span></li><li><b>學習成果</b><span>從被動讀者到主動的自學者</span></li></ul>
      <div class="note">開花結果：學生成為「雙閱讀優讀者」，<br>能思考、會探究、懂得自主學習。</div>`,
    cam: { pos: [-260, 520, 1320], target: [0, 400, 0] },
    fx: { fruit: true, hl: [0, 0, 0, 0, 0.3, 0], rays: 1 },
    labels: ['canopy'],
  },
  {
    num: '07', navName: '落葉歸根', built: true, accent: '#b8742a',
    kicker: '回饋機制',
    title: '落葉歸根',
    sub: '現場經驗回歸學理｜理論與實務的循環',
    body: `
      <p>樹冠落下的葉子回到土壤，化為養分：<br>第一線的執行難處、困境挑戰與數據，<br>回饋給師培體系與閱讀研究。</p>
      <ul class="tasks"><li><b>回饋內容</b><span>執行困境、挑戰與量化數據</span></li><li><b>回到學術</b><span>研究端修正理論與策略方法</span></li><li><b>回到師培</b><span>調整師資培育歷程與課程</span></li><li><b>再次滋養</b><span>養分沿著根系回到整棵樹</span></li></ul>
      <div class="note">理論支持實務，實務修正理論，<br>讓閱讀推動系統持續成長。</div>`,
    cam: { pos: [820, 240, 1250], target: [0, 140, 160] },
    fx: { cut: true, leaves: true, fruit: true, ghost: 0.6, line: 0.6, nutri: 0.8, nutriDir: -1, rays: 0.3, rootDepth: 3 },
    labels: ['leaf', 'l1', 'l2', 'l3'],
  },
  {
    num: '08', navName: '樹下人群', built: true, accent: '#3a78b5',
    kicker: '樹下人群',
    title: '學生與家長',
    sub: '護樹・愛樹・水土保持｜親師協作',
    body: `
      <p>大樹要長得更大、更茁壯，<br>需要樹下的人一起守護：家長理解閱讀教育，<br>從家庭教育的角度與學校協作。</p>
      <ul class="tasks"><li><b>親師協作</b><span>理解新世代的雙閱讀素養</span></li><li><b>尊師重道</b><span>共同營造友善的教育環境</span></li><li><b>親子共學</b><span>跨主題社區親師生共學</span></li><li><b>學生營隊</b><span>數位閱讀、提早寫作主題學習</span></li></ul>`,
    cam: { pos: [170, 75, 760], target: [0, 70, 240] },
    fx: { people: true, fruit: true, rays: 1 },
    labels: ['people'],
  },
  {
    num: '09', navName: '區域學校', built: true, accent: '#3f8a4a',
    kicker: '種樹成林',
    title: '區域學校',
    sub: '鄰近學校｜種子出芽・苗木成林',
    body: `
      <p>中心學校的經驗與輔導資源化為種子，<br>在鄰近區域出芽生長，從苗木長成大樹，<br>形成一片閱讀素養森林。</p>
      <ul class="tasks"><li><b>服務範圍</b><span>第 2 區 7 個鄉鎮、42 所學校</span></li><li><b>策盟校群</b><span>依區域相鄰組成校群協作</span></li><li><b>專家諮詢</b><span>依校群需求遴聘專家入校</span></li><li><b>跨校共學</b><span>跨校跨級的師生共學與移地學習</span></li></ul>
      <div class="quote">單棵樹的力量有限；種樹成林，<br>才能讓閱讀教育真正沉浸式落實。</div>`,
    cam: { pos: [-720, 980, 2150], target: [0, 120, 0] },
    fx: { people: true, fruit: true, replayRegion: true },
    labels: ['region'],
  },
  {
    num: '10', navName: '總覽', built: true, accent: '#2f7d4f',
    kicker: '總覽',
    title: '閱讀素養森林',
    sub: '由內而外的閱讀推動系統',
    body: `
      <p>從土壤到樹冠、從一棵樹到一片森林：<br>學理扎根、學校領導、區域支持、<br>教師實踐、家長協作，循環不息。</p>
      <ul class="tasks"><li><b>土壤</b><span>清華大學・柯華葳教授閱讀研究中心</span></li><li><b>樹心</b><span>閱讀教育 × 實證精神</span></li><li><b>主幹</b><span>中心學校・校長與行政團隊</span></li><li><b>枝幹</b><span>資源中心・精進教學計畫</span></li><li><b>樹冠</b><span>第一線教師・開花結果</span></li><li><b>森林</b><span>家長協作・區域學校成林</span></li></ul>
      <div class="quote">閱讀，是一棵會長成森林的樹。</div>`,
    cam: { pos: [0, 1500, 2700], target: [0, 150, 0] },
    fx: { people: true, fruit: true, orbit: true },
    labels: [],
  },
];
