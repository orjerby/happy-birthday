import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChildren,
} from '@angular/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [],
  templateUrl: './letter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterComponent {
  paragraphs = viewChildren<ElementRef<HTMLDivElement>>('paragraph')

  animate() {
    this.setGsap()
  }

  private setGsap() {
    gsap.registerPlugin(ScrollTrigger)

    this.paragraphs().forEach((paragraph, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: paragraph.nativeElement,
          start: `center bottom`,
          end: 'bottom center',
          pin: true,
          pinSpacing: false,
          scrub: true,
          markers: false, // debug
        },
      })

      gsap.set(paragraph.nativeElement, {
        opacity: 0,
      })

      tl.to(paragraph.nativeElement, {
        duration: 1,
        translateY: '-45%',
        opacity: 1,
        ease: 'linear',
      })
      tl.to(paragraph.nativeElement, {
        duration: 1,
        translateY: '-55%',
        ease: 'linear',
      })
      tl.to(paragraph.nativeElement, {
        duration: 1,
        translateY: '-100%',
        opacity: 0,
        ease: 'linear',
      })
    })
  }
}
