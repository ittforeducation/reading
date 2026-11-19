/* 大樹成林｜閱讀素養推動系統 — 主程式（three.js r170；樹木生成參考 ez-tree, MIT） */
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // g:three
  var require_three = __commonJS({
    "g:three"(exports, module) {
      module.exports = window.THREE;
    }
  });

  // g:three/examples/jsm/controls/OrbitControls.js
  var require_OrbitControls = __commonJS({
    "g:three/examples/jsm/controls/OrbitControls.js"(exports, module) {
      module.exports = window.THREE_ADDONS;
    }
  });

  // g:three/examples/jsm/renderers/CSS2DRenderer.js
  var require_CSS2DRenderer = __commonJS({
    "g:three/examples/jsm/renderers/CSS2DRenderer.js"(exports, module) {
      module.exports = window.THREE_ADDONS;
    }
  });

  // g:three/examples/jsm/loaders/GLTFLoader.js
  var require_GLTFLoader = __commonJS({
    "g:three/examples/jsm/loaders/GLTFLoader.js"(exports, module) {
      module.exports = window.THREE_ADDONS;
    }
  });

  // src/app.js
  var THREE4 = __toESM(require_three());
  var import_OrbitControls = __toESM(require_OrbitControls());
  var import_CSS2DRenderer = __toESM(require_CSS2DRenderer());
  var import_GLTFLoader = __toESM(require_GLTFLoader());

  // src/treegen.js
  var THREE = __toESM(require_three());
  var RNG = class {
    constructor(seed) {
      this.mask = 4294967295;
      this.m_w = 123456789 + seed & this.mask;
      this.m_z = 987654321 - seed & this.mask;
    }
    random(max = 1, min = 0) {
      this.m_z = 36969 * (this.m_z & 65535) + (this.m_z >> 16) & this.mask;
      this.m_w = 18e3 * (this.m_w & 65535) + (this.m_w >> 16) & this.mask;
      let r = (this.m_z << 16) + (this.m_w & 65535) >>> 0;
      r /= 4294967296;
      return (max - min) * r + min;
    }
  };
  var UP = new THREE.Vector3(0, 1, 0);
  function buildSkeleton(o, rng, roots2) {
    const out = [];
    const queue = [];
    if (roots2) {
      for (const r of roots2) {
        queue.push({ parent: -1, level: 0, origin: r.origin.clone(), quat: r.quat.clone(), length: r.length, radius: r.radius, startT: r.startT ?? 0, terminal: false, sections: o.sections[0], segs: o.segments[0] });
      }
    } else {
      queue.push({ parent: -1, level: 0, origin: new THREE.Vector3(), quat: new THREE.Quaternion(), length: o.length[0], radius: o.radius[0], startT: 0, terminal: false, sections: o.sections[0], segs: o.segments[0] });
    }
    const qForce = new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(o.force.x, o.force.y, o.force.z).normalize());
    while (queue.length) {
      const b = queue.shift();
      const rec = { id: out.length, parent: b.parent, level: b.level, startT: b.startT, terminal: b.terminal, sections: [], segs: b.segs, leaves: [] };
      out.push(rec);
      let q = b.quat.clone();
      const origin = b.origin.clone();
      const secLen = b.length / b.sections;
      for (let i = 0; i <= b.sections; i++) {
        let r = b.radius;
        if (i === b.sections && b.level === o.levels) r = 1e-3;
        else r *= 1 - o.taper[b.level] * (i / b.sections);
        rec.sections.push({ origin: origin.clone(), quat: q.clone(), radius: r });
        origin.add(new THREE.Vector3(0, secLen, 0).applyQuaternion(q));
        const g = Math.max(1, 1 / Math.sqrt(Math.max(r, 1e-3))) * o.gnarliness[b.level];
        const e = new THREE.Euler().setFromQuaternion(q);
        e.x += rng.random(g, -g);
        e.z += rng.random(g, -g);
        q.setFromEuler(e);
        q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, o.twist[b.level]));
        q.rotateTowards(qForce, o.force.strength / Math.max(r, 0.05));
      }
      const secs = rec.sections;
      const last = secs[secs.length - 1];
      if (b.level < o.levels) {
        queue.push({ parent: rec.id, level: b.level + 1, origin: last.origin.clone(), quat: last.quat.clone(), length: o.length[b.level + 1] * (o.terminalScale ?? 1), radius: last.radius, startT: 1, terminal: true, sections: b.sections, segs: b.segs });
        const count = o.children[b.level];
        const radialOffset = rng.random();
        const lvl = b.level + 1;
        for (let i = 0; i < count; i++) {
          const t = rng.random(1, o.start[lvl]);
          const si = Math.floor(t * (secs.length - 1));
          const A2 = secs[si], B = secs[Math.min(si + 1, secs.length - 1)];
          const a = (t - si / (secs.length - 1)) * (secs.length - 1);
          const cOrigin = new THREE.Vector3().lerpVectors(A2.origin, B.origin, a);
          const cRadius = o.radius[lvl] * ((1 - a) * A2.radius + a * B.radius);
          const pq = B.quat.clone().slerp(A2.quat, a);
          const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(o.angle[lvl]));
          const q2 = new THREE.Quaternion().setFromAxisAngle(UP, 2 * Math.PI * (radialOffset + i / count));
          const cq = pq.clone().multiply(q2.multiply(q1));
          queue.push({ parent: rec.id, level: lvl, origin: cOrigin, quat: cq, length: o.length[lvl], radius: cRadius, startT: t, terminal: false, sections: o.sections[lvl], segs: o.segments[lvl] });
        }
      } else if (o.leaves) {
        const L = o.leaves;
        const radialOffset = rng.random();
        for (let i = 0; i < L.count; i++) {
          const t = rng.random(1, L.start);
          const si = Math.floor(t * (secs.length - 1));
          const A2 = secs[si], B = secs[Math.min(si + 1, secs.length - 1)];
          const a = (t - si / (secs.length - 1)) * (secs.length - 1);
          const lo = new THREE.Vector3().lerpVectors(A2.origin, B.origin, a);
          const pq = B.quat.clone().slerp(A2.quat, a);
          const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(L.angle));
          const q2 = new THREE.Quaternion().setFromAxisAngle(UP, 2 * Math.PI * (radialOffset + i / L.count));
          rec.leaves.push({ origin: lo, quat: pq.clone().multiply(q2.multiply(q1)), size: L.size * (1 + rng.random(L.sizeVariance, -L.sizeVariance)), t });
        }
        rec.leaves.push({ origin: last.origin.clone(), quat: last.quat.clone(), size: L.size * (1 + rng.random(L.sizeVariance, -L.sizeVariance)), t: 1 });
      }
    }
    out.forEach((r) => r.children = []);
    out.forEach((r) => {
      if (r.parent >= 0) out[r.parent].children.push(r.id);
    });
    return out;
  }
  function assignGrowth(skel, timing, leafTiming) {
    for (const r of skel) {
      const parent = r.parent >= 0 ? skel[r.parent] : null;
      const g = timing(r, parent);
      r.birth = g.birth;
      r.dur = g.dur;
      for (const lf of r.leaves) {
        const lg = leafTiming(r, lf);
        lf.birth = lg.birth;
        lf.dur = lg.dur;
      }
    }
  }
  function ancestry(skel, r) {
    const chain = [];
    let c = r;
    while (c) {
      chain.unshift(c);
      c = c.parent >= 0 ? skel[c.parent] : null;
    }
    return chain;
  }
  function buildBranchGeometry(skel, opts) {
    const pos = [], nor = [], uv = [], idx = [];
    const A2 = [[], [], [], [], []];
    const G0 = [], G1 = [], G2 = [];
    const tmpV = new THREE.Vector3(), tmpN = new THREE.Vector3();
    for (const r of skel) {
      const chain = ancestry(skel, r);
      const anchors = [0, 1, 2, 3, 4].map((k) => chain[k] ? chain[k].sections[0].origin : null);
      const gw = [0, 1, 2, 3, 4].map((k) => chain[k] ? [chain[k].birth, chain[k].dur] : [-1, 0]);
      const part = opts.partOf(r);
      const base = pos.length / 3;
      const N = r.segs;
      const lobePhase = opts.rngLobe ? opts.rngLobe() : 0;
      const uRep = Math.max(1, Math.round(2 * Math.PI * r.sections[0].radius / (opts.texSize ?? 10)));
      let acc = 0;
      r.sections.forEach((s, i) => {
        if (i > 0) acc += s.origin.distanceTo(r.sections[i - 1].origin);
        for (let j = 0; j <= N; j++) {
          const ang = 2 * Math.PI * (j % N) / N;
          let rad = s.radius;
          if (opts.shape) rad *= opts.shape(r, i, ang, lobePhase);
          tmpN.set(Math.cos(ang), 0, Math.sin(ang)).applyQuaternion(s.quat).normalize();
          tmpV.set(Math.cos(ang) * rad, 0, Math.sin(ang) * rad).applyQuaternion(s.quat).add(s.origin);
          pos.push(tmpV.x, tmpV.y, tmpV.z);
          nor.push(tmpN.x, tmpN.y, tmpN.z);
          uv.push(j / N * uRep, acc / (opts.texSize ?? 10));
          for (let k = 0; k < 5; k++) {
            const a = anchors[k] || anchors[0];
            A2[k].push(a.x, a.y, a.z);
          }
          G0.push(gw[0][0], gw[0][1], gw[1][0], gw[1][1]);
          G1.push(gw[2][0], gw[2][1], gw[3][0], gw[3][1]);
          G2.push(gw[4][0], gw[4][1], part, 0);
        }
      });
      const M = N + 1;
      for (let i = 0; i < r.sections.length - 1; i++) {
        for (let j = 0; j < N; j++) {
          const v1 = base + i * M + j, v2 = v1 + 1, v3 = v1 + M, v4 = v2 + M;
          idx.push(v1, v3, v2, v2, v3, v4);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    for (let k = 0; k < 5; k++) g.setAttribute("aA" + k, new THREE.Float32BufferAttribute(A2[k], 3));
    g.setAttribute("aG0", new THREE.Float32BufferAttribute(G0, 4));
    g.setAttribute("aG1", new THREE.Float32BufferAttribute(G1, 4));
    g.setAttribute("aG2", new THREE.Float32BufferAttribute(G2, 4));
    g.setIndex(idx);
    g.computeBoundingSphere();
    return g;
  }
  function buildLeafGeometry(skel, opts) {
    const pos = [], nor = [], uv = [], idx = [];
    const A2 = [[], [], [], [], [], []];
    const G0 = [], G1 = [], G2 = [], GL = [], COL = [];
    const v = new THREE.Vector3();
    const lr = opts.rng || new RNG(1);
    for (const r of skel) {
      if (!r.leaves.length) continue;
      const chain = ancestry(skel, r);
      const anchors = [0, 1, 2, 3, 4].map((k) => chain[k] ? chain[k].sections[0].origin : null);
      const gw = [0, 1, 2, 3, 4].map((k) => chain[k] ? [chain[k].birth, chain[k].dur] : [-1, 0]);
      const part = opts.partOf(r);
      for (const lf of r.leaves) {
        const W = lf.size, L = lf.size;
        const br = lr.random(1.12, 0.74), warm = lr.random() < 0.18 ? lr.random(1.18, 1.04) : 1;
        let ao = 1;
        if (opts.crownCenter && opts.crownRadius) {
          const f = Math.min(1, lf.origin.distanceTo(opts.crownCenter) / opts.crownRadius);
          ao = 0.5 + 0.5 * f * f;
          ao *= 0.85 + 0.15 * Math.min(1, Math.max(0, (lf.origin.y - opts.crownCenter.y) / opts.crownRadius + 0.6));
        }
        const tint = [br * warm * ao, br * (warm > 1 ? 1.02 : 1) * ao, br * (warm > 1 ? 0.78 : lr.random(1, 0.9)) * ao];
        for (const rot of [0, Math.PI / 2]) {
          const qr = new THREE.Quaternion().setFromAxisAngle(UP, rot);
          const base = pos.length / 3;
          const corners = [[-W / 2, L], [-W / 2, 0], [W / 2, 0], [W / 2, L]];
          const n = new THREE.Vector3(0, 0, 1).applyQuaternion(qr).applyQuaternion(lf.quat);
          corners.forEach(([x, y]) => {
            v.set(x, y, 0).applyQuaternion(qr).applyQuaternion(lf.quat).add(lf.origin);
            pos.push(v.x, v.y, v.z);
            if (opts.crownCenter) {
              const sn = v.clone().sub(opts.crownCenter).normalize();
              const nn = n.clone().multiplyScalar(0.35).add(sn.multiplyScalar(0.65)).normalize();
              nor.push(nn.x, nn.y, nn.z);
            } else nor.push(n.x, n.y, n.z);
            for (let k = 0; k < 5; k++) {
              const a = anchors[k] || anchors[0];
              A2[k].push(a.x, a.y, a.z);
            }
            A2[5].push(lf.origin.x, lf.origin.y, lf.origin.z);
            G0.push(gw[0][0], gw[0][1], gw[1][0], gw[1][1]);
            G1.push(gw[2][0], gw[2][1], gw[3][0], gw[3][1]);
            G2.push(gw[4][0], gw[4][1], part, 1);
            GL.push(lf.birth, lf.dur);
            COL.push(...tint);
          });
          uv.push(0, 1, 0, 0, 1, 0, 1, 1);
          idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    for (let k = 0; k < 5; k++) g.setAttribute("aA" + k, new THREE.Float32BufferAttribute(A2[k], 3));
    g.setAttribute("aAL", new THREE.Float32BufferAttribute(A2[5], 3));
    g.setAttribute("aG0", new THREE.Float32BufferAttribute(G0, 4));
    g.setAttribute("aG1", new THREE.Float32BufferAttribute(G1, 4));
    g.setAttribute("aG2", new THREE.Float32BufferAttribute(G2, 4));
    g.setAttribute("aGL", new THREE.Float32BufferAttribute(GL, 2));
    g.setAttribute("color", new THREE.Float32BufferAttribute(COL, 3));
    g.setIndex(idx);
    g.computeBoundingSphere();
    return g;
  }
  var growthVertexPars = (
    /* glsl */
    `
attribute vec3 aA0; attribute vec3 aA1; attribute vec3 aA2; attribute vec3 aA3; attribute vec3 aA4;
attribute vec4 aG0; attribute vec4 aG1; attribute vec4 aG2;
uniform float uGrowth;
uniform float uHL[6];
varying float vHL;
varying float vPart;
float gp(float b, float d){ if(d<=0.0) return 1.0; float t = clamp((uGrowth-b)/d,0.0,1.0); return t*t*(3.0-2.0*t); }
vec3 gscale(vec3 x, vec3 a, float p){ return a + (x-a)*p; }
#ifdef USE_LEAFGROW
attribute vec3 aAL; attribute vec2 aGL; uniform float uLeafPow;
#endif
`
  );
  var growthVertexMain = (
    /* glsl */
    `
float p4 = gp(aG2.x, aG2.y), p3 = gp(aG1.z, aG1.w), p2 = gp(aG1.x, aG1.y), p1 = gp(aG0.z, aG0.w), p0 = gp(aG0.x, aG0.y);
#ifdef USE_LEAFGROW
vec3 off = position - aAL;
vec3 transformed = aAL;
#else
vec3 transformed = vec3( position );
#endif
transformed = gscale(transformed, aA4, p4);
transformed = gscale(transformed, aA3, p3);
transformed = gscale(transformed, aA2, p2);
transformed = gscale(transformed, aA1, p1);
transformed = gscale(transformed, aA0, p0);
#ifdef USE_LEAFGROW
float anc = p0*p1*p2*p3*p4;
float lsc = gp(aGL.x, aGL.y) * pow(max(anc,0.0), uLeafPow);
transformed += off * lsc;
#endif
int pid = int(aG2.z + 0.5);
vPart = aG2.z;
vHL = 0.0;
for(int i=0;i<6;i++){ if(i==pid) vHL = uHL[i]; }
`
  );

  // src/roots.js
  var THREE2 = __toESM(require_three());
  var rootOpts = {
    levels: 2,
    angle: { 1: 36, 2: 34 },
    children: { 0: 3, 1: 2 },
    force: { x: 0, y: -1, z: 0, strength: 0.02 },
    gnarliness: { 0: 0.06, 1: 0.14, 2: 0.2 },
    length: { 0: 34, 1: 24, 2: 17 },
    radius: { 0: 1, 1: 0.6, 2: 0.62 },
    sections: { 0: 12, 1: 9, 2: 7 },
    segments: { 0: 12, 1: 7, 2: 5 },
    start: { 1: 0.62, 2: 0.25 },
    taper: { 0: 0.62, 1: 0.6, 2: 0.85 },
    twist: { 0: 0, 1: 0, 2: 0 },
    leaves: null
  };

  // src/giant.js
  var THREE3 = __toESM(require_three());
  var UP2 = new THREE3.Vector3(0, 1, 0);
  var sstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  var Buf = class {
    constructor() {
      this.pos = [];
      this.nor = [];
      this.uv = [];
      this.idx = [];
      this.spine = [];
      this.base = [];
      this.grow = [];
      this.part = [];
      this.col = [];
    }
    vert(p, n, u, v, sp, base, grow, part, ao = 1) {
      this.col.push(ao, ao, ao);
      this.pos.push(p.x, p.y, p.z);
      this.nor.push(n.x, n.y, n.z);
      this.uv.push(u, v);
      this.spine.push(sp.x, sp.y, sp.z);
      this.base.push(base.x, base.y, base.z);
      this.grow.push(grow[0], grow[1]);
      this.part.push(part);
      return this.pos.length / 3 - 1;
    }
    geometry() {
      const g = new THREE3.BufferGeometry();
      g.setAttribute("position", new THREE3.Float32BufferAttribute(this.pos, 3));
      g.setAttribute("normal", new THREE3.Float32BufferAttribute(this.nor, 3));
      g.setAttribute("uv", new THREE3.Float32BufferAttribute(this.uv, 2));
      g.setAttribute("aSpine", new THREE3.Float32BufferAttribute(this.spine, 3));
      g.setAttribute("aBase", new THREE3.Float32BufferAttribute(this.base, 3));
      g.setAttribute("aGrow", new THREE3.Float32BufferAttribute(this.grow, 2));
      g.setAttribute("aPart", new THREE3.Float32BufferAttribute(this.part, 1));
      g.setAttribute("color", new THREE3.Float32BufferAttribute(this.col, 3));
      g.setIndex(this.idx);
      g.computeBoundingSphere();
      return g;
    }
  };
  function gridIndices(buf, start, rings, radial) {
    const M = radial + 1;
    for (let i = 0; i < rings - 1; i++) for (let j = 0; j < radial; j++) {
      const a = start + i * M + j, b = a + 1, c = a + M, d = c + 1;
      buf.idx.push(a, c, b, b, c, d);
    }
  }
  function frames(curve, n) {
    const T = [], N = [], B = [];
    for (let i = 0; i <= n; i++) T.push(curve.getTangentAt(i / n).normalize());
    let n0 = new THREE3.Vector3().crossVectors(T[0], Math.abs(T[0].y) < 0.9 ? UP2 : new THREE3.Vector3(1, 0, 0)).normalize();
    for (let i = 0; i <= n; i++) {
      if (i > 0) n0 = n0.clone().sub(T[i].clone().multiplyScalar(n0.dot(T[i]))).normalize();
      N.push(n0.clone());
      B.push(new THREE3.Vector3().crossVectors(T[i], n0).normalize());
    }
    return { T, N, B };
  }
  function tube(buf, pts, opt) {
    const curve = new THREE3.CatmullRomCurve3(pts, false, "centripetal");
    const segs = opt.segs, radial = opt.radial;
    const { N, B } = frames(curve, segs);
    const start = buf.pos.length / 3;
    const len = curve.getLength();
    const p = new THREE3.Vector3(), d = new THREE3.Vector3();
    const uRep = Math.max(1, Math.round(2 * Math.PI * opt.r0 / 11));
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const c = curve.getPointAt(t);
      for (let j = 0; j <= radial; j++) {
        const a = 2 * Math.PI * (j % radial) / radial;
        d.copy(N[i]).multiplyScalar(Math.cos(a)).addScaledVector(B[i], Math.sin(a));
        const r = opt.radius(t, a) * (1 - sstep(0.965, 1, t) * 0.92);
        p.copy(c).addScaledVector(d, r);
        buf.vert(p, d, j / radial * uRep, t * len / 13, c, opt.base, opt.grow, opt.part);
      }
    }
    gridIndices(buf, start, segs + 1, radial);
    return { curve, len };
  }
  function buildGiant(opts = {}) {
    const rng = new RNG(opts.seed ?? 2026);
    const S = opts.scale ?? 1, WIDE = opts.wide ?? 1, DENS = opts.density ?? 1, CARD = opts.card ?? 1, LITE = !!opts.lite;
    const R0 = 26, TH = 88;
    const bark = new Buf();
    const clumps = [];
    const center = (y) => new THREE3.Vector3(3.2 * Math.sin(y * 0.03 + 0.5), y, 2.6 * Math.cos(y * 0.034 + 0.3) - 2.5);
    const lobes = [];
    for (let i = 0; i < 8; i++) lobes.push({ a: i / 8 * Math.PI * 2 + rng.random(0.3, -0.3), s: rng.random(1, 0.55), k: rng.random(30, 16) });
    const trunkR = (y, th) => {
      const h = Math.max(0, y);
      let r = R0 * (1 - 0.28 * sstep(0, TH * 0.8, h)) + R0 * 0.12 * sstep(TH * 0.75, TH * 0.95, h);
      r *= 1 - 0.28 * sstep(TH * 0.9, TH + 8, h);
      let b = 0;
      for (const L of lobes) b += L.s * Math.pow(Math.max(0, Math.cos(th - L.a + h * 0.012)), L.k);
      r *= 1 + 1.55 * b * Math.exp(-h / 8.5) + 0.4 * b * Math.exp(-h / 34);
      const tw = th + h * 0.018;
      r *= 1 + 0.09 * Math.sin(tw * 11) + 0.04 * Math.sin(tw * 23 + 1.3) + 0.03 * Math.sin(th * 3 + h * 0.15) * Math.sin(h * 0.09);
      return r;
    };
    const groove = (y, th) => {
      const tw = th + Math.max(0, y) * 0.018;
      return 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(tw * 11)) * (0.75 + 0.25 * (0.5 + 0.5 * Math.sin(tw * 23 + 1.3)));
    };
    {
      const rings = LITE ? 34 : 96, radial = LITE ? 40 : 136, y0 = -4, y1 = TH + 8;
      const start = bark.pos.length / 3;
      const zero = new THREE3.Vector3();
      for (let i = 0; i < rings; i++) {
        const tt = i / (rings - 1);
        const y = y0 + (y1 - y0) * Math.pow(tt, 1.25);
        const c = center(y);
        for (let j = 0; j <= radial; j++) {
          const th = 2 * Math.PI * (j % radial) / radial;
          const r = trunkR(y, th);
          const p = new THREE3.Vector3(c.x + Math.cos(th) * r, y, c.z + Math.sin(th) * r);
          bark.vert(p, new THREE3.Vector3(Math.cos(th), 0, Math.sin(th)), j / radial * 7, y / 10, c, zero, [0, 0], 0, groove(y, th));
        }
      }
      gridIndices(bark, start, rings, radial);
    }
    {
      const c0 = center(0);
      const inTrenchPre = (x, z) => Math.abs(x) < 106 && z > 58;
      const mkRoot = (az, len, r0, startD, y0, depth = 0) => {
        const pts = [];
        let a = az;
        const n = 7, wob = rng.random(0.5, 0.25) * (rng.random() < 0.5 ? 1 : -1), ph = rng.random(6.28);
        for (let k = 0; k <= n; k++) {
          const t = k / n;
          a = az + wob * Math.sin(t * 3 + ph) * t;
          const d = startD + len * t;
          const x = c0.x + Math.cos(a) * d, z = c0.z + Math.sin(a) * d;
          if (inTrenchPre(x, z)) break;
          const y = y0 * Math.pow(1 - t, 2.2) + r0 * 0.28 * (1 - t) - 0.9 * t + 0.7 * Math.sin(t * 9 + ph) * (1 - t);
          pts.push(new THREE3.Vector3(x, y, z));
        }
        if (pts.length < 4) return;
        const tb = tube(bark, pts, {
          segs: LITE ? 10 : 30,
          radial: LITE ? 6 : 12,
          r0,
          base: pts[0],
          grow: [0.02, 0.5],
          part: 0,
          radius: (t, ang) => (r0 * Math.pow(1 - 0.86 * t, 1.25) + 0.12) * (1 + 0.1 * Math.sin(ang * 5 + t * 16 + ph) + 0.06 * Math.sin(t * 31))
        });
        if (depth < 1 && !LITE) {
          for (let m = 0; m < 2; m++) {
            const t = rng.random(0.62, 0.3);
            const b = tb.curve.getPointAt(t), tg = tb.curve.getTangentAt(t);
            const a2 = Math.atan2(tg.z, tg.x) + (m ? 1 : -1) * rng.random(0.75, 0.4);
            const dd = Math.hypot(b.x - c0.x, b.z - c0.z);
            mkRootFrom(b, a2, len * rng.random(0.5, 0.3), r0 * (1 - 0.86 * t) * 0.7 + 0.3, ph);
          }
        }
      };
      const mkRootFrom = (b, a, len, r0, ph) => {
        const pts = [];
        for (let k = 0; k <= 5; k++) {
          const t = k / 5, aa = a + 0.35 * Math.sin(t * 3 + ph) * t;
          const x = b.x + Math.cos(aa) * len * t, z = b.z + Math.sin(aa) * len * t;
          if (inTrenchPre(x, z)) break;
          pts.push(new THREE3.Vector3(x, b.y * (1 - t) - 0.8 * t, z));
        }
        if (pts.length < 4) return;
        tube(bark, pts, { segs: 14, radial: 8, r0, base: pts[0], grow: [0.3, 0.45], part: 0, radius: (t) => r0 * Math.pow(1 - 0.9 * t, 1.2) + 0.08 });
      };
      const nR = LITE ? 7 : 13;
      for (let i = 0; i < nR; i++) {
        const L0 = lobes[i % lobes.length];
        const az = L0.a + (i >= lobes.length ? 0.39 : 0) + rng.random(0.12, -0.12);
        mkRoot(az, rng.random(150, 85), rng.random(6.2, 3.8), R0 * rng.random(1.15, 0.85), rng.random(13, 7));
      }
    }
    const limbs = [];
    const NL = 6;
    const az0 = rng.random(Math.PI * 2);
    for (let i = 0; i < NL; i++) {
      const az = az0 + i / NL * Math.PI * 2 + rng.random(0.25, -0.25);
      const y = TH * rng.random(0.98, 0.8);
      const base = center(y);
      const L = rng.random(100, 80) * WIDE;
      const d = new THREE3.Vector3(Math.cos(az), 0, Math.sin(az));
      const side = new THREE3.Vector3().crossVectors(d, UP2);
      const w = () => side.clone().multiplyScalar(rng.random(9, -9)).add(new THREE3.Vector3(0, rng.random(5, -5), 0));
      const lift = rng.random(1.2, 0.75);
      const pts = [
        base.clone(),
        base.clone().addScaledVector(d, L * 0.2).addScaledVector(UP2, L * 0.2 * lift + 6),
        base.clone().addScaledVector(d, L * 0.45).addScaledVector(UP2, L * 0.28 * lift + 8).add(w()),
        base.clone().addScaledVector(d, L * 0.72).addScaledVector(UP2, L * 0.36 * lift + 10).add(w()),
        base.clone().addScaledVector(d, L * 0.95).addScaledVector(UP2, L * 0.55 * lift + 16)
      ];
      const r0 = rng.random(11.5, 9);
      const birth = 0.1 + rng.random(0.06), dur = 0.33;
      const ph = rng.random(6.28);
      const { curve } = tube(bark, pts, {
        segs: LITE ? 18 : 46,
        radial: LITE ? 8 : 20,
        r0,
        base,
        grow: [birth, dur],
        part: 3,
        radius: (t, a) => (r0 * Math.pow(1 - 0.78 * t, 1.15) + 0.25) * (1 + 0.07 * Math.sin(a * 7 + t * 14 + ph) + 0.05 * Math.sin(t * 25 + ph) + 0.25 * Math.exp(-t * 18))
      });
      limbs.push({ curve, r0, base, birth, dur, az, part: 3 });
    }
    {
      const base = center(TH * 0.95);
      const pts = [base.clone(), base.clone().add(new THREE3.Vector3(4, 30, -3)), base.clone().add(new THREE3.Vector3(-6, 62, 4)), base.clone().add(new THREE3.Vector3(3, 96, 1))];
      const r0 = 10.5;
      const { curve } = tube(bark, pts, { segs: LITE ? 16 : 40, radial: LITE ? 8 : 20, r0, base, grow: [0.1, 0.33], part: 0, radius: (t, a) => (r0 * Math.pow(1 - 0.8 * t, 1.1) + 0.2) * (1 + 0.06 * Math.sin(a * 7 + t * 12)) });
      limbs.push({ curve, r0, base, birth: 0.1, dur: 0.33, az: 0, part: 0, leader: true });
    }
    const front = limbs.filter((l) => !l.leader).sort((a, b) => Math.sin(b.az) - Math.sin(a.az));
    const leftFront = front.slice(0, 3).sort((a, b) => Math.cos(a.az) - Math.cos(b.az));
    if (leftFront[0]) leftFront[0].part = 1;
    if (leftFront[leftFront.length - 1]) leftFront[leftFront.length - 1].part = 2;
    for (const limb of limbs) {
      const n2 = LITE ? 4 : limb.leader ? 5 : 7;
      for (let k = 0; k < n2; k++) {
        const t = limb.leader ? 0.35 + 0.65 * (k + 0.5) / n2 : 0.3 + 0.7 * (k + 0.5) / n2 + rng.random(0.04, -0.04);
        const base = limb.curve.getPointAt(Math.min(t, 1));
        const tan = limb.curve.getTangentAt(Math.min(t, 1));
        const out = new THREE3.Vector3(tan.x, 0, tan.z).normalize();
        const sideA = rng.random() < 0.5 ? 1 : -1;
        const side = new THREE3.Vector3().crossVectors(out, UP2).multiplyScalar(sideA);
        const dir = out.clone().multiplyScalar(0.7).addScaledVector(side, rng.random(0.9, 0.35)).addScaledVector(UP2, rng.random(0.42, 0.12)).normalize();
        const L = rng.random(40, 26) * (1 - 0.3 * t) * WIDE;
        const pr = limb.r0 * Math.pow(1 - 0.78 * t, 1.15);
        const r0 = Math.max(0.8, pr * 0.55);
        const pts = [base.clone(), base.clone().addScaledVector(dir, L * 0.4).addScaledVector(side, L * 0.08).add(new THREE3.Vector3(0, -L * 0.03, 0)), base.clone().addScaledVector(dir, L).add(new THREE3.Vector3(0, L * 0.2, 0))];
        const birth = limb.birth + limb.dur + t * 0.06, dur = 0.2;
        const { curve } = tube(bark, pts, { segs: LITE ? 6 : 14, radial: LITE ? 5 : 9, r0, base, grow: [birth, dur], part: limb.part === 0 ? 3 : limb.part, radius: (tt) => r0 * (1 - 0.82 * tt) + 0.12 });
        for (let m = 0; m < (LITE ? 2 : 4); m++) {
          const t3 = 0.4 + 0.6 * (m / 3) * rng.random(1, 0.85);
          const b3 = curve.getPointAt(Math.min(t3, 1));
          const d3 = dir.clone().add(new THREE3.Vector3(rng.random(0.8, -0.8), rng.random(0.9, 0.2), rng.random(0.8, -0.8))).normalize();
          const L3 = rng.random(17, 10);
          const r3 = Math.max(0.35, r0 * (1 - 0.82 * t3) * 0.6);
          const e3 = b3.clone().addScaledVector(d3, L3);
          const birth3 = birth + dur + 0.02, dur3 = 0.14;
          tube(bark, [b3.clone(), b3.clone().addScaledVector(d3, L3 * 0.5).add(new THREE3.Vector3(0, 1.5, 0)), e3], { segs: LITE ? 3 : 6, radial: LITE ? 4 : 5, r0: r3, base: b3, grow: [birth3, dur3], part: limb.part === 0 ? 3 : limb.part, radius: (tt) => r3 * (1 - 0.85 * tt) + 0.05 });
          clumps.push({ center: e3.clone().add(new THREE3.Vector3(0, 3, 0)), size: rng.random(14, 10), n: 22, base: b3, grow: [birth3, dur3], life: [birth3 + dur3 * 0.6, 9] });
        }
        clumps.push({ center: curve.getPointAt(1).add(new THREE3.Vector3(0, 4, 0)), size: rng.random(15, 11), n: 26, base, grow: [birth, dur], life: [birth + dur * 0.8, 9] });
      }
    }
    const domeC = new THREE3.Vector3(0, TH + 34, 0);
    const RX = 122 * WIDE, RY = 104;
    const nD = Math.round((LITE ? 46 : 150) * WIDE);
    for (let k = 0; k < nD; k++) {
      const a = rng.random(Math.PI * 2), v2 = rng.random(1, -0.14), sn = Math.sqrt(Math.max(0, 1 - v2 * v2));
      const inner = k % 4 === 0;
      const sh = inner ? rng.random(0.68, 0.4) : rng.random(1, 0.84);
      const bump = 1 + 0.1 * Math.sin(a * 5 + 1.3) + 0.07 * Math.sin(a * 9 + v2 * 6);
      const c = domeC.clone().add(new THREE3.Vector3(sn * Math.cos(a) * RX * sh * bump, v2 * RY * sh * bump, sn * Math.sin(a) * RX * sh * bump));
      clumps.push({ center: c, size: inner ? rng.random(22, 16) : rng.random(27, 18), n: inner ? 20 : 30, base: new THREE3.Vector3(), grow: [0, 0], life: [rng.random(0.82, 0.6), 9] });
    }
    for (let k = 0; k < 7; k++) {
      const a = k / 7 * Math.PI * 2;
      const c = center(TH).add(new THREE3.Vector3(Math.cos(a) * 16, 8 + rng.random(10), Math.sin(a) * 16));
      clumps.push({ center: c, size: 12, n: 26, base: new THREE3.Vector3(), grow: [0, 0], life: [0, 0.5], juvenile: true });
    }
    clumps.push({ center: center(TH).add(new THREE3.Vector3(0, 24, 0)), size: 14, n: 30, base: new THREE3.Vector3(), grow: [0, 0], life: [0, 0.5], juvenile: true });
    const crownC = new THREE3.Vector3(0, TH + 40, 0);
    const lf = { pos: [], nor: [], uv: [], idx: [], center: [], base: [], grow: [], life: [], col: [] };
    const q = new THREE3.Quaternion(), v = new THREE3.Vector3(), e = new THREE3.Euler();
    for (const c of clumps) {
      const cr = rng.random(1.22, 0.78);
      const nLeaves = Math.round(c.n * DENS);
      for (let i = 0; i < nLeaves; i++) {
        const u = rng.random(), th = rng.random(Math.PI * 2), ph = Math.acos(rng.random(1, -1));
        const rr = c.size * Math.cbrt(u);
        const o = new THREE3.Vector3(Math.sin(ph) * Math.cos(th) * rr, Math.cos(ph) * rr * 0.62, Math.sin(ph) * Math.sin(th) * rr);
        const lp = c.center.clone().add(o);
        const CS = rng.random(12, 8) * CARD * (c.juvenile ? 0.8 : 1);
        e.set(rng.random(0.9, -0.9), rng.random(Math.PI * 2), rng.random(0.9, -0.9));
        q.setFromEuler(e);
        const nrm = o.clone().normalize().multiplyScalar(0.6).add(lp.clone().sub(crownC).normalize().multiplyScalar(0.4)).normalize();
        const inner = Math.min(1, o.length() / c.size);
        const hgt = Math.min(1, Math.max(0, (lp.y - (TH + 5)) / 135));
        const top = 0.5 + 0.5 * Math.max(-1, Math.min(1, o.y / (c.size * 0.62)));
        const br = (0.3 + 0.95 * Math.pow(top, 1.25)) * (0.62 + 0.38 * inner) * (0.74 + 0.4 * hgt) * cr * rng.random(1.08, 0.9);
        const axisD = Math.hypot(lp.x, lp.z);
        const glow = c.juvenile ? 0 : (1 - top) * Math.exp(-axisD / 85) * (1 - 0.6 * hgt);
        const warm = rng.random() < 0.15 ? 1.12 : 1;
        for (const rot of [0, Math.PI / 2]) {
          const qr = new THREE3.Quaternion().setFromAxisAngle(UP2, rot).premultiply(q);
          const base = lf.pos.length / 3;
          [[-0.5, 1], [-0.5, 0], [0.5, 0], [0.5, 1]].forEach(([x, y]) => {
            v.set(x * CS, (y - 0.5) * CS, 0).applyQuaternion(qr).add(lp);
            lf.pos.push(v.x, v.y, v.z);
            lf.nor.push(nrm.x, nrm.y, nrm.z);
            lf.center.push(c.center.x, c.center.y, c.center.z);
            lf.base.push(c.base.x, c.base.y, c.base.z);
            lf.grow.push(c.grow[0], c.grow[1]);
            lf.life.push(c.life[0], c.life[1]);
            lf.col.push(br * warm + glow * 0.75, br + glow * 0.62, br * (warm > 1 ? 0.75 : 0.95) + glow * 0.08);
          });
          lf.uv.push(0, 1, 0, 0, 1, 0, 1, 1);
          lf.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
      }
    }
    const leafGeo = new THREE3.BufferGeometry();
    leafGeo.setAttribute("position", new THREE3.Float32BufferAttribute(lf.pos, 3));
    leafGeo.setAttribute("normal", new THREE3.Float32BufferAttribute(lf.nor, 3));
    leafGeo.setAttribute("uv", new THREE3.Float32BufferAttribute(lf.uv, 2));
    leafGeo.setAttribute("color", new THREE3.Float32BufferAttribute(lf.col, 3));
    leafGeo.setAttribute("aCenter", new THREE3.Float32BufferAttribute(lf.center, 3));
    leafGeo.setAttribute("aBase", new THREE3.Float32BufferAttribute(lf.base, 3));
    leafGeo.setAttribute("aGrow", new THREE3.Float32BufferAttribute(lf.grow, 2));
    leafGeo.setAttribute("aLife", new THREE3.Float32BufferAttribute(lf.life, 2));
    leafGeo.setIndex(lf.idx);
    leafGeo.computeBoundingSphere();
    const barkGeo = bark.geometry();
    barkGeo.computeVertexNormals();
    {
      const P = barkGeo.attributes.position.array, Nn = barkGeo.attributes.normal.array;
      const key = (i) => P[i * 3].toFixed(3) + "," + P[i * 3 + 1].toFixed(3) + "," + P[i * 3 + 2].toFixed(3);
      const map = /* @__PURE__ */ new Map();
      for (let i = 0; i < P.length / 3; i++) {
        const k = key(i);
        const e2 = map.get(k);
        if (e2) e2.push(i);
        else map.set(k, [i]);
      }
      for (const ids of map.values()) {
        if (ids.length < 2) continue;
        let x = 0, y = 0, z = 0;
        ids.forEach((i) => {
          x += Nn[i * 3];
          y += Nn[i * 3 + 1];
          z += Nn[i * 3 + 2];
        });
        const l = Math.hypot(x, y, z) || 1;
        ids.forEach((i) => {
          Nn[i * 3] = x / l;
          Nn[i * 3 + 1] = y / l;
          Nn[i * 3 + 2] = z / l;
        });
      }
    }
    const partArr = barkGeo.attributes.aPart.array, baseArr = barkGeo.attributes.aBase.array;
    const tagged = limbs.filter((l) => l.part === 1 || l.part === 2);
    for (let i = 0; i < partArr.length; i++) {
      for (const l of tagged) if (Math.abs(baseArr[i * 3] - l.base.x) < 1e-4 && Math.abs(baseArr[i * 3 + 1] - l.base.y) < 1e-4 && Math.abs(baseArr[i * 3 + 2] - l.base.z) < 1e-4) partArr[i] = l.part;
    }
    if (S !== 1) {
      for (const g of [barkGeo, leafGeo]) for (const k of ["position", "aSpine", "aBase", "aCenter"]) {
        const a = g.attributes[k];
        if (!a) continue;
        for (let i = 0; i < a.array.length; i++) a.array[i] *= S;
        a.needsUpdate = true;
      }
      barkGeo.computeBoundingSphere();
      leafGeo.computeBoundingSphere();
    }
    const crownPts = clumps.filter((c) => !c.juvenile).map((c) => ({ p: c.center.clone().multiplyScalar(S), r: c.size * S }));
    return { barkGeo, leafGeo, R0: R0 * S, TH: TH * S, lobes, center: (y) => center(y / S).multiplyScalar(S), limbs, S, crownPts };
  }
  var barkGrowPars = (
    /* glsl */
    `
attribute vec3 aSpine; attribute vec3 aBase; attribute vec2 aGrow; attribute float aPart;
uniform float uGrow; uniform float uThin; uniform float uHL[6];
varying float vHL; varying vec3 vWP; varying vec3 vWN;
float growF(vec2 g){ if(g.y<=0.0) return 1.0; float t = clamp((uGrow-g.x)/g.y,0.0,1.0); return t*t*(3.0-2.0*t); }
`
  );
  var barkGrowMain = (
    /* glsl */
    `
float gf = growF(aGrow);
vec3 sp = aBase + (aSpine - aBase) * gf;
vec3 transformed = sp + (position - aSpine) * gf * uThin;
int pid = int(aPart + 0.5);
vHL = 0.0;
for(int i=0;i<6;i++){ if(i==pid) vHL = uHL[i]; }
vWP = (modelMatrix * vec4(transformed,1.0)).xyz;
vWN = normalize(mat3(modelMatrix) * normal);
`
  );
  var leafGrowPars = (
    /* glsl */
    `
attribute vec3 aCenter; attribute vec3 aBase; attribute vec2 aGrow; attribute vec2 aLife;
uniform float uGrow; uniform float uLeafBoost; uniform float uTime; uniform float uHL[6];
varying float vHL;
float growF(vec2 g){ if(g.y<=0.0) return 1.0; float t = clamp((uGrow-g.x)/g.y,0.0,1.0); return t*t*(3.0-2.0*t); }
float ss(float a, float b, float x){ float t = clamp((x-a)/(b-a),0.0,1.0); return t*t*(3.0-2.0*t); }
`
  );
  var leafGrowMain = (
    /* glsl */
    `
float gf = growF(aGrow);
vec3 cNow = aBase + (aCenter - aBase) * gf;
float life = ss(aLife.x, aLife.x + 0.1, uGrow) * (1.0 - ss(aLife.y, aLife.y + 0.18, uGrow));
vec3 transformed = cNow + (position - aCenter) * life * uLeafBoost;
float wo = dot(aCenter.xz, vec2(0.05, 0.037));
transformed += vec3(0.6, 0.15, 0.45) * (sin(uTime*0.8 + wo) * 0.6 + sin(uTime*1.7 + wo*1.3) * 0.3) * uv.y * life;
vHL = uHL[4];
`
  );

  // src/app.js
  var A = window.FOREST_ASSETS;
  var STAGES = window.FOREST_STAGES;
  var D = 126;
  var LAYER = [0, -42, -84, -126];
  var ZC = 190;
  var ZF = 650;
  var TX = 300;
  var SUN_DIR = new THREE4.Vector3(-0.66, 0.56, 0.4).normalize();
  var GLOW_DIR = new THREE4.Vector3(-0.5, 0.34, -0.8).normalize();
  var $ = (s) => document.querySelector(s);
  var app = $("#app");
  var DPR = window.devicePixelRatio || 1;
  var QUALITY = {
    high: { name: "\u9AD8", pr: Math.min(DPR, 1.5), shadow: 2048, grass: 1, motes: true },
    std: { name: "\u6A19\u6E96", pr: Math.min(DPR, 1), shadow: 1536, grass: 0.85, motes: true },
    low: { name: "\u7701\u96FB", pr: Math.min(DPR, 0.72), shadow: 1024, grass: 0.35, motes: false }
  };
  var QORDER = ["high", "std", "low"];
  var qKey = (() => {
    try {
      return localStorage.getItem("forestQuality") || "std";
    } catch (e) {
      return "std";
    }
  })();
  var qAuto = true;
  var renderer = new THREE4.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(QUALITY[qKey].pr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE4.PCFShadowMap;
  renderer.toneMapping = THREE4.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  app.appendChild(renderer.domElement);
  var labelRenderer = new import_CSS2DRenderer.CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.className = "labels";
  app.appendChild(labelRenderer.domElement);
  var scene = new THREE4.Scene();
  var FOG = new THREE4.Color(15327174);
  scene.fog = new THREE4.Fog(FOG, 1900, 9500);
  var camera = new THREE4.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 2, 16e3);
  function applyViewOffset() {
    const w = window.innerWidth, h = window.innerHeight;
    const pn = document.getElementById("panel");
    const right = pn && pn.offsetWidth > 0 ? pn.offsetLeft + pn.offsetWidth : w * 0.5;
    const shift = w > 900 ? right / 2 : 0;
    camera.setViewOffset(w, h, -shift, 0, w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  applyViewOffset();
  camera.position.set(0, 260, 1100);
  var controls = new import_OrbitControls.OrbitControls(camera, labelRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 120;
  controls.maxDistance = 3800;
  controls.maxPolarAngle = Math.PI * 0.6;
  controls.target.set(0, 220, 0);
  var U = {
    uTime: { value: 0 },
    uGrow: { value: 1 },
    uThin: { value: 1 },
    uLeafBoost: { value: 1 },
    uRoot: { value: 1 },
    uLeafPow: { value: 0.16 },
    uHL: { value: [0, 0, 0, 0, 0, 0] },
    uHLRoot: { value: [0, 0, 0, 0, 0, 0] },
    uDim: { value: 0 }
  };
  var texLoader = new THREE4.TextureLoader();
  var loadTex = (url, srgb = true, rep = true) => new Promise((res) => texLoader.load(url, (t) => {
    if (srgb) t.colorSpace = THREE4.SRGBColorSpace;
    if (rep) {
      t.wrapS = t.wrapT = THREE4.RepeatWrapping;
    }
    t.anisotropy = 4;
    res(t);
  }));
  var b64ToAB = (b64) => {
    const bin = atob(b64);
    const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u.buffer;
  };
  var loadGLB = (b64) => new Promise((res, rej) => new import_GLTFLoader.GLTFLoader().parse(b64ToAB(b64), "", res, rej));
  var smooth = (t) => t * t * (3 - 2 * t);
  var easeIO = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  var clamp01 = (x) => Math.min(1, Math.max(0, x));
  var sstep2 = (a, b, x) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  function terrainH(x, z) {
    const r = Math.hypot(x, z);
    const near = sstep2(260, 760, r) * (3.5 * Math.sin(x * 8e-3 + 1.3) * Math.cos(z * 9e-3 - 0.4) + 1.8 * Math.sin(x * 0.019 + z * 0.014));
    const far = sstep2(1300, 3800, r) * (170 + 130 * Math.sin(x * 15e-4 + 0.7) * Math.cos(z * 13e-4 + 1.1) + 70 * Math.sin(x * 4e-3 - z * 3e-3));
    return near + far;
  }
  var inTrench = (x, z) => x > -TX && x < TX && z > ZC && z < ZF;
  var NOISE_GLSL = (
    /* glsl */
    `
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),f.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.03; a*=0.5; } return s; }
`
  );
  function makeSky() {
    const g = new THREE4.SphereGeometry(12e3, 32, 16);
    const m = new THREE4.ShaderMaterial({
      side: THREE4.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { uGlow: { value: GLOW_DIR } },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*p; gl_Position.z = gl_Position.w; }`,
      fragmentShader: `varying vec3 vDir; uniform vec3 uGlow;
      void main(){
        float y = vDir.y;
        vec3 zen = vec3(0.16,0.38,0.70);
        vec3 mid = vec3(0.50,0.70,0.86);
        vec3 hor = vec3(1.0,0.90,0.72);
        vec3 c = mix(hor, mix(mid, zen, smoothstep(0.18,0.8,y)), smoothstep(0.0,0.24,y));
        if (y < 0.0) c = hor;
        float s = max(dot(vDir, uGlow),0.0);
        c += vec3(1.0,0.86,0.58)*pow(s,6.0)*0.55 + vec3(1.0,0.95,0.8)*pow(s,120.0)*1.8;
        gl_FragColor = vec4(c,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    });
    const mesh = new THREE4.Mesh(g, m);
    mesh.renderOrder = -10;
    mesh.frustumCulled = false;
    scene.add(mesh);
  }
  function makeClouds(cloudTex) {
    const group = new THREE4.Group();
    const rng = new RNG(99);
    for (let i = 0; i < 26; i++) {
      const m = new THREE4.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false, opacity: rng.random(0.95, 0.6), fog: false });
      const s = new THREE4.Sprite(m);
      const a = rng.random(Math.PI * 0.95, -Math.PI * 0.95) + Math.PI;
      const r = rng.random(9500, 6200);
      s.position.set(Math.sin(a) * r, rng.random(3900, 1400), Math.cos(a) * r);
      const sc = rng.random(1900, 900);
      s.scale.set(sc * rng.random(1.8, 1.1), sc, 1);
      s.material.rotation = rng.random(0.3, -0.3);
      s.userData.speed = rng.random(3, 1);
      group.add(s);
    }
    scene.add(group);
    return group;
  }
  var mistSprites = [];
  function makeMist(cloudTex) {
    const rng = new RNG(4711);
    for (let i = 0; i < 20; i++) {
      const m = new THREE4.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false, opacity: rng.random(0.34, 0.16), color: 16773590, fog: false });
      const s = new THREE4.Sprite(m);
      const a = rng.random(Math.PI * 2), r = rng.random(2600, 950);
      s.position.set(Math.sin(a) * r, rng.random(190, 50), Math.cos(a) * r);
      const sc = rng.random(1500, 800);
      s.scale.set(sc, sc * 0.3, 1);
      s.userData.op = m.opacity;
      mistSprites.push(s);
      scene.add(s);
    }
  }
  function makeMountains() {
    const segs = 160, rows = 5;
    const pos = [], idx = [], col = [];
    const rng = new RNG(31);
    const ph = [rng.random(6.28), rng.random(6.28), rng.random(6.28)];
    for (let i = 0; i <= segs; i++) {
      const a = i / segs * Math.PI * 2;
      const hgt = 260 + 170 * Math.sin(a * 3 + ph[0]) * Math.sin(a * 2 + ph[1]) + 110 * Math.sin(a * 9 + ph[2]) + 50 * Math.sin(a * 23);
      for (let k = 0; k <= rows; k++) {
        const t = k / rows;
        const r = 7200 - t * 800;
        const y = -100 + 2.6 * Math.max(60, hgt) * Math.sin(t * Math.PI * 0.5) * (1 + 0.12 * Math.sin(a * 41 + t * 3));
        pos.push(Math.sin(a) * r, y, Math.cos(a) * r);
        col.push(0.55 + 0.1 * t, 0.66 + 0.06 * t, 0.74 + 0.04 * t);
      }
    }
    for (let i = 0; i < segs; i++) for (let k = 0; k < rows; k++) {
      const a = i * (rows + 1) + k, b = a + 1, c = a + rows + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE4.BufferGeometry();
    g.setAttribute("position", new THREE4.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE4.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    const mesh = new THREE4.Mesh(g, new THREE4.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE4.DoubleSide, transparent: true, opacity: 0.85 }));
    mesh.renderOrder = -8;
    scene.add(mesh);
  }
  function axisCoords(min, max, must) {
    const set = new Set(must);
    const step2 = (a) => a < 500 ? 16 : a < 1200 ? 40 : a < 2600 ? 110 : 260;
    for (let x = 0; x <= max; x += step2(x)) set.add(Math.round(x));
    for (let x = 0; x >= min; x -= step2(-x)) set.add(Math.round(x));
    set.add(min);
    set.add(max);
    return [...set].sort((a, b) => a - b);
  }
  var XS = axisCoords(-6e3, 6e3, [-TX, TX]);
  var ZS = axisCoords(-6e3, 6e3, [ZC, ZF]);
  function gridGeo(xs, zs, keep) {
    const pos = [], uv = [], idx = [];
    for (let j = 0; j < zs.length; j++) for (let i = 0; i < xs.length; i++) {
      const x = xs[i], z = zs[j];
      pos.push(x, terrainH(x, z), z);
      uv.push(x / 20, z / 20);
    }
    const W = xs.length;
    for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) {
      const cx = (xs[i] + xs[i + 1]) / 2, cz = (zs[j] + zs[j + 1]) / 2;
      if (!keep(cx, cz)) continue;
      const a = j * W + i, b = a + 1, c = a + W, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE4.BufferGeometry();
    g.setAttribute("position", new THREE4.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE4.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  function wallGeo(path, normal, bottom = -D) {
    const nY = 18;
    const pos = [], uv = [], nor = [], idx = [];
    let acc = path[0][0] + path[0][1];
    path.forEach(([x, z], i) => {
      if (i > 0) acc += Math.hypot(x - path[i - 1][0], z - path[i - 1][1]);
      const top = terrainH(x, z);
      for (let k = 0; k <= nY; k++) {
        const y = top + (bottom - top) * k / nY;
        pos.push(x, y, z);
        nor.push(normal.x, normal.y, normal.z);
        uv.push(acc / 30, y / 30);
      }
    });
    const M = nY + 1;
    const p = (i) => new THREE4.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    const flip = p(1).sub(p(0)).cross(p(M).sub(p(0))).dot(normal) < 0;
    for (let i = 0; i < path.length - 1; i++) for (let k = 0; k < nY; k++) {
      const a = i * M + k, b = a + 1, c = a + M, d = c + 1;
      if (!flip) idx.push(a, b, c, b, d, c);
      else idx.push(a, c, b, b, c, d);
    }
    const g = new THREE4.BufferGeometry();
    g.setAttribute("position", new THREE4.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE4.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE4.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }
  function floorGeo(up = true) {
    const g = new THREE4.PlaneGeometry(TX * 2, ZF - ZC, 4, 4);
    g.rotateX(up ? -Math.PI / 2 : Math.PI / 2);
    g.translate(0, -D, (ZC + ZF) / 2);
    const uv = g.attributes.uv, p = g.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / 30, p.getZ(i) / 30);
    return g;
  }
  var xsIn = XS.filter((x) => x >= -TX && x <= TX);
  var zsIn = ZS.filter((z) => z >= ZC && z <= ZF);
  function makeGroundMaterial(grassTex, dirtTex) {
    const m = new THREE4.MeshStandardMaterial({ map: grassTex, roughness: 1, metalness: 0, color: 16056272 });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uDirt = { value: dirtTex };
      sh.vertexShader = "varying vec3 vLocal;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvLocal = position;");
      sh.fragmentShader = "varying vec3 vLocal;\nuniform sampler2D uDirt;\n" + NOISE_GLSL + sh.fragmentShader.replace("#include <map_fragment>", `
      #include <map_fragment>
      vec2 wp = vLocal.xz;
      float n = fbm(wp*0.012);
      float n2 = fbm(wp*0.04+7.0);
      vec3 g = diffuseColor.rgb;
      g *= mix(vec3(0.95,1.28,0.66), vec3(1.25,1.38,0.74), n);
      g = mix(g, g*vec3(1.12,1.04,0.70), smoothstep(0.6,0.85,n2)*0.4);
      vec3 dirt = texture2D(uDirt, vMapUv*1.3).rgb*vec3(1.05,0.9,0.75);
      float r = length(wp);
      float bare = 1.0 - smoothstep(130.0, 200.0 + 25.0*n2, r);
      bare = max(bare, smoothstep(0.74,0.84,n)*0.45);
      float forest = smoothstep(650.0, 1050.0, r + (n-0.5)*350.0);
      g = mix(g, g*vec3(0.62,0.74,0.5), forest*0.6);
      diffuseColor.rgb = mix(g, dirt*mix(1.0,0.7,smoothstep(170.0,0.0,r)), bare*0.85);
    `);
    };
    return m;
  }
  function makeStrataMaterial(dirtTex, dirtN, opts = {}) {
    const m = new THREE4.MeshStandardMaterial({ map: dirtTex, normalMap: dirtN, normalScale: new THREE4.Vector2(1.2, 1.2), roughness: 0.98, metalness: 0, transparent: !!opts.transparent });
    m.userData.u = { uLine: { value: 0 }, uTime: U.uTime };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, m.userData.u);
      sh.vertexShader = "varying vec3 vLocal;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvLocal = position;");
      sh.fragmentShader = "varying vec3 vLocal;\nuniform float uLine; uniform float uTime;\n" + NOISE_GLSL + sh.fragmentShader.replace("#include <map_fragment>", `
      vec4 texel = texture2D(map, vMapUv);
      float lum = dot(texel.rgb, vec3(0.299,0.587,0.114));
      float y = vLocal.y;
      float s = vMapUv.x;
      float wob = (fbm(vec2(s*0.9, 3.1))-0.5)*7.0 + sin(s*0.8)*1.2;
      float b1 = -42.0 + wob;
      float b2 = -84.0 + wob*0.8 + (fbm(vec2(s*0.6, 9.0))-0.5)*4.5;
      vec3 C0 = vec3(0.19,0.13,0.08);
      vec3 C1 = vec3(0.68,0.52,0.34);
      vec3 C2 = vec3(0.58,0.34,0.21);
      vec3 C3 = vec3(0.34,0.25,0.20);
      float m1 = smoothstep(b1-1.4, b1+1.4, y);
      float m2 = smoothstep(b2-1.4, b2+1.4, y);
      vec3 col = mix(C3, mix(C2, C1, m1), m2);
      float humus = smoothstep(-10.0 + (fbm(vec2(s*1.7,1.0))-0.5)*4.0, -3.0, y);
      col = mix(col, C0, humus);
      col *= 0.9 + 0.2*fbm(vec2(s*0.25, y*0.6));
      vec2 pc = vec2(s*14.0, y*0.45 + vMapUv.y*6.0);
      float peb = vnoise(pc) * vnoise(pc*1.9+3.0);
      float pebT = mix(0.55, 0.40, 1.0 - m2);
      float isPeb = smoothstep(pebT, pebT+0.04, peb) * (1.0-humus);
      col = mix(col, vec3(0.66,0.61,0.54)*(0.75+0.5*vnoise(pc*3.0)), isPeb*0.75);
      diffuseColor.rgb = col * (0.55 + 2.4*lum);
      `).replace("#include <emissivemap_fragment>", `
      #include <emissivemap_fragment>
      float l1 = 1.0 - smoothstep(0.0, 0.6, abs(y - b1));
      float l2 = 1.0 - smoothstep(0.0, 0.6, abs(y - b2));
      totalEmissiveRadiance += vec3(1.0,0.78,0.42) * (l1 + l2) * uLine * 1.4;
      float fl = step(0.985, hash12(floor(vec2(s*30.0, y*0.8 + vMapUv.y*30.0)))) * (1.0 - m2);
      totalEmissiveRadiance += vec3(1.0,0.8,0.4) * fl * uLine * (0.6+0.4*sin(uTime*2.0 + s*10.0));
      `);
    };
    return m;
  }
  var tree;
  var giant;
  var groundG;
  var slab;
  var roots;
  var leaves;
  var barkMesh;
  var particles;
  var sparkles;
  var motes;
  var rays;
  var ghost;
  var sun;
  var labels = {};
  var rskel = null;
  var strataMats = [];
  var cloudsRef = null;
  var grassMeshes = [];
  async function init() {
    const [barkC, barkN, leafT, ashT, grassT, dirtT, dirtN, cloudT] = await Promise.all([
      loadTex(A.barkColor),
      loadTex(A.barkNormal, false),
      loadTex(A.leafOak, true, false),
      loadTex(A.leafAsh, true, false),
      loadTex(A.grass),
      loadTex(A.dirt),
      loadTex(A.dirtNormal, false),
      loadTex(A.cloud, true, false)
    ]);
    setProgress(0.25);
    makeSky();
    makeMountains();
    cloudsRef = makeClouds(cloudT);
    makeMist(cloudT);
    scene.add(new THREE4.HemisphereLight(13623551, 5722159, 0.95));
    sun = new THREE4.DirectionalLight(16766624, 3.7);
    sun.position.copy(SUN_DIR).multiplyScalar(1500);
    sun.castShadow = true;
    sun.shadow.mapSize.set(QUALITY[qKey].shadow, QUALITY[qKey].shadow);
    const sc = sun.shadow.camera;
    sc.left = -720;
    sc.right = 720;
    sc.top = 820;
    sc.bottom = -720;
    sc.near = 400;
    sc.far = 3200;
    sun.shadow.bias = -6e-4;
    sun.shadow.normalBias = 3;
    sun.target.position.set(0, 210, 60);
    scene.add(sun, sun.target);
    const fill = new THREE4.DirectionalLight(13623551, 0.65);
    fill.position.set(780, 240, 600);
    scene.add(fill);
    const groundMat = makeGroundMaterial(grassT, dirtT);
    const strataMat = makeStrataMaterial(dirtT, dirtN);
    groundG = new THREE4.Group();
    scene.add(groundG);
    const ground = new THREE4.Mesh(gridGeo(XS, ZS, (x, z) => !inTrench(x, z)), groundMat);
    ground.receiveShadow = true;
    groundG.add(ground);
    const walls = [
      new THREE4.Mesh(wallGeo(xsIn.map((x) => [x, ZC]), new THREE4.Vector3(0, 0, 1)), strataMat),
      new THREE4.Mesh(wallGeo(zsIn.map((z) => [-TX, z]), new THREE4.Vector3(1, 0, 0)), strataMat),
      new THREE4.Mesh(wallGeo(zsIn.map((z) => [TX, z]), new THREE4.Vector3(-1, 0, 0)), strataMat),
      new THREE4.Mesh(wallGeo(xsIn.map((x) => [x, ZF]), new THREE4.Vector3(0, 0, -1)), strataMat),
      new THREE4.Mesh(floorGeo(true), strataMat)
    ];
    walls.forEach((w) => {
      w.receiveShadow = true;
      groundG.add(w);
    });
    groundG.userData.walls = walls;
    slab = new THREE4.Group();
    scene.add(slab);
    const sGround = makeGroundMaterial(grassT, dirtT);
    const sStrata = makeStrataMaterial(dirtT, dirtN);
    const st = new THREE4.Mesh(gridGeo(xsIn, zsIn, () => true), sGround);
    st.receiveShadow = true;
    slab.add(st);
    const sw = [
      new THREE4.Mesh(wallGeo(xsIn.map((x) => [x, ZC]), new THREE4.Vector3(0, 0, -1)), sStrata),
      new THREE4.Mesh(wallGeo(zsIn.map((z) => [-TX, z]), new THREE4.Vector3(-1, 0, 0)), sStrata),
      new THREE4.Mesh(wallGeo(zsIn.map((z) => [TX, z]), new THREE4.Vector3(1, 0, 0)), sStrata),
      new THREE4.Mesh(wallGeo(xsIn.map((x) => [x, ZF]), new THREE4.Vector3(0, 0, 1)), sStrata),
      new THREE4.Mesh(floorGeo(false), sStrata)
    ];
    sw.forEach((w) => slab.add(w));
    slab.userData.walls = sw;
    slab.userData.mats = [sGround, sStrata];
    strataMats = [strataMat, sStrata];
    ghost = makeGhostLayers();
    setProgress(0.4);
    buildTree(barkC, barkN, leafT);
    setProgress(0.6);
    buildForest(barkC, barkN, leafT, ashT);
    setProgress(0.75);
    const [g, fW, fY, fB] = await Promise.all([loadGLB(A.grassGLB), loadGLB(A.flowerW), loadGLB(A.flowerY), loadGLB(A.flowerB)]);
    buildGrass(g, [fW, fY, fB]);
    setProgress(0.9);
    particles = makeNutrients();
    sparkles = makeSparkles();
    motes = makeMotes();
    rays = makeRays();
    buildExtras(barkC, barkN, leafT);
    makeLabels();
    applyQuality(qKey, false);
    window.__ready = true;
    setProgress(1);
    setTimeout(() => $("#loader").classList.add("done"), 200);
    buildUI();
    applyViewOffset();
    goStage(0, true);
    animate();
  }
  function highlightFrag(src) {
    return "uniform float uTime; uniform float uDim;\n" + src.replace("#include <map_fragment>", "#include <map_fragment>\n diffuseColor.rgb *= mix(1.0, 0.45, uDim*(1.0 - vHL));").replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
      float rim = pow(clamp(1.0 - abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.2);
      float pulse = 0.75 + 0.25*sin(uTime*2.4);
      totalEmissiveRadiance += vec3(1.0,0.74,0.34) * vHL * (0.03 + 0.4*rim) * pulse;`);
  }
  function buildTree(barkC, barkN, leafT) {
    tree = new THREE4.Group();
    scene.add(tree);
    giant = buildGiant({ seed: 2026, scale: 3, wide: 1.42, density: 1.75, card: 0.8 });
    const bU = { uGrow: U.uGrow, uThin: U.uThin, uHL: U.uHL, uTime: U.uTime, uDim: U.uDim };
    const barkMat = new THREE4.MeshStandardMaterial({ map: barkC, normalMap: barkN, normalScale: new THREE4.Vector2(1.8, 1.8), roughness: 0.95, color: 14469292, emissive: 1840140, vertexColors: true });
    barkMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, bU);
      sh.vertexShader = barkGrowPars + sh.vertexShader.replace("#include <begin_vertex>", barkGrowMain);
      sh.fragmentShader = "varying float vHL; varying vec3 vWP; varying vec3 vWN;\n" + NOISE_GLSL + highlightFrag(sh.fragmentShader).replace("#include <map_fragment>", `#include <map_fragment>
      float mn = fbm(vWP.xz*0.08 + vWP.y*0.05);
      float moss = smoothstep(0.55, 0.95, vWN.y*0.75 + 0.25 - vWP.y*0.004 + (mn-0.5)*0.6);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.24,0.33,0.11)*(0.75+0.5*mn), moss*0.7);`);
    };
    barkMesh = new THREE4.Mesh(giant.barkGeo, barkMat);
    barkMesh.castShadow = barkMesh.receiveShadow = true;
    barkMesh.frustumCulled = false;
    const bd = new THREE4.MeshDepthMaterial({ depthPacking: THREE4.RGBADepthPacking });
    bd.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, bU);
      sh.vertexShader = barkGrowPars + sh.vertexShader.replace("#include <begin_vertex>", barkGrowMain);
    };
    barkMesh.customDepthMaterial = bd;
    tree.add(barkMesh);
    const lU = { uGrow: U.uGrow, uLeafBoost: U.uLeafBoost, uTime: U.uTime, uHL: U.uHL, uDim: U.uDim };
    const leafMat = new THREE4.MeshStandardMaterial({ map: leafT, alphaTest: 0.5, side: THREE4.DoubleSide, vertexColors: true, roughness: 0.75, color: 15922902, emissive: 2373647 });
    leafMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, lU);
      sh.vertexShader = leafGrowPars + sh.vertexShader.replace("#include <begin_vertex>", leafGrowMain);
      sh.fragmentShader = "varying float vHL;\n" + highlightFrag(sh.fragmentShader);
    };
    leaves = new THREE4.Mesh(giant.leafGeo, leafMat);
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    leaves.frustumCulled = false;
    const ld = new THREE4.MeshDepthMaterial({ depthPacking: THREE4.RGBADepthPacking, map: leafT, alphaTest: 0.5 });
    ld.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, lU);
      sh.vertexShader = leafGrowPars + sh.vertexShader.replace("#include <begin_vertex>", leafGrowMain);
    };
    leaves.customDepthMaterial = ld;
    tree.add(leaves);
    const rrng = new RNG(7);
    const spec = [];
    const mk = (ang, s) => {
      const elev = THREE4.MathUtils.degToRad(rrng.random(26, 12));
      const dir = new THREE4.Vector3(Math.cos(ang) * Math.cos(elev), -Math.sin(elev), Math.sin(ang) * Math.cos(elev));
      const c = giant.center(2);
      const reach = giant.R0 * (1 + 1.3 * s) * 0.8;
      spec.push({ origin: new THREE4.Vector3(c.x + Math.cos(ang) * reach, 10, c.z + Math.sin(ang) * reach), quat: new THREE4.Quaternion().setFromUnitVectors(new THREE4.Vector3(0, 1, 0), dir), length: rrng.random(44, 34) * 3, radius: giant.R0 * (0.22 + 0.16 * s) });
    };
    giant.lobes.forEach((L) => mk(L.a, L.s));
    [-0.55, -0.2, 0.15, 0.45].forEach((d) => mk(Math.PI / 2 + d, 0.5));
    const RO = JSON.parse(JSON.stringify(rootOpts));
    for (const k in RO.length) RO.length[k] *= 3;
    RO.force.strength *= 3;
    rskel = buildSkeleton(RO, rrng, spec);
    {
      const c0 = giant.center(0);
      for (const r of rskel) for (const sec of r.sections) {
        const d = Math.hypot(sec.origin.x - c0.x, sec.origin.z - c0.z);
        const k = sstep2(giant.R0 * 1.1, giant.R0 * 1.9, d);
        const lim = THREE4.MathUtils.lerp(6, -sec.radius * 1.15 - 3, k);
        if (sec.origin.y > lim) sec.origin.y = lim;
      }
    }
    assignGrowth(rskel, (r, p) => {
      if (!p) return { birth: 0, dur: 0.31 };
      if (r.level === 1) return { birth: 0.33 + 0.03 * r.startT, dur: 0.3 };
      return { birth: 0.66 + 0.03 * r.startT, dur: 0.31 };
    }, () => ({ birth: 0, dur: 0 }));
    const rootGeo = buildBranchGeometry(rskel, { partOf: () => 5, texSize: 30 });
    const rU = { uGrowth: U.uRoot, uHL: U.uHLRoot, uTime: U.uTime, uDim: { value: 0 } };
    const rootMat = new THREE4.MeshStandardMaterial({ map: barkC, normalMap: barkN, roughness: 0.95, color: 13874836, emissive: 1708554 });
    rootMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, rU);
      sh.vertexShader = growthVertexPars + sh.vertexShader.replace("#include <begin_vertex>", growthVertexMain);
      sh.fragmentShader = "varying float vHL; varying float vPart;\n" + highlightFrag(sh.fragmentShader);
    };
    roots = new THREE4.Mesh(rootGeo, rootMat);
    roots.castShadow = true;
    roots.receiveShadow = true;
    roots.frustumCulled = false;
    tree.add(roots);
  }
  function bakeTreeImpostor(o, seed, leafTex, barkC, barkN, tint) {
    const sk = buildSkeleton(o, new RNG(seed));
    sk.forEach((r) => {
      r.birth = -1;
      r.dur = 0;
      r.leaves.forEach((l2) => {
        l2.birth = -1;
        l2.dur = 0;
      });
    });
    const bg = buildBranchGeometry(sk, { partOf: () => 3, texSize: 8 });
    const lg = buildLeafGeometry(sk, { partOf: () => 4, crownCenter: new THREE4.Vector3(0, o.length[0] * 1.15, 0), crownRadius: 32, rng: new RNG(seed) });
    const s = new THREE4.Scene();
    s.add(new THREE4.HemisphereLight(16773852, 4872752, 1.5));
    const l = new THREE4.DirectionalLight(16770752, 2.6);
    l.position.set(-1, 1.4, 1.6);
    s.add(l);
    const bm = new THREE4.Mesh(bg, new THREE4.MeshStandardMaterial({ map: barkC, normalMap: barkN, color: 12101264, roughness: 1 }));
    const lm = new THREE4.Mesh(lg, new THREE4.MeshStandardMaterial({ map: leafTex, alphaTest: 0.5, side: THREE4.DoubleSide, vertexColors: true, color: tint, roughness: 0.85, emissive: 1450506 }));
    s.add(bm, lm);
    const box = new THREE4.Box3().setFromObject(lm).union(new THREE4.Box3().setFromObject(bm));
    const w = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 1.04, h = (box.max.y - Math.min(0, box.min.y)) * 1.03;
    const cam = new THREE4.OrthographicCamera(-w / 2, w / 2, h, 0, -500, 500);
    cam.position.set(0, 0, 100);
    cam.lookAt(0, 0, 0);
    const RW = 256, RH = Math.round(256 * (h / w));
    const rt = new THREE4.WebGLRenderTarget(RW, RH, { generateMipmaps: true, minFilter: THREE4.LinearMipmapLinearFilter, magFilter: THREE4.LinearFilter });
    const prevTM = renderer.toneMapping;
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0, 0);
    renderer.clear();
    renderer.render(s, cam);
    renderer.setRenderTarget(null);
    renderer.setClearColor(0, 1);
    renderer.toneMapping = prevTM;
    bg.dispose();
    lg.dispose();
    bm.material.dispose();
    lm.material.dispose();
    return { tex: rt.texture, w, h };
  }
  function billboardMesh(imp, pts, rng, scaleRange, darken) {
    const geo = new THREE4.PlaneGeometry(1, 1);
    geo.translate(0, 0.5, 0);
    const ig = new THREE4.InstancedBufferGeometry();
    ig.index = geo.index;
    ig.attributes.position = geo.attributes.position;
    ig.attributes.uv = geo.attributes.uv;
    const off = new Float32Array(pts.length * 4), tint = new Float32Array(pts.length);
    pts.forEach(([x, z], i) => {
      off.set([x, terrainH(x, z) - 1, z, rng.random(scaleRange[1], scaleRange[0])], i * 4);
      tint[i] = rng.random(1.08, 0.82) * darken;
    });
    ig.setAttribute("aOff", new THREE4.InstancedBufferAttribute(off, 4));
    ig.setAttribute("aTint", new THREE4.InstancedBufferAttribute(tint, 1));
    ig.instanceCount = pts.length;
    const m = new THREE4.ShaderMaterial({
      uniforms: { uMap: { value: imp.tex }, uSize: { value: new THREE4.Vector2(imp.w, imp.h) }, uFogC: { value: FOG }, uFogN: { value: scene.fog.near }, uFogF: { value: scene.fog.far } },
      vertexShader: `attribute vec4 aOff; attribute float aTint; uniform vec2 uSize; varying vec2 vUv; varying float vT; varying float vFog;
      void main(){
        vUv = uv; vT = aTint;
        vec3 right = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]));
        vec3 p = aOff.xyz + right * position.x * uSize.x * aOff.w + vec3(0.0,1.0,0.0) * position.y * uSize.y * aOff.w;
        vec4 mv = viewMatrix * vec4(p, 1.0);
        vFog = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
      fragmentShader: `uniform sampler2D uMap; uniform vec3 uFogC; uniform float uFogN; uniform float uFogF; varying vec2 vUv; varying float vT; varying float vFog;
      void main(){
        vec4 c = texture2D(uMap, vUv);
        if (c.a < 0.45) discard;
        vec3 col = c.rgb / max(c.a, 0.001) * vT;
        col *= mix(0.72, 1.0, smoothstep(0.0, 0.35, vUv.y));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogC, smoothstep(uFogN, uFogF, vFog));
      }`
    });
    const mesh = new THREE4.Mesh(ig, m);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  }
  function buildForest(barkC, barkN, oakT, ashT) {
    const base = (over) => Object.assign({ levels: 3, force: { x: 0, y: 1, z: 0, strength: 0.01 }, sections: { 0: 8, 1: 5, 2: 3, 3: 2 }, segments: { 0: 7, 1: 4, 2: 3, 3: 3 }, taper: { 0: 0.7, 1: 0.6, 2: 0.7, 3: 0.8 }, twist: { 0: 0, 1: 0, 2: 0, 3: 0 } }, over);
    const V = [
      { seed: 101, leaf: oakT, tint: 14214332, o: base({ angle: { 1: 48, 2: 42, 3: 32 }, children: { 0: 7, 1: 4, 2: 3 }, gnarliness: { 0: 0.05, 1: 0.16, 2: 0.1, 3: 0.08 }, length: { 0: 30, 1: 20, 2: 10, 3: 4.5 }, radius: { 0: 2.4, 1: 0.6, 2: 0.65, 3: 0.8 }, start: { 1: 0.38, 2: 0.15, 3: 0.1 }, leaves: { count: 10, start: 0.1, size: 6.5, sizeVariance: 0.4, angle: 40 } }) },
      { seed: 202, leaf: ashT, tint: 13228208, o: base({ angle: { 1: 36, 2: 38, 3: 30 }, children: { 0: 8, 1: 4, 2: 3 }, force: { x: 0, y: 1, z: 0, strength: 0.02 }, gnarliness: { 0: 0.03, 1: 0.12, 2: 0.1, 3: 0.08 }, length: { 0: 40, 1: 18, 2: 9, 3: 4 }, radius: { 0: 2, 1: 0.55, 2: 0.65, 3: 0.8 }, start: { 1: 0.42, 2: 0.15, 3: 0.1 }, taper: { 0: 0.75, 1: 0.6, 2: 0.7, 3: 0.8 }, leaves: { count: 10, start: 0.1, size: 7, sizeVariance: 0.4, angle: 30 } }) },
      { seed: 303, leaf: oakT, tint: 12570780, o: base({ angle: { 1: 58, 2: 44, 3: 34 }, children: { 0: 8, 1: 4, 2: 3 }, force: { x: 0, y: 1, z: 0, strength: -5e-3 }, gnarliness: { 0: 0.06, 1: 0.18, 2: 0.12, 3: 0.08 }, length: { 0: 24, 1: 22, 2: 11, 3: 4.5 }, radius: { 0: 2.6, 1: 0.62, 2: 0.65, 3: 0.8 }, start: { 1: 0.35, 2: 0.15, 3: 0.1 }, leaves: { count: 10, start: 0.1, size: 6.8, sizeVariance: 0.4, angle: 40 } }) },
      { seed: 404, leaf: ashT, tint: 11715732, o: base({ angle: { 1: 30, 2: 34, 3: 30 }, children: { 0: 9, 1: 4, 2: 3 }, force: { x: 0, y: 1, z: 0, strength: 0.03 }, gnarliness: { 0: 0.02, 1: 0.1, 2: 0.1, 3: 0.08 }, length: { 0: 46, 1: 16, 2: 8, 3: 4 }, radius: { 0: 1.9, 1: 0.55, 2: 0.65, 3: 0.8 }, start: { 1: 0.5, 2: 0.15, 3: 0.1 }, leaves: { count: 10, start: 0.1, size: 7, sizeVariance: 0.4, angle: 30 } }) }
    ];
    const imps = V.map((v) => bakeTreeImpostor(v.o, v.seed, v.leaf, barkC, barkN, v.tint));
    const rng = new RNG(555);
    const sets = imps.map(() => ({ near: [], far: [] }));
    let tries = 0, n = 0;
    const placed = [];
    while (n < 1900 && tries < 8e4) {
      tries++;
      const r = 820 + Math.pow(rng.random(), 0.85) * 2700, a = rng.random(Math.PI * 2);
      const x = Math.sin(a) * r, z = Math.cos(a) * r;
      if (z > -120 && Math.abs(x) < 720 + Math.max(0, z) * 0.8) continue;
      if (r < 1700 && placed.some((p) => (p[0] - x) ** 2 + (p[1] - z) ** 2 < 48 * 48)) continue;
      placed.push([x, z]);
      sets[n % imps.length][r < 1700 ? "near" : "far"].push([x, z]);
      n++;
    }
    imps.forEach((imp, k) => {
      billboardMesh(imp, sets[k].near, rng, [1.1, 1.7], 1);
      billboardMesh(imp, sets[k].far, rng, [1.6, 2.6], 0.9);
    });
  }
  function bakeMeshes(gltf) {
    const out = [];
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        const g = o.geometry.clone();
        g.applyMatrix4(o.matrixWorld);
        out.push({ geo: g, mat: o.material });
      }
    });
    return out;
  }
  function windPatch(mat) {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = U.uTime;
      sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      float w = sin(uTime*1.3 + ip.x*0.05 + ip.z*0.04) + 0.4*sin(uTime*2.7 + ip.x*0.13);
      transformed.xz += vec2(0.28,0.18) * w * max(position.y,0.0) * 0.6;`);
    };
  }
  function scatterRect(n, rng, x0, x1, z0, z1, filter) {
    const pts = [];
    let tries = 0;
    while (pts.length < n && tries < n * 20) {
      tries++;
      const x = rng.random(x1, x0), z = rng.random(z1, z0);
      if (filter(x, z)) pts.push([x, z]);
    }
    return pts.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
  }
  function buildGrass(grassGltf, flowers) {
    const [{ geo, mat }] = bakeMeshes(grassGltf);
    const gMat = new THREE4.MeshStandardMaterial({ map: mat.map, alphaTest: 0.5, side: THREE4.DoubleSide, roughness: 0.9, color: 13495180 });
    windPatch(gMat);
    const make = (pts, parent, material, seed) => {
      const im = new THREE4.InstancedMesh(geo, material, pts.length);
      const d = new THREE4.Object3D();
      const c = new THREE4.Color();
      const rng2 = new RNG(seed);
      pts.forEach(([x, z], i) => {
        d.position.set(x, terrainH(x, z) - 0.05, z);
        d.rotation.set(0, rng2.random(Math.PI * 2), 0);
        const s = rng2.random(4.4, 2.6);
        d.scale.set(s, s * rng2.random(1.3, 0.8), s);
        d.updateMatrix();
        im.setMatrixAt(i, d.matrix);
        c.setRGB(rng2.random(0.9, 0.68), rng2.random(1.12, 0.95), rng2.random(0.6, 0.45));
        im.setColorAt(i, c);
      });
      im.receiveShadow = true;
      im.userData.max = pts.length;
      parent.add(im);
      grassMeshes.push(im);
      return im;
    };
    const rng = new RNG(11);
    const okMain = (x, z) => {
      const r = Math.hypot(x, z);
      return r > 150 && r < 820 && !inTrench(x, z) && rng.random() < 1.25 - r / 820;
    };
    make(scatterRect(24e3, rng, -820, 820, -820, 820, okMain), groundG, gMat, 1);
    make(scatterRect(7e3, rng, -TX + 2, TX - 2, ZC + 2, ZF - 2, () => true), slab, gMat, 2);
    flowers.forEach((f, k) => {
      const parts = bakeMeshes(f);
      const r3 = new RNG(30 + k);
      const pts = scatterRect(150, r3, -700, 700, -600, 800, (x, z) => Math.hypot(x, z) > 190);
      parts.forEach(({ geo: fg, mat: fm }) => {
        const m = new THREE4.MeshStandardMaterial({ map: fm.map, color: fm.color, side: THREE4.DoubleSide, alphaTest: 0.5, roughness: 0.8 });
        windPatch(m);
        const mainPts = pts.filter(([x, z]) => !inTrench(x, z)), wPts = pts.filter(([x, z]) => inTrench(x, z));
        [[mainPts, groundG], [wPts, slab]].forEach(([pp, parent]) => {
          if (!pp.length) return;
          const im = new THREE4.InstancedMesh(fg, m, pp.length);
          const d = new THREE4.Object3D();
          const r2 = new RNG(pp.length + k);
          pp.forEach(([x, z], i) => {
            d.position.set(x, terrainH(x, z), z);
            d.rotation.y = r2.random(6.28);
            d.scale.setScalar(r2.random(3.8, 2.4));
            d.updateMatrix();
            im.setMatrixAt(i, d.matrix);
          });
          parent.add(im);
        });
      });
    });
  }
  function makeGhostLayers() {
    const g = new THREE4.Group();
    for (const y of [LAYER[1], LAYER[2]]) {
      const pg = new THREE4.PlaneGeometry(TX * 2, ZF - ZC);
      pg.rotateX(-Math.PI / 2);
      pg.translate(0, y, (ZC + ZF) / 2);
      const m = new THREE4.Mesh(pg, new THREE4.MeshBasicMaterial({ color: 16767392, transparent: true, opacity: 0, side: THREE4.DoubleSide, depthWrite: false }));
      m.userData.base = 0.06;
      g.add(m);
      const pts = [[-TX, ZC], [-TX, ZF], [TX, ZF], [TX, ZC]].map(([x, z]) => new THREE4.Vector3(x, y, z));
      const l = new THREE4.Line(new THREE4.BufferGeometry().setFromPoints(pts), new THREE4.LineBasicMaterial({ color: 16765066, transparent: true, opacity: 0 }));
      l.userData.base = 0.5;
      g.add(l);
    }
    scene.add(g);
    g.visible = false;
    return g;
  }
  function softDot() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,240,200,0.8)");
    gr.addColorStop(1, "rgba(255,220,150,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    return new THREE4.CanvasTexture(c);
  }
  var DOT = softDot();
  var pointsMat = (color = "vec3(1.0,0.78,0.38)*2.0") => new THREE4.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE4.AdditiveBlending,
    uniforms: { uMap: { value: DOT }, uOpacity: { value: 0 }, uScale: { value: window.innerHeight / 2 }, uTime: U.uTime },
    vertexShader: `attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale; uniform float uTime;
    void main(){ vA = aAlpha; vec4 mv = modelViewMatrix*vec4(position,1.); gl_PointSize = max(aSize * uScale / max(-mv.z, 1.0) * 2.2, 0.0); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform sampler2D uMap; uniform float uOpacity; varying float vA;
    void main(){ vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(${color}, clamp(t.a*vA*uOpacity, 0.0, 1.0)); }`
  });
  function makeNutrients() {
    const paths = [];
    for (const r of rskel) {
      if (r.children.length) continue;
      const chain = [];
      let c = r;
      while (c) {
        chain.unshift(c);
        c = c.parent >= 0 ? rskel[c.parent] : null;
      }
      const pts2 = [];
      chain.forEach((b) => b.sections.forEach((s) => pts2.push(s.origin.clone())));
      pts2.reverse();
      if (pts2[0].z < ZC + 4) continue;
      pts2.push(giant.center(4));
      const curve = new THREE4.CatmullRomCurve3(pts2);
      paths.push({ curve, len: curve.getLength(), depth: Math.min(...pts2.map((p) => p.y)) });
    }
    if (!paths.length) paths.push({ curve: new THREE4.CatmullRomCurve3([new THREE4.Vector3(0, -90, 260), new THREE4.Vector3(0, 0, 0)]), len: 280, depth: -90 });
    const N = 520;
    const geo = new THREE4.BufferGeometry();
    const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N);
    geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
    geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
    const rng = new RNG(5);
    const P = [];
    for (let i = 0; i < N; i++) {
      P.push({ path: paths[Math.floor(rng.random(paths.length))], t: rng.random(), sp: rng.random(0.09, 0.04) });
      sz[i] = rng.random(7, 3.5);
    }
    const pts = new THREE4.Points(geo, pointsMat());
    pts.frustumCulled = false;
    pts.userData = { P };
    scene.add(pts);
    return pts;
  }
  var _v = new THREE4.Vector3();
  function updateNutrients(dt) {
    const { P } = particles.userData;
    const pos = particles.geometry.attributes.position.array, al = particles.geometry.attributes.aAlpha.array;
    const depthLimit = currentRootDepth();
    P.forEach((p, i) => {
      p.t += state.nutriDir * dt * p.sp * 120 / p.path.len;
      if (p.t > 1) p.t -= 1;
      if (p.t < 0) p.t += 1;
      p.path.curve.getPointAt(p.t, _v);
      pos[i * 3] = _v.x;
      pos[i * 3 + 1] = _v.y;
      pos[i * 3 + 2] = _v.z;
      const fade = Math.min(1, p.t * 6, (1 - p.t) * 8);
      al[i] = p.path.depth >= depthLimit - 0.5 ? fade : 0;
    });
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.aAlpha.needsUpdate = true;
  }
  function makeSparkles() {
    const N = 1400;
    const rng = new RNG(77);
    const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos.set([rng.random(TX - 4, -TX + 4), rng.random(-4, -D + 3), rng.random(ZF - 4, ZC + 4)], i * 3);
      sz[i] = rng.random(3.2, 1.2);
      al[i] = rng.random(1, 0.3);
    }
    const geo = new THREE4.BufferGeometry();
    geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
    geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
    const m = pointsMat("vec3(1.0,0.84,0.55)*1.4");
    m.vertexShader = m.vertexShader.replace("vA = aAlpha;", "vA = aAlpha*(0.3 + 0.7*pow(max(0.5+0.5*sin(uTime*1.5 + position.x*0.7 + position.z*1.3),0.0),3.0));");
    const p = new THREE4.Points(geo, m);
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }
  function makeMotes() {
    const N = 420;
    const rng = new RNG(88);
    const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = Math.sqrt(rng.random()) * 560, a = rng.random(6.28);
      pos.set([Math.sin(a) * r, rng.random(520, 15), Math.cos(a) * r], i * 3);
      sz[i] = rng.random(2.6, 0.9);
      al[i] = rng.random(1, 0.3);
    }
    const geo = new THREE4.BufferGeometry();
    geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
    geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
    const m = pointsMat("vec3(1.0,0.92,0.7)*1.4");
    m.vertexShader = m.vertexShader.replace("vA = aAlpha; vec4 mv = modelViewMatrix*vec4(position,1.);", `vec3 p = position; float ph = position.x*0.13 + position.z*0.07;
    p += vec3(sin(uTime*0.21+ph)*16.0, sin(uTime*0.17+ph*1.7)*11.0, cos(uTime*0.19+ph)*16.0);
    vA = aAlpha*(0.35 + 0.65*pow(max(0.5+0.5*sin(uTime*0.9+ph*5.0),0.0),2.0));
    vec4 mv = modelViewMatrix*vec4(p,1.);`);
    m.uniforms.uOpacity.value = 0.75;
    const p = new THREE4.Points(geo, m);
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }
  function makeRays() {
    const g = new THREE4.Group();
    const axis = new THREE4.Vector3(0.42, -1, 0.38).normalize();
    const rng = new RNG(12);
    for (let i = 0; i < 12; i++) {
      const w = rng.random(130, 46), L = rng.random(1150, 800);
      const m = new THREE4.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE4.AdditiveBlending,
        side: THREE4.DoubleSide,
        fog: false,
        uniforms: { uTime: U.uTime, uOpacity: { value: 1 }, uSeed: { value: rng.random() } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uOpacity; uniform float uSeed;
        void main(){
          float edge = pow(max(sin(vUv.x*3.14159), 0.0), 2.2);
          float along = smoothstep(0.0, 0.25, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
          float flick = 0.75 + 0.25*sin(uTime*0.6 + uSeed*7.0);
          gl_FragColor = vec4(vec3(1.0,0.9,0.62), clamp(edge*along*flick*0.085*uOpacity, 0.0, 1.0));
        }`
      });
      const mesh = new THREE4.Mesh(new THREE4.PlaneGeometry(w, L), m);
      const end = new THREE4.Vector3(rng.random(620, -640), 0, rng.random(330, -420));
      mesh.position.copy(end.clone().addScaledVector(axis, -L * 0.42));
      mesh.userData.axis = axis;
      g.add(mesh);
    }
    scene.add(g);
    return g;
  }
  function updateRays() {
    const camPos = camera.position;
    rays.children.forEach((m) => {
      const Y = m.userData.axis.clone().negate();
      const toCam = camPos.clone().sub(m.position).normalize();
      const X = new THREE4.Vector3().crossVectors(Y, toCam).normalize();
      const Z = new THREE4.Vector3().crossVectors(X, Y).normalize();
      m.quaternion.setFromRotationMatrix(new THREE4.Matrix4().makeBasis(X, Y, Z));
    });
  }
  var FX = {};
  var ANCH = {};
  var LP = (limb, t) => limb.curve.getPointAt(Math.min(1, Math.max(0, t))).clone().multiplyScalar(giant.S);
  var limbRadius = (limb, t) => (limb.r0 * Math.pow(1 - 0.78 * t, 1.15) + 0.25) * giant.S;
  function flowMat(color, op = 0.8, speed = 3, freq = 40, depthTest = true) {
    return new THREE4.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest,
      blending: THREE4.AdditiveBlending,
      side: THREE4.DoubleSide,
      uniforms: { uTime: U.uTime, uOp: { value: 0 }, uColor: { value: new THREE4.Color(color) }, uMax: { value: op }, uSpeed: { value: speed }, uFreq: { value: freq } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uOp; uniform vec3 uColor; uniform float uMax; uniform float uSpeed; uniform float uFreq;
      void main(){
        float band = pow(max(0.5+0.5*sin(vUv.x*uFreq - uTime*uSpeed), 0.0), 5.0);
        float edge = pow(max(sin(vUv.y*3.14159), 0.0), 1.5);
        gl_FragColor = vec4(uColor*1.6, clamp((0.28 + 0.72*band)*edge*uOp*uMax, 0.0, 1.0));
      }`
    });
  }
  function buildExtras(barkC, barkN, leafT) {
    const S = giant.S;
    const limbA = giant.limbs.find((l) => l.part === 1), limbB = giant.limbs.find((l) => l.part === 2);
    const leader = giant.limbs.find((l) => l.leader);
    ANCH.limbA = LP(limbA, 0.42);
    ANCH.limbB = LP(limbB, 0.42);
    ANCH.crown = new THREE4.Vector3(0, giant.TH + 170, 0);
    ANCH.base = new THREE4.Vector3(0, 40, 230);
    {
      const pts = [];
      for (let y = -115; y <= giant.TH * 0.95; y += 22) pts.push(giant.center(y));
      for (let t = 0.12; t <= 1.0001; t += 0.11) pts.push(LP(leader, t));
      const curve = new THREE4.CatmullRomCurve3(pts);
      const g = new THREE4.Group();
      const inner = new THREE4.Mesh(new THREE4.TubeGeometry(curve, 200, 7, 12, false), flowMat(16762976, 0.9, 3.5, 70, false));
      const halo = new THREE4.Mesh(new THREE4.TubeGeometry(curve, 120, 22, 16, false), flowMat(16756800, 0.28, 2, 30, false));
      inner.renderOrder = 6;
      halo.renderOrder = 5;
      g.add(halo, inner);
      const N = 260, rng = new RNG(321);
      const geo = new THREE4.BufferGeometry();
      const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N);
      geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
      geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
      geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
      const P = [];
      for (let i = 0; i < N; i++) {
        P.push({ t: rng.random(), sp: rng.random(0.06, 0.03), off: new THREE4.Vector3(rng.random(10, -10), 0, rng.random(10, -10)) });
        sz[i] = rng.random(9, 4);
      }
      const m = pointsMat("vec3(1.0,0.82,0.42)*2.0");
      m.depthTest = false;
      const sparks = new THREE4.Points(geo, m);
      sparks.frustumCulled = false;
      sparks.renderOrder = 7;
      sparks.userData = { P, curve };
      g.add(sparks);
      g.visible = false;
      scene.add(g);
      FX.core = { group: g, mats: [inner.material, halo.material], sparks, v: 0 };
      ANCH.core = giant.center(giant.TH * 0.55);
    }
    const ringAt = (limb, t, scale, color, thick) => {
      const r = limbRadius(limb, t) * scale;
      const m = new THREE4.Mesh(new THREE4.TorusGeometry(r, thick, 10, 48), new THREE4.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE4.AdditiveBlending, depthWrite: false, depthTest: false }));
      m.position.copy(LP(limb, t));
      m.renderOrder = 8;
      const tan = limb.curve.getTangentAt(t);
      m.quaternion.setFromUnitVectors(new THREE4.Vector3(0, 0, 1), tan);
      scene.add(m);
      m.visible = false;
      return m;
    };
    FX.graftA = { meshes: [ringAt(limbA, 0.1, 1.45, 16762976, 5), ringAt(limbA, 0.16, 1.4, 16769184, 2.5)], v: 0 };
    FX.graftB = { meshes: [ringAt(limbB, 0.1, 1.45, 16762976, 5), ringAt(limbB, 0.16, 1.4, 16769184, 2.5)], v: 0 };
    FX.tiers = { meshes: [ringAt(limbB, 0.32, 2, 13666888, 4.5), ringAt(limbB, 0.55, 2.2, 14213872, 4.5), ringAt(limbB, 0.78, 2.5, 16765773, 4.5)], v: 0 };
    ANCH.tier = [LP(limbB, 0.3), LP(limbB, 0.55), LP(limbB, 0.8)];
    {
      const a = LP(limbA, 0.45), b = LP(limbB, 0.45);
      const mid = a.clone().add(b).multiplyScalar(0.5).add(new THREE4.Vector3(0, -50, 260));
      const curve = new THREE4.CatmullRomCurve3([a, a.clone().lerp(mid, 0.55).add(new THREE4.Vector3(0, -10, 40)), mid, b.clone().lerp(mid, 0.55).add(new THREE4.Vector3(0, -10, 40)), b]);
      const g = new THREE4.Group();
      const tube2 = new THREE4.Mesh(new THREE4.TubeGeometry(curve, 120, 5, 10, false), flowMat(10477823, 1, 5, 26));
      const halo = new THREE4.Mesh(new THREE4.TubeGeometry(curve, 80, 13, 12, false), flowMat(7325951, 0.3, 3, 12));
      g.add(halo, tube2);
      g.visible = false;
      scene.add(g);
      FX.bridge = { group: g, mats: [tube2.material, halo.material], v: 0 };
      ANCH.bridge = curve.getPointAt(0.5);
    }
    {
      const rng = new RNG(808);
      const cand = giant.crownPts.filter((c) => c.p.y > giant.TH + 40);
      const mk = (n, rad, colors, emis) => {
        const geo = new THREE4.IcosahedronGeometry(1, 2);
        const mat = new THREE4.MeshStandardMaterial({ color: 16777215, roughness: 0.45, emissive: emis, emissiveIntensity: 0.55 });
        mat.userData.u = { uAppear: { value: 0 } };
        mat.onBeforeCompile = (sh) => {
          sh.uniforms.uAppear = mat.userData.u.uAppear;
          sh.vertexShader = "uniform float uAppear;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed *= uAppear;");
        };
        const im = new THREE4.InstancedMesh(geo, mat, n);
        const d = new THREE4.Object3D(), c = new THREE4.Color();
        for (let i = 0; i < n; i++) {
          const k = cand[Math.floor(rng.random(cand.length))];
          const dir = k.p.clone().sub(new THREE4.Vector3(0, giant.TH + 60, 0)).normalize().add(new THREE4.Vector3(rng.random(0.6, -0.6), rng.random(0.4, -0.5), rng.random(0.6, -0.6))).normalize();
          d.position.copy(k.p).addScaledVector(dir, k.r * rng.random(0.95, 0.7));
          d.scale.setScalar(rad * rng.random(1.25, 0.8));
          d.updateMatrix();
          im.setMatrixAt(i, d.matrix);
          c.set(colors[Math.floor(rng.random(colors.length))]);
          im.setColorAt(i, c);
        }
        im.frustumCulled = false;
        im.visible = false;
        scene.add(im);
        return im;
      };
      FX.fruit = { meshes: [mk(230, 10.5, [16747050, 16756782, 15224874, 16765503], 8006144), mk(300, 7, [16777215, 16770031, 16774600], 6969936)], v: 0 };
    }
    {
      const N = 300, rng = new RNG(919);
      const cand = giant.crownPts;
      const geo = new THREE4.BufferGeometry();
      const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N), ug = new Float32Array(N);
      geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
      geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
      geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
      geo.setAttribute("aU", new THREE4.BufferAttribute(ug, 1));
      const P = [];
      const spawn = (p, first) => {
        const k = cand[Math.floor(rng.random(cand.length))];
        p.s = k.p.clone().add(new THREE4.Vector3(rng.random(30, -30), rng.random(10, -30), rng.random(30, -30)));
        p.g = new THREE4.Vector3(rng.random(TX - 40, -TX + 40), 0, rng.random(ZC + 280, ZC + 25));
        p.depth = -rng.random(D - 12, 18);
        p.t = first ? rng.random() : 0;
        p.sp = rng.random(0.11, 0.07);
        p.ph = rng.random(6.28);
      };
      for (let i = 0; i < N; i++) {
        const p = {};
        spawn(p, true);
        P.push(p);
        sz[i] = rng.random(26, 15);
      }
      const m = new THREE4.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uMap: { value: leafT }, uOpacity: { value: 0 }, uScale: { value: window.innerHeight / 2 } },
        vertexShader: `attribute float aSize; attribute float aAlpha; attribute float aU; varying float vA; varying float vU; uniform float uScale;
        void main(){ vA = aAlpha; vU = aU; vec4 mv = modelViewMatrix*vec4(position,1.); gl_PointSize = max(aSize * uScale / max(-mv.z,1.0), 0.0); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform sampler2D uMap; uniform float uOpacity; varying float vA; varying float vU;
        void main(){ vec4 t = texture2D(uMap, gl_PointCoord); if (t.a < 0.45) discard;
          vec3 autumn = t.rgb * vec3(1.55, 1.0, 0.35);
          vec3 c = mix(autumn, vec3(1.0,0.82,0.42)*1.6, vU);
          gl_FragColor = vec4(c, clamp(vA*uOpacity*(1.0 - 0.35*vU), 0.0, 1.0));
          #include <colorspace_fragment>
        }`
      });
      const pts = new THREE4.Points(geo, m);
      pts.frustumCulled = false;
      pts.visible = false;
      scene.add(pts);
      FX.leaves = { pts, P, spawn, v: 0 };
      ANCH.leaf = new THREE4.Vector3(0, 120, ZC + 140);
    }
    {
      const rng = new RNG(4321);
      const people = [];
      const groups = 15;
      for (let g2 = 0; g2 < groups; g2++) {
        const ang = Math.PI / 2 + (g2 / (groups - 1) - 0.5) * 2.5 + rng.random(0.06, -0.06);
        const r = rng.random(330, 255);
        const c = new THREE4.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r);
        const n = 2 + Math.floor(rng.random(2.99));
        for (let i = 0; i < n; i++) {
          const side = new THREE4.Vector3(-Math.sin(ang), 0, Math.cos(ang));
          const p = c.clone().addScaledVector(side, (i - (n - 1) / 2) * 17).add(new THREE4.Vector3(rng.random(2, -2), 0, rng.random(2, -2)));
          people.push({ p, adult: i === 0 || rng.random() < 0.25, face: Math.atan2(-p.x, -p.z), water: g2 % 4 === 1 && i === 0 });
        }
      }
      const body = new THREE4.CapsuleGeometry(2.3, 5.2, 4, 10);
      body.translate(0, 4.9, 0);
      const head = new THREE4.SphereGeometry(2, 14, 10);
      head.translate(0, 11.3, 0);
      const bm = new THREE4.MeshStandardMaterial({ roughness: 0.8 });
      const hm = new THREE4.MeshStandardMaterial({ color: 15845797, roughness: 0.7 });
      const bi = new THREE4.InstancedMesh(body, bm, people.length), hi = new THREE4.InstancedMesh(head, hm, people.length);
      const shirts = [4161471, 14706234, 5808986, 15250234, 10117056, 14241643, 3843744, 15921906];
      const d = new THREE4.Object3D(), col = new THREE4.Color();
      people.forEach((pp, i) => {
        d.position.set(pp.p.x, terrainH(pp.p.x, pp.p.z), pp.p.z);
        d.rotation.set(0, pp.face, 0);
        d.scale.setScalar(pp.adult ? 2.4 : 1.6);
        d.updateMatrix();
        bi.setMatrixAt(i, d.matrix);
        hi.setMatrixAt(i, d.matrix);
        col.set(shirts[i % shirts.length]);
        bi.setColorAt(i, col);
      });
      bi.castShadow = hi.castShadow = true;
      const g = new THREE4.Group();
      g.add(bi, hi);
      g.visible = false;
      scene.add(g);
      const waterers = people.filter((pp) => pp.water);
      const canMat = new THREE4.MeshStandardMaterial({ color: 3116890, roughness: 0.45, metalness: 0.3 });
      const cans = waterers.map((pp) => {
        const can = new THREE4.Group();
        const body2 = new THREE4.Mesh(new THREE4.CylinderGeometry(3.2, 3.6, 6, 18), canMat);
        const spout = new THREE4.Mesh(new THREE4.CylinderGeometry(0.55, 0.9, 9, 10), canMat);
        spout.position.set(0, 1.2, 6.2);
        spout.rotation.x = Math.PI / 2 - 0.55;
        const rose = new THREE4.Mesh(new THREE4.CylinderGeometry(1.5, 0.7, 1.4, 14), canMat);
        rose.position.set(0, 3.6, 10);
        rose.rotation.x = Math.PI / 2 - 0.55;
        const handle = new THREE4.Mesh(new THREE4.TorusGeometry(2.6, 0.45, 8, 20, Math.PI), canMat);
        handle.position.set(0, 3, -0.4);
        handle.rotation.y = Math.PI / 2;
        can.add(body2, spout, rose, handle);
        const dir = new THREE4.Vector3(-pp.p.x, 0, -pp.p.z).normalize();
        can.position.set(pp.p.x, terrainH(pp.p.x, pp.p.z) + 15, pp.p.z).addScaledVector(dir, 9);
        can.rotation.order = "YXZ";
        can.rotation.y = pp.face;
        can.rotation.x = 0.62;
        can.scale.setScalar(1.35);
        can.traverse((m) => m.castShadow = true);
        g.add(can);
        can.updateMatrixWorld(true);
        const tip = new THREE4.Vector3(0, 4.2, 10.8);
        can.localToWorld(tip);
        return { tip, dir };
      });
      const N = cans.length * 26, geo = new THREE4.BufferGeometry();
      const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N);
      geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
      geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
      geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
      const W = [];
      for (let i = 0; i < N; i++) {
        W.push({ c: cans[i % cans.length], t: rng.random(), sx: rng.random(1.6, -1.6), sz: rng.random(1.6, -1.6) });
        sz[i] = rng.random(2.6, 1.4);
        al[i] = 1;
      }
      const wm = pointsMat("vec3(0.62,0.85,1.0)*1.3");
      const water = new THREE4.Points(geo, wm);
      water.frustumCulled = false;
      g.add(water);
      FX.people = { group: g, water, W, v: 0 };
      ANCH.people = new THREE4.Vector3(0, 14, 290);
    }
    {
      const lite = buildGiant({ seed: 77, scale: 1, wide: 1, density: 0.9, card: 1.35, lite: true });
      const rng = new RNG(2468);
      const sites = [];
      const angs = [200, 228, 256, 284, 312, 340, 20, 48, 140, 165];
      angs.forEach((deg, i) => {
        const a = THREE4.MathUtils.degToRad(deg + rng.random(6, -6));
        const r = rng.random(780, 650);
        sites.push(new THREE4.Vector3(Math.sin(a) * r, 0, Math.cos(a) * r));
      });
      const minis = sites.map((site, i) => {
        const u = { uGrow: { value: 0 }, uThin: { value: 0.3 }, uLeafBoost: { value: 2.6 }, uHL: { value: [0, 0, 0, 0, 0, 0] }, uTime: U.uTime, uDim: { value: 0 } };
        const bmat = new THREE4.MeshStandardMaterial({ map: barkC, normalMap: barkN, roughness: 0.95, color: 15984336, emissive: 1840140, vertexColors: true });
        bmat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, u);
          sh.vertexShader = barkGrowPars + sh.vertexShader.replace("#include <begin_vertex>", barkGrowMain);
        };
        bmat.customProgramCacheKey = () => "miniBark";
        const lmat = new THREE4.MeshStandardMaterial({ map: leafT, alphaTest: 0.5, side: THREE4.DoubleSide, vertexColors: true, roughness: 0.75, color: 15922902, emissive: 2373647 });
        lmat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, u);
          sh.vertexShader = leafGrowPars + sh.vertexShader.replace("#include <begin_vertex>", leafGrowMain);
        };
        lmat.customProgramCacheKey = () => "miniLeaf";
        const g = new THREE4.Group();
        g.add(new THREE4.Mesh(lite.barkGeo, bmat), new THREE4.Mesh(lite.leafGeo, lmat));
        g.children.forEach((m) => {
          m.frustumCulled = false;
          m.receiveShadow = true;
        });
        g.position.set(site.x, terrainH(site.x, site.z) - 1, site.z);
        g.rotation.y = rng.random(6.28);
        g.userData = { u, max: rng.random(1.05, 0.8), delay: i * 0.45 };
        g.visible = false;
        scene.add(g);
        return g;
      });
      const N = minis.length * 6, geo = new THREE4.BufferGeometry();
      const pos = new Float32Array(N * 3), sz = new Float32Array(N), al = new Float32Array(N);
      geo.setAttribute("position", new THREE4.BufferAttribute(pos, 3));
      geo.setAttribute("aSize", new THREE4.BufferAttribute(sz, 1));
      geo.setAttribute("aAlpha", new THREE4.BufferAttribute(al, 1));
      for (let i = 0; i < N; i++) sz[i] = i % 6 === 0 ? 16 : 7;
      const seeds = new THREE4.Points(geo, pointsMat("vec3(1.0,0.9,0.55)*2.0"));
      seeds.frustumCulled = false;
      seeds.visible = false;
      scene.add(seeds);
      FX.region = { minis, seeds, sites, t: -1, done: false };
      ANCH.region = new THREE4.Vector3(0, 60, 0);
    }
  }
  function setMiniGrowth(g, u) {
    const U2 = g.userData.u;
    U2.uGrow.value = 0.04 + 0.96 * sstep2(0, 0.9, u);
    U2.uThin.value = 0.3 + 0.7 * sstep2(0, 0.85, u);
    U2.uLeafBoost.value = 1 + 1.6 * (1 - sstep2(0, 0.6, u));
    g.scale.setScalar((0.05 + 0.95 * Math.pow(smooth(u), 0.85)) * g.userData.max);
  }
  function regionReset() {
    const R = FX.region;
    R.t = -1;
    R.done = false;
    R.minis.forEach((g) => {
      g.visible = false;
      setMiniGrowth(g, 0);
    });
    R.seeds.visible = false;
  }
  function regionStart(instant) {
    const R = FX.region;
    if (instant) {
      R.t = 999;
      R.done = true;
      R.minis.forEach((g) => {
        g.visible = true;
        setMiniGrowth(g, 1);
      });
      R.seeds.visible = false;
      return;
    }
    if (R.done || R.t >= 0) return;
    R.t = 0;
    R.seeds.visible = true;
  }
  var _sv = new THREE4.Vector3();
  function updateRegion(dt) {
    const R = FX.region;
    if (R.t < 0 || R.done) return;
    R.t += dt;
    const FLY = 2.4, GROW = 6.5;
    const pos = R.seeds.geometry.attributes.position.array, al = R.seeds.geometry.attributes.aAlpha.array;
    let all = true;
    R.minis.forEach((g, i) => {
      const t0 = g.userData.delay;
      const k = clamp01((R.t - t0) / FLY);
      const src = new THREE4.Vector3(0, giant.TH + 150, 0), dst = R.sites[i];
      for (let j = 0; j < 6; j++) {
        const kk = clamp01(k - j * 0.035);
        _sv.lerpVectors(src, dst, kk);
        _sv.y = THREE4.MathUtils.lerp(src.y, terrainH(dst.x, dst.z) + 4, kk) + Math.sin(kk * Math.PI) * 220;
        const idx = i * 6 + j;
        pos[idx * 3] = _sv.x;
        pos[idx * 3 + 1] = _sv.y;
        pos[idx * 3 + 2] = _sv.z;
        al[idx] = kk > 0 && kk < 1 ? 1 - j / 6 : 0;
      }
      if (k >= 1) {
        g.visible = true;
        setMiniGrowth(g, clamp01((R.t - t0 - FLY) / GROW));
      }
      if (R.t - t0 - FLY < GROW) all = false;
    });
    R.seeds.geometry.attributes.position.needsUpdate = true;
    R.seeds.geometry.attributes.aAlpha.needsUpdate = true;
    if (all) {
      R.done = true;
      R.seeds.visible = false;
    }
  }
  function updateExtras(dt) {
    const fade = (o, tgt, rate = 2.5) => o.v = approach(o.v, tgt, rate, dt);
    const C = FX.core;
    fade(C, state.fx.core ? 1 : 0);
    C.group.visible = C.v > 0.01;
    C.mats.forEach((m) => m.uniforms.uOp.value = C.v);
    if (C.group.visible) {
      const { P, curve } = C.sparks.userData;
      const pos = C.sparks.geometry.attributes.position.array, al = C.sparks.geometry.attributes.aAlpha.array;
      P.forEach((p, i) => {
        p.t = (p.t + dt * p.sp) % 1;
        curve.getPointAt(p.t, _sv);
        pos[i * 3] = _sv.x + p.off.x;
        pos[i * 3 + 1] = _sv.y;
        pos[i * 3 + 2] = _sv.z + p.off.z;
        al[i] = Math.min(1, p.t * 8, (1 - p.t) * 8);
      });
      C.sparks.geometry.attributes.position.needsUpdate = true;
      C.sparks.geometry.attributes.aAlpha.needsUpdate = true;
      C.sparks.material.uniforms.uOpacity.value = C.v;
    }
    [["graftA", "graftA"], ["graftB", "graftB"], ["tiers", "tiers"]].forEach(([k, f]) => {
      const o = FX[k];
      fade(o, state.fx[f] ? 1 : 0);
      o.meshes.forEach((m) => {
        m.visible = o.v > 0.01;
        m.material.opacity = o.v * (0.75 + 0.25 * Math.sin(U.uTime.value * 2.4));
      });
    });
    const B = FX.bridge;
    fade(B, state.fx.bridge ? 1 : 0);
    B.group.visible = B.v > 0.01;
    B.mats.forEach((m) => m.uniforms.uOp.value = B.v);
    const F = FX.fruit;
    fade(F, state.fx.fruit ? 1 : 0, 1.6);
    F.meshes.forEach((m) => {
      m.visible = F.v > 0.01;
      m.material.userData.u.uAppear.value = F.v;
    });
    const L = FX.leaves;
    fade(L, state.fx.leaves ? 1 : 0, 2);
    L.pts.visible = L.v > 0.01;
    if (L.pts.visible) {
      const pos = L.pts.geometry.attributes.position.array, al = L.pts.geometry.attributes.aAlpha.array, ug = L.pts.geometry.attributes.aU.array;
      L.P.forEach((p, i) => {
        p.t += dt * p.sp;
        if (p.t >= 1) L.spawn(p, false);
        const fallEnd = 0.62;
        if (p.t < fallEnd) {
          const k = p.t / fallEnd, e = k * k;
          _sv.lerpVectors(p.s, p.g, e);
          _sv.y = THREE4.MathUtils.lerp(p.s.y, 0, e);
          _sv.x += Math.sin(p.t * 18 + p.ph) * 14 * (1 - e);
          _sv.z += Math.cos(p.t * 15 + p.ph) * 10 * (1 - e);
          ug[i] = 0;
        } else {
          const k = (p.t - fallEnd) / (1 - fallEnd);
          _sv.copy(p.g);
          _sv.y = THREE4.MathUtils.lerp(0, p.depth, smooth(k));
          ug[i] = Math.min(1, k * 3);
        }
        pos[i * 3] = _sv.x;
        pos[i * 3 + 1] = _sv.y;
        pos[i * 3 + 2] = _sv.z;
        al[i] = Math.min(1, p.t * 10, (1 - p.t) * 6);
      });
      L.pts.geometry.attributes.position.needsUpdate = true;
      L.pts.geometry.attributes.aAlpha.needsUpdate = true;
      L.pts.geometry.attributes.aU.needsUpdate = true;
      L.pts.material.uniforms.uOpacity.value = L.v;
    }
    const Pp = FX.people;
    fade(Pp, state.fx.people ? 1 : 0, 2);
    Pp.group.visible = Pp.v > 0.01;
    Pp.group.position.y = (1 - Pp.v) * -16;
    if (Pp.group.visible) {
      const pos = Pp.water.geometry.attributes.position.array;
      Pp.W.forEach((w, i) => {
        w.t = (w.t + dt * 1.1) % 1;
        const { tip, dir } = w.c, k = w.t;
        _sv.copy(tip).addScaledVector(dir, 2 + k * 3);
        _sv.x += w.sx * k * 2.2;
        _sv.z += w.sz * k * 2.2;
        _sv.y = tip.y - (tip.y - 1) * k * k;
        pos[i * 3] = _sv.x;
        pos[i * 3 + 1] = _sv.y;
        pos[i * 3 + 2] = _sv.z;
      });
      Pp.water.geometry.attributes.position.needsUpdate = true;
      Pp.water.material.uniforms.uOpacity.value = Pp.v;
    }
    updateRegion(dt);
  }
  function tag(html, cls = "") {
    const el = document.createElement("div");
    el.className = "tag " + cls;
    el.innerHTML = html;
    const o = new import_CSS2DRenderer.CSS2DObject(el);
    o.userData.el = el;
    return o;
  }
  function makeLabels() {
    const mk = (k, title, sub, cls) => {
      const y = (LAYER[k] + LAYER[k + 1]) / 2;
      const o = tag(`<span class="dot"></span><div class="pill"><b>${title}</b><em>${sub}</em></div>`, "layer left " + cls);
      o.position.set(TX * 0.62, y, ZC + 1.5);
      scene.add(o);
      return o;
    };
    labels.l1 = mk(0, "\u8868\u571F", "\u4E00\u822C\u5E2B\u57F9\uFF5C\u4E03\u7A2E\u6559\u5E2B\u77E5\u8B58", "c1");
    labels.l2 = mk(1, "\u6B21\u571F", "\u67EF\u83EF\u8473\u95B1\u8B80\u7814\u7A76\u4E2D\u5FC3\uFF5C\u5B78\u7406", "c2");
    labels.l3 = mk(2, "\u6DF1\u571F", "\u67EF\u83EF\u8473\u95B1\u8B80\u7814\u7A76\u4E2D\u5FC3\uFF5C\u5BE6\u8E10\u53D6\u5F91", "c3");
    const c = giant.center(130);
    labels.trunk = tag('<span class="dot"></span><div class="pill"><b>\u4E3B\u5E79</b><em>\u6C38\u8208\u570B\u5C0F\uFF5C\u6821\u9577\u30FB\u884C\u653F\u5718\u968A</em></div>', "part left");
    labels.trunk.position.set(c.x - giant.R0 * 0.75, 130, c.z + giant.R0 * 0.55);
    scene.add(labels.trunk);
    labels.root = tag('<span class="dot"></span><div class="pill"><b>\u7D2E\u6839</b><em id="rootTagTxt">\u6DF1\u571F</em></div>', "part left");
    labels.root.position.set(-100, -30, 235);
    scene.add(labels.root);
    const add = (key, b, em, pos, cls = "part") => {
      const o = tag(`<span class="dot"></span><div class="pill"><b>${b}</b><em>${em}</em></div>`, cls);
      o.position.copy(pos);
      scene.add(o);
      labels[key] = o;
    };
    add("core", "\u6A39\u5FC3", "\u95B1\u8B80\u6559\u80B2 \xD7 \u5BE6\u8B49\u7CBE\u795E", ANCH.core, "part gold left");
    add("res", "\u8CC7\u6E90\u4E2D\u5FC3", "\u7B2C 2 \u5340\u504F\u9109\u6559\u80B2\u8CC7\u6E90\u4E2D\u5FC3", ANCH.limbA, "part gold left");
    add("adv", "\u7CBE\u9032\u8A08\u756B", "\u521D\u968E\u30FB\u9032\u968E\u30FB\u9AD8\u968E\u793E\u7FA4", ANCH.tier[2].clone().add(new THREE4.Vector3(0, 40, 0)), "part gold left");
    add("bridge", "\u5354\u4F5C\u9818\u5C0E", "\u6838\u5FC3\u8B1B\u5E2B\u5E36\u9818\u6307\u5B9A\u793E\u7FA4", ANCH.bridge.clone().add(new THREE4.Vector3(0, -45, 0)), "part blue");
    ["\u521D\u968E\u793E\u7FA4", "\u9032\u968E\u793E\u7FA4", "\u9AD8\u968E\u793E\u7FA4"].forEach((t, i) => add("tier" + (i + 1), t, ["\u5171\u540C\u5099\u8AB2", "\u89C0\u8AB2\u8B70\u8AB2", "\u5E36\u9818\u4ED6\u6821"][i], ANCH.tier[i], "part gold"));
    add("canopy", "\u6A39\u51A0", "\u7B2C\u4E00\u7DDA\u6559\u5E2B\u30FB\u958B\u82B1\u7D50\u679C", new THREE4.Vector3(-150, giant.TH + 200, 430), "part green left");
    add("leaf", "\u843D\u8449\u6B78\u6839", "\u8AB2\u5802\u8B49\u64DA\u56DE\u5230\u5B78\u7406", new THREE4.Vector3(-60, 150, ZC + 200), "part gold");
    add("people", "\u5B78\u751F\u30FB\u5BB6\u9577", "\u8B77\u6A39\u611B\u6A39\u30FB\u89AA\u5E2B\u5354\u4F5C", new THREE4.Vector3(60, 62, 330), "part blue");
    const s0 = FX.region.sites[3];
    add("region", "\u9130\u8FD1\u5B78\u6821", "\u7A2E\u5B50\u51FA\u82BD\u30FB\u82D7\u6728\u6210\u6797", new THREE4.Vector3(s0.x, 175, s0.z), "part green");
    Object.values(labels).forEach((l) => {
      l.visible = false;
      l.userData.el.style.opacity = 0;
    });
  }
  function showLabels(list) {
    Object.entries(labels).forEach(([k, l]) => {
      const on = list.includes(k);
      l.userData.el.style.opacity = on ? 1 : 0;
      l.visible = true;
      l.userData.el.style.pointerEvents = on ? "auto" : "none";
    });
  }
  function applyQuality(key, remember = true) {
    qKey = key;
    const Q = QUALITY[key];
    renderer.setPixelRatio(Q.pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (sun.shadow.mapSize.x !== Q.shadow) {
      sun.shadow.mapSize.set(Q.shadow, Q.shadow);
      if (sun.shadow.map) {
        sun.shadow.map.dispose();
        sun.shadow.map = null;
      }
    }
    grassMeshes.forEach((m) => m.count = Math.floor(m.userData.max * Q.grass));
    if (motes) motes.visible = Q.motes;
    const b = $("#quality");
    if (b) b.textContent = "\u756B\u8CEA\uFF1A" + Q.name;
    if (remember) {
      try {
        localStorage.setItem("forestQuality", key);
      } catch (e) {
      }
    }
  }
  var perf = { t: 0, frames: 0, checks: 0 };
  function autoQuality(dt) {
    if (!qAuto || perf.checks >= 2) return;
    perf.t += dt;
    perf.frames++;
    if (perf.t >= 3.5) {
      const fps = perf.frames / perf.t;
      perf.t = 0;
      perf.frames = 0;
      perf.checks++;
      const i = QORDER.indexOf(qKey);
      if (fps < 32 && i < QORDER.length - 1) {
        applyQuality(QORDER[i + 1]);
        toast(`\u5075\u6E2C\u5230\u756B\u9762\u8F03\u5361\uFF0C\u5DF2\u81EA\u52D5\u5207\u63DB\u70BA\u300C${QUALITY[qKey].name}\u300D\u756B\u8CEA`);
      }
    }
  }
  var stageIdx = 0;
  var camAnim = null;
  var state = {
    slabOpen: 0,
    slabTarget: 0,
    ghost: 0,
    ghostTarget: 0,
    nutri: 0,
    nutriTarget: 0,
    spark: 0,
    sparkTarget: 0,
    line: 0,
    lineTarget: 0,
    ray: 1,
    rayTarget: 1,
    rootDepth: 3,
    rootTarget: 1,
    growAnim: null,
    u: 1,
    hl: [0, 0, 0, 0, 0, 0],
    hlTarget: [0, 0, 0, 0, 0, 0],
    hlRoot: 0,
    hlRootTarget: 0,
    dim: 0,
    dimTarget: 0,
    fx: {},
    nutriDir: 1
  };
  function currentRootDepth() {
    return [-0.3, -43.5, -85.5, -180][state.rootDepth];
  }
  function flyTo(pos, target, dur = 2.4) {
    const fromT = controls.target.clone();
    const fromOff = new THREE4.Spherical().setFromVector3(camera.position.clone().sub(fromT));
    const toOff = new THREE4.Spherical().setFromVector3(new THREE4.Vector3(...pos).sub(new THREE4.Vector3(...target)));
    let dTheta = toOff.theta - fromOff.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    camAnim = { t: 0, dur, fromT, toT: new THREE4.Vector3(...target), fromOff, toOff, dTheta };
  }
  function updateCam(dt) {
    if (!camAnim) return;
    camAnim.t += dt / camAnim.dur;
    const k = easeIO(clamp01(camAnim.t));
    const { fromT, toT, fromOff, toOff, dTheta } = camAnim;
    const tgt = fromT.clone().lerp(toT, k);
    const sph = new THREE4.Spherical(THREE4.MathUtils.lerp(fromOff.radius, toOff.radius, k), THREE4.MathUtils.lerp(fromOff.phi, toOff.phi, k), fromOff.theta + dTheta * k);
    controls.target.copy(tgt);
    camera.position.copy(tgt).add(new THREE4.Vector3().setFromSpherical(sph));
    if (camAnim.t >= 1) camAnim = null;
  }
  function setRootDepth(n) {
    state.rootDepth = n;
    state.rootTarget = [0.02, 0.333, 0.666, 1][n];
    document.querySelectorAll(".depth button").forEach((b) => b.classList.toggle("on", +b.dataset.d === n));
    const t = document.getElementById("rootTagTxt");
    if (t) t.textContent = ["", "\u8868\u571F", "\u6B21\u571F", "\u6DF1\u571F"][n];
    const info = document.getElementById("depthInfo");
    if (info) info.innerHTML = STAGES[stageIdx].depthText?.[n] ?? "";
  }
  function setGrowthU(u) {
    state.u = u;
    U.uGrow.value = 0.04 + 0.96 * sstep2(0, 0.9, u);
    U.uThin.value = 0.3 + 0.7 * sstep2(0, 0.85, u);
    U.uLeafBoost.value = 1 + 1.6 * (1 - sstep2(0, 0.6, u));
    U.uRoot.value = 0.12 + 0.88 * sstep2(0.1, 0.9, u);
    tree.scale.setScalar(0.06 + 0.94 * Math.pow(smooth(u), 0.85));
  }
  function startGrow() {
    state.growAnim = { t: 0, dur: 12 };
    setGrowthU(0);
    state.rootDepth = 3;
    state.rootTarget = 1;
  }
  function resolveCam(C) {
    if (!C.focus) return C;
    const t = ANCH[C.focus].toArray();
    return { pos: [t[0] + C.off[0], t[1] + C.off[1], t[2] + C.off[2]], target: t, dur: C.dur, from: C.from };
  }
  function goStage(i, first = false, page = 0) {
    stageIdx = i;
    const S = STAGES[i];
    const C = resolveCam(S.cam);
    if (first) {
      camera.position.set(...C.from);
      controls.target.set(...C.target);
      flyTo(C.pos, C.target, 7.5);
    } else flyTo(C.pos, C.target, C.dur ?? 2.6);
    state.slabTarget = S.fx.cut ? 1 : 0;
    state.ghostTarget = S.fx.ghost ?? 0;
    state.nutriTarget = S.fx.nutri ?? 0;
    state.sparkTarget = S.fx.spark ?? 0;
    state.lineTarget = S.fx.line ?? 0;
    state.rayTarget = S.fx.rays ?? 1;
    state.hlTarget = S.fx.hl ?? [0, 0, 0, 0, 0, 0];
    state.hlRootTarget = S.fx.hlRoot ?? 0;
    state.dimTarget = S.fx.dim ?? 0;
    if (S.fx.grow) startGrow();
    else {
      state.growAnim = null;
      if (state.u < 1) setGrowthU(1);
    }
    if (S.fx.rootDepth != null) setRootDepth(S.fx.rootDepth);
    state.fx = S.fx;
    state.nutriDir = S.fx.nutriDir ?? 1;
    if (S.fx.region) regionStart(S.fx.region === "done" && !FX.region.done && FX.region.t < 0);
    else regionReset();
    controls.autoRotate = !!S.fx.orbit;
    controls.autoRotateSpeed = 0.35;
    showLabels(S.labels || []);
    renderPanel(S, page);
    renderNav();
  }
  var pageIdx = 0;
  var pagesOf = (S) => S.pages || [S.body];
  function renderPanel(S, page = 0, quick = false) {
    const p = $("#panel");
    const pages = pagesOf(S);
    pageIdx = Math.max(0, Math.min(pages.length - 1, page));
    p.classList.remove("show");
    setTimeout(() => {
      p.style.setProperty("--accent", S.accent);
      const pager = pages.length > 1 ? `<div class="pager">${pages.map((_, k) => `<button class="${k === pageIdx ? "on" : ""}" data-p="${k}">${k + 1}</button>`).join("")}</div>` : "";
      const showDepth = S.depthText && pageIdx === 0;
      p.innerHTML = `
      <div class="kicker"><span class="num">${S.num}</span>${S.kicker}<span class="sp"></span>
        ${(S.fx.grow || S.fx.replayRegion) && pageIdx === 0 ? '<button class="replay" id="replay">\u21BB \u91CD\u64AD\u6210\u9577</button>' : ""}${pager}</div>
      <h2>${S.titles && S.titles[pageIdx] || S.title}</h2>
      <div class="sub">${S.subs && S.subs[pageIdx] || S.sub}</div>
      <div class="pbody">${pages[pageIdx]}</div>
      ${showDepth ? `<div class="depth"><span>\u7D2E\u6839\u6DF1\u5EA6</span>${["\u8868\u571F", "\u6B21\u571F", "\u6DF1\u571F"].map((t, k) => `<button data-d="${k + 1}">${t}</button>`).join("")}</div><div id="depthInfo" class="depthinfo"></div>` : ""}`;
      p.scrollTop = 0;
      p.querySelectorAll(".depth button").forEach((b) => b.addEventListener("click", () => setRootDepth(+b.dataset.d)));
      p.querySelectorAll(".pager button").forEach((b) => b.addEventListener("click", () => {
        renderPanel(S, +b.dataset.p, true);
        renderNav();
      }));
      p.querySelectorAll("[data-video]").forEach((b) => b.addEventListener("click", () => openVideo(b.dataset.video)));
      p.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => openImage(b.getAttribute("src"))));
      const rp = p.querySelector("#replay");
      if (rp) rp.addEventListener("click", () => {
        if (S.fx.grow) {
          startGrow();
        } else {
          regionReset();
          regionStart(false);
        }
        const c = resolveCam(S.cam);
        flyTo(c.pos, c.target, 1.5);
      });
      if (showDepth) setRootDepth(state.rootDepth || 3);
      p.classList.add("show");
    }, quick ? 140 : 260);
  }
  function openVideo(src) {
    const lb = $("#lightbox");
    lb.innerHTML = `<div class="lb-in"><video src="${src}" controls autoplay playsinline></video><button class="lb-x" aria-label="\u95DC\u9589">\u2715</button></div>`;
    lb.classList.add("show");
  }
  function openImage(src) {
    const lb = $("#lightbox");
    lb.innerHTML = `<div class="lb-in"><img src="${src}" alt=""><button class="lb-x" aria-label="\u95DC\u9589">\u2715</button></div>`;
    lb.classList.add("show");
  }
  function closeLightbox() {
    const lb = $("#lightbox");
    if (!lb.classList.contains("show")) return false;
    lb.classList.remove("show");
    lb.innerHTML = "";
    return true;
  }
  function renderNav() {
    const dots = $("#dots");
    dots.innerHTML = STAGES.map((s, k) => `<button class="d ${k === stageIdx ? "on" : ""} ${s.built ? "" : "todo"}" data-k="${k}" title="${s.navName}${s.built ? "" : "\uFF08\u88FD\u4F5C\u4E2D\uFF09"}"><i></i><span>${s.navName}</span></button>`).join("");
    dots.querySelectorAll(".d").forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.k;
      if (STAGES[k].built) goStage(k);
    }));
    $("#prev").disabled = !findBuilt(-1) && pageIdx === 0;
    $("#next").disabled = !findBuilt(1) && pageIdx >= pagesOf(STAGES[stageIdx]).length - 1;
  }
  function findBuilt(dir) {
    for (let k = stageIdx + dir; k >= 0 && k < STAGES.length; k += dir) if (STAGES[k].built) return { k };
    return null;
  }
  function step(dir) {
    if (closeLightbox()) return;
    const S = STAGES[stageIdx], n = pagesOf(S).length;
    if (pageIdx + dir >= 0 && pageIdx + dir < n) {
      renderPanel(S, pageIdx + dir, true);
      renderNav();
      return;
    }
    const f = findBuilt(dir);
    if (f) goStage(f.k, false, dir < 0 ? pagesOf(STAGES[f.k]).length - 1 : 0);
  }
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 3200);
  }
  function buildUI() {
    $("#prev").addEventListener("click", () => step(-1));
    $("#next").addEventListener("click", () => step(1));
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") step(-1);
      if (e.key === "Escape") closeLightbox();
      if ((e.key === "f" || e.key === "F") && !$("#lightbox").classList.contains("show")) toggleFS();
    });
    $("#fs").addEventListener("click", toggleFS);
    $("#lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox" || e.target.classList.contains("lb-x")) closeLightbox();
    });
    $("#reset").addEventListener("click", () => {
      const c = resolveCam(STAGES[stageIdx].cam);
      flyTo(c.pos, c.target, 1.6);
    });
    $("#quality").addEventListener("click", () => {
      qAuto = false;
      const i = QORDER.indexOf(qKey);
      applyQuality(QORDER[(i + 1) % QORDER.length]);
      toast("\u756B\u8CEA\uFF1A" + QUALITY[qKey].name);
    });
  }
  function toggleFS() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  function setProgress(p) {
    const b = $("#loadbar");
    if (b) b.style.width = Math.round(p * 100) + "%";
  }
  var clock = new THREE4.Clock();
  function approach(cur, tgt, rate, dt) {
    return cur + (tgt - cur) * (1 - Math.exp(-rate * dt));
  }
  var STILL = location.search.includes("still");
  var NOGL = location.search.includes("nogl");
  function renderOnce() {
    if (NOGL) return;
    updateRays();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  window.__render = renderOnce;
  function animate() {
    if (STILL) {
      renderOnce();
      return;
    }
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    tick(dt);
    autoQuality(dt);
    renderOnce();
  }
  function tick(dt) {
    U.uTime.value += dt;
    updateCam(dt);
    controls.update();
    if (state.growAnim) {
      state.growAnim.t += dt / state.growAnim.dur;
      const k = clamp01(state.growAnim.t);
      setGrowthU(1 - Math.pow(1 - k, 1.4));
      if (k >= 1) state.growAnim = null;
    } else {
      U.uRoot.value = approach(U.uRoot.value, state.rootTarget, 1.6, dt);
    }
    state.slabOpen = approach(state.slabOpen, state.slabTarget, 2, dt);
    const w = state.slabOpen;
    slab.position.set(0, -w * 280, w * 90);
    slab.visible = w < 0.98;
    const closed = w < 4e-3;
    groundG.userData.walls.forEach((m) => m.visible = !closed);
    slab.userData.walls.forEach((m) => m.visible = !closed);
    state.ghost = approach(state.ghost, state.ghostTarget, 2.5, dt);
    ghost.visible = state.ghost > 0.01;
    ghost.children.forEach((c) => {
      c.material.opacity = (c.userData.base || 0) * state.ghost;
    });
    state.nutri = approach(state.nutri, state.nutriTarget, 2, dt);
    particles.material.uniforms.uOpacity.value = state.nutri;
    particles.visible = state.nutri > 0.01;
    if (particles.visible) updateNutrients(dt);
    state.spark = approach(state.spark, state.sparkTarget, 2, dt);
    sparkles.material.uniforms.uOpacity.value = state.spark;
    sparkles.visible = state.spark > 0.01;
    state.ray = approach(state.ray, state.rayTarget, 2, dt);
    rays.children.forEach((m) => m.material.uniforms.uOpacity.value = state.ray * state.u);
    rays.visible = state.ray > 0.01;
    state.line = approach(state.line, state.lineTarget, 2, dt);
    strataMats.forEach((m) => m.userData.u.uLine.value = state.line);
    for (let k = 0; k < 6; k++) state.hl[k] = approach(state.hl[k], state.hlTarget[k], 3, dt);
    U.uHL.value = state.hl;
    state.hlRoot = approach(state.hlRoot, state.hlRootTarget, 3, dt);
    U.uHLRoot.value = [0, 0, 0, 0, 0, state.hlRoot];
    state.dim = approach(state.dim, state.dimTarget, 3, dt);
    U.uDim.value = state.dim;
    updateExtras(dt);
    {
      const k = 1 - sstep2(500, 1100, camera.position.y);
      mistSprites.forEach((m) => {
        m.material.opacity = m.userData.op * k;
        m.visible = k > 0.02;
      });
    }
    cloudsRef.children.forEach((c) => {
      c.position.x += c.userData.speed * dt * 2;
    });
  }
  window.addEventListener("resize", () => {
    applyViewOffset();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    [particles, sparkles, motes, FX.leaves && FX.leaves.pts, FX.core && FX.core.sparks, FX.people && FX.people.water, FX.region && FX.region.seeds].forEach((p) => p && (p.material.uniforms.uScale.value = window.innerHeight / 2));
  });
  window.__goStage = (i, pg = 0) => goStage(i, false, pg);
  window.__setGrowth = (g) => {
    state.growAnim = null;
    setGrowthU(g);
  };
  window.__cam = (p, t) => {
    camAnim = null;
    camera.position.set(...p);
    controls.target.set(...t);
  };
  window.__setRoot = setRootDepth;
  window.__ff = (sec) => {
    for (let i = 0; i < sec * 30; i++) tick(1 / 30);
    updateRays();
  };
  window.__anch = () => Object.fromEntries(Object.entries(ANCH).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.toArray().map(Math.round)) : v.toArray().map(Math.round)]));
  window.__info = () => ({ tris: renderer.info.render.triangles, calls: renderer.info.render.calls });
  init();
})();
