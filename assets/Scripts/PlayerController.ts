// import { _decorator, Component, EventMouse, Node, Vec3, input, Input, Animation} from 'cc';
// const { ccclass, property } = _decorator;

// export const BLOCK_SIZE = 40;

// @ccclass('PlayerController')
// export class PlayerController extends Component {
//     @property(Animation)
//     BodyAnim:Animation = null;

//     private _startJump: boolean = false;
//     //kiem tra ng choi co dang nhay hay ko
//     private _jumpStep: number = 0;
//     //so buoc nhay
//     private _jumpTime: number = 0.3;
//     //thoi gian cho moi buoc nhay
//     private _curJumpTime: number = 0;
//     //thoi gian nguoi choi da nhay
//     private _curJumpSpeed: number = 0;
//     //toc do theo chieu doc
//     private _cusPos: Vec3 = new Vec3();
//     //vi tri hien tai cua nguoi choi
//     private _deltaPos: Vec3 = new Vec3(0, 0, 0);
//     //vi tri nhay
//     private _targetPos: Vec3 = new Vec3();
//     //vi tri dich cua nguoi choi

//     start() {
//         input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
//     }

//     update(deltaTime: number) {
//         if(this._startJump) {
//             this._curJumpTime += deltaTime; //tăng thời gian nhảy hiện tại
//             if(this._curJumpTime > this._jumpTime){
//                 this.node.setPosition(this._targetPos); //nếu đã hết thời gian nhảy thì đặt vị trí của người chơi về vị trí đích
//                 this._startJump = false; //đặt lại trạng thái nhảy
//             }else {
//                 this.node.getPosition(this._cusPos); //lấy vị trí hiện tại của người chơi
//                 this._deltaPos.x = this._curJumpSpeed * deltaTime; //tính toán khoảng di chuyển theo trục x
//                 Vec3.add(this._cusPos, this._cusPos, this._deltaPos); //cộng khoảng di chuyển vào vị trí hiện tại
//                 // _cusPos = _cusPos + _deltaPos;
//                 this.node.setPosition(this._cusPos); //đặt vị trí mới cho người chơi
//             }
//         }
//     }

//     jumpByStep(step: number) {
//         if(this._startJump) {
//             return; //neu nguoi choi da bat dau nhay roi thi khong cho nhay tiep
//         }
//         this._startJump = true;

//         // const clipName = step === 1 ? 'oneStep' : 'twoStep';
//         // const state = this.BodyAnim.getState(clipName);
//         // this._jumpTime = state.duration; //lấy thời gian của clip nhảy tương ứng với số bước nhảy

//         this._jumpStep = step; //so buoc nhay
//         this._curJumpTime = 0; //đặt lại tg nhảy về 0 mỗi khi bắt đầu nhảy

//         this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime; //tính tốc độ nhảy 

//         this.node.getPosition(this._cusPos); // lấy vị trí hiện tại của người chơi làm gốc tính toán
//         Vec3.add(this._targetPos, this._cusPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0)); // tính toán vị trí đích theo trục x của người chơi sau khi nhảy

//         if(this.BodyAnim){
//             if( step === 1) {
//                 this.BodyAnim.play('oneStep');
//             }else if(step === 2) {
//                 this.BodyAnim.play('twoStep');
//             }
//         }
//     }
    
//     onMouseUp(event: EventMouse) {
//         if(event.getButton() === 0) {
//             console.log("Left mouse button clicked");
//             this.jumpByStep(1);
//         }else if(event.getButton() === 2) {
//             this.jumpByStep(2);
//         }
//     }
// }

import { _decorator, Component, Vec3, EventMouse, input, Input, Animation } from "cc";
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40;

@ccclass("PlayerController")
export class PlayerController extends Component {
    @property(Animation)
    BodyAnim:Animation = null;

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.3;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();

    start () {
        
    }

    reset() {
    }
    
    setInputActive(active: boolean){
        if(active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }else{
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }

    }

    jumpByStep(step: number) {
    if (this._startJump) {
        return;
    }
    this._startJump = true;

    const clipName = step === 1 ? 'oneStep' : 'twoStep';
    const state = this.BodyAnim.getState(clipName);
    this._jumpTime = state.duration; //lấy thời gian của clip nhảy tương ứng với số bước nhảy


    this._jumpStep = step;
    this._curJumpTime = 0;
    this._curJumpSpeed = this._jumpStep * BLOCK_SIZE/ this._jumpTime;
    this.node.getPosition(this._curPos);
    Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep* BLOCK_SIZE, 0, 0));  
    
    //the code can explain itself
    if (this.BodyAnim) {
        if (step === 1) {
            this.BodyAnim.play('oneStep');
            console.log("chay anim oneStep");
        } else if (step === 2) {
            this.BodyAnim.play('twoStep');
        }
    }
}
   
    update (deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) {
                // end
                this.node.setPosition(this._targetPos);
                this._startJump = false;              
            } else {
                // tween
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }
}


