const { ccclass, property } = cc._decorator;
import WebsocketControl from './DemoWebsocket';
import { PlayerDataAI, KEY_INGAME } from './GameDefine';

@ccclass
export default class PlayerAI extends cc.Component {

    speed: number;
    gravity: number;
    dir: number = 0;
    dirY: number = 0;

    public keys: Map<number, boolean> = new Map();
    
    playerAI: PlayerDataAI;
 

    // ---------------------------------------------------------
    websocketCtr: WebsocketControl = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        cc.log("PlayerAI onLoad");
        this.speed = 150;
        this.gravity = -12;

    }
    start() {
        cc.log("playerAI start");

        this.playerAI = new PlayerDataAI();
        this.playerAI.x = this.node.x;
        this.playerAI.y = this.node.y;
        this.websocketCtr = cc.find('Canvas/GameWorld')
            .getComponent(WebsocketControl);
    }
    
    update(dt) {
        this.movePlayerAI();
    }
    public movePlayerAI() {
        WebsocketControl.instance.getNewPlayerAIPosition();
        var i = WebsocketControl.instance.getNewPlayerAIPosition().x;
        switch (i) {
            case 0:
                this.node.x += 0;
                this.node.y += 1;
                break;
            case 1:
                this.node.x += 0;
                this.node.y -= 1;
                break;
            case 2:
                this.node.x += 1;
                this.node.y += 0;
                break;
            case 3:
                this.node.x -= 1;
                this.node.y += 0;
                break;
        }
    }
}
