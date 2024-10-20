import { _decorator, Component, Node, EventTouch, UITransform, Vec3, UIOpacity, Tween, tween, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ControlComponent')
export class ControlComponent extends Component {
    @property(Node)
    lever: Node;

    @property(Node)
    tutorialHand: Node;

    @property(UIOpacity)
    tutorialHandOpacity: UIOpacity;

    @property(UITransform)
    leverAreaTransform: UITransform;

    private _tutorialActive: boolean;
    private _tutorialTweensArray: Tween<any>[];
    public acceleration: number = 0;

    protected start(): void {
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchStart, this);

        this._startTutorial();
    }

    private _touchStart(event: EventTouch): void {
        if (this._tutorialActive) {
            this._stopTutorial();
        }

        const UILocation = event.getUILocation();
        const leverY = this.leverAreaTransform.convertToNodeSpaceAR(new Vec3(UILocation.x, UILocation.y, 0)).y;
        const leverYBordered = Math.max(Math.min(leverY, this.leverAreaTransform.height), 0);

        this.acceleration = leverYBordered / this.leverAreaTransform.height;

        this.lever.setPosition(0, leverYBordered, 0);
    }

    private _startTutorial(): void {
        this._tutorialActive = true;

        const tw1 = tween(this.tutorialHandOpacity)
            .delay(1)
            .to(0.15, {opacity: 255})
            .delay(1)
            .to(0.15, {opacity: 0})
            .union()
            .repeatForever()
            .start();

        const tw2 = this._tutorialTweenMove(this.tutorialHand);

        const tw3 = this._tutorialTweenMove(this.lever);

        this._tutorialTweensArray = [tw1, tw2, tw3];
    }

    private _tutorialTweenMove(node: Node): Tween<any> {
        return tween(node)
            .delay(1.15)
            .to(0.5, { position: new Vec3(0, this.leverAreaTransform.height,0) }, { easing: easing.sineInOut })
            .to(0.5, { position: new Vec3(0, 0,0) }, { easing: easing.sineInOut })
            .delay(0.15)
            .union()
            .repeatForever()
            .start();
    }

    private _stopTutorial(): void {
        this._tutorialActive = false;
    
        this._tutorialTweensArray.forEach((tween) => {
            tween.stop();
        });

        tween(this.tutorialHandOpacity)
            .to(0.15, {opacity: 0})
            .start();
    }
}

