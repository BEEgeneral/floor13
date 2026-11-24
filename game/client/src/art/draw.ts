// @ts-nocheck
/* Dibujo del hotel (canvas 2D). Portado del visor docs/diseno/entorno/hotel.html.
   Cada pieza se apoya en su base (x,y). Los fondos de Blender sustituirán a bakeStatic. */
export const T = 48, W = 960, H = 624, WALL = 192;
export const SERIF = "'Cardo', Georgia, serif";
/* ---------- utilidades ---------- */
export function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function lin(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,col])=>g.addColorStop(o,col));return g;}
export function rad(c,x,y,r,stops){const g=c.createRadialGradient(x,y,0,x,y,r);stops.forEach(([o,col])=>g.addColorStop(o,col));return g;}
export function shadow(c,x,y,rx,ry,a=.4){c.fillStyle=`rgba(0,0,0,${a})`;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();}
export const BRASS=['#6e4f1c','#e8c36a','#c8993e','#6a4a1a'];
export function brassG(c,x0,x1){return lin(c,x0,0,x1,0,[[0,BRASS[0]],[.35,BRASS[1]],[.62,BRASS[2]],[1,BRASS[3]]]);}

/* ---------- piezas dibujadas (cada una se apoya en su base x,y) ---------- */
export function drawColumn(c,x,y){ // base en y, alto ~190
  shadow(c,x,y+2,26,7,.45);
  c.fillStyle=lin(c,x-24,0,x+24,0,[[0,'#8d8068'],[.4,'#f0e6d0'],[1,'#8d8068']]); c.fillRect(x-22,y-14,44,14);
  c.fillStyle=lin(c,x-17,0,x+17,0,[[0,'#7a6e58'],[.35,'#efe5cf'],[.7,'#c9bda3'],[1,'#6f644f']]); c.fillRect(x-16,y-170,32,158);
  c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=1.5; for(let i=-9;i<=9;i+=6){c.beginPath();c.moveTo(x+i,y-166);c.lineTo(x+i,y-14);c.stroke();}
  c.fillStyle=brassG(c,x-26,x+26); c.fillRect(x-24,y-184,48,16); c.fillRect(x-20,y-172,40,5);
}
export function drawCandelabra(c,x,y,t,seed){
  shadow(c,x,y+3,16,5,.5);
  c.fillStyle=brassG(c,x-4,x+4); c.fillRect(x-3,y-44,6,44);
  c.beginPath(); c.ellipse(x,y-2,12,4,0,0,7); c.fillStyle=BRASS[2]; c.fill();
  c.strokeStyle=BRASS[1]; c.lineWidth=3; c.beginPath(); c.moveTo(x-18,y-52); c.quadraticCurveTo(x-18,y-38,x,y-38); c.quadraticCurveTo(x+18,y-38,x+18,y-52); c.stroke();
  [-18,0,18].forEach((dx,i)=>{
    c.fillStyle='#f4ead2'; c.fillRect(x+dx-2.5,y-66,5,14);
    const f=.85+.15*Math.sin(t*9+seed+i*2)+.08*Math.sin(t*23+i);
    c.fillStyle='#ffd36a'; c.beginPath(); c.moveTo(x+dx,y-66-14*f); c.quadraticCurveTo(x+dx+5,y-62,x+dx,y-58); c.quadraticCurveTo(x+dx-5,y-62,x+dx,y-66-14*f); c.fill();
    c.fillStyle='#fff6d0'; c.beginPath(); c.ellipse(x+dx,y-61,1.6,3.4,0,0,7); c.fill();
  });
}
export function bolt(c,x1,y1,x2,y2,seed,w){
  const R=rng(seed); const n=9; c.beginPath(); c.moveTo(x1,y1);
  for(let i=1;i<n;i++){const k=i/n; c.lineTo(x1+(x2-x1)*k+(R()-.5)*18, y1+(y2-y1)*k+(R()-.5)*18);} c.lineTo(x2,y2);
  c.lineJoin='round'; c.lineCap='round';
  c.strokeStyle='rgba(111,240,255,.35)'; c.lineWidth=w+5; c.stroke();
  c.strokeStyle='#d8fdff'; c.lineWidth=w; c.stroke();
}
export function drawCoil(c,x,y,t,arcTo){
  shadow(c,x,y+3,24,7,.5);
  c.fillStyle=brassG(c,x-16,x+16); c.fillRect(x-15,y-12,30,12);
  c.fillStyle=brassG(c,x-7,x+7); c.fillRect(x-6,y-92,12,82);
  c.strokeStyle='#8a5f2a'; c.lineWidth=2.5; [-76,-62,-48,-34].forEach(h=>{c.beginPath();c.ellipse(x,y+h,11,3.6,0,0,7);c.stroke();});
  c.fillStyle=brassG(c,x-28,x+28); c.beginPath(); c.ellipse(x,y-102,27,11,0,0,7); c.fill();
  c.strokeStyle='rgba(255,243,196,.55)'; c.lineWidth=1.2; c.beginPath(); c.ellipse(x,y-104,24,8,0,3.3,6.1); c.stroke();
}
export function drawChair(c,x,y,dir='d'){ // dir: u (mira arriba), d (mira abajo), l, r
  shadow(c,x,y+4,19,6,.4);
  const v=lin(c,x-18,0,x+18,0,[[0,'#4d1120'],[.5,'#86253b'],[1,'#4d1120']]);
  const back=()=>{c.fillStyle=v; c.strokeStyle=BRASS[2]; c.lineWidth=2; c.beginPath(); c.roundRect(x-16,y-44,32,34,8); c.fill(); c.stroke();};
  const seat=()=>{c.fillStyle=v; c.strokeStyle=BRASS[2]; c.lineWidth=2; c.beginPath(); c.roundRect(x-18,y-14,36,20,6); c.fill(); c.stroke();};
  if(dir==='u'){ seat(); back(); } else { back(); seat(); }
}
export function drawPerson(c,x,y,o){ // base de los pies en x,y
  const {jacket='#7a1d33',hat=true,face=1,walk=0,seated=false,skin='#e2b48e',hair='#2a1d16'}=o;
  shadow(c,x,y+1,13,4.5,.45);
  const bob=Math.abs(Math.sin(walk))*2.5, sw=Math.sin(walk)*5;
  if(!seated){ c.fillStyle='#14121a'; c.fillRect(x-7+sw*.6,y-14,6,14); c.fillRect(x+1-sw*.6,y-14,6,14); } else { y+=8; }
  const by=y-14-bob;
  c.fillStyle=jacket; c.beginPath(); c.roundRect(x-10,by-20,20,24,6); c.fill();
  c.fillStyle='#efe9dc'; c.beginPath(); c.moveTo(x-3,by-20); c.lineTo(x+3,by-20); c.lineTo(x,by-6); c.fill();
  c.fillStyle='#111'; c.fillRect(x-3,by-19,6,3);
  c.fillStyle=jacket; c.fillRect(x-14,by-17,5,16); c.fillRect(x+9,by-17,5,16);
  c.fillStyle=skin; c.fillRect(x-14,by-3,5,4); c.fillRect(x+9,by-3,5,4);
  c.fillStyle=skin; c.beginPath(); c.arc(x,by-28,8.5,0,7); c.fill();
  c.fillStyle=hair; c.beginPath(); c.arc(x,by-31,8.5,Math.PI,0); c.fill();
  if(face!==0){ c.fillStyle='#2a1d16'; const ex=face*2.2; c.fillRect(x-3.5+ex,by-28,2,2.6); c.fillRect(x+1.5+ex,by-28,2,2.6); }
  if(hat){ c.fillStyle='#15131a'; c.beginPath(); c.ellipse(x,by-35,12,3.2,0,0,7); c.fill(); c.fillRect(x-7.5,by-49,15,14); c.fillStyle='#a31c3d'; c.fillRect(x-7.5,by-39,15,3.5); }
}
export function drawRoundTable(c,x,y,t){
  shadow(c,x,y+34,112,22,.5);
  c.fillStyle='#1d130e'; c.beginPath(); c.ellipse(x,y+14,106,46,0,0,7); c.fill();
  c.fillStyle='#3a261a'; c.beginPath(); c.ellipse(x,y+4,106,46,0,0,7); c.fill();
  c.strokeStyle=BRASS[1]; c.lineWidth=4; c.stroke();
  c.fillStyle=rad(c,x,y,92,[[0,'#1c8a98'],[1,'#0e4a54']]); c.beginPath(); c.ellipse(x,y,92,38,0,0,7); c.fill();
  c.strokeStyle='rgba(111,240,255,.55)'; c.lineWidth=2; c.stroke();
  c.save(); c.translate(x-34,y-6);
  for(let i=0;i<5;i++){ c.save(); c.translate(i*14,12); c.rotate((-20+i*10)*Math.PI/180); c.fillStyle='#f6efe0'; c.strokeStyle='#86253b'; c.lineWidth=2; c.beginPath(); c.roundRect(-9,-26,20,30,3); c.fill(); c.stroke(); c.fillStyle='#86253b'; c.beginPath(); c.moveTo(1,-18);c.lineTo(6,-10);c.lineTo(1,-2);c.lineTo(-4,-10);c.fill(); c.restore(); }
  c.restore();
  c.fillStyle=BRASS[2]; c.fillRect(x+40,y-10,22,14);
}
export function drawCameraRig(c,x,y,t){ // brazo de latón sobre la mesa
  c.strokeStyle=brassG(c,x-4,x+4); c.lineWidth=8; c.beginPath(); c.moveTo(x,y-172); c.lineTo(x,y-92); c.stroke();
  c.fillStyle=brassG(c,x-40,x+40); c.beginPath(); c.roundRect(x-36,y-184,72,16,6); c.fill();
  c.fillStyle='#15131a'; c.strokeStyle=BRASS[1]; c.lineWidth=6; c.beginPath(); c.arc(x,y-84,22,0,7); c.fill(); c.stroke();
  const p=.7+.3*Math.sin(t*3); c.fillStyle=`rgba(111,240,255,${p})`; c.beginPath(); c.arc(x,y-84,11,0,7); c.fill();
  c.fillStyle='#fff'; c.beginPath(); c.arc(x-4,y-88,3.4,0,7); c.fill();
}
export function drawDesk(c,x,y,w){
  shadow(c,x+w/2,y+36,w/2+6,8,.45);
  c.fillStyle=lin(c,0,y,0,y+34,[[0,'#4a3122'],[1,'#22150f']]); c.beginPath(); c.roundRect(x,y,w,34,4); c.fill(); c.strokeStyle=BRASS[2]; c.lineWidth=3; c.stroke();
  c.fillStyle=BRASS[1]; for(let i=0;i<3;i++){c.fillRect(x+w*(i+.5)/3-9,y+6,18,10);}
}
export function drawPlant(c,x,y,t){
  shadow(c,x,y+2,22,7,.45);
  c.fillStyle=lin(c,x-16,0,x+16,0,[[0,'#3b2a1d'],[.5,'#8a6a45'],[1,'#3b2a1d']]); c.beginPath(); c.moveTo(x-16,y-30); c.lineTo(x+16,y-30); c.lineTo(x+12,y); c.lineTo(x-12,y); c.fill();
  for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.36+Math.sin(t*1.4+i)*.03; c.strokeStyle=i%2?'#1f5a34':'#2c7a46'; c.lineWidth=7; c.lineCap='round'; c.beginPath(); c.moveTo(x,y-30); c.quadraticCurveTo(x+Math.cos(a)*30,y-30+Math.sin(a)*34,x+Math.cos(a)*54,y-30+Math.sin(a)*64+10); c.stroke();}
}
export function drawSofa(c,x,y,w){
  shadow(c,x+w/2,y+34,w/2,8,.4);
  const v=lin(c,x,0,x+w,0,[[0,'#4d1120'],[.5,'#86253b'],[1,'#4d1120']]);
  c.fillStyle=v; c.strokeStyle=BRASS[2]; c.lineWidth=2.5; c.beginPath(); c.roundRect(x,y-22,w,28,10); c.fill(); c.stroke();
  c.beginPath(); c.roundRect(x-8,y-6,w+16,40,10); c.fill(); c.stroke();
  c.strokeStyle='rgba(0,0,0,.3)'; for(let i=1;i<3;i++){c.beginPath(); c.moveTo(x+w*i/3,y+2); c.lineTo(x+w*i/3,y+28); c.stroke();}
}
export function drawChandelier(c,x,y,t){ // cuelga del techo (no visible), solo luz y brazos
  c.strokeStyle=BRASS[2]; c.lineWidth=3; c.beginPath(); c.moveTo(x,0); c.lineTo(x,y-26); c.stroke();
  c.fillStyle=brassG(c,x-34,x+34); c.beginPath(); c.ellipse(x,y,34,10,0,0,7); c.fill();
  for(let i=-3;i<=3;i++){const px=x+i*10; c.fillStyle='#f4ead2'; c.fillRect(px-2,y-10,4,10); const f=.8+.2*Math.sin(t*8+i); c.fillStyle='#ffd36a'; c.beginPath(); c.ellipse(px,y-14,2.6,5*f,0,0,7); c.fill();}
  for(let i=-5;i<=5;i++){c.fillStyle='rgba(220,240,255,.8)'; c.beginPath(); c.arc(x+i*6,y+13+Math.abs(i)%2*5,2,0,7); c.fill();}
}
export function drawElevatorDoor(c,x,y,t,floorNo){ // base en y (suelo), arco en la pared
  const wd=96, top=y-186;
  c.fillStyle=brassG(c,x-wd-12,x+wd+12); c.beginPath(); c.moveTo(x-wd-12,y); c.lineTo(x-wd-12,top+80); c.quadraticCurveTo(x-wd-12,top-10,x,top-10); c.quadraticCurveTo(x+wd+12,top-10,x+wd+12,top+80); c.lineTo(x+wd+12,y); c.fill();
  c.fillStyle='#120c0b'; c.beginPath(); c.moveTo(x-wd,y); c.lineTo(x-wd,top+84); c.quadraticCurveTo(x-wd,top+4,x,top+4); c.quadraticCurveTo(x+wd,top+4,x+wd,top+84); c.lineTo(x+wd,y); c.fill();
  c.fillStyle=rad(c,x,y-80,120,[[0,'rgba(111,240,255,.55)'],[1,'rgba(111,240,255,0)']]); c.fillRect(x-wd,top,wd*2,wd*2);
  c.save(); c.beginPath(); c.rect(x-wd+8,top+60,wd*2-16,y-top-60); c.clip();
  c.strokeStyle=BRASS[2]; c.lineWidth=3; for(let i=-5;i<=5;i++){const px=x+i*18; c.beginPath(); c.moveTo(px,y); c.lineTo(px+18,y-34); c.lineTo(px,y-68); c.lineTo(px+18,y-102); c.lineTo(px,y-136); c.moveTo(px+18,y); c.lineTo(px,y-34); c.lineTo(px+18,y-68); c.lineTo(px,y-102); c.lineTo(px+18,y-136); c.stroke();}
  c.restore();
  // reloj indicador sobre el arco
  const cy=top-22; c.fillStyle='#14100e'; c.strokeStyle=BRASS[1]; c.lineWidth=5; c.beginPath(); c.arc(x,cy,34,0,7); c.fill(); c.stroke();
  c.fillStyle='#6ff0ff'; c.font=`700 26px ${SERIF}`; c.textAlign='center'; c.textBaseline='middle';
  c.shadowColor='#6ff0ff'; c.shadowBlur=14; c.fillText(String(floorNo),x,cy+1); c.shadowBlur=0;
  c.fillStyle='#fff3c4'; for(let i=0;i<8;i++){const a=i/8*Math.PI*2; c.fillRect(x+Math.cos(a)*29-1,cy+Math.sin(a)*29-1,2,2);}
}
export function drawTapestry(c,x,y,w,h,txt){
  c.fillStyle=lin(c,x,0,x+w,0,[[0,'#4d1120'],[.5,'#86253b'],[1,'#4d1120']]); c.fillRect(x,y,w,h);
  c.strokeStyle=BRASS[1]; c.lineWidth=4; c.strokeRect(x,y,w,h); c.strokeStyle='rgba(232,195,106,.55)'; c.lineWidth=1.5; c.strokeRect(x+8,y+8,w-16,h-16);
  c.fillStyle='rgba(232,195,106,.9)'; c.font=`400 ${Math.round(h*.34)}px ${SERIF}`; c.textAlign='center'; c.textBaseline='middle'; c.fillText(txt,x+w/2,y+h/2+2);
  c.fillStyle=BRASS[1]; for(let i=0;i<6;i++){c.beginPath(); c.moveTo(x+4+i*(w-8)/5,y+h); c.lineTo(x+4+i*(w-8)/5,y+h+10); c.lineWidth=3; c.stroke();}
}

