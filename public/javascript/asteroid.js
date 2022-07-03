const fps=30;
const friction=0.8;
const roid_jag=0.4;
const roid_num=5;
const roid_size=100;
const roid_spd=50;
const roid_vert=10;
const ship_size=30;
const ship_thrust=5;
const ship_turn_spd=360;
const shpw_centre_dot=false;
const game_lives=3;
const laser_dist=.6;
const laser_explode_dur=0.3;
const laser_max=10;
const laser_spd=10;
const roid_pts_lge=20;
const roid_pts_med=50;
const roid_pts_sml=100;
const save_key_score='highscore';
const ship_inv_dur=3;
const ship_blink_dur=0.1;
const ship_explode_dur=0.3;
const show_bounding=false;
const music_on=true;
const sound_on=true;
const text_fade_time=3;
const text_size=40;
const colors=[
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'cyan',
    'magenta',
    'lime',
    'indigo',
    'navy',
    'olive',
    'maroon',
    'teal',
    'aqua',
    'salmon',
    'coral',
    'gold',
    'silver',
]
var rotation;
var gamesEl=document.getElementById('games');
var titleEl=document.getElementById('title');
var scoreEl=document.getElementById('scoreboard');
gamesEl.width=window.innerWidth;
gamesEl.height=window.innerHeight;
var ctx=gamesEl.getContext('2d');
var roidsLeft,roidsTotal;
var level,lives,roids,score,scoreHight,ship,text,textAlpha;
ship=newShip(); //debe sacarse la function newShip() hacia afuera
function drawShip(x,y){
    ctx.beginPath();
    ctx.fillStyle='white';
    ctx.moveTo(x,y);
    ctx.lineTo(x+10,y);
    ctx.lineTo(x+5,y-10);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
function newShip(){
    return {
        x:gamesEl.width/2,
        y:gamesEl.height/2,
        a:90/180*Math.PI,
        r:10,
        blinkNum:Math.ceil(ship_inv_dur/ship_blink_dur),
        blinkTime:Math.ceil(ship_inv_dur*fps),
        canShot:true,
        lasers:[],
        thrusting:false,
        thrust: {
            x:0,
            y:0
        },
        explodeTime:0,
        rot:null,
        dead:false,
        engineThrusting:false,
    }
}

function drawShip(x,y,a,r,color='white'){
    ctx.strokeStyle=color;
    ctx.fillStyle=color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
        x+4/3*r*Math.cos(a),
        y-4/3*r*Math.sin(a)
    );
    ctx.lineTo(
        x-r*(2/3*Math.cos(a)+Math.sin(a)),
        y+r*(2/3*Math.sin(a)-Math.cos(a))
    );
    ctx.lineTo(
        x-r*(2/3*Math.cos(a)-Math.sin(a)),
        y+r*(2/3*Math.sin(a)+Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
function rotateShip(ship){
    ship.a+=ship.rot;
}
function thrustShip(ship){
    if(ship.thrusting){
        ship.thrust.x+=.04*Math.cos(ship.a)*ship_thrust;
        ship.thrust.y+=.04*Math.sin(ship.a)*ship_thrust;
    }else{
        ship.thrust.x-=ship.thrust.x*.1;
        ship.thrust.y-=ship.thrust.y*.1;
    }
    ship.x+=ship.thrust.x;
    ship.y-=ship.thrust.y;
    if(ship.x>gamesEl.width){
        ship.x=0;
    }
    if(ship.x<0){
        ship.x=gamesEl.width;
    }
    if(ship.y>gamesEl.height){
        ship.y=0;
    }
    if(ship.y<0){
        ship.y=gamesEl.height;
    }
}
function drawEngine(){
    if(ship.engineThrusting){
        ctx.strokeStyle='yellow';
        ctx.fillStyle="red"
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(
            ship.x-ship.r*(2/3*Math.cos(ship.a)+.5*Math.sin(ship.a)),
            ship.y+ship.r*(2/3*Math.sin(ship.a)-.5*Math.cos(ship.a))
        );
        ctx.lineTo(
            ship.x-ship.r*((8+(Math.random()*3))/3*Math.cos(ship.a)),
            ship.y+ship.r*((8+(Math.random()*3))/3*Math.sin(ship.a))
        );
        ctx.lineTo(
            ship.x-ship.r*(2/3*Math.cos(ship.a)-.5*Math.sin(ship.a)),
            ship.y+ship.r*(2/3*Math.sin(ship.a)+.5*Math.cos(ship.a))
        );
        ctx.stroke();
        ctx.fill();
    }
}
function distanceBetweenPoints(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function newAsteroid(x,y,r){
    var lvlMult=1+0.1*level;
    var roid={
        x,
        y,
        r,
        xv:Math.random()*roid_spd*lvlMult/fps*(Math.random()<.5?1:-1),
        yv:Math.random()*roid_spd*lvlMult/fps*(Math.random()<.5?1:-1),
        a: Math.random()*Math.PI*2,
        offs:[],
        vert: Math.floor(Math.random()*(roid_vert+1)+roid_vert/2),
    }
    for(var i=0;i<roid.vert;i++){
        roid.offs.push(Math.random()*roid_jag*2+1-roid_jag);
    }
    return roid;
}
function createAsteroidBelt(){
    roids=[];
    roidsTotal=(roid_num+level)*3;
    roidsLeft=roidsTotal;
    var x, y;
    level=0;
    for(var i=0;i<roid_num+level;i++){
        do{
            x=Math.floor(Math.random()*gamesEl.width);
            y=Math.floor(Math.random()*gamesEl.height);
        }while(distanceBetweenPoints(ship.x,ship.y,x,y)<roid_size*2+ship_size);
        roids.push(newAsteroid(x,y,roid_size));
    };
};
function drawAsteroides(){
    for( var i=0;i<roids.length;i++){
        var roid=roids[i];
        ctx.strokeStyle='white';
        ctx.fillStyle=colors[i%(colors.length+1)];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(
            roid.x+roid.r*roid.offs[0]*Math.cos(roid.a),
            roid.y+roid.r*roid.offs[0]*Math.sin(roid.a)
        );
        for(var j=1;j<roid.vert;j++){
            ctx.lineTo(
                roid.x+roid.r*roid.offs[j]*Math.cos(roid.a+j*Math.PI*2/roid.vert),
                roid.y+roid.r*roid.offs[j]*Math.sin(roid.a+j*Math.PI*2/roid.vert)
            );
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };
}
function movementAsteroids(){
    for(var i=0;i<roids.length;i++){
        var roid=roids[i];
        roid.x+=roid.xv;
        roid.y+=roid.yv;
        if(roid.x>gamesEl.width+roid.r){
            roid.x-=gamesEl.width+roid.r*2;
        }else if(roid.x<-roid.r){
            roid.x+=gamesEl.width+roid.r*2;
        }
        if(roid.y>gamesEl.height+roid.r){
            roid.y-=gamesEl.height+roid.r*2;
        }else if(roid.y<-roid.r){
            roid.y+=gamesEl.height+roid.r*2;
        }
    }
}
function shotLasers(){
    if(ship.canShot&&ship.lasers.length<laser_max){
        ship.lasers.push({
            x:ship.x+4*Math.cos(ship.a),
            y:ship.y+4*Math.sin(ship.a),
            vx:laser_spd*Math.cos(ship.a),
            vy:-laser_spd*Math.sin(ship.a),
            dist:0,
            explodeTime:0,
        });
    }
    ship.canShot=false;
}
function drawLasers(){
    for(var i=0;i<ship.lasers.length;i++){
        if(ship.lasers[i].explodeTime==0){
            ctx.fillStyle='rgb(93, 215, 255)';
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x,ship.lasers[i].y,6*Math.random(),0,Math.PI*2);
            ctx.fill();
        }
    }
}
function movementLasers(){
    for(var i=0;i<ship.lasers.length;i++){
        if(ship.lasers[i].explodeTime==0){
            ship.lasers[i].x+=ship.lasers[i].vx;
            ship.lasers[i].y+=ship.lasers[i].vy;
        }
        if(
            ship.lasers[i].x>gamesEl.width||
            ship.lasers[i].x<0||
            ship.lasers[i].y>gamesEl.height||
            ship.lasers[i].y<0
        ){
            ship.lasers.splice(i,1);
        }
    }
};
function keyDown(e){
    e.preventDefault();
    switch(e.key){
        case 'a':
            ship.rot=-.05;
            break;
        case 'd':
            ship.rot=.05;
            break;
        case 'w':
            ship.thrusting=true;
            ship.engineThrusting=true;
            break;
        case 'p':
            shotLasers();
    }
}
function destructionAsteroids(){
    for(var i=0;i<roids.length;i++){
        var roid=roids[i];
        for(var j=0;j<ship.lasers.length;j++){
            var laser=ship.lasers[j];
            if(distanceBetweenPoints(laser.x,laser.y,roid.x,roid.y)<roid.r+4){
                roid.r*=.9;

            }
        }
    }
    roids.forEach((roid,i)=>{
        if(roid.r<=20){
            roids.splice(i,1);
            roidsLeft--;
            score+=10;
        }
            setTimeout(()=>{
                roid.r+=.5;
            },1000);
    })
}
function keyUp(e){
    e.preventDefault();
    switch(e.key){
        case 'a':
        case 'd':
            ship.rot=0;
            break;
        case 'w':
            ship.thrusting=false;
            ship.engineThrusting=false;
            break;
        case 'p':
            ship.canShot=true;
            if(ship.lasers.length>=laser_max){
                ship.lasers.length=0;
            }
            break;
    }
}
function draw(){
    drawAsteroides();
    drawShip(ship.x,ship.y,ship.a,ship.r);
    drawLasers();
    drawEngine();
}
function update(){
    ctx.clearRect(0,0,gamesEl.width,gamesEl.height);
    rotateShip(ship);
    thrustShip(ship);
    movementAsteroids();
    movementLasers();
    destructionAsteroids();
    draw();
    requestAnimationFrame(update);
}
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
createAsteroidBelt();
update();