import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  animations: [
    trigger('boxAnimation', [
  transition(':enter', [
    query(
      '.workflow-box',
      [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        stagger(400, [
          animate(
            '1700ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          )
        ])
      ],
      { optional: true } // <<< critical, prevents null crash
    )
  ])
])

  ]
})
export class Home {}
