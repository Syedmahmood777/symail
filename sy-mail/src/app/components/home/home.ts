import { Component, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bgshapes } from '../bgshapes/bgshapes';
import { Carousel } from '../carousel/carousel';
import { isPlatformBrowser } from '@angular/common';
import { ViewChildren, QueryList } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Bgshapes, Carousel, RouterLink, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})

export class Home implements AfterViewInit {
  constructor(private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {}
  @ViewChildren('workflowBox') boxes!: QueryList<ElementRef>;
  @ViewChildren('container') containers!: QueryList<ElementRef>;
 
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof IntersectionObserver === 'undefined') return;
    
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
            const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {            
            (entry.target as HTMLElement).classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px' // Trigger animation earlier
      });
      
      this.boxes.forEach(box => {
        
        observer.observe(box.nativeElement);
      });
      this.containers.forEach(box => {
        
        observer.observe(box.nativeElement);
      });



    }, 100);
  }
}