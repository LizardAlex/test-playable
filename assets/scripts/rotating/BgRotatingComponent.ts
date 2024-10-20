import { _decorator, Component, v3 } from 'cc';
import { RotatingComponent } from './RotatingComponent';
const { ccclass, property } = _decorator;

@ccclass('BgRotatingScript')
export class BgRotatingScript extends RotatingComponent {
    public onRotate(width: number, height: number, ipad: number, iphoneX: number) {
        this.node.setScale(v3(Math.max(width / 1024, height / 1024), Math.max(width / 1024, height / 1024)));
    }
}

