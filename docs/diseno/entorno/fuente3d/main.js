import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const SERIF = "'Cardo', Georgia, serif";
await (document.fonts?.load(`700 80px Cardo`).catch(()=>{}));
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true; 
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07050a); scene.fog = new THREE.Fog(0x07050a, 30, 70);
const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.08;
const camera = new THREE.PerspectiveCamera(42, 960/624, 0.1, 100);

/* ---------- materiales y texturas ---------- */
const M = (color, rough=.6, metal=0, extra={}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
const brass = M(0xc8993e, .32, .95), wood = M(0x2a1b15, .55), velvet = M(0x7d2236, .95), marbleW = M(0xe6dac2, .25), cyanEm = new THREE.MeshBasicMaterial({ color: 0x9ff6ff });
function tex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

const floorTex = tex(1024, 1024, (g, w, h) => { const R = rng(5), s = w / 2; for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { g.fillStyle = (x + y) % 2 ? '#17120f' : '#cdbfa2'; g.fillRect(x*s, y*s, s, s); }
  for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${R()>.5?'110,90,60':'255,255,255'},${.05+R()*.14})`; g.lineWidth = 1 + R()*2; g.beginPath(); const x = R()*w, y = R()*h; g.moveTo(x, y); g.bezierCurveTo(x+R()*160-80, y+R()*160-80, x+R()*160-80, y+R()*160-80, x+R()*200-100, y+R()*200-100); g.stroke(); } }, [10, 6.5]);
const panelTex = tex(512, 512, (g, w, h) => { g.fillStyle = '#26180f'; g.fillRect(0,0,w,h); g.fillStyle = '#1a110b'; g.fillRect(48,40,w-96,300); g.strokeStyle = '#c8993e'; g.lineWidth = 5; g.strokeRect(48,40,w-96,300); g.strokeStyle='rgba(255,255,255,.08)'; g.lineWidth=2; g.strokeRect(60,52,w-120,276); g.fillStyle = '#20140d'; g.fillRect(48,372,w-96,100); g.strokeStyle='#c8993e'; g.lineWidth=3; g.strokeRect(48,372,w-96,100); }, [4, 1]);
const rugTex = tex(1024, 640, (g, w, h) => { g.fillStyle = '#5a1424'; g.fillRect(0,0,w,h); g.strokeStyle = '#d6a84a'; g.lineWidth = 14; g.strokeRect(14,14,w-28,h-28); g.lineWidth = 3; g.setLineDash([4, 14]); g.strokeRect(46,46,w-92,h-92); g.setLineDash([]);
  g.fillStyle = 'rgba(232,195,106,.28)'; g.font = `400 150px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('XIII', w/2, h*.78); g.strokeStyle='rgba(232,195,106,.45)'; g.lineWidth=3; g.beginPath(); g.arc(w/2, h*.38, 120, 0, 7); g.stroke(); });
const tapTex = tex(256, 384, (g, w, h) => { g.fillStyle = '#6b1a2c'; g.fillRect(0,0,w,h); const gr = g.createLinearGradient(0,0,w,0); gr.addColorStop(0,'rgba(0,0,0,.35)'); gr.addColorStop(.5,'rgba(255,255,255,.08)'); gr.addColorStop(1,'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(0,0,w,h);
  g.strokeStyle = '#e8c36a'; g.lineWidth = 6; g.strokeRect(10,10,w-20,h-20); g.fillStyle = '#e8c36a'; g.font = `400 84px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('XIII', w/2, h/2); });
const latticeTex = tex(512, 512, (g, w, h) => { g.clearRect(0,0,w,h); g.strokeStyle = '#d9a845'; g.lineWidth = 7; const n = 8, s = w/n; for (let i = -n; i < n*2; i++) { g.beginPath(); g.moveTo(i*s, 0); g.lineTo(i*s + h/2, h); g.moveTo(i*s + h/2, 0); g.lineTo(i*s, h); g.stroke(); } });
const dialTex = tex(256, 256, (g, w, h) => { g.fillStyle = '#0d0a08'; g.fillRect(0,0,w,h); g.fillStyle = '#9ff6ff'; g.font = `700 150px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#6ff0ff'; g.shadowBlur = 24; g.fillText('13', w/2, h/2 + 8); });

const add = (m, p, parent = scene) => { if (p) m.position.set(...p); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
const box = (w,h,d,mat,p,parent) => add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat), p, parent);
const cyl = (rt,rb,h,mat,p,seg=24,parent) => add(new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), mat), p, parent);

