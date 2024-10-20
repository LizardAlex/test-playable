import { _decorator, Camera } from 'cc';
import { RotatingComponent } from './RotatingComponent';
const { ccclass, property } = _decorator;

@ccclass('CTARotatingComponent')
export class CTARotatingComponent extends RotatingComponent {
    public onRotate(width: number, height: number, ipad: number, iphoneX: number): void {
        if (!this.node || !this.node.isValid) return;
        if (width > height) {
            this.node.position.set(0, -height / 2 + 100);
        } else {
            this.node.position.set(0, -height / 2 + 100 + 100 * iphoneX - 20 * ipad);
        }
    }
}

