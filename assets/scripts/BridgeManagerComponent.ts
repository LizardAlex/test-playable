import { _decorator, BoxCollider, Component, RigidBody, ERigidBodyType, Node } from 'cc';
import { CarComponent } from './CarComponent';
const { ccclass, property } = _decorator;

@ccclass('BridgeManagerComponent')
export class BridgeManagerComponent extends Component {
    @property(CarComponent)
    carComponent: CarComponent;

    protected start(): void {
        this.node.children.forEach((child: Node, id: number) => {
            const collider = child.getComponent(BoxCollider);

            collider.once('onTriggerEnter', () => {
                const rigidBody = child.getComponent(RigidBody);

                if (rigidBody) {
                    collider.isTrigger = false;
                    rigidBody.type = ERigidBodyType.DYNAMIC;
                }
            });
        })
    }
}

