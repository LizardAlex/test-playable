import { _decorator, Node, tween, Vec3, TweenEasing } from 'cc';

export class BezierTween {
    public static startTween(
        duration: number,
        targetNode: Node, 
        targetPosition: Vec3, 
        bezierPoint: Vec3,
        callback: () => void = () => {},
        easing: TweenEasing = 'sineIn' 
    ) {
        const quadraticBezier = (start: number, control: number, end: number, t: number): number => {
            return (1 - t) * (1 - t) * start + 2 * (1 - t) * t * control + t * t * end;
        };

        const coordinateFunctions: Array<(start, end, ratio) => any> = [
            (start, end, ratio) => quadraticBezier(start, bezierPoint.x, end, ratio),
            (start, end, ratio) => quadraticBezier(start, bezierPoint.y, end, ratio),
            (start, end, ratio) => end
        ];

        let counter = 0;

        tween(targetNode)
            .to(duration, { position: targetPosition }, {
                progress: (start, end, current, ratio) => {
                    const currentCoordinate = coordinateFunctions[counter](start, end, ratio);
                    counter = (counter + 1) % 3;
                    return currentCoordinate;
                },
                easing,
            })
            .call(callback)
            .start();
    }
}
