import {Component, OnInit} from '@angular/core';
import {MqttService} from './service/mqtt.service';
import {HttpService} from './service/http.service';

declare let Paho: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private mqtt: MqttService, private http: HttpService) {
  }

  ngOnInit() {
    this.mqtt.client = new Paho.MQTT.Client("remote.thybot.com", Number(15675), "/ws", "kiosk1" + Math.floor(Math.random() * 100));
    console.log("connecting");
    let self = this;
    this.mqtt.client.connect({
      onSuccess: self.mqtt.onConnect.bind(self.mqtt),/* 注1 ： 利用 .bind() 将mqtt.onConnect 中的this重新指向 mqtt本身 */
      onFailure: self.mqtt.onFailure.bind(self.mqtt),/* 同上 */
      userName: "kiosk1",
      password: "kiosk"
    });
    this.mqtt.client.onMessageArrived = self.mqtt.onMessageArrived.bind(self.mqtt);
    this.mqtt.client.onConnectionLost = self.mqtt.onConnectionLost.bind(self.mqtt);
    this.mqtt.sendMessageInterval();
    this.mqtt.randomMessageInerval();

    this.http.getData('http://192.168.1.12/yii-wechat2/backend/web/api/device/device?device_id=1').then((res)=>{
        console.log(res);
        let warning = JSON.parse(res.data.setting_warning);
        this.mqtt.maxTemp = warning.t_max ? warning.t_max : this.mqtt.maxTemp;
        this.mqtt.minTemp = warning.t_min ? warning.t_min : this.mqtt.minTemp;
        this.mqtt.maxHumi = warning.h_max ? warning.h_max : this.mqtt.maxHumi;
        this.mqtt.minHumi = warning.h_min ? warning.h_min : this.mqtt.minHumi;
        let setting = JSON.parse(res.data.setting);
        this.mqtt.target_t = setting.t_set ? setting.t_set : ((parseFloat(this.mqtt.maxTemp) + parseFloat(this.mqtt.minTemp)) / 2).toFixed(1);
        this.mqtt.target_h = setting.h_set ? setting.h_set : ((parseFloat(this.mqtt.maxHumi) + parseFloat(this.mqtt.minHumi)) / 2).toFixed(1);

    });
  }



}
