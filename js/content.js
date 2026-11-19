/* 大樹成林：各階段文字與鏡頭設定（文字可直接修改）
   ・換行用 <br>，重點字用 <b>…</b>
   ・cam = 鏡頭位置 pos / 注視點 target；fx = 該階段的畫面效果 */
const rows = (list) => '<ul class="rows">' + list.map(([k, t]) => `<li><b>${k}</b><span>${t}</span></li>`).join('') + '</ul>';
const flow = (list, on = -1, cls = '') => '<div class="flow ' + cls + '">' + list.map((t, i) => `<span class="${i === on ? 'on' : ''}">${t}</span>`).join('<i>▶</i>') + '</div>';

const qs = (list) => '<div class="gaps">' + list.map(([n, b, t]) => `<div><i>${n}</i><p style="margin:0"><b>${b}</b><span>${t}</span></p></div>`).join('') + '</div>';
const loop = (t) => `<div class="loop">↺ ${t}</div>`;

window.FOREST_STAGES = [
  {
    num: '00', navName: '開場', built: true, accent: '#24573a',
    kicker: '開場',
    title: '<em>施培</em>：土壤・歷程・結果',
    sub: '從專業養分，到課堂開花結果、區域成林',
    titles: [null, '系統領導 × <em>教師專業發展</em>'],
    subs: [null, '教師專業成長，需要領導者建立持續支持的組織與跨界協作系統'],
    pages: [`
      <p class="lead">一棵神木，從苗木長成一片森林——<br>看<b>學校主動施培</b>的土壤、歷程與結果。</p>
      <div class="tri">
        <div style="--c:#a06a2c"><strong>土壤</strong><i>專業養分</i><span>一般師培 ×<br>柯華葳閱讀研究中心</span></div>
        <div style="--c:#7a5233"><strong>歷程</strong><i>樹心・主幹・枝幹</i><span>校長系統領導，<br>學校主動結盟施培</span></div>
        <div style="--c:#2f7d4f"><strong>結果</strong><i>樹冠・樹蔭・森林</i><span>教師實踐開花結果，<br>區域學校成林</span></div>
      </div>
      ${flow(['土壤', '樹心', '主幹', '枝幹', '樹冠', '森林'])}
      <div class="quote">施培：學校<em>主動診斷需求、整合資源</em>，建構專業成長機制。</div>`, `
      <div class="mini-h">施培歷程中的八個關鍵提問</div>
      ${qs([['01', '領導邊界，應止於校門嗎？', '從學校領導轉向系統領導'], ['02', '專業發展，由誰決定？', '從外部供給轉向學校需求診斷'], ['03', '教師為什麼願意改變？', '專業態度、能動性與實際投入'], ['04', '是個人的事，還是組織的事？', '教師社群、共同實踐、分布式領導'], ['05', '大學專業，如何進入現場？', '跨界結盟與持續性專業支持'], ['06', '誰來整合這一切？', '系統領導下的學校主動施培'], ['07', '從一次研習到長期合作', '增能、共備、入班、蒐證與回饋'], ['08', '從單一學校到共學網絡', '系統領導擴大專業培育效益']])}`],
    cam: { from: [-300, 1300, 5200], pos: [-560, 60, 1850], target: [0, 350, 0] },
    fx: { grow: true },
    labels: [],
  },
  {
    num: '01', navName: '土壤', built: true, accent: '#a06a2c',
    kicker: '土壤｜專業養分',
    title: '專業養分從哪裡來？',
    sub: '一般師培 × 清華大學柯華葳教授閱讀研究中心',
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
    labels: ['l1', 'l2', 'l3'],
  },
  {
    num: '02', navName: '樹心', built: true, accent: '#b9801a',
    kicker: '歷程｜樹心',
    title: '閱讀教育 × 實證精神',
    sub: '從根部貫穿主幹、直達樹冠的核心',
    titles: [null, '兩種取向的<em>概念對照</em>'],
    subs: [null, '差別在：活動結束就結束，還是形成持續改進的循環'],
    pages: [`
      <p class="lead">每一層的推動，都以<b>學生的閱讀學習</b>為目標，<br>並且用<b>證據</b>檢核：課堂是否真的改變？</p>
      <div class="mini-h">持續專業學習循環</div>
      ${flow(['增能', '共備', '入班', '蒐證', '回饋'], 3)}
      ${rows([['問對問題', '是否蒐集<b>學生學習改變</b>的證據？'], ['長期合作', '從一次研習，走向<b>長期教學合作</b>']])}
      <div class="quote">關鍵不在辦了幾場研習，而在<em>課堂是否改變</em>。</div>`, `
      <div class="vs">
        <div class="col gray"><h4>一般專業供給取向<small>可能的運作方式</small></h4>
          <span>大學提出方案</span><i>▼</i><span>學校參與研習</span><i>▼</i><span>教師接受培訓</span><i>▼</i><span class="end">活動結束</span></div>
        <div class="col on"><h4>學校主動施培取向<small>建議強調的實踐機制</small></h4>
          <span>學校診斷需求</span><i>▼</i><span>主動專業結盟</span><i>▼</i><span>共同增能與實踐</span><i>▼</i><span class="end">蒐證回饋與持續改進</span></div>
      </div>
      ${loop('蒐證結果回饋下一輪需求診斷，形成<b>持續改進循環</b>')}`],
    cam: { pos: [-460, 260, 1650], target: [0, 320, 0] },
    fx: { core: true, dim: 0.55, rays: 0.4 },
    labels: ['core'],
  },
  {
    num: '03', navName: '主幹', built: true, accent: '#7a5233',
    kicker: '歷程｜主幹與根',
    title: '校長的<em>系統領導</em>',
    sub: '從單一學校領導，走向跨組織協作與共同改進',
    titles: [null, '永興國小 × 清華大學', '三種合作模式的<em>比較分析</em>', '最佳解方：<em>學校主動結盟</em>'],
    subs: [null, '「跨文本雙閱讀」合作重點｜系統領導如何實際運作', '誰決定教師需要接受什麼培育？', '從被動接受，到主動結盟｜學校主動施培的實踐歷程'],
    pages: [`
      <div class="pillars">
        <div style="--c:#2f6fb0"><b>課程領導</b><span>診斷教與學的需求</span></div>
        <div style="--c:#7a56b8"><b>教師能動性</b><span>促進教師主動實踐</span></div>
        <div style="--c:#2f7d4f"><b>專業學習</b><span>持續增能與回饋</span></div>
        <div style="--c:#c9772a"><b>跨界協作</b><span>整合大學專家資源</span></div>
      </div>
      ${flow(['需求診斷', '資源結盟', '專業增能', '教學實踐', '蒐證回饋'], -1, 'sm')}
      ${rows([['校內施培', '個別教師 ▶ 教師社群 ▶ <b>全校教師</b>'], ['校內外整合', '主動連結<b>大學、專家與其他學校</b>']])}`, `
      <p class="lead">關鍵不是有沒有辦閱讀研習，<br>而是能否說明<b>「為什麼需要這項專業合作」</b>。</p>
      ${rows([['需求轉換', '辨識學生要提升的<b>閱讀能力</b>與教學支持'], ['專業互補', '<b>研究專業 × 現場知識</b>，大學與學校互補'], ['教學實踐', '理解模式 ▶ 研討文本 ▶ 設計任務 ▶ <b>課堂</b>'], ['系統領導', '整合教師、行政、家長、研究團隊與經費']])}
      <div class="quote">校長不只支持教師參加研習，更要<em>建立支持條件</em>。</div>`, `
      <div class="tbl">
        <b class="h"></b><b class="h">大學發起</b><b class="h">政策媒合</b><b class="h on">學校主動結盟</b>
        <b>發起主體</b><span>大學、研究團隊</span><span>教育行政機關</span><span class="on">學校、校長或教師團隊</span>
        <b>需求來源</b><span>研究議題與計畫</span><span>政策目標與地方需求</span><span class="on">學生學習與教學問題</span>
        <b>合作形成</b><span>專業邀請、研究合作</span><span>計畫補助、行政媒合</span><span class="on">主動尋找專家、策略結盟</span>
        <b>學校角色</b><span>合作參與者</span><span>計畫執行者</span><span class="on">需求提出者、共同設計者</span>
        <b>核心優勢</b><span>理論、研究與技術</span><span>制度、資源與規模</span><span class="on">在地適切性與學校自主</span>
        <b>潛在限制</b><span>議題與現場可能落差</span><span>行政要求影響彈性</span><span class="on">仰賴領導力與資源連結</span>
        <b>持續條件</b><span>長期研究與實踐合作</span><span>制度及經費支持</span><span class="on">組織能力與穩定夥伴</span>
      </div>`, `
      <p class="lead">從「外部提供資源、學校接受培育」，轉為<br><b>學校主動診斷需求、整合資源、共同建構成長機制</b>。</p>
      <div class="steps">
        <div><i>01</i><b>需求<br>診斷</b></div><div><i>02</i><b>主動<br>結盟</b></div><div><i>03</i><b>專業<br>增能</b></div><div><i>04</i><b>課程<br>共備</b></div><div><i>05</i><b>入班<br>實踐</b></div><div><i>06</i><b>蒐證<br>回饋</b></div>
      </div>
      ${loop('蒐證結果回饋下一輪需求診斷，形成<b>持續改進循環</b>')}
      <div class="quote">學校<em>主動結盟</em>，才是閱讀實踐的最佳解方。</div>`],
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
    num: '04', navName: '資源中心', built: true, accent: '#b07a2a',
    kicker: '歷程｜枝幹・向外延伸',
    title: '偏鄉教育資源中心',
    sub: '彰化縣第 2 區｜服務 7 個鄉鎮、42 所學校',
    titles: [null, '實例：提升<em>閱讀領導力</em>'],
    subs: [null, '打造閱讀優質學校｜專業讓領導有方・八場系列研習'],
    pages: [`
      <p class="lead">以永興國小為基地，把一校的經驗，<br>擴大為<b>跨校的專業資源共享與協作</b>。</p>
      ${rows([['增能共作', '閱讀理解與<b>讀寫合一</b>工作坊'], ['諮詢輔導', '策盟校群專家諮詢、<b>入班精進</b>'], ['學生共學', '數位閱讀、提早寫作主題營隊'], ['人才培育', '閱讀推手、種子教師認證、人才庫']])}
      <div class="note">政策媒合來的資源，由學校<b>主動組織、主動運用</b>。</div>`, `
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
      </div>`],
    cam: { focus: 'limbA', off: [-330, -150, 1050] },
    fx: { graftA: true, hl: [0, 1, 0, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ['res'],
  },
  {
    num: '05', navName: '精進計畫', built: true, accent: '#b07a2a',
    kicker: '歷程｜枝幹・社群支持',
    title: '精進教學計畫',
    sub: '彰化縣精進教學計畫｜專業成長是組織的事',
    body: `
      <p class="lead">從校長、主任到教師的領導培能，<br>以<b>教師社群</b>陪伴學校持續精進。</p>
      ${rows([['初階社群', '共同備課，熟悉閱讀策略'], ['進階社群', '課程設計、<b>觀課議課</b>與回饋'], ['高階社群', '發展校本模組，<b>帶領他校</b>'], ['分布領導', '教師社群、共同實踐與<b>分布式領導</b>']])}
      <div class="note"><b>協作領導</b>：資源中心培養的核心講師，帶領指定社群。</div>`,
    cam: { focus: 'bridge', off: [120, -150, 1500] },
    fx: { tiers: true, bridge: true, hl: [0, 0.55, 1, 0, 0, 0], dim: 0.45, rays: 0.5 },
    labels: ['adv', 'bridge'],
  },
  {
    num: '06', navName: '樹冠', built: true, accent: '#2f7d4f',
    kicker: '結果｜樹冠・第一線教師',
    title: '從接受培訓，到<em>教學實踐</em>',
    sub: '教師是樹冠上的枝葉與花果',
    titles: [null, '先診斷：<em>教師四象限</em>', '施培三階段', '實例：<em>閱見課程新實踐</em>'],
    subs: [null, '教師為什麼願意改變？看「態度」，也看「實際投入」', '從參與到實踐，再到自主共創', '共創國語雙閱讀教案，讓閱讀力在課堂中發光'],
    pages: [`
      <p class="lead">專業知識，要<b>轉化為課堂活動</b>才算數。</p>
      ${flow(['理解模式', '研討文本', '設計任務', '課堂實踐'], 3)}
      ${rows([['共備教案', '國語雙閱讀：低、中、高年級組'], ['入班精進', '課室閱讀讀寫<b>公開課</b>'], ['全校皆動', '先行教師 ▶ 社群 ▶ 年級 ▶ <b>全校</b>'], ['開花結果', '學生成為<b>雙閱讀優讀者</b>']])}`, `
      <div class="quad">
        <div class="ax-y"><span>高度認同</span><b>專業成長態度</b><span>低</span></div>
        <div class="q" style="--c:#7a56b8"><div class="ql"><small>有心待動型</small><b>態度積極<br>行動不足</b></div><div class="qr"><em>支持與陪伴</em><ul><li>時間調整</li><li>同儕共備</li><li>降低門檻</li></ul></div></div>
        <div class="q" style="--c:#1f8a78"><div class="ql"><small>主動實踐型</small><b>態度積極<br>行動積極</b></div><div class="qr"><em>賦權與共創</em><ul><li>教學示範</li><li>社群引領</li><li>創新研發</li></ul></div></div>
        <div class="q" style="--c:#5b6f8f"><div class="ql"><small>低度參與型</small><b>態度消極<br>行動不足</b></div><div class="qr"><em>關懷與引導</em><ul><li>需求訪談</li><li>成功經驗</li><li>分段任務</li></ul></div></div>
        <div class="q" style="--c:#a2559a"><div class="ql"><small>被動配合型</small><b>態度消極<br>行動積極</b></div><div class="qr"><em>賦予意義</em><ul><li>教學成果回饋</li><li>專業對話</li><li>提升自主</li></ul></div></div>
        <div class="ax-x"><span>低度投入</span><b>實際投入行為</b><span>高度投入</span></div>
      </div>
      <div class="note">先<b>診斷教師在哪一象限</b>，再決定用什麼策略支持。</div>`, `
      <div class="phase">
        <div style="--c:#2f6fb0"><small>第一階段・第一年</small><b>啟動參與</b><em>從少數到多數</em><span>先行教師參與，<br>建立示範經驗，<br>鼓勵其他教師加入</span><u>指標：參與率與回饋</u></div>
        <div style="--c:#7a56b8"><small>第二階段・第一至二年</small><b>全面增能</b><em>從多數到全校</em><span>建立全校共同研習制度，<br>形成專業語言，<br>推動共備與示範教學</span><u>目標：全校參與 100%</u></div>
        <div style="--c:#1f8a78"><small>第三階段・第二至三年</small><b>實踐共創</b><em>從增能到落地</em><span>專業學習轉化為教學、<br>課程設計與評量改進，<br>發展自主研究與共創</span><u>成果：教學與評量改進</u></div>
      </div>
      ${flow(['參與', '增能', '實踐共創'], 2)}`, `
      <div class="grades">
        <div style="--c:#2f7d4f"><img src="media/low.jpg" data-zoom alt="低年級組工作坊"><b>低年級組</b>
          <span><i>9月</i>連貫性教學設計</span><span><i>11月</i>提升識寫字品質</span><span><i>12月</i>篇章理解與表達</span></div>
        <div style="--c:#2f6fb0"><img src="media/mid.jpg" data-zoom alt="中年級組工作坊"><b>中年級組</b>
          <span><i>9月</i>連貫性教學設計</span><span><i>11月</i>詞彙推論結構監控</span><span><i>12月</i>篇章理解與表達</span></div>
        <div style="--c:#b5562a"><img src="media/high.jpg" data-zoom alt="高年級組工作坊"><b>高年級組</b>
          <span><i>9月</i>連貫性教學設計</span><span><i>11月</i>篇章理解與表達</span><span><i>12月</i>深度學習雙閱讀</span></div>
      </div>`],
    cam: { pos: [-420, 470, 2050], target: [0, 430, 0] },
    fx: { fruit: true, hl: [0, 0, 0, 0, 0.3, 0], rays: 1 },
    labels: ['canopy'],
  },
  {
    num: '07', navName: '歸根', built: true, accent: '#b8742a',
    kicker: '結果｜落葉歸根',
    title: '研究 × 實務的<em>夥伴關係</em>',
    sub: 'Research–Practice Partnerships（RPPs）',
    body: `
      <p class="lead">大學提供<b>研究與專業知識</b>，教師提供<b>現場知識</b>；<br>課堂的證據再回到學理，循環不息。</p>
      ${rows([['定義需求', '先辨識學生學習問題，再確立<b>專業支持</b>'], ['共同設計', '大學與教師<b>共同協商</b>培育內容與方式'], ['長期陪伴', '增能 ▶ 共備 ▶ 入班 ▶ 蒐證 ▶ <b>回饋</b>'], ['全校皆動', '先行教師 ▶ 社群 ▶ 年級 ▶ <b>全校教師</b>'], ['跨校共學', '以資源中心促進<b>資源共享與跨校協作</b>']])}`,
    cam: { pos: [980, 360, 1800], target: [0, 190, 200] },
    fx: { cut: true, leaves: true, fruit: true, ghost: 0.6, line: 0.6, nutri: 0.8, nutriDir: -1, rays: 0.3, rootDepth: 3 },
    labels: ['leaf', 'l1', 'l2', 'l3'],
  },
  {
    num: '08', navName: '樹蔭', built: true, accent: '#2f6fb0',
    kicker: '結果｜樹蔭下的人',
    title: '學生與家長',
    sub: '護樹・愛樹・水土保持',
    body: `
      <p class="lead">大樹要長得更茁壯，<br>需要<b>樹蔭下的人</b>一起守護。</p>
      ${rows([['家長溝通', '理解新世代的<b>雙閱讀素養</b>'], ['資源募集', '家長與社區支持，擴大實施規模'], ['親子共學', '跨主題社區親師生共學'], ['學生營隊', '數位閱讀、提早寫作主題學習']])}
      <div class="quote">教學要持續運作，需要<em>親師一起</em>撐起支持條件。</div>`,
    cam: { pos: [240, 95, 1000], target: [0, 100, 250] },
    fx: { people: true, fruit: true, rays: 1 },
    labels: ['people'],
  },
  {
    num: '09', navName: '區域', built: true, accent: '#2f7d4f',
    kicker: '結果｜區域學校成林',
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
    num: '10', navName: '總覽', built: true, accent: '#24573a',
    kicker: '總覽｜閱讀素養森林',
    title: '學校主動<em>施培</em>，大樹成林',
    sub: '由內而外的閱讀推動系統',
    titles: [null, '對話：校長 × 清華大學'],
    subs: [null, '吳寶嘉校長（彰化縣永興國小）× 陳明蕾教授（國立清華大學）'],
    pages: [`
      ${qs([['土', '土壤｜專業養分', '一般師培 × 柯華葳閱讀中心'], ['心', '樹心｜核心', '閱讀教育 × 實證精神'], ['幹', '主幹｜系統領導', '校長整合需求、資源與成效'], ['枝', '枝幹｜向外延伸', '資源中心 × 精進教學計畫'], ['冠', '樹冠｜教師實踐', '增能・共備・入班・蒐證・回饋'], ['林', '森林｜跨校共學', '家長守護，區域學校成林']])}
      ${flow(['土壤', '歷程', '結果', '大樹成林'], 3)}
      <div class="quote">閱讀，是一棵會<em>長成森林</em>的樹。</div>`, `
      <button class="video" data-video="media/talk.mp4"><img src="media/talk.jpg" alt="對話影片"><span class="play">▶</span><em>點擊播放對話影片（約 3 分鐘）</em></button>`],
    cam: { pos: [0, 2100, 3900], target: [0, 220, 0] },
    fx: { people: true, fruit: true, region: 'done', orbit: true },
    labels: [],
  },
];
