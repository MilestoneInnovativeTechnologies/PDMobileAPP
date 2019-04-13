import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(public menu: MenuController) {
        console.log('main');
    }

    toggleMenu() {
        this.menu.toggle('first');
    }
}
