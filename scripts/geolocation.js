// GPS LOGGER v1.0
// https://github.com/code-of-design/gps-logggger-html5
(function($){
  "use strict";

  // SET UP
  var latitude = null; // 緯度.
  var longitude = null; // 経度.
  var latitude_storage = []; // 緯度ストレージ.
  var longitude_storage = []; // 経度ストレージ.
  var lapsed_time = {
    hour: 0,
    minute: 0,
    second: 0
  }; // 経過時間.
  var distance = 0; // 移動距離.
  var distance_storage = []; // 移動距離ストレージ.

  // Dom id
  var latitude_id = document.getElementById("latitude"); // 緯度id.
  var longitude_id = document.getElementById("longitude"); // 経度id.
  var googlemap_id = document.getElementById("google-map__map"); // Google Mapid.
  var lapsed_time_id = document.getElementById("lapsed-time__time"); // 経過時間id.

  // DRAW
  window.onload = function(){
    // 現在位置を取得する
    getCurrentPosition();

    // 位置情報を記録する
    $(".begin-btn__btn").click(function(){
      setInterval(getLapsedTime, 1000); // 経過時間を取得する.
      watchPosition(); // 位置情報を監視する.
    });
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
        viewGooglemap(latitude, longitude);
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
        // 位置情報をストレージに追加する
        addPositionToStorage(latitude, longitude, latitude_storage, longitude_storage);
        // 現在位置を表示する
        viewCurrentPosition(latitude_id, longitude_id, latitude, longitude);
      }, errorGetPosition);
    }
  }

  // 位置情報をストレージに追加する
  function addPositionToStorage(lat, lng, lat_storage, lng_storage){
    lat_storage.push(lat);
    lng_storage.push(lng);
    console.log(lat_storage, lng_storage);
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

  // 現在日時を取得する
  function getCurrentTime(){
    var current_date = new Date();
    var year = current_date.getFullYear();
    var month = current_date.getMonth();
    var day = current_date.getDate();
    var hour = current_date.getHours();
    var minute = current_date.getMinutes();
    var second = current_date.getSeconds();
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
  function viewGooglemap(latitude, longitude) {
    var current_position = {
      lat: latitude,
      lng: longitude
    };
    // Mapを宣言する
    var googlemap = new google.maps.Map(googlemap_id, {
      zoom: 17,
      center: current_position
    });
    // マーカを表示する
    var marker = new google.maps.Marker({
      position: current_position,
      map: googlemap
    });
  }

  // 2点距離を測定する [https://developers.google.com/maps/documentation/javascript/geometry?hl=ja]
  function getBetweenDistance(lat_begin, lng_begin, lat_end, lng_end){
    var begin_position = new google.maps.LatLng(lat_begin, lng_begin);
    var end_position = new google.maps.LatLng(lat_end, lng_end);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(begin_position, end_position);

    return distance;
  }
})(jQuery);
