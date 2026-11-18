/* 大樹成林：各階段文字與鏡頭設定（文字可直接修改）
   ・換行用 <br>，重點字用 <b>…</b>
   ・cam = 鏡頭位置 pos / 注視點 target；fx = 該階段的畫面效果 */
const rows = (list) => '<ul class="rows">' + list.map(([k, t]) => `<li><b>${k}</b><span>${t}</span></li>`).join('') + '</ul>';
const flow = (list, on = -1) => '<div class="flow">' + list.map((t, i) => `<span class="${i === on ? 'on' : ''}">${t}</span>`).join('<i>▶</i>') + '</div>';

window.FOREST_STAGES = [
  {
    num: '00', navName: '開場', built: true, accent: '#24573a',
    kicker: '開場',
    title: '師培・<em>失培</em>・施培',
    sub: '系統領導的覺察及策進作為',
    body: `
      <p class="lead">一棵神木，從苗木長成一片森林——<br>閱讀教育如何從<b>學理扎根</b>，走到<b>課堂開花結果</b>？</p>
      <div class="tri">
        <div style="--c:#a06a2c"><strong>師培</strong><i>大地土壤</i><span>大學與研究中心<br>提供專業養分</span></div>
        <div style="--c:#b5482f"><strong>失培</strong><i>八個落差</i><span>培育了，卻未必<br>長成教學能力</span></div>
        <div style="--c:#2f7d4f"><strong>施培</strong><i>主幹與枝葉</i><span>學校主動診斷<br>整合資源施培</span></div>
      </div>
      ${flow(['土壤', '樹心', '主幹', '枝幹', '樹冠', '森林'])}
      <div class="quote">校長的領導邊界，應該<em>止於校門</em>嗎？</div>`,
    cam: { from: [-300, 1300, 5200], pos: [-560, 60, 1850], target: [0, 350, 0] },
    fx: { grow: true },
    labels: [],
  },
  {
    num: '01', navName: '土壤', built: true, accent: '#a06a2c',
    kicker: '師培｜大地土壤',
    title: '專業養分從哪裡來？',
    sub: '一般師培 × 清華大學柯華葳教授閱讀研究中心',
    body: `
      <p class="lead">土壤分三層，愈往下愈接近<b>閱讀教育的專業核心</b>。</p>
      <div class="layers">
        <div class="ly c1"><div class="tag-l"><b>表土</b><small>一般師培</small></div><div class="body-l">
          <h4>七種教師知識<small>Shulman（1986；1987）</small></h4>
          <div class="chips"><span>學科內容</span><span>一般教學</span><span>課程</span><span>學科教學 PCK</span><span>學習者特性</span><span>教育情境</span><span>教育目標與價值</span></div></div></div>
        <div class="ly c2"><div class="tag-l"><b>次土</b><small>柯華葳中心</small></div><div class="body-l">
          <h4>學理<small>實證科學閱讀</small></h4>
          <p>以實證科學為基礎的閱讀學理：<b class="k">知道為什麼這樣教</b></p></div></div>
        <div class="ly c3"><div class="tag-l"><b>深土</b><small>柯華葳中心</small></div><div class="body-l">
          <h4>實踐取徑<small>從學理走進課堂</small></h4>
          <p>把學理轉化為課堂可行的做法：<b class="k">知道怎麼做得到</b></p></div></div>
      </div>
      <div class="note">根扎得愈深，愈能汲取<b>閱讀專業</b>的養分。</div>`,
    cam: { pos: [240, 250, 1220], target: [0, -40, 340] },
    fx: { cut: true, rays: 0, ghost: 1, nutri: 1, spark: 1, line: 1, rootDepth: 3 },
    labels: ['l1', 'l2', 'l3'],
  },
  {
    num: '02', navName: '失培', built: true, accent: '#b5482f',
    kicker: '失培｜問題意識',
    title: '師培為何可能走向<em>失培</em>？',
    sub: '培育了，不代表能力成長；研習了，不代表教學改變',
    body: `
      <div class="gaps">
        <div><i>01</i><p style="margin:0"><b>制度與需求的落差</b><span>師培供給未必回應學校需求</span></p></div>
        <div><i>02</i><p style="margin:0"><b>參與與投入的落差</b><span>研習出席不等於積極學習</span></p></div>
        <div><i>03</i><p style="margin:0"><b>知識與實踐的落差</b><span>知道怎麼教，不等於改變教法</span></p></div>
        <div><i>04</i><p style="margin:0"><b>個體與組織的落差</b><span>少數教師成長不等於全校進步</span></p></div>
        <div><i>05</i><p style="margin:0"><b>短期與持續的落差</b><span>一次性增能難以支持持續改變</span></p></div>
        <div><i>06</i><p style="margin:0"><b>研習與學生學習的落差</b><span>研習成果不等於學生學習成效</span></p></div>
        <div><i>07</i><p style="margin:0"><b>外部支持與學校能動</b><span>資源投入不等於學校自主發展</span></p></div>
        <div><i>08</i><p style="margin:0"><b>專業發展與系統領導</b><span>缺乏整體規劃，易成零散活動</span></p></div>
      </div>
      <div class="quote">土壤再肥沃，<em>根扎得淺</em>，養分就到不了樹冠。</div>`,
    cam: { pos: [-300, 230, 1240], target: [0, -10, 320] },
    fx: { cut: true, rays: 0, ghost: 0.8, nutri: 0.5, spark: 0.6, line: 0.8, hlRoot: 1, dim: 0.3, rootDepth: 1 },
    labels: ['l1', 'l2', 'l3'],
  },
  {
    num: '03', navName: '樹心', built: true, accent: '#b9801a',
    kicker: '核心｜樹心',
    title: '閱讀教育 × 實證精神',
    sub: '從根部貫穿主幹、直達樹冠的核心',
    body: `
      <p class="lead">每一層的推動，都以<b>學生的閱讀學習</b>為目標，<br>並且用<b>證據</b>檢核：課堂是否真的改變？</p>
      <div class="mini-h">持續專業學習循環</div>
      ${flow(['增能', '共備', '入班', '蒐證', '回饋'], 3)}
      ${rows([['問對問題', '是否蒐集<b>學生學習改變</b>的證據？'], ['長期合作', '從一次研習，走向<b>長期教學合作</b>']])}
      <div class="quote">關鍵不在辦了幾場研習，而在<em>課堂是否改變</em>。</div>`,
    cam: { pos: [-460, 260, 1650], target: [0, 320, 0] },
    fx: { core: true, dim: 0.55, rays: 0.4 },
    labels: ['core'],
  },
  {
    num: '04', navName: '主幹', built: true, accent: '#7a5233',
    kicker: '施培｜主幹與根',
    title: '校長的<em>系統領導</em>',
    sub: '彰化縣永興國小｜從學校領導，轉向系統領導',
    body: `
      <p class="lead">校長是<b>整合需求、資源、實踐與成效</b>的人。</p>
      ${rows([['需求診斷', '先辨識<b>學生學習問題</b>，再定專業支持'], ['資源整合', '教師・行政・家長・研究團隊・經費'], ['施培範圍', '校內施培 ▶ <b>校內外整合施培</b>']])}
      <div class="mini-h" style="margin-top:calc(var(--u)*.9)">合作的三條路</div>
      ${flow(['大學發起', '政策媒合', '學校主動結盟'], 2)}`,
    depthText: {
      1: '<b>表土</b>：只吸收一般師培的養分，容易停在研習。',
      2: '<b>次土</b>：向下連結閱讀學理，知道為什麼這樣教。',
      3: '<b>深土</b>：扎進實踐取徑，與研究團隊共同設計、長期陪伴。',
    },
    cam: { pos: [520, 330, 1650], target: [0, 120, 170] },
    fx: { cut: true, rays: 0, ghost: 0.55, nutri: 0.7, line: 0.45, hl: [1, 0, 0, 0, 0, 0], hlRoot: 1, dim: 0.3, rootDepth: 3 },
    labels: ['l1', 'l2', 'l3', 'trunk'],
  },
  {
    num: '05', navName: '資源中心', built: true, accent: '#b07a2a',
    kicker: '枝幹｜系統領導向外延伸',
    title: '偏鄉教育資源中心',
    sub: '彰化縣第 2 區｜服務 7 個鄉鎮、42 所學校',
    body: `
      <p class="lead">以永興國小為基地，把一校的經驗，<br>擴大為<b>跨校的專業資源共享與協作</b>。</p>
      ${rows([['增能共作', '閱讀理解與<b>讀寫合一</b>工作坊'], ['諮詢輔導', '策盟校群專家諮詢、<b>入班精進</b>'], ['學生共學', '數位閱讀、提早寫作主題營隊'], ['人才培育', '閱讀推手、種子教師認證、人才庫']])}
      <div class="note">政策媒合來的資源，由學校<b>主動組織、主動運用</b>。</div>`,
    cam: { focus: 'limbA', off: [-330, -150, 1050] },
    fx: { graftA: true, hl: [0, 1, 0, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ['res'],
  },
  {
    num: '06', navName: '精進計畫', built: true, accent: '#b07a2a',
    kicker: '枝幹｜領導培能與社群支持',
    title: '精進教學計畫',
    sub: '彰化縣精進教學計畫｜專業成長是組織的事',
    body: `
      <p class="lead">從校長、主任到教師的領導培能，<br>以<b>教師社群</b>陪伴學校持續精進。</p>
      ${rows([['初階社群', '共同備課，熟悉閱讀策略'], ['進階社群', '課程設計、<b>觀課議課</b>與回饋'], ['高階社群', '發展校本模組，<b>帶領他校</b>'], ['領導培能', '「閱聚共好」閱讀領導力系列']])}
      <div class="note"><b>協作領導</b>：資源中心培養的核心講師，帶領指定社群。</div>`,
    cam: { focus: 'bridge', off: [120, -150, 1500] },
    fx: { tiers: true, bridge: true, hl: [0, 0.55, 1, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ['adv', 'bridge'],
  },
  {
    num: '07', navName: '樹冠', built: true, accent: '#2f7d4f',
    kicker: '樹冠｜第一線教師',
    title: '從接受培訓，到<em>教學實踐</em>',
    sub: '教師是樹冠上的枝葉與花果',
    body: `
      <p class="lead">專業知識，要<b>轉化為課堂活動</b>才算數。</p>
      ${flow(['理解模式', '研討文本', '設計任務', '課堂實踐'], 3)}
      ${rows([['共備教案', '國語雙閱讀：低、中、高年級組'], ['入班精進', '課室閱讀讀寫<b>公開課</b>'], ['全校皆動', '先行教師 ▶ 社群 ▶ 年級 ▶ <b>全校</b>'], ['開花結果', '學生成為<b>雙閱讀優讀者</b>']])}`,
    cam: { pos: [-420, 470, 2050], target: [0, 430, 0] },
    fx: { fruit: true, hl: [0, 0, 0, 0, 0.3, 0], rays: 1 },
    labels: ['canopy'],
  },
  {
    num: '08', navName: '歸根', built: true, accent: '#b8742a',
    kicker: '回饋｜落葉歸根',
    title: '研究 × 實務的<em>夥伴關係</em>',
    sub: 'Research–Practice Partnerships（RPPs）',
    body: `
      <p class="lead">大學提供<b>研究與專業知識</b>，教師提供<b>現場知識</b>；<br>課堂的證據再回到學理，循環不息。</p>
      ${rows([['定義需求', '從接受資源，到<b>定義需求</b>'], ['共同設計', '從外部培育，到<b>共同設計</b>'], ['長期陪伴', '從短期研習，到<b>長期陪伴</b>'], ['全校皆動', '從少數參與，到<b>全校皆動</b>'], ['跨校共學', '從單校發展，到<b>跨校共學</b>']])}`,
    cam: { pos: [980, 360, 1800], target: [0, 190, 200] },
    fx: { cut: true, leaves: true, fruit: true, ghost: 0.6, line: 0.6, nutri: 0.8, nutriDir: -1, rays: 0.3, rootDepth: 3 },
    labels: ['leaf', 'l1', 'l2', 'l3'],
  },
  {
    num: '09', navName: '實例', built: true, accent: '#8a3f7a',
    kicker: '實例｜學校主動結盟',
    title: '永興國小 × 清華大學',
    sub: '「跨文本雙閱讀」合作重點',
    body: `
      <p class="lead">關鍵不是有沒有辦閱讀研習，<br>而是能否說明<b>「為什麼需要這項專業合作」</b>。</p>
      ${rows([['需求轉換', '辨識學生要提升的<b>閱讀能力</b>與教學支持'], ['專業互補', '<b>研究專業 × 現場知識</b>，大學與學校互補'], ['教學實踐', '理解模式 ▶ 研討文本 ▶ 設計任務 ▶ <b>課堂</b>'], ['系統領導', '整合教師、行政、家長、研究團隊與經費']])}
      <div class="quote">校長不只支持教師參加研習，更要<em>建立支持條件</em>。</div>`,
    cam: { pos: [-620, 300, 1750], target: [0, 230, 120] },
    fx: { cut: true, core: true, fruit: true, nutri: 0.8, ghost: 0.5, line: 0.5, rays: 0.5, rootDepth: 3 },
    labels: [],
  },
  {
    num: '10', navName: '樹下', built: true, accent: '#2f6fb0',
    kicker: '守護｜樹下人群',
    title: '學生與家長',
    sub: '護樹・愛樹・水土保持',
    body: `
      <p class="lead">大樹要長得更茁壯，<br>需要<b>樹下的人</b>一起守護。</p>
      ${rows([['家長溝通', '理解新世代的<b>雙閱讀素養</b>'], ['資源募集', '家長與社區支持，擴大實施規模'], ['親子共學', '跨主題社區親師生共學'], ['學生營隊', '數位閱讀、提早寫作主題學習']])}
      <div class="quote">教學要持續運作，需要<em>親師一起</em>撐起支持條件。</div>`,
    cam: { pos: [240, 95, 1000], target: [0, 100, 250] },
    fx: { people: true, fruit: true, rays: 1 },
    labels: ['people'],
  },
  {
    num: '11', navName: '區域', built: true, accent: '#2f7d4f',
    kicker: '成林｜區域學校',
    title: '從單校發展，到<em>跨校共學</em>',
    sub: '系統領導如何擴大專業培育的效益',
    body: `
      <p class="lead">永興國小的經驗化為種子，<br>在鄰近學校<b>出芽、成樹、成林</b>。</p>
      ${rows([['策盟校群', '依區域相鄰組成校群協作'], ['專家諮詢', '依校群需求遴聘專家入校'], ['跨校共學', '跨校跨級的師生共學與移地學習'], ['共學網絡', '從單一學校，到<b>專業共學網絡</b>']])}
      <div class="quote">單棵樹的力量有限；<em>種樹成林</em>，閱讀才能落實。</div>`,
    cam: { pos: [-1000, 1500, 3300], target: [0, 170, 0] },
    fx: { people: true, fruit: true, region: 'play', replayRegion: true },
    labels: ['region'],
  },
  {
    num: '12', navName: '總覽', built: true, accent: '#24573a',
    kicker: '總覽｜閱讀素養森林',
    title: '讓師培<em>不失培</em>：學校主動施培',
    sub: '由內而外的閱讀推動系統',
    body: `
      <div class="gaps">
        <div><i>土</i><p style="margin:0"><b>土壤｜師培</b><span>一般師培 × 柯華葳閱讀中心</span></p></div>
        <div><i>心</i><p style="margin:0"><b>樹心｜核心</b><span>閱讀教育 × 實證精神</span></p></div>
        <div><i>幹</i><p style="margin:0"><b>主幹｜系統領導</b><span>校長整合需求、資源與成效</span></p></div>
        <div><i>枝</i><p style="margin:0"><b>枝幹｜向外延伸</b><span>資源中心 × 精進教學計畫</span></p></div>
        <div><i>冠</i><p style="margin:0"><b>樹冠｜教師實踐</b><span>增能・共備・入班・蒐證・回饋</span></p></div>
        <div><i>林</i><p style="margin:0"><b>森林｜跨校共學</b><span>家長守護，區域學校成林</span></p></div>
      </div>
      ${flow(['師培', '覺察落差', '學校主動施培', '大樹成林'], 2)}
      <div class="quote">閱讀，是一棵會<em>長成森林</em>的樹。</div>`,
    cam: { pos: [0, 2100, 3900], target: [0, 220, 0] },
    fx: { people: true, fruit: true, region: 'done', orbit: true },
    labels: [],
  },
];
