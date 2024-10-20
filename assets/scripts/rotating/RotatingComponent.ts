import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('RotatingComponent')
export abstract class RotatingComponent extends Component {
    public abstract onRotate(width: number, height: number, ipad: number, iphoneX: number);
}