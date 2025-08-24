import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,MatListModule,MatIconModule,MatToolbarModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
