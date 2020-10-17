import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
providedIn: 'root'
})

export class ShapeService {
  constructor() { }
  
  circle() {
    return new Konva.Circle({
      radius: 40,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      draggable: true
    });
  }

  rectangle() {
    return new Konva.Rect({
      width: 100,
      height: 50,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      draggable: true
    });
  }
}