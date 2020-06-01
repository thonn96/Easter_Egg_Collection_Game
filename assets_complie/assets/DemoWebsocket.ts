const {ccclass, property} = cc._decorator;

import PlayerControl from './PlayerControl';
import { PlayerData, KEY_CONNECTED, KEY_READY, KEY_INGAME, PlayerDataAI } from './GameDefine';
import PlayerAI from './PlayerAI';

// doc 
// https://docs.cocos2d-x.org/creator/manual/en/scripting/network.html 
var eggPositionX: number = 1;
var eggPositionY: number = 1;
var playerAIPositionX: number = 1;
var playerAIPositionY: number = 1;

@ccclass
export default class WebsocketControl extends cc.Component {

    websocket : WebSocket;
    isConnected : boolean = false;

    player: PlayerControl;
    playerDataMe : PlayerData = null;
    playerDataRivel: PlayerData = null;
    playerAI: PlayerDataAI = null;
    @property(cc.Prefab) prefab_PlayerAi: cc.Prefab = null;
    @property(cc.Prefab) prefab_Player: cc.Prefab = null;
    @property(cc.Prefab) eggfab: cc.Prefab = null;
    @property
    maxStarDuration: number = 0;
    @property
    minStarDuration: number = 0;
    public static instance: WebsocketControl;

   

    // create AI
    createAI() {

      /*  for (let i = 0; i < 5; ++i) {   
            var playerAI = cc.instantiate(this.prefab_PlayerAi);
            this.node.addChild(playerAI);
            playerAI.setPosition(i * 10, i * 20);
        }
    */
    }
     
    //
    //tho
    spawnNewEgg() {
        var newEgg = cc.instantiate(this.eggfab);
        this.node.addChild(newEgg);
        newEgg.addComponent(cc.CircleCollider);
        newEgg.getComponent(cc.CircleCollider).radius = 40;
        newEgg.group = 'Player1';
        newEgg.setPosition(this.getNewEggPosition());
    }
    getNewEggPosition() {
        var EggX = eggPositionX;
        var EggY = eggPositionY ;
        console.log('tho1:' + EggX);
        console.log('tho1:' + EggY);
        var maxX = this.node.width / 2;
        return cc.v2(EggX, EggY);
    }

    getNewPlayerAIPosition() {
        var playerAI_X = playerAIPositionX;
        var playerAI_Y = playerAIPositionY;
      
       return cc.v2(playerAI_X, playerAI_Y);
    }

    //
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.spawnNewEgg();
        this.createAI();
     
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
        this.websocket.onmessage = function (evt) {
           // console.log('data: ' + evt.data);
            
           // let playerdata = JSON.parse(evt.data);
            let eventData = JSON.parse(evt.data);
            switch (eventData.type) {
                case 'PLAYER_DATA':
                    {
                        console.log('tho ' +evt.data);
                        break;
                    }
                case 'EGG_DATA':
                    {
                       // console.log(eventData.data);
                        eggPositionX = eventData.data.egg_positionX;
                        eggPositionY = eventData.data.egg_positionY;
                        break;
                    }
                case 'PLAYER_DATA_AI':
                    {
                        playerAIPositionX = eventData.data.playerAI_direction;
                        playerAIPositionY = eventData.data.playerAI_Y;   
                        break;
                    }
            }
        };

        this.websocket.onclose = function (event) {
            console.log("Closed ");
            self.isConnected = false;
        }
        this.player = cc.find('Canvas/Player').getComponent(PlayerControl);
         this.Send(this.player.getInfo(KEY_READY));
        console.log(this.player.node.x);
        
    }

    public sendPosition(x: number, y: number) {
       // return cc.v2(x, y);
    }
    update(dt) {

        
       // if(this.isConnected == false) 
      //      return;


        // this.Send('dt: ' + dt);
    }
    public Send(data : string) {
        if(this.websocket != null && this.isConnected == true)
            this.websocket.send(data);
    }
}
