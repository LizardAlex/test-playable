import { _decorator, BoxCollider, Component, HingeConstraint, RigidBody, Node, UIOpacity, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DeadAreaComponent')
export class DeadAreaComponent extends Component {
    @property([BoxCollider])
    colliders: BoxCollider[] = [];

    @property([HingeConstraint])
    constraintToRemove: HingeConstraint[] = [];

    @property([BoxCollider])
    boxCollidersToTurnOn: BoxCollider[] = [];

    @property([RigidBody])
    rigidBodiesToTurnOn: RigidBody[] = [];

    @property(BoxCollider)
    mainCarCollider: BoxCollider;

    @property(RigidBody)
    mainCarBody: RigidBody;

    @property(Node)
    packshot: Node;

    @property(UIOpacity)
    UIopacity: UIOpacity;
    
    protected start(): void {
        this.colliders.forEach((collider) => {
            collider.on('onTriggerEnter', this._destroyPlayer, this);
        });
    }

    private _runPackshot(): void {
        tween(this.UIopacity)
            .delay(0.5)
            .call(() => {
                this.packshot.active = true;
            })
            .to(0.3, {opacity: 0})
            .start();
    }

    private _destroyPlayer(): void {
        this.mainCarBody.enabled = false;
        this.mainCarCollider.enabled = false;

        this._runPackshot();

        this.colliders.forEach((collider) => {
            collider.off('onTriggerEnter', this._destroyPlayer, this);
        });

        this.constraintToRemove.forEach((constraint) => {
            constraint.destroy();
        });

        this.boxCollidersToTurnOn.forEach((boxCollider) => {
            boxCollider.enabled = true;
        });

        this.rigidBodiesToTurnOn.forEach((rigidBody) => {
            rigidBody.enabled = true;
        });
    }
}

