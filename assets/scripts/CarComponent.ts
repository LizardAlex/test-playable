import { _decorator, Component, CCInteger, RigidBody , Vec3, game} from 'cc';
import { ControlComponent } from './ControlComponent';
const { ccclass, property } = _decorator;

@ccclass('CarComponent')
export class CarComponent extends Component {

    @property(RigidBody)
    car: RigidBody;

    @property([RigidBody])
    wheels: RigidBody[] = [];

    @property(RigidBody)
    propeller: RigidBody;

    @property(CCInteger)
    propellerSpeed: number = 360;

    @property(CCInteger)
    maxSpeed: number = 26;

    @property(ControlComponent)
    controlComponent: ControlComponent;

    protected update(deltaTime: number): void {
       this.propeller.node.setRotationFromEuler(new Vec3(this.propeller.node.eulerAngles.x + this.propellerSpeed * deltaTime * this.controlComponent.acceleration, 0, 0));
     
        this.wheels.forEach((rb) => {
            rb.setAngularVelocity(new Vec3(0, 0, -this.maxSpeed * this.controlComponent.acceleration));
        })
    }
}

