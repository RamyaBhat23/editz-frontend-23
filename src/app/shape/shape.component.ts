import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ShapeService } from '../shape.service';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css']
})

export class ShapeComponent implements OnInit {

  constructor(private appcomponent:AppComponent, private shapeservice:ShapeService) { }

  ngOnInit(): void {
  }

  addCircle() {
    this.appcomponent.stage.on('click',event=>{
      this.appcomponent.stage.off('click');
      // var x=this.appcomponent.stage.getPointerPosition().x;//wrt top-left corner of stage
      // var y=this.appcomponent.stage.getPointerPosition().y;
      var position=this.getRelativePointerPosition(this.appcomponent.img);//wrt node(img)
      var x=position.x;
      var y=position.y;
      var circle = this.shapeservice.circle();
      this.appcomponent.shapes.push(circle);
      this.appcomponent.imgLayer.add(circle);
      this.appcomponent.stage.add(this.appcomponent.imgLayer);
      circle.setAttr('x',x);
      circle.setAttr('y',y);
      this.appcomponent.imgLayer.batchDraw();
      this.appcomponent.stage.batchDraw();
      this.appcomponent.addTransformerListeners(circle);
    });
  }

  addRectangle() {
    this.appcomponent.stage.on('click',event=>{
      this.appcomponent.stage.off('click');
      var position=this.getRelativePointerPosition(this.appcomponent.img);
      var x=position.x;
      var y=position.y;
      var rectangle = this.shapeservice.rectangle();
      this.appcomponent.shapes.push(rectangle);
      this.appcomponent.imgLayer.add(rectangle);
      this.appcomponent.stage.add(this.appcomponent.imgLayer);
      rectangle.setAttr('x',x);
      rectangle.setAttr('y',y);
      this.appcomponent.imgLayer.batchDraw();
      this.appcomponent.stage.batchDraw();
      this.appcomponent.addTransformerListeners(rectangle);
    });
  }

  getRelativePointerPosition(node) {
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();

    // now we can find relative point
    return transform.point(pos);
  }
}