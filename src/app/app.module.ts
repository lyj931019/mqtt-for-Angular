import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {IndexComponent} from './pages/index.component';
import {AppComponent} from './app.component';

import {HttpModule} from '@angular/http';


import {MqttService} from './service/mqtt.service';


import { FormsModule } from '@angular/forms';
import {HttpService} from './service/http.service';

@NgModule({
  declarations: [
    AppComponent, IndexComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, HttpModule
  ],
  providers: [MqttService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
