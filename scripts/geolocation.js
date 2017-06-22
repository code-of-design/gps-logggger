// GPS-Loggger v1.0
// https://github.com/code-of-design/gps-logggger-html5
(function($){
  "use strict";

  var latitude;
  var longitude;
  var latitude_id = document.getElementById("latitude");
  var longitude_id = document.getElementById("longitude");
  var minimap_id = document.getElementById("map");
  var current_time_id = document.getElementById("current-time__time");

  window.onload = function(){
    // 現在時刻を取得する.
    setInterval(getCurrentTime, 1000);
    // 位置情報を監視する.
    watchPosition();
  };

  // 現在位置を取得する.
  function getCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // 緯度経度を取得する.
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        // 緯度経度を正規化する.
        latitude = parseFloat(latitude.toFixed(3));
        longitude = parseFloat(longitude.toFixed(3));
        // Google Mapsを表示する.
        viewMinimap(latitude, longitude);
        // 現在位置を表示する.
        viewCurrentPosition(latitude_id, longitude_id,latitude, longitude);
      }, errorGetPosition); // 位置情報取得のエラーハンドリング.
    }
  }

  // 位置情報を監視する.
  function watchPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(function (position) {
        // 緯度経度.
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        // 緯度経度を正規化する.
        latitude = parseFloat(latitude.toFixed(3));
        longitude = parseFloat(longitude.toFixed(3));
        // Google Mapsを表示する.
        // viewMinimap(latitude, longitude);
        // 現在位置を表示する.
        viewCurrentPosition(latitude_id, longitude_id, latitude, longitude);
        // 位置情報を記録する.
        clickLogbtn(latitude, longitude);
      }, errorGetPosition);
    }
  }

  // 位置情報取得のエラーハンドリング.
  function errorGetPosition(error) {
    console.log(error.code);
    console.log(error.message);
  }

  // 現在位置を表示する.
  function viewCurrentPosition(latitude_id, longitude_id, latitude, longitude) {
    latitude_id.innerHTML += latitude;
    longitude_id.innerHTML += longitude;
  }

  // 現在時刻を取得する.
  function getCurrentTime(){
    var current_time = new Date();
    var year = current_time.getFullYear();
    var month = current_time.getMonth();
    var day = current_time.getDate();
    var hour = current_time.getHours();
    var minute = current_time.getMinutes();
    var second = current_time.getSeconds();
    var time = hour+":"+minute+":"+second;
    // 現在時刻を表示する.
    viewCurrentTime(time);
  }

  // 現在時刻を表示する.
  function viewCurrentTime(time){
    current_time_id.innerHTML = time;
  }

  // Google Mapsを表示する.
  function viewMinimap(latitude, longitude) {
    var current_position = {
      lat: latitude,
      lng: longitude
    };
    // Mapを宣言する.
    var minimap = new google.maps.Map(minimap_id, {
      zoom: 17,
      center: current_position
    });
    // マーカを表示する.
    var marker = new google.maps.Marker({
      position: current_position,
      map: minimap
    });
  }

  // 2点距離を測定する.
  // https://developers.google.com/maps/documentation/javascript/geometry?hl=ja
  function getBetweenDistance(lat_begin, lng_begin, lat_end, lng_end){
    var begin_position = new google.maps.LatLng(lat_begin, lng_begin);
    var end_position = new google.maps.LatLng(lat_end, lng_end);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(begin_position, end_position);

    return distance;
  }

  // 位置情報を記録する.
  function clickLogbtn(latitude, longitude){
    $(".begin-btn__btn").click(function(){
      viewMinimap(latitude, longitude);
    });
  }

})(jQuery);
