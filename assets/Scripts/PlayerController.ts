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

    private _curMoveIndex: number = 0;

    start () {
        
    }

    reset() {
        this._curMoveIndex = 0;
        this.node.getPosition(this._curPos);
        this._targetPos.set(0, 0, 0);
    }
    
    setInputActive(active: boolean){
        if(active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
        else{
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

    this._curMoveIndex += step;
}
   
    update (deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) {
                // end
                this.node.setPosition(this._targetPos);
                this._startJump = false;  
                this.onOnceJumpEnd();            
            } else {
                // tween
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }

    onOnceJumpEnd() {
        this.node.emit('JumpEnd', this._curMoveIndex);
    }
}


