// @ts-nocheck
import * as D from './draw.ts';
const {T,W,H,WALL,SERIF,BRASS,brassG,shadow,lin,rad,drawColumn,drawCandelabra,drawCoil,drawChair,drawPerson,drawRoundTable,drawCameraRig,drawDesk,drawPlant,drawSofa,drawChandelier,drawElevatorDoor,drawTapestry,bolt}=D;
const COLL=(x,y,w,h)=>({x,y,w,h});
/* ---------- plantas ---------- */

export const PLANTA13 = {
  id:13, name:'Planta 13', sub:'Sala de exámenes y conferencias', seed:13, ambient:.78, tint:'rgba(70,200,220,.05)',
  spawn:[480,540], lift:[480,226],
  colliders:[COLL(0,0,W,WALL+8), COLL(318,WALL,32,30), COLL(610,WALL,32,30), COLL(374,382,212,86), COLL(78,296,134,36),
             COLL(740,300,176,36), COLL(740,350,176,6), COLL(0,0,10,H), COLL(W-10,0,10,H), COLL(0,H-8,W,8)],
  paintStatic(g){
    g.fillStyle='#5a1424'; g.beginPath(); g.roundRect(250,262,460,320,10); g.fill(); g.strokeStyle=BRASS[2]; g.lineWidth=6; g.stroke();
    g.strokeStyle='rgba(232,195,106,.55)'; g.lineWidth=2; g.setLineDash([3,8]); g.strokeRect(266,278,428,288); g.setLineDash([]);
    g.fillStyle='rgba(232,195,106,.16)'; g.font=`400 92px ${SERIF}`; g.textAlign='center'; g.textBaseline='middle'; g.fillText('XIII',480,520);
    g.fillStyle='rgba(111,240,255,.10)'; g.beginPath(); g.ellipse(480,432,150,80,0,0,7); g.fill();
    drawTapestry(g,70,30,120,130,'XIII'); drawTapestry(g,770,30,120,130,'XIII');
    [240,720].forEach(x=>drawColumn(g,x,WALL+4));
  },
  props(t){
    const P=[];
    P.push({y:WALL+2,f:c=>drawElevatorDoor(c,480,WALL+4,t,13)});
    P.push({y:WALL+30,f:c=>drawCoil(c,334,WALL+30,t,[480,WALL-130])});
    P.push({y:WALL+30,f:c=>drawCoil(c,626,WALL+30,t,[480,WALL-130])});
    P.push({y:440,f:c=>drawRoundTable(c,480,418,t)});
    P.push({y:200,f:c=>drawCameraRig(c,480,418,t),top:true});
    P.push({y:332,f:c=>drawDesk(c,78,296,134)});
    [[108,'#2a2f4a'],[145,'#3a2438'],[182,'#23403f']].forEach(([x,col],i)=>{
      P.push({y:270,f:c=>drawChair(c,x,284,'d')}); P.push({y:290,f:c=>drawPerson(c,x,282,{jacket:col,seated:true,hat:i!==1,face:0})});
    });
    for(let r=0;r<3;r++) for(let k=0;k<4;k++){ const x=760+k*46, y=392+r*58; P.push({y:y,f:c=>drawChair(c,x,y,'l')}); }
    P.push({y:396,f:c=>drawPerson(c,806,394,{jacket:'#4a3320',hat:false,seated:true,face:-1})});
    P.push({y:456,f:c=>drawPerson(c,852,454,{jacket:'#2c3e5a',seated:true,face:-1})});
    P.push({y:514,f:c=>drawPerson(c,760,512,{jacket:'#5a2a2a',hat:false,seated:true,face:-1,skin:'#c28d68',hair:'#111'})});
    P.push({y:456,f:c=>drawPerson(c,480,444,{jacket:'#7a1d33',face:0,walk:Math.sin(t*1.5)*.2})});
    [[40,WALL+60],[920,WALL+60],[44,590],[916,590]].forEach(([x,y],i)=>P.push({y,f:c=>drawCandelabra(c,x,y,t,i*3)}));
    return P;
  },
  lights(t){
    const f=i=>.92+.08*Math.sin(t*9+i*2)+.05*Math.sin(t*21+i);
    return [
      ...[[40,WALL+16],[920,WALL+16],[44,546],[916,546]].map(([x,y],i)=>({x,y,r:190,a:.92*f(i),c:'255,190,100'})),
      {x:334,y:WALL-80,r:230,a:(.7+.3*Math.random()*.4),c:'111,240,255'},{x:626,y:WALL-80,r:230,a:(.7+.3*Math.random()*.4),c:'111,240,255'},
      {x:480,y:WALL-40,r:170,a:.95,c:'111,240,255'},{x:480,y:418,r:150,a:.9,c:'111,240,255'}, {x:480,y:540,r:210,a:.35,c:'255,190,100'},
    ];
  },
  label:'#6ff0ff'
};
export const VESTIBULO = {
  id:0, name:'Planta 0', sub:'Vestíbulo', seed:7, ambient:.74, tint:'rgba(255,170,90,.05)',
  spawn:[480,540], lift:[480,226],
  colliders:[COLL(0,0,W,WALL+8), COLL(84,262,230,60), COLL(48,560,50,30), COLL(862,560,50,30), COLL(600,300,300,40), COLL(0,0,10,H), COLL(W-10,0,10,H), COLL(0,H-8,W,8)],
  paintStatic(g){
    g.fillStyle='#5a1424'; g.beginPath(); g.roundRect(432,196,96,H-196,0); g.fill(); g.strokeStyle=BRASS[2]; g.lineWidth=5; g.stroke();
    g.fillStyle='rgba(232,195,106,.25)'; for(let y=220;y<H;y+=48){ g.fillRect(436,y,88,3); }
    // ventanas altas con noche
    [[150],[730]].forEach(([x])=>{ g.fillStyle=lin(g,0,24,0,150,[[0,'#10203a'],[1,'#1c2f52']]); g.beginPath(); g.moveTo(x,160); g.lineTo(x,70); g.quadraticCurveTo(x,22,x+40,22); g.quadraticCurveTo(x+80,22,x+80,70); g.lineTo(x+80,160); g.fill();
      g.strokeStyle=BRASS[1]; g.lineWidth=5; g.stroke(); g.lineWidth=2; g.beginPath(); g.moveTo(x+40,22); g.lineTo(x+40,160); g.moveTo(x,90); g.lineTo(x+80,90); g.stroke();
      g.fillStyle='#e9efff'; for(let i=0;i<7;i++) g.fillRect(x+8+((i*37)%64),32+((i*29)%50),1.8,1.8); g.beginPath(); g.arc(x+58,52,7,0,7); g.fill(); });
    g.fillStyle='rgba(120,160,230,.10)'; g.beginPath(); g.moveTo(150,160); g.lineTo(230,160); g.lineTo(330,400); g.lineTo(140,400); g.fill(); g.beginPath(); g.moveTo(730,160); g.lineTo(810,160); g.lineTo(910,400); g.lineTo(720,400); g.fill();
    [330,630].forEach(x=>drawColumn(g,x,WALL+4)); [40,920].forEach(x=>drawColumn(g,x,WALL+4));
    // cartel
    g.fillStyle='#1b120d'; g.strokeStyle=BRASS[1]; g.lineWidth=3; g.beginPath(); g.roundRect(620,60,220,96,6); g.fill(); g.stroke();
    g.fillStyle='#e8c36a'; g.font=`400 17px ${SERIF}`; g.textAlign='center'; g.textBaseline='middle'; g.fillText('HOY EN EL HOTEL',730,86);
    g.fillStyle='#efe4cf'; g.font=`400 14px 'Fira Sans', sans-serif`; g.fillText('Planta 13 · exámenes 20:00',730,112); g.fillText('Planta 1 · Gran Salón',730,134);
  },
  props(t){
    const P=[];
    P.push({y:WALL+2,f:c=>drawElevatorDoor(c,480,WALL+4,t,0)});
    P.push({y:WALL+30,f:c=>drawCoil(c,372,WALL+30,t,[480,WALL-130])}); P.push({y:WALL+30,f:c=>drawCoil(c,588,WALL+30,t,[480,WALL-130])});
    P.push({y:322,f:c=>drawDesk(c,84,262,230)});
    P.push({y:322,f:c=>{ c.fillStyle='#c8993e'; c.beginPath(); c.arc(130,256,7,0,7); c.fill(); c.fillStyle='#f4ead2'; c.fillRect(200,248,40,14); c.strokeStyle='#8a5f2a'; c.strokeRect(200,248,40,14); }});
    P.push({y:300,f:c=>drawPerson(c,200,296,{jacket:'#23403f',hat:false,face:0})});
    P.push({y:340,f:c=>drawSofa(c,610,310,280)});
    P.push({y:340,f:c=>drawPerson(c,700,316,{jacket:'#5a2a2a',seated:true,face:-1,hat:false})});
    P.push({y:590,f:c=>drawPlant(c,70,586,t)}); P.push({y:590,f:c=>drawPlant(c,886,586,t)});
    [[40,WALL+60],[920,WALL+60]].forEach(([x,y],i)=>P.push({y,f:c=>drawCandelabra(c,x,y,t,i*5)}));
    return P;
  },
  lights(t){ const f=i=>.92+.08*Math.sin(t*9+i*2);
    return [{x:480,y:130,r:330,a:.95*f(1),c:'255,200,120'},{x:40,y:WALL+16,r:170,a:.8*f(2),c:'255,190,100'},{x:920,y:WALL+16,r:170,a:.8*f(3),c:'255,190,100'},
            {x:372,y:WALL-80,r:200,a:.6,c:'111,240,255'},{x:588,y:WALL-80,r:200,a:.6,c:'111,240,255'},{x:480,y:WALL-30,r:150,a:.85,c:'111,240,255'},
            {x:190,y:100,r:200,a:.35,c:'130,170,255'},{x:770,y:100,r:200,a:.35,c:'130,170,255'}]; }
};


