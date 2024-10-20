import { _decorator, Component, BoxCollider, Label, Camera, Node, instantiate, Vec3, tween, easing } from 'cc';
import { BezierTween } from './utils/BezierTween';
const { ccclass, property } = _decorator;

@ccclass('CoinsCounterComponent')
export class CoinsCounterComponent extends Component {
    @property(Label)
    label: Label;

    @property([BoxCollider])
    colliders: BoxCollider[] = [];
    
    @property(Camera)
    camera3d: Camera;

    @property(Node)
    coin: Node;

    private _score = 0;
    private _bezierOffset = 250;

    protected start(): void {
        this.colliders.forEach((collider) => {
            collider.once('onTriggerEnter', () => {
                this._collect(collider.node);
                collider.node.destroy();
            });
        });
    }

    private _collect(colliderNode: Node): void {
        const coin = instantiate(this.coin);
        coin.parent = this.node;
        this.camera3d.convertToUINode(colliderNode.worldPosition, this.node, coin.position);

        BezierTween.startTween(0.3, coin, this.coin.position, new Vec3(coin.position.x / 2 + this._bezierOffset, coin.position.y / 2, 0), () => {
            tween(coin)
                .to(0.15, {scale: new Vec3(1.35, 1.35, 1.35)}, {easing: easing.sineIn})
                .call(() => {
                    this._score++;
                    this.label.string = this._score.toString();
                })
                .to(0.15, {scale: new Vec3(1, 1, 1)}, {easing: easing.sineOut})
                .call(() => {
                    coin.destroy();
                })
                .start();
        });
    }
}

