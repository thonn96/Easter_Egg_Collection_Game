
const {ccclass, property} = cc._decorator;

import WebsocketControl from './DemoWebsocket';

@ccclass
export default class NewClass extends cc.Component {

    @property
    jumpHeight:number = 0;
    @property
    jumpDuration:number = 0;
    @property
    maxMovementSpeed:number = 0;
    @property
    accel: number = 0;
    jumpAction: any;
    node: any;


  

    // check collistion Egg and Player
    onCollisionEnter(selfCollider, otherCollider) {
        console.log(selfCollider.name);
        console.log(otherCollider.name);
        if (otherCollider.name = 'Egg<CircleCollider>' && selfCollider.name == 'Player<CircleCollider>') {
            this.node.destroy();
        } else if (otherCollider.name = 'Egg<CircleCollider>' && selfCollider.name == 'playerAI<CircleCollider>') {
            this.node.destroy();
        }
    }
    //---------------------------------
    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    start () {

    }

    //update (dt) {}
    onDestroy() {
        this.node.parent.getComponent('DemoWebsocket').spawnNewEgg();       
        
    }
}
