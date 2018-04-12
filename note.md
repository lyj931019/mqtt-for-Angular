
# this指向问题
var _this = this;


# HTML img.src图片不存在（找不到），则显示另一张图片
<img src="/images/0001.jpg" onerror="this.src='/images/nopicture.gif'"/>  

# angular service
购物车，可以用服务来保存，加入购物车的商品

vertical-align:适用范围，父元素有line-height,当前元素为display:inline-block;



# 解决 数组 或 对象的 复制问题:
var obj = JSON.parse(JSON.stringify(Array)) 



# 数组求最大值（最小值）：

## 1.es6拓展运算符...
Math.max(...arr)

## 2.es5 apply(与方法1原理相同)
Math.max.apply(null,arr)


# angular 强制检查
（手动检查代替脏检查）
ChangeDetectorRef
private cdr: ChangeDetectorRef
fn_this.cdr.detectChanges();





# Rem & Em

## Em:

EM 是字体排印的一个单位，等同于当前指定的point-size。-维基百科著作权归作者所有。

意思就是，如果存在一个选择器的font-size属性的值为 20px,那么1em=20px著作权归作者所有。


## Rem:

rem指根em。它的产生是为了帮助人们解决em所带来的计算问题。

它是字体排版的一个单位，等同于根font-size。这意味着1rem等同于<html>中的font-size。

## 简单的规则：

如果这个属性根据它的font-size进行测量，则使用em
其他的一切事物均使用rem.


通过标题元素，我们了解到，是否使用em进行大小声明，只需判断该属性是否与页面其他元素进行交互。这里有两种不同的方式来思考如何构建此组件：

所有内联元素缩放都根据组件的font-size决定。
部分内联元素缩放根据组件的font-size决定。


著作权归作者所有。
商业转载请联系作者获得授权,非商业转载请注明出处。
原文: https://www.w3cplus.com/css/rem-vs-em.html © w3cplus.com


# Button
Button 按钮的点击时候出现蓝色边框的问题
添加css属性，这样在点击安按钮的时候就不会有蓝色边框了。
button{	outline:none;}



# Angular http:get/post 
## 待更新（angular似乎已经不再推荐使用此方法）
## service
```
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ControlService {

  constructor( private http: Http) { }

  postData(url, value) { // post方法
    return this.http.post(url, value).toPromise()
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.json());
        });
      })
      .catch(this.handleError);
  }

  getData(url) {  // get方法
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.json());
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> { // 出错时执行
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}

```
## 调用
```

xxx.getData(url).then(data => {
	this.day = data.data;
	console.log(this.day);
});


xxx.postData(url, data).then(data => {
	this.data = data.data
	console.log('success!');
});
```

## post 的数据主体 : data

```
let data = new URLSearchParams();
data.append(key, value); //key为键，value为值
```


# Angular 代码压缩
## ng build --prod
ng build 默认不压缩代码，添加 --prod 指令则会压缩代码


## ng build --env=prod --prod
按生产环境压缩，生产环境的配置文件（environment）名为prod 

# Angular2 解析富文本
直接导入DomSanitizer
```
import {DomSanitizer} from "@angular/platform-browser";
```
声明一个变量接收html内容
```
 TrustHtml: any; // 类型为‘SafeHtml’
```
在适当地方调用该方法 
```
 this.TrustHtml = this.dz.bypassSecurityTrustHtml(html); // html：即html内容，类型：string
```
在html处渲染
```
 <div [innerHtml]="TrustHtml"></div> 
```
[innerHtml]可以直接渲染html标签，默认不渲染属性