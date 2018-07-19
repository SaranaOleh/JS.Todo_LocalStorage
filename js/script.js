"use strict";
function User(login,pass) {
    this.login = login;
    this.pass = pass;
}
function Ads(title,desc,author,time,id) {
    this.title = title;
    this.desc = desc;
    this.author = author;
    this.time = time;
    this.id = id;
}
var Girafe = {

    init: function (container) {
        this.authUser = null;
        window.localStorage.getItem("users") ?
            window.localStorage.getItem("users") :
            window.localStorage.setItem("users",JSON.stringify([]));
        window.localStorage.getItem("ads") ?
            window.localStorage.getItem("ads") :
            window.localStorage.setItem("ads",JSON.stringify([]));
        this.container = container;
        this.storage = window.localStorage;
        this.moduleStart.init(false,1);
    },
    moduleAuth: {
        init: function (login,pass) {
            this.super = Girafe;
            this.verification(login,pass);
        },
        verification: function (login,pass) {
            if(login === "" || pass === "") return;
            var users = JSON.parse(this.super.storage.getItem("users"))?
                        JSON.parse(this.super.storage.getItem("users")):
                        [];
            function userExists() {
                for(var i=0;i<users.length;i++){
                    if(users[i].login === login) return users[i];
                }
            }
            if(userExists()){
                if(userExists().pass === pass){
                    this.authorization(userExists());
                }
            }else{
                this.register(login,pass);
            }
        },
        register: function (login,pass) {
            var users = JSON.parse(this.super.storage.getItem("users"))?
                JSON.parse(this.super.storage.getItem("users")):
                [];
            var user = new User(login,pass);
            users.push(user);
            this.super.storage.setItem("users",JSON.stringify(users));
            this.authorization(user);
        },
        authorization: function (user) {
            this.super.authUser = user;
            this.super.moduleStart.init(true,1);
        },
        logout: function () {
            this.super.authUser = null;
            this.super.moduleStart.init(false,1);
        }
    },
    moduleStart: {
        init: function (auth,page) {
            this.super = Girafe;
            this.drawPage(auth,page);
            this.formAuth = this.super.container.forms.auth;
            this.content = this.super.container.querySelector(".content");
            this.events();
        },
        drawPage: function (auth,page) {
            var fragment = document.createDocumentFragment();
            function formAuth(auth) {
                if(auth === false){
                    var header = document.createElement("HEADER");
                    var mainHref = document.createElement("A");
                    var form = document.createElement("FORM");
                    var login = document.createElement("input");
                    var pass = document.createElement("input");
                    var submit = document.createElement("input");
                    var create = document.createElement("A");
                    mainHref.setAttribute("href","false");
                    mainHref.innerText = "To Main";
                    mainHref.setAttribute("class","mainHref");
                    create.setAttribute("href","#");
                    create.innerText = "Create Ad";
                    create.setAttribute("class","createad");
                    form.setAttribute("name","auth");
                    login.setAttribute("type","text");
                    login.setAttribute("placeholder","login");
                    login.setAttribute("name","login");
                    pass.setAttribute("type","password");
                    pass.setAttribute("placeholder","password");
                    pass.setAttribute("name","password");
                    submit.setAttribute("type","submit");
                    submit.setAttribute("value","OK");
                    form.appendChild(login);
                    form.appendChild(pass);
                    form.appendChild(submit);
                    form.appendChild(create);
                    header.appendChild(mainHref);
                    header.appendChild(form);
                    return header;
                }else{
                    var headerAuth = document.createElement("HEADER");
                    var mainHrefAuth = document.createElement("A");
                    var test = document.createElement("DIV");
                    var name = document.createElement("P");
                    var logout = document.createElement("A");
                    var createAuth = document.createElement("A");
                    mainHrefAuth.setAttribute("href","true");
                    mainHrefAuth.innerText = "To Main";
                    mainHrefAuth.setAttribute("class","mainHref");
                    createAuth.setAttribute("href","#");
                    createAuth.innerText = "Create Ad";
                    createAuth.setAttribute("class","createAdAuth");
                    name.innerText = "Hello " + Girafe.authUser.login;
                    logout.setAttribute("href","#");
                    logout.innerText = "Logout";
                    test.setAttribute("class","authCont");
                    test.appendChild(name);
                    test.appendChild(logout);
                    test.appendChild(createAuth);
                    headerAuth.appendChild(mainHrefAuth);
                    headerAuth.appendChild(test);
                    return headerAuth;
                }

            }
            function adList(ad) {
                var fragment = document.createDocumentFragment();
                var main = document.createElement("DIV");
                var title = document.createElement("P");
                var desc = document.createElement("P");
                var author = document.createElement("P");
                var time = document.createElement("P");
                main.setAttribute("class","ad");
                title.innerText = ad.title;
                title.setAttribute("class","titleHref");
                title.dataset.id = ad.id;
                desc.innerText = ad.desc;
                author.innerText = ad.author;
                time.innerText = ad.time;
                main.appendChild(title);
                main.appendChild(desc);
                main.appendChild(author);
                main.appendChild(time);
                if(Girafe.authUser !== null){
                    if(ad.author === Girafe.authUser.login){
                        var del = document.createElement("A");
                        del.setAttribute("href",ad.id);
                        del.setAttribute("class","del");
                        del.innerText = "DELETE";
                        var edit = document.createElement("A");
                        edit.setAttribute("href",ad.id);
                        edit.setAttribute("class","edit");
                        edit.innerText = "EDIT";
                        main.appendChild(del);
                        main.appendChild(edit);
                    }
                }
                fragment.append(main);
                return fragment;
            }
            function pagination(page) {
                var fragment = document.createDocumentFragment();
                var ul = document.createElement("ul");
                ul.setAttribute("class","paginator");
                if(page > 1) page = 0;
                for(var i = page;i<Math.ceil(ads.length)/5;i++){
                    var li = document.createElement("LI");
                    var a = document.createElement("A");
                    a.setAttribute("href",""+(i+1));
                    a.innerText = "" + (i+1);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
                fragment.append(ul);
                return fragment;
            }
            var main = document.createElement("MAIN");
            var ads = JSON.parse(Girafe.storage.getItem("ads"));
            for(var i = page*5-5;i<page*5;i++){
                if(ads[i] === undefined) continue;
                main.appendChild(adList(ads[i]))
            }
            fragment.append(formAuth(auth));
            fragment.append(main);
            fragment.append(pagination(page));
            document.body.innerHTML = "";
            document.body.appendChild(fragment);
        }.bind(this),
        events: function () {
            this.super.container.querySelectorAll(".titleHref").forEach(function (elem) {
                elem.addEventListener("click",function (e) {
                    function getAd(cur) {
                        var ads = JSON.parse(Girafe.storage.getItem("ads"));
                        var ad = null;
                        for(var i = 0; i<ads.length;i++){
                            if(ads[i].id === +cur){
                               ad = ads[i];
                            }
                        }
                        return ad;
                    }
                    Girafe.moduleViewAd.init(getAd(e.target.getAttribute("data-id")));
                }.bind(this))
            });
            this.super.container.querySelectorAll(".paginator").forEach(function (e) {
                e.addEventListener("click",function (e) {
                    e.preventDefault();
                    if(Girafe.authUser === null){
                        Girafe.moduleStart.init(false,parseInt(e.target.getAttribute("href")));
                    }else{
                        Girafe.moduleStart.init(true,parseInt(e.target.getAttribute("href")));
                    }
                }.bind(this))
            });
            this.super.container.querySelector(".mainHref").addEventListener("click",function (e) {
                e.preventDefault();
                var flag = e.target.getAttribute("href");
                if(flag === "true"){
                    flag = true;
                }else{
                    flag = false;
                }
                this.super.moduleStart.init(flag,1);
            }.bind(this));
            if(this.super.authUser === null){

                this.formAuth.addEventListener("submit",function (e) {
                    e.preventDefault();
                    this.super.moduleAuth.init(this.formAuth.elements.login.value,this.formAuth.elements.password.value);
                }.bind(this));
                this.formAuth.addEventListener("click",function (e) {
                    if(e.target.matches(".createad")){
                        var span = document.createElement("SPAN");
                        span.innerText = " to create ad you ned authorizate";
                        span.setAttribute("class","createSpan");
                        e.target.parentNode.appendChild(span);
                    }
                });
            }
            else{
                this.super.container.querySelector("div>a").addEventListener("click",function (e) {
                    e.preventDefault();
                    this.super.moduleAuth.logout();
                }.bind(this));
                this.super.container.querySelector(".createAdAuth").addEventListener("click",function (e) {
                    this.super.moduleCreateEdit.init(null);
                }.bind(this));
                this.super.container.querySelector("main").addEventListener("click",function (e) {
                    if(e.target.matches(".del")){
                        e.preventDefault();
                        var ads = JSON.parse(this.super.storage.getItem("ads"));
                        function getAd(cur) {
                            var ads = JSON.parse(Girafe.storage.getItem("ads"));
                            var indx = 0;
                            for(var i = 0; i<ads.length;i++){
                                if(ads[i].id === +cur){
                                    indx = i;
                                }
                            }
                            return indx;
                        }
                        ads.splice(getAd(e.target.getAttribute("href")),1);
                        this.super.storage.setItem("ads",JSON.stringify(ads));
                        this.super.moduleStart.init(true,1);
                    }
                    if(e.target.matches(".edit")){
                        e.preventDefault();
                        function getAd(cur) {
                            var ads = JSON.parse(Girafe.storage.getItem("ads"));
                            var indx = 0;
                            for(var i = 0; i<ads.length;i++){
                                if(ads[i].id === +cur){
                                    indx = i;
                                }
                            }
                            return indx;
                        }
                        this.super.moduleCreateEdit.init(
                            JSON.parse(this.super.storage.getItem("ads"))[getAd(e.target.getAttribute("href"))]);
                    }
                }.bind(this))
            }


        }
    },
    moduleCreateEdit: {
        init: function (ad) {
            this.ad = ad;
            this.super = Girafe;
            this.drawPage(ad);
            this.events();
        },
        drawPage: function (ad) {
            var fragment = document.createDocumentFragment();
            var main = document.createElement("MAIN");
            var form = document.createElement("FORM");
            var title = document.createElement("INPUT");
            var disc = document.createElement("TEXTAREA");
            var submit = document.createElement("INPUT");
            form.setAttribute("name","createForm");
            title.setAttribute("type","text");
            title.setAttribute("name","title");
            title.setAttribute("placeholder","title");
            disc.setAttribute("name","discription");
            submit.setAttribute("type","submit");
            submit.setAttribute("name","submit");
            submit.setAttribute("value","CREATE");
            if(ad){
                title.value = ad.title;
                disc.innerText = ad.desc;
                submit.setAttribute("value","EDIT")
            }
            form.appendChild(title);
            form.appendChild(disc);
            form.appendChild(submit);
            main.appendChild(form);
            fragment.append(main);
            var old = this.super.container.querySelector("main");
            var pag = this.super.container.querySelector(".paginator");
            if(pag) this.super.container.body.removeChild(pag);
            this.super.container.body.replaceChild(fragment,old);
        },
        events: function () {
            this.super.container.forms.createForm.addEventListener("submit",function (e) {
                e.preventDefault();
                if(this.super.container.forms.createForm.elements.title.value === "" ||
                    this.super.container.forms.createForm.elements.discription.value === "") return;
                var newAd = new Ads(this.super.container.forms.createForm.elements.title.value,
                    this.super.container.forms.createForm.elements.discription.value,
                    this.super.authUser.login,
                    new Date(),
                    JSON.parse(this.super.storage.getItem("ads"))[JSON.parse(this.super.storage.getItem("ads")).length-1] ?
                    JSON.parse(this.super.storage.getItem("ads"))[JSON.parse(this.super.storage.getItem("ads")).length-1].id + 1 :
                 1);
                var ads = JSON.parse(this.super.storage.getItem("ads"))?
                    JSON.parse(this.super.storage.getItem("ads")):
                    [];
                ads.push(newAd);
                if(e.target.elements.submit.value === "EDIT"){
                    function getAd(cur) {
                        var indx = 0;
                        for(var i = 0; i<ads.length;i++){
                            if(ads[i].id === +cur){
                                console.log(i);
                                indx = i;
                            }
                        }
                        return indx;
                    }
                    ads.splice(getAd(this.ad.id),1);
                }
                this.super.storage.setItem("ads",JSON.stringify(ads));
                this.super.moduleViewAd.init(newAd);

            }.bind(this))
        }
    },
    moduleViewAd: {
        init: function (ad) {
            this.super = Girafe;
            this.drawPage(ad);
            this.events();
        },
        drawPage: function (ad) {
            var fragment = document.createDocumentFragment();
            var main = document.createElement("MAIN");
            var title = document.createElement("P");
            var desc = document.createElement("P");
            var author = document.createElement("P");
            var time = document.createElement("P");
            title.innerText = ad.title;
            desc.innerText = ad.desc;
            author.innerText = ad.author;
            time.innerText = ad.time;
            main.appendChild(title);
            main.appendChild(desc);
            main.appendChild(author);
            main.appendChild(time);
            if(Girafe.authUser !== null){
                if(ad.author === this.super.authUser.login){
                    var del = document.createElement("A");
                    del.setAttribute("href",ad.id);
                    del.setAttribute("class","del");
                    del.innerText = "DELETE";
                    var edit = document.createElement("A");
                    edit.setAttribute("href",ad.id);
                    edit.setAttribute("class","edit");
                    edit.innerText = "EDIT";
                    main.appendChild(del);
                    main.appendChild(edit);
                }
            }
            fragment.append(main);
            var old = this.super.container.querySelector("main");
            var pag = this.super.container.querySelector(".paginator");
            if(pag)this.super.container.body.removeChild(pag);
            this.super.container.body.replaceChild(fragment,old);
        },
        events: function () {
            this.super.container.querySelector("main").addEventListener("click",function (e) {
                if(e.target.matches(".del")){
                    e.preventDefault();
                    var ads = JSON.parse(this.super.storage.getItem("ads"));
                    function getAd(cur) {
                        var ads = JSON.parse(Girafe.storage.getItem("ads"));
                        var indx = 0;
                        for(var i = 0; i<ads.length;i++){
                            if(ads[i].id === +cur){
                                indx = i;
                            }
                        }
                        return indx;
                    }
                    ads.splice(getAd(e.target.getAttribute("href")),1);
                    this.super.storage.setItem("ads",JSON.stringify(ads));
                    this.super.moduleStart.init(true,1);
                }
                if(e.target.matches(".edit")){
                    e.preventDefault();
                    function getAd(cur) {
                        var ads = JSON.parse(Girafe.storage.getItem("ads"));
                        var indx = 0;
                        for(var i = 0; i<ads.length;i++){
                            if(ads[i].id === +cur){
                                indx = i;
                            }
                        }
                        return indx;
                    }
                    this.super.moduleCreateEdit.init(
                        JSON.parse(this.super.storage.getItem("ads"))[getAd(e.target.getAttribute("href"))]);
                }
            }.bind(this))
        }
    }
};
Girafe.init(document);