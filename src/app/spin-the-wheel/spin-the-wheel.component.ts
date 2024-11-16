import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core'
import gsap from 'gsap'

@Component({
  selector: 'app-spin-the-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spin-the-wheel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinTheWheelComponent implements AfterViewInit {
  wheel = viewChild<ElementRef<HTMLElement>>('wheel')
  disabled = signal(false)
  wonEp1200 = signal(false)

  ngAfterViewInit(): void {
    const wheel = this.wheel()?.nativeElement
    if (wheel) {
      gsap.set(wheel, {
        rotation: '+=15',
      })
    }
  }

  protected spinWheel() {
    const wheel = this.wheel()?.nativeElement
    if (!wheel) return

    this.disabled.set(true)

    const tickSound = new Audio('sounds/tick.mp3')
    let lastPlayedPosition = 0 // Track last played position for sound
    const fullSpinDegrees = 360 * 15.94 // 15.94 full spins

    gsap.to(wheel, {
      rotation: `+=${fullSpinDegrees}`, // 10 full spins (10 * 360)
      duration: 20, // Duration of the animation
      ease: 'power1.out', // Ease out for a realistic slowing effect
      onUpdate: () => {
        // Get current rotation
        const currentRotation = gsap.getProperty(wheel, 'rotation')

        // Calculate the normalized rotation within the 360 range
        const normalizedRotation = +currentRotation % 360
        const sectionAngle = 60

        // Check if we crossed a 60-degree threshold
        if (
          normalizedRotation - lastPlayedPosition >= sectionAngle ||
          normalizedRotation - lastPlayedPosition <= -sectionAngle
        ) {
          tickSound.play()
          lastPlayedPosition = normalizedRotation
        }
      },
      onComplete: () => {
        const hooraySound = new Audio('sounds/hooray.wav')
        hooraySound.play()
        this.wonEp1200.set(true)
      },
    })
  }
}
