const {ccclass, property} = cc._decorator;
import WebsocketControl from './DemoWebsocket';
import { PlayerData, KEY_INGAME } from './GameDefine';

@ccclass
export default class PlayerControl extends cc.Component {

    speed : number;
    gravity : number;
    dir: number = 0;
    dirY: number = 0;
   
    public keys : Map<number, boolean> = new Map();
    playerData: PlayerData;
    playerDataRivel: PlayerData = null;
   
    // ---------------------------------------------------------
    websocketCtr : WebsocketControl = null;
    
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.log("PlayerControl onLoad");
        this.speed = 150;
        this.gravity = -12;
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,
            this.onKeyUp, this);    
        
    }
    start () {
        cc.log("PlayerControl start");
        this.playerData = new PlayerData();
        this.playerData.x = this.node.x;
        this.playerData.y = this.node.y;//tho
        this.websocketCtr = cc.find('Canvas/GameWorld')
            .getComponent(WebsocketControl);
        //tho
     
    }
    update(dt) {
        
        //  this.speed -= this.gravity * dt;
        if (this.dir == 0 && this.dirY ==0) 
            return;

        this.speed -= this.gravity * dt;
        this.node.x += this.speed * this.dir * dt;
        this.playerData.x = this.node.x;
        //tho
        this.node.y += this.speed * this.dirY * dt;
        this.playerData.y = this.node.y;
        
        if(this.websocketCtr != null) {
            this.websocketCtr.Send(this.getInfo(KEY_INGAME));
 
        }
    }

    public getInfo(type : string) {
        this.playerData.x = this.node.x;
        this.playerData.y = this.node.y;//tho
        
      /*  if(this.websocketCtr != null) {
            this.playerData.id = this.websocketCtr.playerDataMe.id;
        }*/
        
        this.playerData.type = type;
        return JSON.stringify(this.playerData);
    }

    onKeyDown(e:cc.Event.EventCustom) {
        this.keys.set(e.keyCode, true);

        switch(e.keyCode){
            case cc.macro.KEY.right:
                this.dir = 1;
                break;
            case cc.macro.KEY.left : 
                this.dir = -1;
                break;
            case cc.macro.KEY.up:
                this.dirY = 1;
                break;
            case cc.macro.KEY.down:
                this.dirY = -1;
                break;
        }
        console.log(this.keys.size);
    }
    onKeyUp(e:cc.Event.EventCustom){
        this.keys.delete(e.keyCode);
        this.dir = 0;
        this.dirY = 0
    }

   

}
