import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  languages: Array<{ 'code': String, 'label': String }> =
  [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' }
  ];
  constructor( @Inject(LOCALE_ID) public localeId: string) { }

  ngOnInit() {
    console.log("Locale_ID=", this.localeId)
  }

}
