import { Component } from '@angular/core';
import 'zone.js';
import { MatSidenav,MatSidenavContainer,MatSidenavContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-main',
  imports: [MatSidenav,MatSidenavContainer,MatSidenavContent,RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

}
