import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class Carousel implements OnInit {
  @ViewChild('carouselTrack', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  cards = [
    {
      icon: 'assets/icon/angular.svg',
      name: 'Angular',
      description:
        'A powerful JavaScript library for building user interfaces with component-based architecture and virtual DOM for optimal performance.',
      features: ['Virtual DOM', 'Component-Based', 'JSX', 'Hooks']
    },
    {
      icon: '🟢',
      name: 'Node.js',
      description:
        "JavaScript runtime built on Chrome's V8 engine, enabling server-side development with non-blocking, event-driven architecture.",
      features: ['Event-Driven', 'Non-Blocking I/O', 'NPM Ecosystem', 'Cross-Platform']
    }
  ];

  currentIndex = 0;
  autoPlayInterval: any = null;
  isAutoPlaying = false;

  private startX = 0;
  private isDragging = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return; // ✅ prevents SSR crash

    const track = this.trackRef.nativeElement;

    // Touch support
    track.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].clientX;
      this.isDragging = true;
      this.stopAutoPlay();
    });

    track.addEventListener('touchend', (e: TouchEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diffX = this.startX - endX;

      if (Math.abs(diffX) > 50) {
        diffX > 0 ? this.nextSlide() : this.prevSlide();
      }
    });

    // Mouse support
    track.addEventListener('mousedown', (e: MouseEvent) => {
      this.startX = e.clientX;
      this.isDragging = true;
      this.stopAutoPlay();
      e.preventDefault();
    });

    // ✅ Use window instead of document for browser-only event listeners
    window.addEventListener('mouseup', (e: MouseEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const diffX = this.startX - e.clientX;

      if (Math.abs(diffX) > 50) {
        diffX > 0 ? this.nextSlide() : this.prevSlide();
      }
    });
  }

  get totalCards(): number {
    return this.cards.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.totalCards;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
  }

  startAutoPlay(): void {
    if (this.autoPlayInterval) return;
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 3000);
    this.isAutoPlaying = true;
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    this.isAutoPlaying = false;
  }

  toggleAutoPlay(): void {
    this.isAutoPlaying ? this.stopAutoPlay() : this.startAutoPlay();
  }
}




