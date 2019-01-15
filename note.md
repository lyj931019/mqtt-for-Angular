
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



# Angular http:get/post  (HttpClient)
## 官方文档使用此方法
## app.module.ts 
```
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // *

@NgModule({
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```
此方法似乎不需要封装在**service**里，
直接在要使用的地方**引用**: 
```
import { HttpClient } from '@angular/common/http'
```
声明：
```
constructor(private httpClient:HttpClient){}
```
## get 
### 直接使用
```
this.httpClient.get(url).subscribe( (res)=>{
	// 就收到数据之后的回调
	// 可执行赋值操作等，保存接收的数据
} )

```
这个例子太简单，所以它也可以在组件本身的代码中调用 Http.get()，而不用借助服务。
不过，数据访问很少能一直这么简单。 你通常要对数据做后处理、添加错误处理器，还可能加一些重试逻辑，以便应对网络抽风的情况。
该组件很快就会因为这些数据方式的细节而变得杂乱不堪。 组件变得难以理解、难以测试，并且这些数据访问逻辑无法被复用，也无法标准化。
这就是为什么最佳实践中要求把数据展现逻辑从数据访问逻辑中拆分出去，也就是说把数据访问逻辑包装进一个单独的服务中， 并且在组件中把数据访问逻辑委托给这个服务。就算是这么简单的应用也要如此。

### 简单的写进服务里（未加数据访问逻辑）
**Service**
```
getData(url){
  return this.httpClient.get(url);
}

```
**Component**
```
this.xxService.getData(url).subscribe( (res)=>{
	// 就收到数据之后的回调
	// 可执行赋值操作等，保存接收的数据
} )
```
### 数据访问逻辑（待更新）

## Post

### 直接使用 （未测试）
```
this.httpClient.post(url, data, httpOptions).subscribe( (res)=>{
	// 就收到数据之后的回调
	// 可执行赋值操作等，保存接收的数据
}) // catchError未写

```
它还接受另外两个参数：

1. data - 要 POST 的请求体数据。
2. httpOptions - 这个例子中，该方法的选项指定了所需的请求头。

**添加请求头:**
```
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

```
**<font style='color:#de3d3e;'> 注意：</font> *data*格式未知** 

# 设置查询参数
## 创建 HttpParams 对象
```
import {HttpParams} from "@angular/common/http";
 
const params = new HttpParams()
    .set('orderBy', '"$key"')
    .set('limitToFirst', "1");
 
this.courses$ = this.http
    .get("/courses.json", {params})
    .do(console.log)
    .map(data => _.values(data))
```

需要注意的是，我们通过链式语法调用 set() 方法，构建 HttpParams 对象。这是因为 HttpParams 对象是不可变的，通过 set()方法可以防止该对象被修改。

每当调用 set() 方法，将会返回包含新值的 HttpParams 对象，因此如果使用下面的方式，将不能正确的设置参数。
```
const params = new HttpParams();
 
params.set('orderBy', '"$key"')
params.set('limitToFirst', "1");
// params.toString() == ''
```




# 配置路由，添加#号
```
//...
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy} // ***
  ],
  bootstrap: [AppComponent]
})
```
