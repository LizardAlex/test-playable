import { _decorator, Camera } from 'cc';
import { RotatingComponent } from './RotatingComponent';
const { ccclass, property } = _decorator;

@ccclass('camera3dRotatingComponent')
export class camera3dRotatingComponent extends RotatingComponent {
    public onRotate(width: number, height: number, ipad: number, iphoneX: number): void {
        const camera = this.node.getComponent(Camera);
        if (width > height) {
            camera.fov = 70;
        } else {
            camera.fov = 45;
        }
        
    }
}

