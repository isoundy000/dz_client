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

class LoadingUI extends eui.Component {

    public lable_progress: eui.Label;
    public load_progress: eui.ProgressBar;
    public group_login: eui.Group;
    public group_normal: eui.Group;


    public btn_accountLogin: eui.Button;
    public btn_register: eui.Button;
    public btn_next: eui.Button;
    public btn_complete: eui.Button;
    public btn_login: eui.Button;

    public et_phone: eui.EditableText;
    public et_password: eui.EditableText;
    public et_sms: eui.EditableText;


    public btn_close: eui.Image;
    public btn_forget: eui.Image;

    public btnShow: egret.tween.TweenGroup;
    private currentX: number;
    public static CREATESENCE = "createSence";
    public constructor() {
        super();
        this.once(eui.UIEvent.COMPLETE, this.createView, this);
        this.skinName = "resource/custom_skins/LoadUISkin.exml";
    }

    private createView(): void {
        this.load_progress.once(eui.UIEvent.COMPLETE, () => {
            this.currentX = this.lable_progress.x;
            this.load_progress.maximum = 100;//设置进度条的最大值
            this.load_progress.minimum = 0;//设置进度条的最小值
            RES.loadGroup("preload");
        }, this);
        this.btn_accountLogin.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.skin.currentState = "login";
        }, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.skin.currentState = "closeGroup";
        }, this);
        this.btn_register.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.skin.currentState = "register";
        }, this);
        this.btn_next.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.skin.currentState == "register") {
                this.skin.currentState = "smscheck";
            } else if (this.skin.currentState == "resetPassword") {
                this.skin.currentState = "sms_reset";
            }
        }, this);
        this.btn_complete.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.skin.currentState = "login";
            this.et_sms.text="";
        }, this);
        this.btn_forget.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.skin.currentState = "resetPassword";
        }, this);

        this.btn_login.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let phone = this.et_phone.text;
            let password = this.et_password.text;
            if (phone == "" || password == "") {
                game.TextUtils.showTextTip("账户密码不能为空！！！");
                return;
            }
            let data = { uname: 'pisa', pwd: 'pisa' };
            HttpAPI.HttpGET("http://192.168.1.129/login", data, (event) => {
                console.log("登录成功");
                var request = <egret.HttpRequest>event.currentTarget;
                // let own: User = new User();
                // console.log("post data : ", JSON.parse(request.response).id);
                // own.uId = JSON.parse(request.response).id;
                // UserUtils.getInstance().saveOwnUser(own);
            }, (event) => {
                console.log("登录失败");
                var request = <egret.HttpRequest>event.currentTarget;
                console.log("post data : ", request.response);
            }, this);
            let own: User = new User();
            own.uId = phone;//JSON.parse(request.response).id;
            UserUtils.getInstance().saveOwnUser(own);
            this.dispatchEventWith(LoadingUI.CREATESENCE);
        }, this);

        this.load_progress.skinName = "resource/custom_skins/LoadProgressSkin.exml";
    }

    public setProgress(current: number, total: number): void {
        this.load_progress.value = Math.ceil(current / total * 100);
        this.lable_progress.text = this.load_progress.value + "%";
        this.lable_progress.x = this.currentX + Math.ceil(this.load_progress.width * (current / total));
    }
    public showEnterButton() {
        this.group_login.visible = true;
        this.btnShow.play(0);
        this.load_progress.visible = false;
        this.lable_progress.visible = false;
    }
}