/* ---------- sala: suelo, paredes, techo ---------- */
const RW = 10, RD = 6.5, WH = 5.4;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(RW*2, RD*2), new THREE.MeshStandardMaterial({ map: floorTex, roughness: .4, metalness: 0 })); floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);
const wallMat = new THREE.MeshStandardMaterial({ map: panelTex, roughness: .7 });
const back = new THREE.Mesh(new THREE.PlaneGeometry(RW*2, WH), wallMat); back.position.set(0, WH/2, -RD); back.receiveShadow = true; scene.add(back);
[[-1, Math.PI/2],[1, -Math.PI/2]].forEach(([s, r]) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(RD*2, WH), wallMat); w.position.set(s*RW, WH/2, 0); w.rotation.y = r; w.receiveShadow = true; scene.add(w); });
box(RW*2, .22, .3, brass, [0, 2.0, -RD+.15]); box(RW*2, .3, .4, brass, [0, WH-.15, -RD+.2]); box(RW*2, .5, .2, wood, [0, .25, -RD+.1]);
box(.2, .12, RD*2, brass, [-RW+.1, 2.0, 0]); box(.2, .12, RD*2, brass, [RW-.1, 2.0, 0]);
const ceil = new THREE.Mesh(new THREE.PlaneGeometry(RW*2, RD*2), M(0x120c09, 1)); ceil.rotation.x = Math.PI/2; ceil.position.y = WH; scene.add(ceil);
const rug = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 6), new THREE.MeshStandardMaterial({ map: rugTex, roughness: .95 })); rug.rotation.x = -Math.PI/2; rug.position.set(0, .012, 1.6); rug.receiveShadow = true; scene.add(rug);

/* ---------- columnas y tapices ---------- */
function column(x, z) { const g = new THREE.Group(); cyl(.34, .34, 4.6, marbleW, [0, 2.5, 0], 20, g); box(.9, .25, .9, marbleW, [0, .13, 0], g); box(.9, .25, .9, marbleW, [0, 4.92, 0], g); box(1.0, .12, 1.0, brass, [0, 5.1, 0], g); for (let i = 0; i < 10; i++) { const a = i/10*Math.PI*2; box(.04, 4.3, .04, M(0xb9ad92, .6), [Math.cos(a)*.34, 2.5, Math.sin(a)*.34], g); } g.position.set(x, 0, z); scene.add(g); }
[-4.8, 4.8].forEach(x => column(x, -RD+.7)); [-9.2, 9.2].forEach(x => column(x, -RD+.7));
[-7.2, 7.2].forEach(x => { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 3.1), new THREE.MeshStandardMaterial({ map: tapTex, roughness: .95 })); p.position.set(x, 3.15, -RD+.08); scene.add(p); box(2.3, .12, .14, brass, [x, 4.78, -RD+.12]); });

/* ---------- ascensor ---------- */
const lift = new THREE.Group(); lift.position.set(0, 0, -RD);
{ const sh = new THREE.Shape(); sh.moveTo(-2.1, 0); sh.lineTo(-2.1, 2.9); sh.absarc(0, 2.9, 2.1, Math.PI, 0, true); sh.lineTo(2.1, 0); sh.lineTo(-2.1, 0);
  const hole = new THREE.Path(); hole.moveTo(-1.8, 0); hole.lineTo(-1.8, 2.9); hole.absarc(0, 2.9, 1.8, Math.PI, 0, true); hole.lineTo(1.8, 0); hole.lineTo(-1.8, 0); sh.holes.push(hole);
  const fr = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .36, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, curveSegments: 32 }), brass); fr.castShadow = true; lift.add(fr);
  const inner = new THREE.Shape(); inner.moveTo(-1.8, 0); inner.lineTo(-1.8, 2.9); inner.absarc(0, 2.9, 1.8, Math.PI, 0, true); inner.lineTo(1.8, 0);
  const glow = new THREE.Mesh(new THREE.ShapeGeometry(inner, 32), new THREE.MeshBasicMaterial({ color: 0x1b8ea0 })); glow.position.z = .08; lift.add(glow);
  const lat = new THREE.Mesh(new THREE.ShapeGeometry(inner, 32), new THREE.MeshStandardMaterial({ map: latticeTex, transparent: true, metalness: .9, roughness: .3, color: 0xd9a845 })); lat.position.z = .2;
  // UV de la forma: normalizar
  const uv = lat.geometry.attributes.uv, pos = lat.geometry.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i)+1.8)/3.6*1.0, pos.getY(i)/4.7); lift.add(lat);
  const dial = new THREE.Mesh(new THREE.CircleGeometry(.5, 40), new THREE.MeshBasicMaterial({ map: dialTex })); dial.position.set(0, 5.0, .3); lift.add(dial);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.52, .07, 12, 40), brass); ring.position.set(0, 5.0, .3); lift.add(ring); }
