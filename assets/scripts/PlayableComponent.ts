import { _decorator, Component, UITransform, screen, Camera, settings, AudioSource, view } from 'cc';
import { RotatingComponent } from './rotating/RotatingComponent';
const { ccclass, property } = _decorator;

@ccclass('Sounds')
export class Sounds {
    @property
    key: string = '';

    @property(AudioSource)
    audio: AudioSource | null = null;
}

@ccclass('PlayableComponent')
export class PlayableComponent extends Component {
    @property(UITransform)
    transform: UITransform;

    @property([Camera])
    cameras: Camera[] = [];

    @property([RotatingComponent])
    rotatableComponents: RotatingComponent[] = [];

    @property([Sounds])
    audioSources: Sounds[] = [];
    //@ts-ignore
    private _settingsSize = settings._override?.screen?.designResolution?.width || 720;
    private readonly _soundsMap: Map<AudioSource, number> = new Map();

    private _ipad: number;
    private _ihponeX: number;
    private _firstInteraction: boolean = false;

    protected onLoad(): void {
        this.audioSources.forEach((audio) => {
            this._soundsMap.set(audio.audio, audio.audio.volume);
        })

        this._onWindowResize(screen.resolution.width, screen.resolution.height);
        view.on('canvas-resize', () => {
            this._onWindowResize(screen.resolution.width, screen.resolution.height);
        });

        cc.mute = this._mute.bind(this);
        cc.unMute = this._unMute.bind(this);

        cc.onVolumeChange = this._onVolumeChange.bind(this);

        cc.onResize = (width, height) => {
            this._onWindowResize(width, height);
        }
    }

    private _onVolumeChange(vol: number) {
        this.audioSources.forEach((audio) => {
            const audioSource = audio.audio;
            const volume = this._soundsMap.get(audioSource);
            if (volume) {
                audioSource.volume = Math.round(volume * vol * 100) / 100;
            }
        });
    }

    private _mute(): void {
        this.audioSources.forEach((audio) => {
            const audioSource = audio.audio;
            this._soundsMap.set(audioSource, audioSource.volume);
            audioSource.volume = 0;
        });
    }

    private _unMute(): void {
        this.audioSources.forEach((audio) => {
            const audioSource = audio.audio;
            const vol = this._soundsMap.get(audioSource);
            if (vol) {
                audioSource.volume = vol;
            }
        });
    }

    private _onWindowResize(width: number, height: number): void {
        if (width > height) {
            this.transform.height = this._settingsSize;
            this.transform.width = this.transform.height * width / height;
        } else {
            this.transform.width = this._settingsSize;
            this.transform.height = this.transform.width * height / width;
        }

        this._ipad = Math.min(Math.abs((Math.min(Math.max(this.transform.width, this.transform.height), 1280) / 1280 - 0.75) / 0.25 - 1), 1);
        this._ihponeX = Math.min(Math.abs((Math.max(Math.max(this.transform.width, this.transform.height), 1280) / 1280 - 1) / 0.218), 1);

        this.cameras.forEach((camera) => {
            camera.orthoHeight = this.transform.height / 2;
        });

        for (const component of this.rotatableComponents) {
            if (component && component.onRotate && component.node?.isValid) {
                component.onRotate(this.transform.width, this.transform.height, this._ipad, this._ihponeX);
            }
        }
    }

    public playSound(key: string, key2: string):  AudioSource {
        let audioKey = typeof key === 'string' ? key : key2; 
        const audio = this.audioSources.find((audio) => audio.key === audioKey)?.audio;
        audio?.play();

        return audio;
    }

    public firstInteraction(): void {
        if (!this._firstInteraction) {
            if (cc.firstInteraction) cc.firstInteraction();
        }

        this._firstInteraction = true;
    }

    public gameEnd(): void {
        if (cc.gameEnd) cc.gameEnd();
    }

    public CTAClick(): void {
        if (typeof onCTAClick !== 'undefined') {
            onCTAClick();
        }
    }
}

