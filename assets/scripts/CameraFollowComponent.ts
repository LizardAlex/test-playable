import { _decorator, Component, Node, Vec3, director, Director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollowComponent')
export class CameraFollowComponent extends Component {
    @property(Node)
    character: Node;

    private _offset: Vec3;

    protected start(): void {
        this._offset = this.node.position.clone();

        director.on(Director.EVENT_AFTER_PHYSICS, this._onPhysicsUpdate, this);
    }

    private _onPhysicsUpdate(): void {
        this.node.setPosition(this.character.position.clone().add(this._offset));
    }
}