scene.add(lift);

/* ---------- bobinas Tesla y arcos ---------- */
const arcs = [];
function coil(x) { const g = new THREE.Group(); box(.9, .25, .9, brass, [0, .13, 0], g); cyl(.14, .18, 2.8, brass, [0, 1.6, 0], 16, g); for (let i = 0; i < 5; i++) add(new THREE.Mesh(new THREE.TorusGeometry(.3, .04, 8, 24), M(0x8a5f2a, .4, .9)), [0, .8 + i*.38, 0], g).rotation.x = Math.PI/2;
  const top = add(new THREE.Mesh(new THREE.TorusGeometry(.62, .24, 20, 40), brass), [0, 3.2, 0], g); top.rotation.x = Math.PI/2; g.position.set(x, 0, -RD+1.1); scene.add(g); return g; }
const coils = [coil(-3.4), coil(3.4)];
function makeArc(from, to) { const m = new THREE.LineBasicMaterial({ color: 0xcffaff }); const geo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 10 }, () => new THREE.Vector3())); const l = new THREE.Line(geo, m); l.frustumCulled = false; scene.add(l); arcs.push({ l, from, to }); }
makeArc(new THREE.Vector3(-3.4, 3.2, -RD+1.1), new THREE.Vector3(-.4, 5.1, -RD+.35)); makeArc(new THREE.Vector3(3.4, 3.2, -RD+1.1), new THREE.Vector3(.4, 5.1, -RD+.35));
makeArc(new THREE.Vector3(-3.4, 3.2, -RD+1.1), new THREE.Vector3(-4.6, 3.8, -RD+.9)); makeArc(new THREE.Vector3(3.4, 3.2, -RD+1.1), new THREE.Vector3(4.6, 3.8, -RD+.9));
function updateArcs(t) { const s = Math.floor(t*14); arcs.forEach((a, i) => { const R = rng(s*13+i*7), p = a.l.geometry.attributes.position, n = p.count; for (let k = 0; k < n; k++) { const f = k/(n-1), j = k === 0 || k === n-1 ? 0 : .22; p.setXYZ(k, a.from.x+(a.to.x-a.from.x)*f+(R()-.5)*j*2, a.from.y+(a.to.y-a.from.y)*f+(R()-.5)*j*2, a.from.z+(a.to.z-a.from.z)*f+(R()-.5)*j); } p.needsUpdate = true; a.l.visible = i < 2 || s % 3 === 0; }); }

/* ---------- mesa de examen y cámara cenital ---------- */
const table = new THREE.Group(); table.position.set(0, 0, 1.6);
cyl(.35, .55, .8, wood, [0, .4, 0], 24, table); cyl(2.2, 2.2, .18, wood, [0, .86, 0], 48, table); add(new THREE.Mesh(new THREE.TorusGeometry(2.2, .06, 12, 64), brass), [0, .96, 0], table).rotation.x = Math.PI/2;
cyl(1.95, 1.95, .04, M(0x0f5a66, .9, 0, { emissive: 0x0a3a44, emissiveIntensity: .5 }), [0, .96, 0], 48, table);
for (let i = 0; i < 5; i++) { const c = box(.36, .012, .52, M(0xcfc6b2, .8), [-.5+i*.24, 1.0, -.2], table); c.rotation.y = (-24+i*12)*Math.PI/180; }
box(.4, .06, .26, brass, [1.1, 1.0, .1], table);
scene.add(table);
cyl(.05, .05, 2.4, brass, [0, 4.2, 1.6], 10); const head = cyl(.4, .5, .3, brass, [0, 3.0, 1.6], 24); const lens = new THREE.Mesh(new THREE.CircleGeometry(.26, 24), new THREE.MeshBasicMaterial({ color: 0x9ff6ff })); lens.rotation.x = Math.PI/2; lens.position.set(0, 2.84, 1.6); scene.add(lens);
const spot = new THREE.SpotLight(0x8ff3ff, 14, 12, .55, .6, 1.6); spot.position.set(0, 2.9, 1.6); spot.target.position.set(0, .9, 1.6); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); scene.add(spot, spot.target);

