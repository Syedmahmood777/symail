import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class Carousel implements OnInit, OnDestroy {
  @ViewChild('carouselTrack', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

cards = [
  {
    icon: 'assets/icon/angular.svg',
    name: 'Angular',
    description: 'A platform for building scalable single-page client applications using TypeScript and a component-based architecture. It provides a robust CLI, dependency injection, and modular development. Widely adopted for enterprise-grade web apps with strong maintainability and performance.',
    features: ['Component-Based', 'Reactive Forms', 'RxJS', 'TypeScript']
  },
  {
    icon: 'assets/icon/nodejs.svg',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 engine, enabling server-side development with non-blocking, event-driven architecture. It is optimized for scalability, real-time applications, and microservices. Backed by a huge open-source ecosystem via NPM.',
    features: ['Event-Driven', 'Non-Blocking I/O', 'NPM Ecosystem', 'Cross-Platform']
  }
];



  currentIndex = 0;
  autoPlayInterval: any = null;
  isAutoPlaying = false;

  private startX = 0;
  private isDragging = false;
  private isBrowser = false;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (!this.isBrowser) return;

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      this.setupEventListeners();
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private setupEventListeners(): void {
    if (!this.trackRef?.nativeElement) {
      console.error('Track element not found');
      return;
    }

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
    this.cdr.markForCheck();
  }

  nextSlide(): void {
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.totalCards;
    this.cdr.markForCheck();
  }

  prevSlide(): void {
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    this.cdr.markForCheck();
  }

  startAutoPlay(): void {
    
    if (this.autoPlayInterval) {
      this.stopAutoPlay();
    }

    if (!this.isBrowser) {
      return;
    }

    // Test if nextSlide works manually first
    setTimeout(() => {
      this.nextSlide();
    }, 100);

    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
    
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
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }


 
}