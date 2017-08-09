import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';

import { MyProfileDataInterface } from '../../interfaces/users';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private dataService:DataService) { }

  ngOnInit() {
    //console.log("Inside logout");
    sessionStorage.setItem("userToken", "")
    this.dataService.clearMyProfile();
    this.router.navigate(['login'])
  }

}