/* ---------- muebles y personas ---------- */
function chair(x, z, rot = 0) { const g = new THREE.Group(); box(.8, .12, .8, velvet, [0, .5, 0], g); box(.8, 1.0, .12, velvet, [0, 1.0, -.34], g); box(.84, .06, .84, brass, [0, .4, 0], g); [[-.34,-.34],[.34,-.34],[-.34,.34],[.34,.34]].forEach(([a,b]) => cyl(.04,.04,.4,brass,[a,.2,b],8,g)); g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g); }
function person(x, z, o = {}) { const { jacket = 0x7a1d33, seated = false, hat = true, skin = 0xe2b48e, rot = 0 } = o; const g = new THREE.Group(); const legs = [];
  if (!seated) [-.12, .12].forEach(dx => { const l = box(.18, .8, .2, M(0x14121a, .7), [dx, .4, 0], g); l.geometry.translate(0, -.4, 0); l.position.y = .8; legs.push(l); }); else { box(.42, .2, .5, M(0x14121a, .7), [0, .62, .1], g); }
  const by = seated ? .62 : .8; const torso = add(new THREE.Mesh(new THREE.CapsuleGeometry(.27, .5, 8, 16), M(jacket, .7)), [0, by + .55, 0], g); box(.12, .46, .03, M(0xf1ece0, .6), [0, by + .6, .26], g);
  add(new THREE.Mesh(new THREE.SphereGeometry(.2, 20, 16), M(skin, .6)), [0, by + 1.2, 0], g);
  if (hat) { cyl(.31, .31, .03, M(0x15131a, .4), [0, by + 1.34, 0], 24, g); cyl(.2, .21, .34, M(0x15131a, .4), [0, by + 1.52, 0], 24, g); cyl(.212, .212, .06, M(0xa31c3d, .5), [0, by + 1.4, 0], 24, g); }
  const blob = new THREE.Mesh(new THREE.CircleGeometry(.5, 20), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .4, depthWrite: false })); blob.rotation.x = -Math.PI/2; blob.position.y = .015; g.add(blob);
  g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g); g.userData = { legs, torso }; return g; }
box(3.2, .8, .9, wood, [-6.5, .4, -2.4]); box(3.3, .08, 1.0, brass, [-6.5, .82, -2.4]);
[-7.4, -6.5, -5.6].forEach((x, i) => { chair(x, -3.5, 0); person(x, -3.45, { jacket: [0x2a2f4a, 0x3a2438, 0x23403f][i], seated: true, hat: i !== 1 }); });
for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) chair(5.8 + c*1.15, .6 + r*1.5, Math.PI/2);
person(6.9, .6, { jacket: 0x4a3320, seated: true, hat: false, rot: Math.PI/2 }); person(8.05, 2.1, { jacket: 0x2c3e5a, seated: true, rot: Math.PI/2 }); person(5.8, 3.6, { jacket: 0x5a2a2a, seated: true, hat: false, skin: 0xc28d68, rot: Math.PI/2 });
person(0, 0.3, { jacket: 0x7a1d33 });
const player = person(0, 4.3, { jacket: 0x1d5a6b, rot: 0 });

/* ---------- candelabros y luces ---------- */
const flames = [];
function candelabra(x, z) { const g = new THREE.Group(); cyl(.06, .14, 1.4, brass, [0, .7, 0], 12, g); cyl(.22, .26, .08, brass, [0, .04, 0], 16, g);
  [-.4, 0, .4].forEach((dx, i) => { cyl(.035, .035, .34, M(0xf4ead2, .8), [dx, 1.62 - (i === 1 ? 0 : .1), 0], 8, g); const f = new THREE.Mesh(new THREE.SphereGeometry(.06, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffd68a })); f.scale.set(1, 1.9, 1); f.position.set(dx, 1.88 - (i === 1 ? 0 : .1), 0); g.add(f); flames.push(f); });
  const arm = new THREE.Mesh(new THREE.TorusGeometry(.4, .025, 8, 24, Math.PI), brass); arm.rotation.z = Math.PI; arm.position.set(0, 1.5, 0); g.add(arm);
  g.position.set(x, 0, z); scene.add(g); const l = new THREE.PointLight(0xffa860, 5, 11, 1.8); l.position.set(x, 1.9, z + .3); scene.add(l); return l; }
const warm = [candelabra(-9, -5.4), candelabra(9, -5.4), candelabra(-9, 5.6), candelabra(9, 5.6)];
const cyanL = [new THREE.PointLight(0x6ff0ff, 6, 10, 1.8), new THREE.PointLight(0x6ff0ff, 6, 10, 1.8), new THREE.PointLight(0x6ff0ff, 8, 9, 1.8)];
cyanL[0].position.set(-3.4, 3.4, -RD+1.8); cyanL[1].position.set(3.4, 3.4, -RD+1.8); cyanL[2].position.set(0, 2.2, -RD+1.2); scene.add(...cyanL);
scene.add(new THREE.HemisphereLight(0x6a5a86, 0x1a1210, .45));
const fill = new THREE.PointLight(0xffb070, 4, 18, 1.6); fill.position.set(0, 4.8, 4.5); scene.add(fill);

