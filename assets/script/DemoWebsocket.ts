const {ccclass, property} = cc._decorator;

import PlayerControl from './PlayerControl';
import { PlayerData, KEY_CONNECTED, KEY_READY, KEY_INGAME, PlayerDataAI } from './GameDefine';
import PlayerAI from './PlayerAI';

// doc 
// https://docs.cocos2d-x.org/creator/manual/en/scripting/network.html 
var eggPositionX: number = 1;
var eggPositionY: number = 1;
var playerAIPositionDirection: number = 1;

@ccclass
export default class WebsocketControl extends cc.Component {

    websocket : WebSocket;
    isConnected : boolean = false;

    player: PlayerControl;
    playerAI: PlayerDataAI = null;
    @property(cc.Prefab) prefab_PlayerAi: cc.Prefab = null;
    @property(cc.Prefab) prefab_Player: cc.Prefab = null;
    @property(cc.Prefab) eggfab: cc.Prefab = null;
    @property(cc.Label) times: cc.Label = null;

    timeGame: number = 1000;
    coutdownTime() {
        if (this.timeGame > 0)
        this.timeGame -= 1;
        this.times.string = 'Time:' + this.timeGame.toString() + 's' ;
     }
  
    public static instance: WebsocketControl;
    // create Egg with new position
    spawnNewEgg() {
        var newEgg = cc.instantiate(this.eggfab);
        this.node.addChild(newEgg);
        newEgg.addComponent(cc.CircleCollider);
        newEgg.getComponent(cc.CircleCollider).radius = 40;
        newEgg.group = 'Player1';
        newEgg.setPosition(this.getNewEggPosition());
    }
    //------------------------------------

    // get new Egg position form Server
    getNewEggPosition() {
        var EggX = eggPositionX;
        var EggY = eggPositionY ;
        return cc.v2(EggX, EggY);
    }
    // ------------------------

     // get new Player position form Server
    getNewPlayerAIDirection() {
        var playerAI_X = playerAIPositionDirection;
       
      
        return playerAI_X;
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.spawnNewEgg();
   
     
    }
    start() {
        WebsocketControl.instance = this
        cc.log("WebSocket start");
        this.websocket = new 
            WebSocket("ws://192.168.1.6:8080");

        var self = this;
        this.websocket.onopen = function (evt) {
            // cc.log(evt);
            self.isConnected = true;
        };
        //get data from server
        this.websocket.onmessage = function (evt) {
            let eventData = JSON.parse(evt.data);
            switch (eventData.type) {
                case 'PLAYER_DATA':
                    {
                        console.log('tho ' +evt.data);
                        break;
                    }
                case 'EGG_DATA':
                    {
                        eggPositionX = eventData.data.egg_positionX;
                        eggPositionY = eventData.data.egg_positionY;
                        break;
                    }
                case 'PLAYER_DATA_AI':
                    {
                        playerAIPositionDirection = eventData.data.playerAI_direction;

                        break;
                    }
            }
        };
        //-------------------------------------
        this.websocket.onclose = function (event) {
            console.log("Closed ");
            self.isConnected = false;
        }
        this.player = cc.find('Canvas/Player').getComponent(PlayerControl);
         this.Send(this.player.getInfo(KEY_READY));
        console.log(this.player.node.x);
        
    }

    update(dt) {
        
            this.coutdownTime();

    }
    public Send(data : string) {
        if(this.websocket != null && this.isConnected == true)
            this.websocket.send(data);
    }

     
   

}
