// GPS-Loggger v1.0
// https://github.com/code-of-design/gps-logggger-html5
(function($){
  "use strict";

  var latitude = 0.0; // 緯度.
  var longitude = 0.0; // 経度.
  var latitude_log = []; // 緯度ログ.
  var longitude_log = []; // 経度ログ.
  var lapsed_time = {
    hour: 0,
    minute: 0,
    second: 0
  }; // 経過時間.
  var distance = 0; // 移動距離.
  var distance_log = []; // 移動距離ログ.

  var latitude_id = document.getElementById("latitude");
  var longitude_id = document.getElementById("longitude");
  var minimap_id = document.getElementById("map");
  var current_time_id = document.getElementById("current-time__time");
  var lapsed_time_id = document.getElementById("lapsed-time__time");

  // SET UP
  window.onload = function(){
    // 現在位置を取得する
    getCurrentPosition();
  };

  // 現在位置を取得する
  function getCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // 緯度経度を取得する
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        // 緯度経度を正規化する
        latitude = parseFloat(latitude.toFixed(3));
        longitude = parseFloat(longitude.toFixed(3));
        // 現在位置を表示する
        viewCurrentPosition(latitude_id, longitude_id,latitude, longitude);
        // Google Mapsを表示する
        viewMinimap(latitude, longitude);
      }, errorGetPosition); // 位置情報取得のエラーハンドリング.
    }
  }

  // 位置情報を監視する
  function watchPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(function (position) {
        // 緯度経度を取得する
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        // 緯度経度を正規化する
        latitude = parseFloat(latitude.toFixed(3));
        longitude = parseFloat(longitude.toFixed(3));
        // 現在位置を表示する
        viewCurrentPosition(latitude_id, longitude_id, latitude, longitude);
        // 緯度経度をログする.
        if (latitude_log.length > 0) {
          if (latitude_log[latitude_log.length] >= (latitude+0.05) ||
          latitude_log[latitude_log.length] <= (latitude-0.05)) {
            latitude_log.push(latitude);
            // Google Mapsを表示する
            viewMinimap(latitude, longitude);
          }
        }
        else{
          latitude_log.push(latitude);
        }
        if (longitude_log.length > 0) {
          if (longitude_log[longitude_log.length] >= (longitude+0.05) ||
          longitude_log[longitude_log.length] <= (longitude-0.05)) {
            longitude_log.push(longitude);
            // Google Mapsを表示する
            viewMinimap(latitude, longitude);
          }
        }
        else {
          longitude_log.push(longitude);
        }
        console.log(latitude_log, longitude_log);
      }, errorGetPosition);
    }
  }

  // 現在位置を表示する
  function viewCurrentPosition(latitude_id, longitude_id, latitude, longitude) {
    latitude_id.innerHTML = "LAT: " + latitude;
    longitude_id.innerHTML = "LNG: " + longitude;
  }

  // 位置情報取得のエラーハンドリング
  function errorGetPosition(error) {
    console.log(error.code);
    console.log(error.message);
  }

  // 現在時刻を取得する
  function getCurrentTime(){
    var current_time = new Date();
    var year = current_time.getFullYear();
    var month = current_time.getMonth();
    var day = current_time.getDate();
    var hour = current_time.getHours();
    var minute = current_time.getMinutes();
    var second = current_time.getSeconds();
    var time = hour+":"+minute+":"+second;
    // 現在時刻を表示する
    viewCurrentTime(time);
  }

  // 現在時刻を表示する
  function viewCurrentTime(time){
    current_time_id.innerHTML = time;
  }

  // 経過時間を取得する
  function getLapsedTime(){
    if (lapsed_time.second < 59) {
      lapsed_time.second += 1;
    }
    else {
      lapsed_time.second = 0;
      lapsed_time.minute += 1;
    }

    if (lapsed_time.minute > 59) {
      lapsed_time.minute = 0;
      lapsed_time.hour += 1;
    }
    viewLapsedTime(lapsed_time.hour, lapsed_time.minute, lapsed_time.second);
  }

  // 経過時間を表示する.
  function viewLapsedTime(hour, minute, second){
    var time;
    time = (hour < 10) ? ("0"+hour+":") : (hour+":");
    time += (minute < 10) ? ("0"+minute+":") : (minute+":");
    time += (second < 10) ? ("0"+second) : second
    lapsed_time_id.innerHTML = time;
  }

  // Google Mapsを表示する
  function viewMinimap(latitude, longitude) {
    var current_position = {
      lat: latitude,
      lng: longitude
    };
    // Mapを宣言する
    var minimap = new google.maps.Map(minimap_id, {
      zoom: 17,
      center: current_position
    });
    // マーカを表示する
    var marker = new google.maps.Marker({
      position: current_position,
      map: minimap
    });
  }

  // 2点距離を測定する
  // https://developers.google.com/maps/documentation/javascript/geometry?hl=ja
  function getBetweenDistance(lat_begin, lng_begin, lat_end, lng_end){
    var begin_position = new google.maps.LatLng(lat_begin, lng_begin);
    var end_position = new google.maps.LatLng(lat_end, lng_end);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(begin_position, end_position);

    return distance;
  }

  // 位置情報を記録する
  //function clickLogbtn(latitude, longitude){
    $(".begin-btn__btn").click(function(){
      // 経過時間を取得する
      setInterval(getLapsedTime, 1000);
      // 位置情報を監視する
      watchPosition();
    });
  //}

})(jQuery);
