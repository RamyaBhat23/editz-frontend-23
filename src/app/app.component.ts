import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ImageEditor';
  stage: Konva.Stage;
  imageobject;
  img;
  imgLayer:Konva.Layer;
  link;
  marginset;
  hflip:boolean=true;
  vflip:boolean=true;
  rotatevalue;
  rotationflag=1;
  shapes: any = [];
  click=1;
  shapeArray:any=[];
  transformers: Konva.Transformer[] = [];

  constructor(
  ) { }

  ngOnInit() {
  }

  upload(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var URL = window.webkitURL || window.URL;
      var url = URL.createObjectURL(event.target.files[0]);
    }

    this.imageobject = new Image();
    this.imageobject.src = url;

    this.imageobject.onload = ()=>{

      this.stage = new Konva.Stage({
        container: 'container',
        x:0+this.imageobject.width/2,
        y:0+this.imageobject.height/2,
        offset:{
          x:this.imageobject.width/2,
          y:this.imageobject.height/2
        },
        width:this.imageobject.width,
        height:this.imageobject.height,
      });

      this.img=new Konva.Image({
        image:this.imageobject,
        x:0+this.imageobject.width/2,
        y:0+this.imageobject.height/2,
        offset:{
          x:this.imageobject.width/2,
          y:this.imageobject.height/2
        },
        width:this.imageobject.width,
        height:this.imageobject.height,
        draggable:false
      });

      this.marginset=document.getElementsByClassName("konvajs-content")[0];
      this.marginset.style["margin"]="auto";
      
      this.imgLayer=new Konva.Layer();
      this.stage.add(this.imgLayer);
      this.imgLayer.setZIndex(0);
      this.imgLayer.add(this.img);
      this.imgLayer.batchDraw();
    }    
  }

  save()
  {
    var dataURL = this.stage.toDataURL();
    this.downloadURL(dataURL, 'download.png');
  }

  downloadURL(url,name)
  {
    this.link=document.createElement('a');
    this.link.download=name;
    this.link.href=url;
    document.body.appendChild(this.link);
    this.link.click();
    document.body.removeChild(this.link);
    delete this.link;
  }

  addTransformerListeners(shape) {
    const tr = new Konva.Transformer();
    shape.on('click',event=>
    {
      let index=this.shapeArray.indexOf(shape);

      if(index!=-1){
        this.transformers[this.shapeArray[index]._id].detach();
        delete this.shapeArray[index];
        index=-1;
        this.imgLayer.batchDraw();
        this.stage.batchDraw();
      }

      else{
        console.log("selected");
        this.imgLayer.add(tr);
        tr.attachTo(event.target);//shape also works
        this.transformers[event.target._id]=tr;
        this.imgLayer.batchDraw();
        this.stage.batchDraw();
        this.shapeArray.push(event.target);
        this.colorShape(shape);
        this.addDeleteListener();//if any error in colorShape() then this doesn't work
      }
    });
  }

  showColors(){
    if(this.click==1){
      document.getElementById('rgb').style.display="block";
      this.click=0;
    }
    else{
      document.getElementById('rgb').style.display="none";
      this.click=1;
    }
  }

  colorShape(shape){
    let component=this.imgLayer;
    let SHAPE=this;
    shape.cache();
    shape.filters([Konva.Filters.RGB]);
    this.stage.clickStartShape.fill("white");
    this.imgLayer.batchDraw();
    var sliders=['red','green','blue'];
    
    sliders.forEach(function(attr){
      var slider=<HTMLInputElement> document.getElementById(attr);
      function update(){
        console.log("update color");
        SHAPE.shapeArray.forEach(s => 
        {
          s[attr](parseFloat(slider.value));
          console.log(slider.value);
        })
        component.batchDraw();
      }
      slider.oninput = update;
    });
  }
  
  addDeleteListener() {
    let component = this;
    window.addEventListener('keydown', event => {//keydown-press, keyup-opp
      if (event.keyCode === 46)//delete key 
      {
       console.log("deleted shape:"+component.shapeArray);
       component.shapeArray.forEach(e=>{
         component.shapes.forEach(shape=>{
           if(e==shape){
             e.remove();
             shape.remove();
             component.imgLayer.batchDraw();
           }
         });
       });
       component.transformers.forEach(t=>{
         t.detach();
       });
      }
    });
  }

  rotation(){
    this.stage.rotation(this.rotatevalue);
    this.stage.batchDraw();
  }

  //rotation using slider
  showRotation(){
    var slider=<HTMLInputElement>document.getElementById("range");
    var output=<HTMLInputElement>document.getElementById("rotationvalue");
    var manual=<HTMLInputElement>document.getElementById("rotationvalue");
    output.innerHTML=slider.value;
    slider.oninput=event=>{
      this.rotatevalue=parseInt(slider.value);
      manual.value=(this.rotatevalue).toString();
      this.rotation();
    }

    if(this.rotationflag==1){
      document.getElementById("rb").style.display="inline";
      this.rotationflag=0;
    }

    else{
      document.getElementById("rb").style.display="none";
      this.rotationflag=1;
    }
  }
  
  //rotation using manual entry
  manualRotation(){
    var slider=<HTMLInputElement>document.getElementById("range");
    var manual=<HTMLInputElement>document.getElementById("rotationvalue");
    this.rotatevalue=parseInt(manual.value);
    slider.value=(this.rotatevalue).toString();
    this.rotation();
  }

  flipx(){
    if(this.hflip){
      this.stage.setAttr('scaleX',-1);
      this.hflip=false;
      this.imgLayer.batchDraw();
      this.stage.batchDraw();  
    }
    else{
      this.stage.setAttr('scaleX',1);
      this.hflip=true;
      this.imgLayer.batchDraw();
      this.stage.batchDraw(); 
    }
  }

  flipy(){
    if(this.vflip){
      this.stage.setAttr('scaleY',-1);
      this.vflip=false;
      this.imgLayer.batchDraw();
      this.stage.batchDraw();  
    }
    else{
      this.stage.setAttr('scaleY',1);
      this.vflip=true;
      this.imgLayer.batchDraw();
      this.stage.batchDraw(); 
    }
  }
}