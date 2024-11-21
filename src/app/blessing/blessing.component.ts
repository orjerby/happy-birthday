import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeartSvgComponent } from '../heart-svg/heart-svg.component'
import { LetterComponent } from '../letter/letter.component'

gsap.registerPlugin(ScrollTrigger)

@Component({
  selector: 'app-blessing',
  standalone: true,
  imports: [LetterComponent, HeartSvgComponent],
  templateUrl: './blessing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlessingComponent {
  firstMovingSection = viewChild<ElementRef<HTMLElement>>('firstMovingSection')
  secondMovingSection = viewChild<ElementRef<HTMLElement>>(
    'secondMovingSection',
  )
  firstMovingSectionFirst = viewChild<ElementRef<HTMLElement>>(
    'firstMovingSectionFirst',
  )
  videos = viewChildren<ElementRef<HTMLVideoElement>>('vid')
  movingSectionsGap = signal<number>(0)
  letter = viewChild<LetterComponent>('letter')

  ngAfterViewInit(): void {
    this.setMovingSectionsGap()
    this.prepareMovingSections()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setMovingSectionsGap()
  }

  public animate() {
    this.animateMovingSections()
    this.letter()?.animate()
  }

  private prepareMovingSections() {
    const secondMovingSection = this.secondMovingSection()?.nativeElement

    if (secondMovingSection) {
      gsap.set(secondMovingSection, { x: '50%' })
    }
  }

  private animateMovingSections() {
    const tl = gsap.timeline({ repeat: -1 })

    const firstMovingSection = this.firstMovingSection()?.nativeElement
    const secondMovingSection = this.secondMovingSection()?.nativeElement

    if (firstMovingSection && secondMovingSection) {
      tl.to(firstMovingSection, {
        duration: 20,
        x: '50%',
        ease: 'linear',
      })
      tl.to(
        secondMovingSection,
        {
          duration: 20,
          x: '0%',
          ease: 'linear',
        },
        '<',
      )
      tl.to(firstMovingSection, {
        duration: 20,
        x: '0%',
        ease: 'linear',
      })
      tl.to(
        secondMovingSection,
        {
          duration: 20,
          x: '50%',
          ease: 'linear',
        },
        '<',
      )
    }
  }

  private setMovingSectionsGap() {
    const firstMovingSectionFirst =
      this.firstMovingSectionFirst()?.nativeElement

    if (firstMovingSectionFirst) {
      this.movingSectionsGap.set(
        Math.max(0, (innerWidth - firstMovingSectionFirst.clientWidth) / 2) /
          16,
      )
    }
  }
}
