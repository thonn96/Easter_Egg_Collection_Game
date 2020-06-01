const { ccclass, property } = cc._decorator;
import WebsocketControl from './DemoWebsocket';
import { PlayerDataAI, KEY_INGAME } from './GameDefine';

@ccclass
export default class PlayerAI extends cc.Component {

    speed: number;
    gravity: number;
    dir: number = 0;
    dirY: number = 0;

    playerAI: PlayerDataAI;
 

    // ---------------------------------------------------------

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
    }
    start() {
        this.playerAI = new PlayerDataAI();
        this.playerAI.x = this.node.x;
        this.playerAI.y = this.node.y;
    }
    
    update(dt) {
        this.movePlayerAI();
    }
    // action move playerAI
    public movePlayerAI() {
        WebsocketControl.instance.getNewPlayerAIDirection();
        var i = WebsocketControl.instance.getNewPlayerAIDirection();
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
    //-----------------------------------
}
