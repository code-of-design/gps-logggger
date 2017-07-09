// GPS LOGGGGER v1.1
// 位置情報を記録しよう
// https://github.com/code-of-design/gps-logggger-html5

"use strict";

var gps = {
  CLASS: {
    LAT: $(".current-position__lat > .value"),
    LNG: $(".current-position__LNG > .value"),
    PROGRESS_TIME: $(".progress-time > .time > .value"),
    MOVING_DISTANCE: $(".moving-distance > .distance > .value")
  },
  lat: null,
  lng: null,
  lat_storage: [],
  lng_storage: [],
  progress_time: {
    h: 0,
    m: 0,
    s: 0
  },
  PROGRESS_TIME_INTERVAL: 1000,
  moving_distance: 0,
  GET_POSITION_INTERVAL: 5000,

  init: function(){
    this.viewCurrentPosition("000.000", "000.000");
    this.viewProgressTime(this.progress_time.h, this.progress_time.m, this.progress_time.s);
    this.viewMovingDistance(this.moving_distance);
  },

  addCurrentPositionToStorage: function(lat, lng, lat_storage, lng_storage){
    var storage_lng = lat_storage.length;
    var lat_diff = 0.0;
    var lng_diff = 0.0;
    var DISITION = 0.001;

    if (storage_lng <= 0) {
      lat_storage.push(lat);
      lng_storage.push(lng);
      this.viewPositionStorage(lat, lng);
    }
    else {
      lat_diff = lat_storage[storage_lng-1] - lat;
      lng_diff = lng_storage[storage_lng-1] - lng;
    }

    if ((lat_diff >= DISITION) || (lat_diff <= (-1)*DISITION) ||
    (lng_diff >= DISITION) || (lng_diff <= (-1)*DISITION)) {
      lat_storage.push(lat);
      lng_storage.push(lng);
      this.viewPositionStorage(lat, lng) ;
      this.getMovingDistance(lat_storage, lng_storage);
    }
  },

  countProgressTime: function(){
    var h, s, m;
    if (gps.progress_time.s < 59) {
      gps.progress_time.s += 1;
    }
    else {
      gps.progress_time.s = 0;
      gps.progress_time.m += 1;
    }

    if (gps.progress_time.m > 59) {
      gps.progress_time.m = 0;
      gps.progress_time.h+= 1;
    }
    h = gps.progress_time.h;
    m = gps.progress_time.m;
    s = gps.progress_time.s;

    gps.viewProgressTime(h, m, s);
  },

  getTwoPositionDistance: function(lat_begin, lng_begin, lat_end, lng_end) {
    var begin_position = new google.maps.LatLng({lat: lat_begin, lng: lng_begin});
    var end_position = new google.maps.LatLng({lat: lat_end, lng: lng_end});
    var distance = google.maps.geometry.spherical.computeDistanceBetween(begin_position, end_position);

    distance = Math.round(distance);

    return distance;
  },

  getMovingDistance: function(lat_storage, lng_storage){
    var storage_lng = lat_storage.length;

    if (storage_lng >= 2) {
      this.moving_distance += this.getTwoPositionDistance(lat_storage[storage_lng-1], lng_storage[storage_lng-1],
      lat_storage[storage_lng-2], lng_storage[storage_lng-2]);
    }
    this.viewMovingDistance(this.moving_distance);
  },

  viewCurrentPosition: function(lat, lng){
    this.CLASS.LAT.text(lat);
    this.CLASS.LNG.text(lng);
  },

  viewProgressTime: function(h, m, s){
    var time;
    time = (h < 10) ? ("0"+h+":") : (h+":");
    time += (m < 10) ? ("0"+m+":") : (m+":");
    time += (s < 10) ? ("0"+s) : s
    this.CLASS.PROGRESS_TIME.text(time);
  },

  viewMovingDistance: function(distance){
    distance = (distance*0.001).toFixed(1);

    this.CLASS.MOVING_DISTANCE.text(distance);
  },

  viewPositionStorage: function(lat, lng){
    $(".position-storage tr:last").after("<tr><td>"+lat+"|</td><td>"+lng+"</td></tr>");
  }
};

var google_map = {
  CLASS: $(".google-map"),
  map: null,
  style: null, // Google Mapのスタイル.
  ZOOM: 16,
  DISABLE_DEFAULT_UI: true,

  viewGoogleMap: function(lat, lng){
    $.getJSON("scripts/google_map_style.json", function(data){
      google_map.style = data;
    }).done(function(){
      google_map.map = new google.maps.Map(google_map.CLASS.get()[0], {
        center: {lat: lat, lng: lng},
        zoom: google_map.ZOOM,
        disableDefaultUI: google_map.DISABLE_DEFAULT_UI,
        styles: google_map.style
      });

      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: google_map.map
      });
    })
    .fail(function(){
      alert("Error: viewGoogleMap");
    });
  },
};

var record_btn = {
  CLASS: $(".btn-record"),
  LABEL:{
    WAIT: "記録する",
    RUN: "記録中"
  },

  onClick: function(){
    this.CLASS.click(function(){
      $(".btn-record > .label").text(record_btn.LABEL.RUN);
      setInterval(gps.countProgressTime, gps.PROGRESS_TIME_INTERVAL);
      setInterval(getCurrentPosition, gps.GET_POSITION_INTERVAL);
    });
  }
};

gps.init();
getCurrentPosition();
record_btn.onClick();

// 現在位置を取得する
function getCurrentPosition() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      // 緯度経度を取得する
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      lat = parseFloat(lat.toFixed(3));
      lng = parseFloat(lng.toFixed(3));

      google_map.viewGoogleMap(lat, lng);

      gps.addCurrentPositionToStorage(lat, lng, gps.lat_storage, gps.lng_storage);

      gps.viewCurrentPosition(lat, lng);

      console.log("getCurrentPosition()", lat, lng); // DEBUG.

    }, errorgetCurrentPosition); // 現在位置取得のエラーハンドリング.
  }
}

// 現在位置取得のエラーハンドリング
function errorgetCurrentPosition(err) {
  alert(err.code + ": " + err.message);
}
