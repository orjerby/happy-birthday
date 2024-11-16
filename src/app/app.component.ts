import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core'
import { BlessingComponent } from './blessing/blessing.component'
import { HeaderComponent } from './header/header.component'
import { SpinTheWheelComponent } from './spin-the-wheel/spin-the-wheel.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BlessingComponent,
    SpinTheWheelComponent,
  ],
  templateUrl: './app.component.html',
  animations: [
    trigger('isStarted', [
      transition(':leave', [
        style({
          opacity: 1,
        }),
        animate(1000, style({ opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  started = signal(false)
  blessing = viewChild<BlessingComponent>('blessing')
  happyBirthdaySounds = [
    new Audio('sounds/happy-birthday-hebrew.mp3'),
    new Audio('sounds/happy-birthday-english.mp3'),
    new Audio('sounds/happy-birthday-random-1.mp3'),
    new Audio('sounds/happy-birthday-random-2.mp3'),
    new Audio('sounds/happy-birthday-random-3.mp3'),
    new Audio('sounds/happy-birthday-random-4.mp3'),
    new Audio('sounds/happy-birthday-random-5.mp3'),
  ]
  currentIndexHappyBirthdaySound = 0
  muted = false

  private volumeChangeHandler: (this: HTMLAudioElement, ev: Event) => void =
    () => {}
  private audioEndHandler: (this: HTMLAudioElement, ev: Event) => void =
    () => {}

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.disableScroll()
  }

  protected startJourney() {
    this.started.set(true)

    this.blessing()?.animate()

    if (!this.muted) {
      this.playNextAudio()
    }

    setTimeout(() => {
      this.enableScroll()
    }, 2000)
  }

  protected toggleSpeaker() {
    if (this.muted) {
      this.playNextAudio()
      this.muted = false
    } else {
      this.happyBirthdaySounds.forEach((audio) => {
        audio.removeEventListener('volumechange', this.volumeChangeHandler)
        audio.removeEventListener('ended', this.audioEndHandler)

        audio.pause()
      })

      this.muted = true
    }
  }

  private disableScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden')
  }

  private enableScroll() {
    this.renderer.removeStyle(document.body, 'overflow')
  }

  private playNextAudio() {
    const currentAudio =
      this.happyBirthdaySounds[
        this.currentIndexHappyBirthdaySound % this.happyBirthdaySounds.length
      ]

    this.happyBirthdaySounds.forEach((audio) => {
      if (audio !== currentAudio) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    currentAudio.removeEventListener('volumechange', this.volumeChangeHandler)
    currentAudio.removeEventListener('ended', this.audioEndHandler)

    this.volumeChangeHandler = this.increaseVolume.bind(this, currentAudio)
    this.audioEndHandler = this.handleAudioEnd.bind(this)

    currentAudio
      .play()
      .then(() => {
        currentAudio.addEventListener('volumechange', this.volumeChangeHandler)
        currentAudio.addEventListener('ended', this.audioEndHandler)

        currentAudio.volume = 0
      })
      .catch((error) => console.error('Error playing audio:', error))
  }

  private increaseVolume(audio: HTMLAudioElement) {
    if (audio.volume < 0.1) {
      setTimeout(() => {
        audio.volume = Math.min(audio.volume + 0.01, 0.1)
      }, 500)
    } else {
      audio.removeEventListener('volumechange', this.volumeChangeHandler!)
    }
  }

  private handleAudioEnd() {
    this.currentIndexHappyBirthdaySound++
    this.playNextAudio()
  }
}
