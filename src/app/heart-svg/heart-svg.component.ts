import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-heart-svg',
  standalone: true,
  imports: [],
  templateUrl: './heart-svg.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeartSvgComponent {}
