import {Injectable} from '@angular/core';

declare let Paho: any;

@Injectable()
export class MqttService {
  /*
  * destinationName :  'kiosk/1/' + type
  * type : [ collect , change , warning ]
  * collect : 定时采集的数据
  * change :  逢变则报的数据 （开/关 门/灯）
  * warning : 报警的数据 ( 温度/湿度  过高/过低)
  *
  * change code : [ 000 , 100 , 101 , 200 , 201 ]
  * 000 : 随collect 一起发送，正常数据
  * 100 ： 关门
  * 101 ： 开门
  * 200 ： 关灯
  * 201 ： 开灯
  *
  * warning code ： [001 , 002 , 101 , 102]
  * 001 : 温度过高
  * 002 ： 温度过低
  * 101 ： 温度过高
  * 102 ： 温度过低
  * */

  //
  id_config = 'kiosk/1/';

  // 连接主体
  client: any = null;
  // 是否已经建立连接
  isOnConnect: any = false;
  // 温度
  temp: any = '2.0';
  // 湿度
  humi: any = '70.0';
  // 门是否开着
  doorIsOpen: any = 0;
  // 灯是否开着
  lightIsOpen: any = 0;

  // 温度的浮动范围
  floatTemp: any = 5.0;
  // 湿度的浮动范围
  floatHumi: any = 5.0;

  // 最大温度
  maxTemp: any = 20.0;
  // 最小温度
  minTemp: any = 2.0;
  // 最大湿度
  maxHumi: any = 80.0;
  // 最小湿度
  minHumi: any = 30.0;

  // 设定的温度
  target_t: any = 10.0;
  // 设定的湿度
  target_h: any = 50.0;

  // 每30分钟上传一次
  // 上传周期
  // timer: any = '1800000';
  timer: any = '600000'; // 10分钟
  // timer = '30000';/* 测试用 */

  // 收集采集的数据的格式
  data: any = {
    t: '0',
    h: '0',
    d: 0,
    l: 0
  };
  // 采集间隔 一分钟
  // dataPushTimer: any = '60000';
  dataPushTimer: any = '10000'; // 10 秒
  // dataPushTimer = '1000';/* 测试用 */

  // 收集采集的数据
  totalData: any = {};

  message: any = null;

  /*
  * 0 : 正常
  * 1 : 超高
  * 2 : 过低
  * */
  tempState = 0;
  humiState = 0;

  // types = ['collect', 'change', 'warning'];

  // 基础函数
  onFailure(message) {
    console.log('CONNECTION FAILURE - ' + message.errorMessage);
    this.isOnConnect = false;
  }

