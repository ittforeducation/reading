/* 大樹成林：各階段文字與鏡頭設定
   ・00 覺察＝講座前段（背景與問題意識），字卡滿版、不搭配大樹
   ・換行用 <br>，重點字用 <b>…</b>；每個階段的 pages 是該階段的各張字卡 */
const A_MAP = `<svg viewBox="0 0 100 100" class="cmap"><polygon points="57,6 66,20 84,30 82,44 91,66 79,93 61,80 37,88 13,57 31,36 45,22"/><polyline points="79,39 37,61 66,60"/>
  <g><circle cx="79" cy="39" r="3.6"/><text x="79" y="40.6">1</text><text class="t" x="84" y="35">芬園鄉</text></g>
  <g><circle cx="37" cy="61" r="3.6"/><text x="37" y="62.6">2</text><text class="t" x="24" y="55">二林鎮</text></g>
  <g><circle cx="66" cy="60" r="3.6"/><text x="66" y="61.6">3</text><text class="t" x="69" y="68">永靖鄉</text></g>
  <text class="c" x="8" y="10">彰化縣</text></svg>`;
const aSchool = (n, name, when, badge, lines) => `<div class="sc"><i>${n}</i><div><h4>${name}<small>${when}</small>${badge ? `<u>${badge}</u>` : ''}</h4>${lines.map(([y, t]) => `<p><b>${y}</b>${t}</p>`).join('')}</div></div>`;
const aBox = (cls, t, items) => `<div class="cb ${cls}"><h5>${t}</h5><ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
const aGap = (list) => list.map(([n, t, d, qn]) => `<div class="gp"><i>${n}</i><div><b>${t}</b><span>${d}</span><em>${qn}</em></div></div>`).join('');
const aIssue = (range, list) => `<div class="issue"><div class="isl"><small>落差 ${range}</small><p>教師接受了培育，<br>不代表專業能力必然成長；</p><p>教師參與了研習，<br>也不代表教學實踐必然改變。</p></div><div class="isr">${aGap(list)}</div></div>`;

const AWAKE = {
  navName: '覺察', built: true, full: true, accent: '#3f7a3a',
  kicker: '覺察｜背景與問題意識',
  title: '師培／<em>失培</em>／施培',
  sub: '系統領導的覺察及策進作為',
  titles: [null,
    '回顧閱讀推動的歷程', '評選指標：98 年版 ▶ <em>108 年修正版</em>', '評選指標：98 年版 ▶ <em>108 年修正版</em>', '閱讀推動者眼中的<em>評選指標</em>',
    '回顧閱讀推動的歷程', '閱讀教育的<em>領導與培育</em>',
    '問題意識：師培為何可能走向<em>失培</em>？', '問題意識：師培為何可能走向<em>失培</em>？', '問題意識：師培為何可能走向<em>失培</em>？',
    '覺察實務現場：教師精進專業的<em>四種樣態</em>', '覺察實務現場：教師精進專業的<em>三個階段</em>'],
  subs: [null,
    '教育部閱讀「個人推手獎」3 座', '教育部獎勵國民中小學推動閱讀績優學校團體及個人評選指標（一）', '教育部獎勵國民中小學推動閱讀績優學校團體及個人評選指標（二）', '從組織與資源，走進課室與學生學習',
    '教育部「閱讀磐石學校獎」5 座', '以閱讀為核心關懷，承擔四重身分，做大支持閱讀教育的有機系統',
    '培育了，不代表能力成長；研習了，不代表教學改變', '培育了，不代表能力成長；研習了，不代表教學改變', '培育了，不代表能力成長；研習了，不代表教學改變',
    '看「專業成長態度」，也看「實際投入行為」', '參與 ▶ 增能 ▶ 實踐共創'],
  pages: [`
    <div class="cover">
      <img src="media/cover.jpg" data-zoom alt="閱讀磐石獎">
      <div class="cv">
        <div class="cv-t"><span>師培</span><i>▶</i><span class="warn">失培</span><i>▶</i><span class="on">施培</span></div>
        <strong>吳寶嘉 博士</strong>
        <p>彰化縣永興國小校長<br>彰化縣偏鄉教育資源中心總召<br>國立彰化師範大學兼任助理教授</p>
      </div>
    </div>`, `
    <div class="mapwrap">${A_MAP}<div class="scs">
      ${aSchool(1, '彰化縣芬園鄉文德國小', '民國 93–105 年｜主任', '', [['2014', '第一座教育部閱讀推手獎'], ['主題', '卓越游牧，以閱為舵']])}
      ${aSchool(2, '彰化縣二林鎮廣興國小', '民國 106–112 年｜校長', '', [['2020', '第二座教育部閱讀推手獎'], ['主題', '山海閱程樂推三石：卡謬觀點實踐']])}
      ${aSchool(3, '彰化縣永靖鄉永興國小', '民國 112 年–迄今｜校長', '', [['2025', '第三座教育部閱讀推手獎'], ['主題', '啟造閱讀三稜鏡，色散教育七彩虹']])}
    </div></div>`, `
    <div class="cmp">
      <h4 class="old">98 年版</h4><h4 class="new">108 年修正版</h4>
      ${aBox('old', '學生閱讀<br>績效與影響', ['閱讀質量／興趣提升', '閱讀能力提升', '個別差異輔導', '知識、情意、技能成長'])}
      ${aBox('new', '學生閱讀學習<br>成效及影響', ['學生閱讀能力及閱讀興趣之提升', '學生閱讀個別差異之輔導及協助', '學生運用閱讀能力進行<b>議題探究</b>'])}
      ${aBox('old', '教師精進', ['教師閱讀專業成長情形', '閱讀教學社群成長情形'])}
      ${aBox('new', '推動專業精進<br>與社群發展', ['閱讀推動人員閱讀專業成長情形', '閱讀推動人員閱讀教學社群成長情形', '閱讀推動組織及成員之<b>專業發展機制</b>'])}
    </div>`, `
    <div class="cmp">
      <h4 class="old">98 年版</h4><h4 class="new">108 年修正版</h4>
      ${aBox('old', '理念、目標<br>及組織架構', [])}
      ${aBox('new', '理念、目標<br>及組織架構', ['閱讀推動之理念及其發展脈絡', '短中長期程目標內涵', '組織架構與人員分工合作'])}
      ${aBox('old', '資源整合<br>營造閱讀環境', ['經營圖書室和閱讀氛圍', '整合各方推動閱讀共享', '提升閱讀服務的效率'])}
      ${aBox('new', '資源整合<br>與環境營造', ['有效整合運用學校內外部資源推動閱讀', '優化閱讀環境，提升學生閱讀學習成效', '資源整合提供學生<b>數位閱讀</b>學習課程'])}
      ${aBox('old', '閱讀教學<br>實施困境突破', ['學校／班級閱讀活動規劃及參與', '閱讀課規劃及圖書館教育', '各領域閱讀策略教學'])}
      ${aBox('new', '閱讀教學<br>規劃與實施', ['閱讀教學計畫、執行及檢核之品質', '圖書館資訊利用教育之規劃及執行', '<b>多元文本閱讀課程</b>之規劃及執行', '各學習領域閱讀策略教學規劃及執行'])}
    </div>`, `
    <div class="cloud">
      <div><span class="s">組織架構</span><span class="m">推動理念</span><span class="s">資源整合</span></div>
      <div><span class="s">環境營造</span><span class="l">閱讀教學規劃</span><span class="s">數位閱讀</span></div>
      <div><span class="s">教學社群</span><span class="xl">學生閱讀學習</span><span class="s">專業成長</span></div>
      <div><span class="s">多元文本</span><span class="l">閱讀策略</span><span class="s">個別差異輔導</span></div>
      <div><span class="s">閱讀興趣</span><span class="l">議題探究</span><span class="s">學習成效</span></div>
      <div><span class="xs">圖書館資訊利用教育</span><span class="s">教學檢核</span><span class="xs">專業發展機制</span></div>
    </div>`, `
    <div class="mapwrap">${A_MAP}<div class="scs">
      ${aSchool(1, '彰化縣芬園鄉文德國小', '民國 93–105 年｜主任', '2 座', [['2012', '桐雪紛飛，戀閱寫鄉人'], ['2016', '看見閱光—生態焦點閱讀實驗']])}
      ${aSchool(2, '彰化縣二林鎮廣興國小', '民國 106–112 年｜校長', '2 座', [['2018', '構閱為渠，廣興桃李'], ['2022', '閱讀母親河，改道開扇原']])}
      ${aSchool(3, '彰化縣永靖鄉永興國小', '民國 112 年–迄今｜校長', '1 座', [['2025', '興閱穩學力，靖讀接永續']])}
    </div></div>`, `
    <div class="pyr">
      <div class="tier t0"><b>閱讀教育的關懷</b></div><div class="role r0">以閱讀為核心關懷，向外承擔四重身分</div>
      <div class="tier t1"><b>學校教學</b></div><div class="role"><small>學校教學</small><b>校長<i>106 年–迄今</i></b><span>學校首席教師</span></div>
      <div class="tier t2"><b>跨校支援</b></div><div class="role"><small>跨校支援</small><b>偏鄉教育資源中心總召<i>113 年–迄今</i></b><span>跨校資源整合與教師增能</span></div>
      <div class="tier t3"><b>閱讀評鑑</b></div><div class="role"><small>閱讀評鑑</small><b>閱讀教育評鑑規劃輔導者<i>110 年–迄今</i></b><span>評鑑規劃與學校輔導</span></div>
      <div class="tier t4"><b>縣級規劃</b></div><div class="role"><small>縣級規劃</small><b>國中小精進教學品質計畫規劃者<i>105 年–迄今</i></b><span>全縣研習、各校社群規劃審查</span></div>
    </div>`,
    aIssue('01–03', [['01', '制度與需求的落差', '師培供給不必然回應學校真實需求', '誰決定教師需要學什麼？'], ['02', '參與與投入的落差', '研習出席不等於積極學習', '教師是為了研習時數，還是為了解決教學問題？'], ['03', '知識與實踐的落差', '知道怎麼教，不等於真正改變教法', '研習內容是否進入課堂？']]),
    aIssue('04–06', [['04', '個體與組織的落差', '少數教師成長不等於全校進步', '如何讓個人經驗成為組織共同的專業資產？'], ['05', '短期與持續的落差', '一次性增能難以支持持續改變', '專業支持是否延伸至教學實施與回饋？'], ['06', '研習與學生學習的落差', '教師研習成果不等於學生學習成效', '是否蒐集學生學習改變的證據？']]),
    aIssue('07–08', [['07', '外部支持與學校能動的落差', '外部資源投入不等於學校具備自主發展能力', '學校能否主動選擇及組織專業資源？'], ['08', '專業發展與系統領導的落差', '教師成長若缺乏整體規劃，易成零散活動', '誰負責整合需求、資源、實踐與成效？']]),
    `
    <div class="quad">
      <div class="ax-y"><span>高度認同</span><b>專業成長態度</b><span>低</span></div>
      <div class="q" style="--c:#4f8a3c"><div class="ql"><small>有心待動型</small><b>第二象限<br>態度積極・行動不足</b></div><div class="qr"><em>支持與陪伴</em><ul><li>時間調整</li><li>同儕共備</li><li>降低實踐門檻</li></ul></div></div>
      <div class="q" style="--c:#1f6b3a"><div class="ql"><small>主動實踐型</small><b>第一象限<br>態度積極・行動積極</b></div><div class="qr"><em>賦權與共創</em><ul><li>教學示範</li><li>社群引領</li><li>創新研發</li></ul></div></div>
      <div class="q" style="--c:#5c7f78"><div class="ql"><small>低度參與型</small><b>第三象限<br>態度消極・行動不足</b></div><div class="qr"><em>關懷與引導</em><ul><li>需求訪談</li><li>成功經驗</li><li>分段任務</li></ul></div></div>
      <div class="q" style="--c:#8a9a3c"><div class="ql"><small>被動配合型</small><b>第四象限<br>態度消極・行動積極</b></div><div class="qr"><em>賦予意義</em><ul><li>教學成果回饋</li><li>專業對話</li><li>提升自主性</li></ul></div></div>
      <div class="ax-x"><span>低度投入</span><b>實際投入行為</b><span>高度投入</span></div>
    </div>`, `
    <div class="phase">
      <div style="--c:#5c8f4a"><small>第一階段・第一年</small><b>啟動參與</b><em>從少數到多數</em><span>先行教師參與、建立示範經驗，<br>鼓勵其他教師加入，<br>逐漸形成共同學習氛圍。</span><u>主要指標：教師參與率、增能需求與回饋</u></div>
      <div style="--c:#3f7a3a"><small>第二階段・第一至第二年</small><b>全面增能</b><em>從多數到全校</em><span>建立全校共同研習制度，<br>形成專業語言，並開始推動<br>課程共備與示範教學。</span><u>主要目標：全校教師研習參與率 100%</u></div>
      <div style="--c:#1f5a34"><small>第三階段・第二至第三年</small><b>實踐共創</b><em>從增能到教學落地</em><span>專業學習轉化為實際教學、<br>課程設計與評量改進，<br>逐步發展自主研究及共創能力。</span><u>從參與、增能，走向實踐共創</u></div>
    </div>`],
  cam: { pos: [-560, 60, 1850], target: [0, 350, 0] },
  fx: {},
  labels: [],
};

/* 施培 01 之後的各階段（文字可直接修改；換行用 <br>，重點字用 <b>…</b>） */
const REST = [
  {
    navName: "施培",
    built: true,
    accent: "#24573a",
    kicker: "施培｜總說",
    title: `<em>施培</em>：土壤・歷程・結果`,
    sub: "從專業養分，到課堂開花結果、區域成林",
    cam: { from: [-300, 1300, 5200], pos: [-560, 60, 1850], target: [0, 350, 0] },
    fx: { grow: true },
    labels: [],
    body: `
      <p class="lead">「樹」閱，從苗木長成一片森林——<br>看<b>學校主動施培</b>的土壤、歷程與結果。</p>
      <div class="tri">
        <div style="--c:#a06a2c"><strong>土壤</strong><i>專業養分</i><span>一般師培 ×<br>柯華葳閱讀研究中心</span></div>
        <div style="--c:#7a5233"><strong>歷程</strong><i>樹心・主幹・枝幹</i><span>校長系統領導，<br>學校主動結盟施培</span></div>
        <div style="--c:#2f7d4f"><strong>結果</strong><i>樹冠・樹蔭・森林</i><span>教師實踐開花結果，<br>區域學校成林</span></div>
      </div>
      <div class="flow "><span class="">土壤</span><i>▶</i><span class="">樹心</span><i>▶</i><span class="">主幹</span><i>▶</i><span class="">枝幹</span><i>▶</i><span class="">樹冠</span><i>▶</i><span class="">森林</span></div>
      <div class="quote">施培：學校<em>主動診斷需求、整合資源</em>，建構專業成長機制。</div>`
  },
  {
    navName: "土壤",
    built: true,
    accent: "#a06a2c",
    kicker: "土壤｜專業養分",
    title: "專業養分從哪裡來？",
    sub: "一般師培 × 清華大學柯華葳教授閱讀研究中心",
    body: `
      <p class="lead">土壤分三層，愈往下愈接近<b>閱讀教育的專業核心</b>。</p>
      <div class="layers">
        <div class="ly c1"><div class="tag-l"><b>表土</b><small>一般師培</small></div><div class="body-l">
          <h4>七種教師知識<small>Shulman（1986；1987）</small></h4>
          <div class="chips"><span>學科內容</span><span>一般教學</span><span>課程</span><span>學科教學 PCK</span><span>學習者特性</span><span>教育情境</span><span>教育目標價值</span></div></div></div>
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
    labels: ["l1", "l2", "l3"]
  },
  {
    navName: "樹心",
    built: true,
    accent: "#b9801a",
    kicker: "歷程｜樹心",
    title: "閱讀教育 × 實證精神",
    sub: "從根部貫穿主幹、直達樹冠的核心",
    cam: { pos: [-460, 260, 1650], target: [0, 320, 0] },
    fx: { core: true, dim: 0.55, rays: 0.4 },
    labels: ["core"],
    body: `
      <p class="lead">每一層的推動，都以<b>學生的閱讀學習</b>為目標，<br>並且用<b>證據</b>檢核：課堂是否真的改變？</p>
      <div class="mini-h">持續專業學習循環</div>
      <div class="flow "><span class="">增能</span><i>▶</i><span class="">共備</span><i>▶</i><span class="">入班</span><i>▶</i><span class="on">蒐證</span><i>▶</i><span class="">回饋</span></div>
      <ul class="rows"><li><b>問對問題</b><span>是否蒐集<b>學生學習改變</b>的證據？</span></li><li><b>長期合作</b><span>從一次研習，走向<b>長期教學合作</b></span></li></ul>
      <div class="quote">關鍵不在辦了幾場研習，而在<em>課堂是否改變</em>。</div>`
  },
  {
    navName: "主幹",
    built: true,
    accent: "#7a5233",
    kicker: "歷程｜主幹與根",
    title: `校長的<em>系統領導</em>`,
    sub: "從單一學校領導，走向跨組織協作與共同改進",
    titles: [null, `三種合作模式的<em>比較分析</em>`, `最佳解方：<em>學校主動結盟</em>`, "永興國小 × 清華大學"],
    subs: [null, "誰決定教師需要接受什麼培育？", "從被動接受，到主動結盟｜學校主動施培的實踐歷程", "「跨文本雙閱讀」合作重點｜系統領導如何實際運作"],
    pages: [
      `
      <div class="pillars">
        <div style="--c:#2f6fb0"><b>課程領導</b><span>診斷教與學的需求</span></div>
        <div style="--c:#7a56b8"><b>教師能動性</b><span>促進教師主動實踐</span></div>
        <div style="--c:#2f7d4f"><b>專業學習</b><span>持續增能與回饋</span></div>
        <div style="--c:#c9772a"><b>跨界協作</b><span>整合大學專家資源</span></div>
      </div>
      <div class="flow sm"><span class="">需求診斷</span><i>▶</i><span class="">資源結盟</span><i>▶</i><span class="">專業增能</span><i>▶</i><span class="">教學實踐</span><i>▶</i><span class="">蒐證回饋</span></div>
      <ul class="rows"><li><b>校內施培</b><span>個別教師 ▶ 教師社群 ▶ <b>全校教師</b></span></li><li><b>校內外整合</b><span>主動連結<b>大學、專家與其他學校</b></span></li></ul>`,
      `
      <div class="tbl">
        <b class="h"></b><b class="h">大學發起</b><b class="h">政策媒合</b><b class="h on">學校主動結盟</b>
        <b>發起主體</b><span>大學、研究團隊</span><span>教育行政機關</span><span class="on">學校、校長或教師團隊</span>
        <b>需求來源</b><span>研究議題與計畫</span><span>政策目標與地方需求</span><span class="on">學生學習與教學問題</span>
        <b>合作形成</b><span>專業邀請、研究合作</span><span>計畫補助、行政媒合</span><span class="on">主動尋找專家、策略結盟</span>
        <b>學校角色</b><span>合作參與者</span><span>計畫執行者</span><span class="on">需求提出者、共同設計者</span>
        <b>核心優勢</b><span>理論、研究與技術</span><span>制度、資源與規模</span><span class="on">在地適切性與學校自主</span>
        <b>潛在限制</b><span>議題與現場可能落差</span><span>行政要求影響彈性</span><span class="on">仰賴領導力與資源連結</span>
        <b>持續條件</b><span>長期研究與實踐合作</span><span>制度及經費支持</span><span class="on">組織能力與穩定夥伴</span>
      </div>`,
      `
      <p class="lead">從「外部提供資源、學校接受培育」，轉為<br><b>學校主動診斷需求、整合資源、共同建構成長機制</b>。</p>
      <div class="steps">
        <div><i>01</i><b>需求<br>診斷</b></div><div><i>02</i><b>主動<br>結盟</b></div><div><i>03</i><b>專業<br>增能</b></div><div><i>04</i><b>課程<br>共備</b></div><div><i>05</i><b>入班<br>實踐</b></div><div><i>06</i><b>蒐證<br>回饋</b></div>
      </div>
      <div class="loop">↺ 蒐證結果回饋下一輪需求診斷，形成<b>持續改進循環</b></div>
      <div class="quote">學校<em>主動結盟</em>，才是閱讀實踐的最佳解方。</div>`,
      `
      <p class="lead">關鍵不是有沒有辦閱讀研習，<br>而是能否說明<b>「為什麼需要這項專業合作」</b>。</p>
      <ul class="rows"><li><b>需求轉換</b><span>辨識學生要提升的<b>閱讀能力</b>與教學支持</span></li><li><b>專業互補</b><span><b>研究專業 × 現場知識</b>，大學與學校互補</span></li><li><b>教學實踐</b><span>理解模式 ▶ 研討文本 ▶ 設計任務 ▶ <b>課堂</b></span></li><li><b>系統領導</b><span>整合教師、行政、家長、研究團隊與經費</span></li></ul>
      <div class="quote">校長不只支持教師參加研習，更要<em>建立支持條件</em>。</div>`
    ],
    depthText: {
      1: `<b>表土</b>：只吸收一般師培的養分，容易停在研習。`,
      2: `<b>次土</b>：向下連結閱讀學理，知道為什麼這樣教。`,
      3: `<b>深土</b>：扎進實踐取徑，與研究團隊共同設計、長期陪伴。`
    },
    cam: { pos: [520, 330, 1650], target: [0, 120, 170] },
    fx: { cut: true, rays: 0, ghost: 0.55, nutri: 0.7, line: 0.45, hl: [1, 0, 0, 0, 0, 0], hlRoot: 1, dim: 0.3, rootDepth: 3 },
    labels: ["l1", "l2", "l3", "trunk"]
  },
  {
    navName: "資源中心",
    built: true,
    accent: "#b07a2a",
    kicker: "歷程｜枝幹・向外延伸",
    title: "偏鄉教育資源中心",
    sub: "彰化縣第 2 區｜服務 7 個鄉鎮、42 所學校",
    titles: [null, `實例：提升<em>閱讀領導力</em>`],
    subs: [null, "打造閱讀優質學校｜專業讓領導有方・八場系列研習"],
    pages: [
      `
      <p class="lead">以永興國小為基地，把一校的經驗，<br>擴大為<b>跨校的專業資源共享與協作</b>。</p>
      <ul class="rows"><li><b>增能共作</b><span>閱讀理解與<b>讀寫合一</b>工作坊</span></li><li><b>諮詢輔導</b><span>策盟校群專家諮詢、<b>入班精進</b></span></li><li><b>學生共學</b><span>數位閱讀、提早寫作主題營隊</span></li><li><b>人才培育</b><span>閱讀推手、種子教師認證、人才庫</span></li></ul>
      <div class="note">政策媒合來的資源，由學校<b>主動組織、主動運用</b>。</div>`,
      `
      <div class="media-r">
        <ol class="sess">
          <li><i>9月</i><span>學校的閱讀教學理念，從何而來？</span></li>
          <li><i>10月</i><span>什麼資源與環境有助讀寫能力？</span></li>
          <li><i>11月</i><span>你看懂不同年級的「國語考卷」嗎？</span></li>
          <li><i>1月</i><span>閱讀課程計畫，會不會徒具其名？</span></li>
          <li><i>2月</i><span>他山之石：計畫不能只有華麗文字</span></li>
          <li><i>3月</i><span>教師在課堂上真的有教閱讀策略嗎？</span></li>
          <li><i>4月</i><span>閱讀教學專業發展社群的經營</span></li>
          <li><i>5月</i><span>如何說服家長接受新世代雙素養？</span></li>
        </ol>
        <figure><img src="media/lead.jpg" data-zoom alt="閱讀領導力研習現場"><figcaption>閱讀領導力研習現場</figcaption></figure>
      </div>`
    ],
    cam: { focus: "limbA", off: [-330, -150, 1050] },
    fx: { graftA: true, hl: [0, 1, 0, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ["res"]
  },
  {
    navName: "精進計畫",
    built: true,
    accent: "#b07a2a",
    kicker: "歷程｜枝幹・社群支持",
    title: "精進教學計畫",
    sub: "彰化縣精進教學計畫｜專業成長是組織的事",
    body: `
      <p class="lead">從校長、主任到教師的領導培能，<br>以<b>教師社群</b>陪伴學校持續精進。</p>
      <ul class="rows"><li><b>初階社群</b><span>共同備課，熟悉閱讀策略</span></li><li><b>進階社群</b><span>課程設計、<b>觀課議課</b>與回饋</span></li><li><b>高階社群</b><span>發展校本模組，<b>帶領他校</b></span></li><li><b>分布領導</b><span>教師社群、共同實踐與<b>分布式領導</b></span></li></ul>
      <div class="note"><b>協作領導</b>：資源中心培養的核心講師，帶領指定社群。</div>`,
    cam: { focus: "bridge", off: [120, -150, 1500] },
    fx: { tiers: true, bridge: true, hl: [0, 0.55, 1, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ["adv", "bridge"]
  },
  {
    navName: "樹冠",
    built: true,
    accent: "#2f7d4f",
    kicker: "結果｜樹冠・第一線教師",
    title: `從接受培訓，到<em>教學實踐</em>`,
    sub: "教師是樹冠上的枝葉與花果",
    titles: [null, `實例：<em>閱見課程新實踐</em>`, "對話：校長 × 清華大學"],
    subs: [null, "共創國語雙閱讀教案，讓閱讀力在課堂中發光", "吳寶嘉校長（彰化縣永興國小）× 陳明蕾教授（國立清華大學）"],
    pages: [
      `
      <p class="lead">專業知識，要<b>轉化為課堂活動</b>才算數。</p>
      <div class="flow "><span class="">理解模式</span><i>▶</i><span class="">研討文本</span><i>▶</i><span class="">設計任務</span><i>▶</i><span class="on">課堂實踐</span></div>
      <ul class="rows"><li><b>共備教案</b><span>國語雙閱讀：低、中、高年級組</span></li><li><b>入班精進</b><span>課室閱讀讀寫<b>公開課</b></span></li><li><b>全校皆動</b><span>先行教師 ▶ 社群 ▶ 年級 ▶ <b>全校</b></span></li><li><b>開花結果</b><span>學生成為<b>雙閱讀優讀者</b></span></li></ul>`,
      `
      <div class="grades">
        <div style="--c:#2f7d4f"><img src="media/low.jpg" data-zoom alt="低年級組工作坊"><b>低年級組</b>
          <span><i>9月</i>連貫性教學設計</span><span><i>11月</i>提升識寫字品質</span><span><i>12月</i>篇章理解與表達</span></div>
        <div style="--c:#2f6fb0"><img src="media/mid.jpg" data-zoom alt="中年級組工作坊"><b>中年級組</b>
          <span><i>9月</i>連貫性教學設計</span><span><i>11月</i>詞彙推論結構監控</span><span><i>12月</i>篇章理解與表達</span></div>
        <div style="--c:#b5562a"><img src="media/high.jpg" data-zoom alt="高年級組工作坊"><b>高年級組</b>
          <span><i>9月</i>連貫性教學設計</span><span><i>11月</i>篇章理解與表達</span><span><i>12月</i>深度學習雙閱讀</span></div>
      </div>`,
      `
      <button class="video" data-video="media/talk.mp4"><img src="media/talk.jpg" alt="對話影片"><span class="play">▶</span><em>點擊播放對話影片（約 3 分鐘）</em></button>`
    ],
    cam: { pos: [-420, 470, 2050], target: [0, 430, 0] },
    fx: { fruit: true, hl: [0, 0, 0, 0, 0.3, 0], rays: 1 },
    labels: ["canopy"]
  },
  {
    navName: "歸根",
    built: true,
    accent: "#b8742a",
    kicker: "結果｜落葉歸根",
    title: `研究 × 實務的<em>夥伴關係</em>`,
    sub: "Research–Practice Partnerships（RPPs）",
    body: `
      <p class="lead">大學提供<b>研究與專業知識</b>，教師提供<b>現場知識</b>；<br>課堂的證據再回到學理，循環不息。</p>
      <ul class="rows"><li><b>定義需求</b><span>先辨識學生學習問題，再確立<b>專業支持</b></span></li><li><b>共同設計</b><span>大學與教師<b>共同協商</b>培育內容與方式</span></li><li><b>長期陪伴</b><span>增能 ▶ 共備 ▶ 入班 ▶ 蒐證 ▶ <b>回饋</b></span></li><li><b>全校皆動</b><span>先行教師 ▶ 社群 ▶ 年級 ▶ <b>全校教師</b></span></li><li><b>跨校共學</b><span>以資源中心促進<b>資源共享與跨校協作</b></span></li></ul>`,
    cam: { pos: [980, 360, 1800], target: [0, 190, 200] },
    fx: { cut: true, leaves: true, fruit: true, ghost: 0.6, line: 0.6, nutri: 0.8, nutriDir: -1, rays: 0.3, rootDepth: 3 },
    labels: ["leaf", "l1", "l2", "l3"]
  },
  {
    navName: "樹蔭",
    built: true,
    accent: "#2f6fb0",
    kicker: "結果｜樹蔭下的人",
    title: "學生與家長",
    sub: "護樹・愛樹・水土保持",
    body: `
      <p class="lead">大樹要長得更茁壯，<br>需要<b>樹蔭下的人</b>一起守護。</p>
      <ul class="rows"><li><b>家長溝通</b><span>理解新世代的<b>雙閱讀素養</b></span></li><li><b>資源募集</b><span>家長與社區支持，擴大實施規模</span></li><li><b>親子共學</b><span>跨主題社區親師生共學</span></li><li><b>學生營隊</b><span>數位閱讀、提早寫作主題學習</span></li></ul>
      <div class="quote">教學要持續運作，需要<em>親師一起</em>撐起支持條件。</div>`,
    cam: { pos: [240, 95, 1000], target: [0, 100, 250] },
    fx: { people: true, fruit: true, rays: 1 },
    labels: ["people"]
  },
  {
    navName: "共學",
    built: true,
    accent: "#2f7d4f",
    kicker: "結果｜跨校共學成林",
    title: `從單校發展，到<em>跨校共學</em>`,
    sub: "系統領導如何擴大專業培育的效益",
    body: `
      <p class="lead">永興國小的經驗化為種子，<br>在鄰近學校<b>出芽、成樹、成林</b>。</p>
      <ul class="rows"><li><b>策盟校群</b><span>依區域相鄰組成校群協作</span></li><li><b>專家諮詢</b><span>依校群需求遴聘專家入校</span></li><li><b>跨校共學</b><span>跨校跨級的師生共學與移地學習</span></li><li><b>共學網絡</b><span>從單一學校，到<b>專業共學網絡</b></span></li></ul>
      <div class="quote">單棵樹的力量有限；<em>種樹成林</em>，閱讀才能落實。</div>`,
    cam: { pos: [-1000, 1500, 3300], target: [0, 170, 0] },
    fx: { people: true, fruit: true, region: "play", replayRegion: true },
    labels: ["region"]
  },
  {
    navName: "總結",
    built: true,
    accent: "#24573a",
    kicker: "總結｜閱讀素養森林",
    title: `學校主動<em>施培</em>，大樹成林`,
    sub: "由內而外的閱讀推動系統",
    cam: { pos: [0, 2100, 3900], target: [0, 220, 0] },
    fx: { people: true, fruit: true, region: "done", orbit: true },
    labels: [],
    body: `
      <div class="gaps"><div><i>土</i><p style="margin:0"><b>土壤｜專業養分</b><span>一般師培 × 柯華葳閱讀中心</span></p></div><div><i>心</i><p style="margin:0"><b>樹心｜核心</b><span>閱讀教育 × 實證精神</span></p></div><div><i>幹</i><p style="margin:0"><b>主幹｜系統領導</b><span>校長整合需求、資源與成效</span></p></div><div><i>枝</i><p style="margin:0"><b>枝幹｜向外延伸</b><span>資源中心 × 精進教學計畫</span></p></div><div><i>冠</i><p style="margin:0"><b>樹冠｜教師實踐</b><span>增能・共備・入班・蒐證・回饋</span></p></div><div><i>林</i><p style="margin:0"><b>森林｜跨校共學</b><span>家長守護，區域學校成林</span></p></div></div>
      <div class="flow "><span class="">土壤</span><i>▶</i><span class="">歷程</span><i>▶</i><span class="">結果</span><i>▶</i><span class="on">大樹成林</span></div>
      <div class="finale"><div class="fin-l"><b>願每一所學校，都長成孩子閱讀的大樹；</b><b>願每一棵大樹，連成一片<em>閱讀的森林</em>。</b></div><div class="fin-r"><strong>感謝聆聽</strong><span>敬請指教</span></div></div>`
  }
];
window.FOREST_STAGES = [AWAKE, ...REST];
window.FOREST_STAGES.forEach((s, i) => { s.num = String(i).padStart(2, '0'); });
