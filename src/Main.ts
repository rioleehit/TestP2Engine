//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    // private createGameScene():void {
    //     let sky:egret.Bitmap = this.createBitmapByName("bg_jpg");
    //     //this.addChild(sky);
    //     let stageW:number = this.stage.stageWidth;
    //     let stageH:number = this.stage.stageHeight;
    //     sky.width = stageW;
    //     sky.height = stageH;

    //     let topMask = new egret.Shape();
    //     topMask.graphics.beginFill(0x000000, 0.5);
    //     topMask.graphics.drawRect(0, 0, stageW, 172);
    //     topMask.graphics.endFill();
    //     topMask.y = 33;
    //     //this.addChild(topMask);

    //     let icon:egret.Bitmap = this.createBitmapByName("egret_icon_png");
    //     //this.addChild(icon);
    //     icon.x = 26;
    //     icon.y = 33;

    //     let line = new egret.Shape();
    //     line.graphics.lineStyle(2,0xffffff);
    //     line.graphics.moveTo(0,0);
    //     line.graphics.lineTo(0,117);
    //     line.graphics.endFill();
    //     line.x = 172;
    //     line.y = 61;
    //     //this.addChild(line);


    //     let colorLabel = new egret.TextField();
    //     colorLabel.textColor = 0xffffff;
    //     colorLabel.width = stageW - 172;
    //     colorLabel.textAlign = "center";
    //     colorLabel.text = "Hello Egret";
    //     colorLabel.size = 24;
    //     colorLabel.x = 172;
    //     colorLabel.y = 80;
    //     //this.addChild(colorLabel);

    //     let textfield = new egret.TextField();
    //     //this.addChild(textfield);
    //     textfield.alpha = 0;
    //     textfield.width = stageW - 172;
    //     textfield.textAlign = egret.HorizontalAlign.CENTER;
    //     textfield.size = 24;
    //     textfield.textColor = 0xffffff;
    //     textfield.x = 172;
    //     textfield.y = 135;
    //     this.textfield = textfield;

    //     //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
    //     // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
    //     //RES.getResAsync("description_json", this.startAnimation, this)
    // }
    //debug模式，使用图形绘制
    private isDebug: boolean = true;
    /**
     * 创建游戏场景
     */
    private createGameScene(): void {
        //egret.Profiler.getInstance().run();
        var factor: number = 50;

        //创建world
        var world: p2.World = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;

        //创建plane
        var planeShape: p2.Plane = new p2.Plane();
        var planeBody: p2.Body = new p2.Body();
        planeBody.addShape(planeShape);
        planeBody.displays = [];
        world.addBody(planeBody);

        egret.Ticker.getInstance().register(function(dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            world.step(dt / 1000);

            var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
            var l = world.bodies.length;
            for (var i: number = 0; i < l; i++) {
                var boxBody: p2.Body = world.bodies[i];
                var box: egret.DisplayObject = boxBody.displays[0];
                if (box) {
                    box.x = boxBody.position[0] * factor;
                    box.y = stageHeight - boxBody.position[1] * factor;
                    box.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
                    if (boxBody.sleepState == p2.Body.SLEEPING) {
                        box.alpha = 0.5;
                    }
                    else {
                        box.alpha = 1;
                    }
                }
            }
        }, this);

        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, addOneBox, this);
        var self = this;

        function addOneBox(e: egret.TouchEvent): void {
            var positionX: number = Math.floor(e.stageX / factor);
            var positionY: number = Math.floor((egret.MainContext.instance.stage.stageHeight - e.stageY) / factor);
            var display: egret.DisplayObject;
            if (Math.random() > 0.5) {
                //添加方形刚体
                //var boxShape: p2.Shape = new p2.Rectangle(2, 1);
                var boxShape: p2.Shape = new p2.Box({width: 2, height: 1});
                var boxBody: p2.Body = new p2.Body({ mass: 1, position: [positionX, positionY], angularVelocity: 1 });
                boxBody.addShape(boxShape);
                world.addBody(boxBody);

                if(self.isDebug){
                    display = self.createBox((<p2.Box>boxShape).width * factor,(<p2.Box>boxShape).height * factor);
                }else{
                    display = self.createBitmapByName("rect");
                }
                display.width = (<p2.Box>boxShape).width * factor;
                display.height = (<p2.Box>boxShape).height * factor;
            }
            else {
                //添加圆形刚体
                //var boxShape: p2.Shape = new p2.Circle(1);
                var boxShape: p2.Shape = new p2.Circle({ radius: 1 });
                var boxBody: p2.Body = new p2.Body({ mass: 1, position: [positionX, positionY] });
                boxBody.addShape(boxShape);
                world.addBody(boxBody);

                if (self.isDebug) {
                    display = self.createBall((<p2.Circle>boxShape).radius*factor);
                } else {
                    display = self.createBitmapByName("circle");
                }

                display.width = (<p2.Circle>boxShape).radius * 2 * factor;
                display.height = (<p2.Circle>boxShape).radius * 2 * factor;
            }

            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;

            boxBody.displays = [display];
            self.addChild(display);
        }
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    // private createBitmapByName(name: string): egret.Bitmap {
    //     var result: egret.Bitmap = new egret.Bitmap();
    //     var texture: egret.Texture = RES.getRes(name);
    //     result.texture = texture;
    //     return result;
    // }
    /**
     * 创建一个圆形
     */
    private createBall(r: number): egret.Shape {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xfff000);
        shape.graphics.drawCircle(r, r, r);
        shape.graphics.endFill();
        return shape;
    }
    /**
     * 创建一个方形
     */
    private createBox(width:number,height:number): egret.Shape {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xfff000);
        shape.graphics.drawRect(0,0,width,height);
        shape.graphics.endFill();
        return shape;
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        let result = new egret.Bitmap();
        let texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        let self:any = this;

        let parser = new egret.HtmlTextParser();
        let textflowArr:Array<Array<egret.ITextElement>> = [];
        for (let i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        let textfield = self.textfield;
        let count = -1;
        let change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);

            let tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 200);
            tw.wait(2000);
            tw.to({"alpha": 0}, 200);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}


