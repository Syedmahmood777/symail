import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterModule,MatListModule,MatIconModule,MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