/* ---------- entrada ---------- */
const keys = {}; addEventListener('keydown', e => { keys[e.code] = true; if (e.code.startsWith('Arrow')) e.preventDefault(); }); addEventListener('keyup', e => keys[e.code] = false);
let usingPad = false;
function readMove() { let x = (keys.ArrowRight||keys.KeyD?1:0) - (keys.ArrowLeft||keys.KeyA?1:0), y = (keys.ArrowDown||keys.KeyS?1:0) - (keys.ArrowUp||keys.KeyW?1:0);
  for (const p of (navigator.getGamepads?.() || [])) { if (!p) continue; let ax = p.axes[0]||0, ay = p.axes[1]||0; const m = Math.hypot(ax, ay); if (m > .2) { const k = (m-.2)/.8/m; x += ax*k; y += ay*k; usingPad = true; } }
  const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } return { x, y }; }
const blockers = [[-8.1,-4.0,-4.9,-1.9],[-1.6,.0,1.6,3.2],[5.2,0,9.4,4.4],[-4.0,-6.5,-2.8,-5.2],[2.8,-6.5,4.0,-5.2],[-10,-7,10,-6.0]]; // [x0,z0,x1,z1]
function blocked(x, z) { const r = .3; return x < -RW+.6 || x > RW-.6 || z > RD-.5 || blockers.some(b => x > b[0]-r && x < b[2]+r && z > b[1]-r && z < b[3]+r) || (Math.hypot(x, z-1.6) < 2.5); }

/* ---------- postproceso ---------- */
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(960, 624), .35, .6, .9); composer.addPass(bloom); composer.addPass(new OutputPass());
function resize() { const w = innerWidth, h = innerHeight; const ar = 960/624; let W = w, H = w/ar; if (H > h) { H = h; W = h*ar; } canvas.style.width = W+'px'; canvas.style.height = H+'px'; renderer.setSize(W, H, false); composer.setSize(W, H); camera.aspect = ar; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- bucle ---------- */
const timer = new THREE.Timer(); timer.connect(document); let walk = 0, face = 0;
const camBase = new THREE.Vector3(0, 11.4, 17.6); const look = new THREE.Vector3(0, 1.2, -.4);
document.getElementById('dev').textContent = 'Teclado o mando';
renderer.setAnimationLoop(() => {
  timer.update(); const dt = Math.min(Math.max(timer.getDelta(), 0), .1), t = timer.getElapsed();
  const m = readMove(); const sp = 4.2;
  if (m.x || m.y) { const nx = player.position.x + m.x*sp*dt, nz = player.position.z + m.y*sp*dt; if (!blocked(nx, player.position.z)) player.position.x = nx; if (!blocked(player.position.x, nz)) player.position.z = nz; face = Math.atan2(m.x, m.y); walk += dt*10; } else walk *= .85;
  player.rotation.y += (((face - player.rotation.y + Math.PI*3) % (Math.PI*2)) - Math.PI) * Math.min(1, dt*12);
  player.userData.legs.forEach((l, i) => l.rotation.x = Math.sin(walk + i*Math.PI) * .6); player.userData.torso.position.y = 1.35 + Math.abs(Math.sin(walk)) * .04;
  document.getElementById('dev').textContent = usingPad ? 'Mando detectado' : 'Teclado o mando';
  camera.position.lerp(new THREE.Vector3(camBase.x + player.position.x*.12, camBase.y, camBase.z + (player.position.z-5)*.06), 1 - Math.exp(-dt*3)); camera.lookAt(look.x + player.position.x*.08, look.y, look.z);
  updateArcs(t);
  flames.forEach((f, i) => { const k = .85 + .15*Math.sin(t*9+i*2) + .08*Math.sin(t*23+i); f.scale.set(1, 1.9*k, 1); });
  warm.forEach((l, i) => l.intensity = 5 * (.88 + .12*Math.sin(t*9+i*3) + .05*Math.sin(t*21+i)));
  cyanL.forEach((l, i) => l.intensity = (i === 2 ? 8 : 6) * (.8 + .2*Math.sin(t*37+i) * Math.sin(t*11)));
  composer.render();
});
window.__ready = true;
