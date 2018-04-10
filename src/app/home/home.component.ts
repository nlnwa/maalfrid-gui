import {Component} from '@angular/core';
import {RoleService} from '../auth/role.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private roleService: RoleService) {
  }


  get isLoggedIn(): boolean {
    return this.roleService.isCurator() || this.roleService.isAdmin() || this.roleService.isReadonly();
  }
}