  // 这里this 需要重新绑定，请见app.componet.ts 注1
  onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log('onConnect');
    this.client.subscribe(this.id_config + 'notify');
    this.isOnConnect = true;
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
    console.log('connection lost');
    this.isOnConnect = false;
  }

  // 接收消息
  onMessageArrived(message) {
    console.log('收到消息:' + message.destinationName);
    console.log('onMessageArrived:' + message.payloadString);
    if (message.destinationName = this.id_config + 'notify') {
       let res = JSON.parse(message.payloadString);
       if (res.type == 'change_setting') {
         this.target_t = res.data.t_set ? res.data.t_set : this.target_t;
         this.target_h = res.data.h_set ? res.data.h_set : this.target_h;
       } else if (res.type == 'change_setting_warning') {
         this.maxTemp = res.data.t_max ? res.data.t_max : this.maxTemp;
         this.minTemp = res.data.t_min ? res.data.t_min : this.minTemp;
         this.maxHumi = res.data.h_max ? res.data.h_max : this.maxHumi;
         this.minHumi = res.data.h_min ? res.data.h_min : this.minHumi;
       }
    }
  }


  // 创建并发送消息
  createSendMessage(data, type) {
    console.log(JSON.stringify(data));
    this.message = new Paho.MQTT.Message(JSON.stringify(data));
    this.message.destinationName = this.id_config + type;
    this.message.qos = 1;
    console.log('send');
    this.client.send(this.message);
  }

  // 温度报警
  sendTempAlert() {
    if (this.isOnConnect) {
      if (parseFloat(this.temp) < this.minTemp) {
        let state = 2;
        if (this.tempState != state) {
          let code = '002'; // 温度过低
          this.sendChangeMessage(code, 'warning', '温度过低！当前温度为：' + this.temp + '℃');
          console.log('send temp test:' + this.temp + '℃');
          this.tempState = state;
        }
      } else if ( parseFloat(this.temp) > this.maxTemp) {
        let state = 1;
        if (this.tempState != state) {
          let code = '001'; // 温度过高
          this.sendChangeMessage(code, 'warning', '温度过高！当前温度为：' + this.temp + '℃');
          console.log('send temp test:' + this.temp + '℃');
          this.tempState = state
        }
      } else if ( parseFloat(this.temp) <= this.maxTemp && parseFloat(this.temp) >= this.minTemp ) {
        let state = 0;
        if (this.tempState != state) {
          let code = '000'; // 湿度正常
          this.sendChangeMessage(code, 'warning', '温度恢复正常！当前温度为：' + this.temp + '%');
          console.log('send humi test:' + this.humi + '%');
          this.tempState = state;
        }
      }
    }
  }

  // 湿度报警
  sendHumiAlert() {
    if (this.isOnConnect) {
      if (parseFloat(this.humi) < this.minHumi ) {
        let state = 2;
        if (this.humiState != state) {
          let code = '102'; // 湿度过低
          this.sendChangeMessage(code, 'warning', '湿度过低！当前湿度为：' + this.humi + '%');
          console.log('send humi test:' + this.humi + '%');
          this.humiState = state;
        }
      } else if (parseFloat(this.humi) > this.maxHumi) {
        let state = 1;
        if (this.humiState != state) {
          let code = '101'; // 湿度过高
          this.sendChangeMessage(code, 'warning', '湿度过高！当前湿度为：' + this.humi + '%');
          console.log('send humi test:' + this.humi + '%');
          this.humiState = state;
        }
      } else if ( parseFloat(this.humi) <= this.maxHumi && parseFloat(this.humi) >= this.minHumi ) {
        let state = 0;
        if (this.humiState != state) {
          let code = '100'; // 湿度正常
          this.sendChangeMessage(code, 'warning', '湿度恢复正常！当前湿度为：' + this.humi + '%');
          console.log('send humi test:' + this.humi + '%');
          this.humiState = state;
        }
      }
    }
  }

  // 决定门和灯应该发什么code的函数
  decideChangeCode(isDoor = true ) {
    if (isDoor) {
      if (this.doorIsOpen == 0) {
        this.doorIsOpen = 1; // 开门
        this.sendChangeMessage('101', 'change');
      } else {
        this.doorIsOpen = 0; // 关门
        this.sendChangeMessage('100', 'change');
      }
    } else {
      if ( this.lightIsOpen == 0 ) {
        this.lightIsOpen = 1; // 开灯
        this.sendChangeMessage('201', 'change');
      } else {
        this.lightIsOpen = 0; // 关灯
        this.sendChangeMessage('200', 'change');
      }
    }
  }


  // 定时上传的任务
  sendMessageInterval() {
    console.log('上传数据');
    console.log(this.totalData);
    let self = this;
    if (self.isOnConnect) {

      console.log(JSON.stringify(this.totalData));
      self.createSendMessage(this.totalData, 'collect');
      self.sendChangeMessage('000', 'change');
     /* let message = new Paho.MQTT.Message(JSON.stringify(this.totalData));
      message.destinationName = "kiosk/asd";
      message.qos = 1;
      self.client.send(message);*/
      self.totalData = {};
      console.log('send message interval test : ');
    }
    setTimeout(self.sendMessageInterval.bind(self), parseInt(self.timer));
  }

  // 逢变则报
  sendChangeMessage(code, type , message = '') {
    if (this.isOnConnect) {
      /*
      * 发送信息的主体
      * 1.获取数据
      * 2.send
      * */
      this.data.d = this.doorIsOpen;
      this.data.h = this.humi;
      this.data.l = this.lightIsOpen;
      this.data.t = this.temp;

      let sendMessage = {
        data: JSON.parse(JSON.stringify(this.data)),
        timestamp: Math.floor((new Date().getTime()) / 1000) + '',
        code: code
      };
      if (type == 'warning') {
        sendMessage['message'] = message;
      }
      console.log(JSON.stringify(sendMessage));
      this.createSendMessage(sendMessage, type);
      /*let message = new Paho.MQTT.Message(JSON.stringify(sendMessage));
      message.destinationName = "kiosk";
      message.qos = 1;
      this.client.send(message);*/
      console.log('send change message:' , this.data);
    }
  }

  // 报警信息
  sendAlertMessage() {
    if (this.isOnConnect) {
      /*
      * 发送信息的主体
      * 1.获取数据
      * 2.send
      * */
      console.log('send alert message:' + this.lightIsOpen);
    }
  }

  // 定时采集任务
  randomMessageInerval() {
    console.log('采集数据');
    let self = this;
    self.temp = (parseFloat(self.target_t) + Math.floor(Math.random() * (self.floatTemp * 2 + 1) - self.floatTemp) ).toFixed(1);
    self.sendTempAlert();
    self.humi = (parseFloat(self.target_h) + Math.floor(Math.random() * (self.floatHumi * 2 + 1) - self.floatHumi) ).toFixed(1);
    self.sendHumiAlert();
    // if (Math.random() > 0.9) {
    //   // self.doorIsOpen = self.doorIsOpen == 0 ? 1 : 0;
    //   self.decideChangeCode();
    // }
    // if (Math.random() > 0.9) {
    //   // self.lightIsOpen = self.lightIsOpen == 0 ? 1 : 0;
    //  self.decideChangeCode(false);
    // }
    self.data.d = self.doorIsOpen;
    self.data.h = self.humi;
    self.data.l = self.lightIsOpen;
    self.data.t = self.temp;
    self.totalData[ Math.floor((new Date().getTime()) / 1000) + ''] = JSON.parse(JSON.stringify(self.data));
    // Math.random() > 0.99 && this.doorIsOpen = !this.doorIsOpen;
    console.log('data:' , self.data);
    console.log('totalData:', self.totalData);
    setTimeout(self.randomMessageInerval.bind(self), parseInt(self.dataPushTimer));
  }

  sendTest(name, id, type) {
    let self = this;
    if (self.isOnConnect) {
      console.log(JSON.stringify(this.totalData));
      this.message = new Paho.MQTT.Message(JSON.stringify(this.totalData));
      this.message.destinationName = name + id + type;
      this.message.qos = 1;
      console.log('send test');
      this.client.send(this.message);
    }
  }
}
