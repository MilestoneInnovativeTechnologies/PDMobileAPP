import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {IonicStorageModule} from '@ionic/storage';
import {IonicSelectableModule} from 'ionic-selectable';

import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {DataProviderService} from './data-provider.service';
// ionic cordova run android --prod --device -l -c -s

import {HTTP} from '@ionic-native/http/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), IonicSelectableModule
        , ReactiveFormsModule],
    providers: [HTTP,
        StatusBar,
        SplashScreen,
        [DataProviderService],
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
