import { _decorator, Component, CCInteger, Prefab, Node, instantiate, Label, Vec3 } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE,
}

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Prefab })
    public boxPrefab: Prefab|null = null;

    @property({ type: CCInteger })
    public roadLength: number = 50;
    private _road: BlockType[] = [];

    @property({ type: Node })
    public startMenu: Node|null = null;

    @property({ type: PlayerController})
    public playerCtrl: PlayerController|null = null;

    @property({ type: Label})
    public stepsLabel: Label|null = null;

    start() {
        this.setCurState(GameState.GS_INIT); // Thiết lập trạng thái ban đầu là GS_INIT
    }

    // update(dt: number): void {
        
    // }

    generateRoad() {
        this.node.removeAllChildren(); // Xóa tất cả các khối hiện tại

        this._road = [];

        this._road.push(BlockType.BT_STONE); // Khởi tạo khối đầu tiên là BT_STONE

        for(let i = 1; i < this.roadLength; i++) {
            if(this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE); // Nếu khối trước là BT_NONE, tạo khối mới là BT_STONE
            }else {
                this._road.push(Math.floor(Math.random() * 2)); // Ngẫu nhiên tạo khối mới là BT_NONE hoặc BT_STONE
                // Math.random lấy số float ngẫu nhiên từ 0 -> 1, sau đó nhân với 2 và dùng hàm Math.floor để làm tròn về số nguyên gần nhất
            }
        }

        for(let j =0; j < this._road.length; j++) {
            let block: Node | null = this.spawnBlockByType(this._road[j]);
            if(block) {
                this.node.addChild(block);
                block.setPosition(j * BLOCK_SIZE, 0, 0); // Đặt vị trí của khối theo chỉ số của nó trong mảng
            }
        }
    } 

    spawnBlockByType(type: BlockType){
        if (!this.boxPrefab) {
            return null; // Nếu prefab không được gán, trả về null
        }

        let block: Node|null = null;
        switch(type) {
            case BlockType.BT_STONE:
                block = instantiate(this.boxPrefab); // Tạo một khối mới từ prefab
                break;
        }

        return block; // Trả về khối mới được tạo
    }

    setCurState(value: GameState){
        switch(value){
            case GameState.GS_INIT:
                this.init(); // Gọi hàm init khi chuyển sang trạng thái GS_INIT
                break;
            case GameState.GS_PLAYING:
                if(this.startMenu) {
                    this.startMenu.active = false; // Ẩn menu bắt đầu khi chuyển sang trạng thái GS_PLAYING
                }

                if(this.stepsLabel){
                    this.stepsLabel.string = "0"; // Đặt số bước đi ban đầu là 0
                }

                setTimeout(() => {
                    if(this.playerCtrl) {
                        this.playerCtrl.setInputActive(true); // Bật điều khiển của người chơi sau 1 giây
                    }
                }, 0.1)
                break;
            case GameState.GS_END:
                break;
        }
    }

    init(){
        if(this.startMenu) {
            this.startMenu.active = true; // Hiển thị menu bắt đầu
        }

        this.generateRoad(); // Tạo đường đi

        if(this.playerCtrl){
            this.playerCtrl.setInputActive(false); // Tắt điều khiển của người chơi
            this.playerCtrl.node.setPosition(Vec3.ZERO); // Đặt vị trí của người chơi về gốc tọa độ
            this.playerCtrl.reset(); // Đặt lại trạng thái của người chơi
        }
    }

    onStartButtonClicked() {
        this.setCurState(GameState.GS_PLAYING); // Chuyển sang trạng thái GS_PLAYING khi nút bắt đầu được nhấn
    }
}


