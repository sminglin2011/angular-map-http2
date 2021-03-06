import { Component, OnInit, Input, Output, OnChanges, AfterContentInit, EventEmitter } from '@angular/core';
import { Utility } from '../../Core';

@Component({
  selector: 'xtn-baidu-map-marker',
  templateUrl: 'marker.html',
  styleUrls: ['marker.scss']
})
export class XtnBaiduMapMarker implements OnInit, OnChanges {

  @Input('EnableDragging') enableDragging: boolean;
  @Input('BMap') BMap: any;
  @Input('Map') __Map: any;
  @Input('Position') __CurrentPosition: any;
  @Output('onUpdatePosition') onUpdatePosition: EventEmitter<any> = new EventEmitter();
  __Marker: any;

  BaiduAnimation: any = { BMAP_ANIMATION_BOUNCE: 2, BMAP_ANIMATION_DROP: 1 };

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    const { point, address } = this.__CurrentPosition;
    console.log('marker-->', address);
    // const { BMAP_ANIMATION_BOUNCE } = <any>window
    if (this.__Marker) {
      this.__Map.removeOverlay(this.__Marker);
      // this.__Marker.setPosition(this.__CurrentPosition.point);
    }
    this.__Marker = null;
    this.AddMarker(this.__CurrentPosition);
  }

  AddMarker(position) {
    if (!this.BMap || !position) {
      return;
    }
    const { point } = position;
    const self = this;
    const { onUpdatePosition } = this;

    const myIcon = new this.BMap.Icon("/assets/img/person-icon.png",
      new this.BMap.Size(48, 48), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        offset: new this.BMap.Size(48, 48),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new this.BMap.Size(0, 0)   // 设置图片偏移    
      });
    // 创建标注对象并添加到地图   
    const marker = new this.BMap.Marker(point, { icon: myIcon });
    const { BMAP_ANIMATION_BOUNCE, BMAP_ANIMATION_DROP } = <any>window
    this.__Map.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 2000);

    // 点击图标事件
    marker.addEventListener("click", function (e) {
      console.log('点击图标啦', e);
    });

    // 让图标可以进行拖拽。
    if (!!this.enableDragging) {
      marker.enableDragging();
      marker.addEventListener("dragend", function (e) {
        console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
        if (onUpdatePosition) {
          onUpdatePosition.emit(e);
        }
      })
    }
    this.__Marker = marker;
  }
}