/* ---------- capas estáticas por planta (suelo, pared, alfombras) ---------- */
export function bakeStatic(room){
  const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d'); const R=rng(room.seed);
  // suelo de mármol
  for(let ty=Math.floor(WALL/T);ty<H/T;ty++) for(let tx=0;tx<W/T;tx++){
    const dark=(tx+ty)%2; g.fillStyle=dark?'#1a1512':'#d3c5a8'; g.fillRect(tx*T,ty*T,T,T);
    g.strokeStyle=dark?'rgba(255,255,255,.06)':'rgba(120,100,70,.28)'; g.lineWidth=1.2;
    for(let k=0;k<2;k++){g.beginPath(); const sx=tx*T+R()*T, sy=ty*T+R()*T; g.moveTo(sx,sy); g.quadraticCurveTo(sx+R()*30-15,sy+R()*30-15,sx+R()*40-20,sy+R()*40-20); g.stroke();}
  }
  g.fillStyle=lin(g,0,WALL,0,WALL+100,[[0,'rgba(0,0,0,.65)'],[1,'rgba(0,0,0,0)']]); g.fillRect(0,WALL,W,100);
  g.fillStyle=lin(g,0,H-150,0,H,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.35)']]); g.fillRect(0,H-150,W,150);
  // pared con paneles
  g.fillStyle=lin(g,0,0,0,WALL,[[0,'#2c1c15'],[1,'#150e0b']]); g.fillRect(0,0,W,WALL);
  for(let px=0;px<W;px+=96){
    g.fillStyle='#1b120d'; g.fillRect(px+10,22,76,118);
    g.strokeStyle='rgba(232,195,106,.5)'; g.lineWidth=2; g.strokeRect(px+10,22,76,118);
    g.strokeStyle='rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(px+11,139); g.lineTo(px+11,23); g.lineTo(px+85,23); g.stroke();
    g.fillStyle='#22160f'; g.fillRect(px+10,146,76,30); g.strokeStyle='rgba(232,195,106,.35)'; g.strokeRect(px+10,146,76,30);
  }
  g.fillStyle=brassG(g,0,W); g.fillRect(0,0,W,10); g.fillRect(0,WALL-16,W,6); g.fillStyle='#120b08'; g.fillRect(0,WALL-10,W,10);
  g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(0,WALL-10,W,10);
  room.paintStatic(g);
  return c;
}

