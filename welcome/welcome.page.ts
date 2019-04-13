import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

    constructor(public routes: Router) {
    }

    ngOnInit() {
    }



    async login( ) {
        console.log('kikk');
        this.routes.navigateByUrl('login');
    }
}
