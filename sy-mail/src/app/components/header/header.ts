import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
