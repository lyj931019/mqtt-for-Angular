import {Component, OnInit} from '@angular/core';
import {MqttService} from '../../service/mqtt.service';

// import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';


@Component({
  selector: 'tb-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  testStr = '';

  name = 'kiosk/';
  type = 'change';
  kioskId = '1/';
  constructor(private mqtt: MqttService) {
  }

  ngOnInit() {

  }

  changeDoor() {
    // this.mqtt.decideChangeCode();
  }

  changeLight() {
    // this.mqtt.decideChangeCode(false);
  }

  uploadTemp() {
    // this.mqtt.sendTempAlert();
  }

  uploadHumi() {
    // this.mqtt.sendHumiAlert();
  }

  handleClick() {
    // this.mqtt.sendTest(this.name, this.kioskId, this.type);
  }

}
