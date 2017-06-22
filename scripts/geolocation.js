// GPS-Loggger v1.0
// [https://github.com/code-of-design/gps-logggger-html5]
(function($){
  "use strict";

  var latitude;
  var longitude;

  // 現在位置を取得する.
  (function getCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // 緯度経度を取得する.
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        latitude = parseFloat(latitude.toFixed(3)); // 少数を正規化する.
        longitude = parseFloat(longitude.toFixed(3)); // 少数を正規化する.

        var latitude_id = document.getElementById("latitude");
        var longitude_id = document.getElementById("longitude");

        // Google Mapsを表示する.
        initMap();
        // 現在位置を表示する.
        console.log(latitude_id, longitude_id);
        viewCurrentPosition(latitude_id, longitude_id,latitude, longitude);
      }, errorGetCurrentPosition);
    }
  })();

  // 現在位置を表示する.
  function viewCurrentPosition(latitude_id, longitude_id, latitude, longitude) {
    latitude_id.innerHTML = "Latitude: " + latitude;
    longitude_id.innerHTML = "Longitude: " + longitude;
  }

  // 現在位置の取得エラーハンドリング.
  function errorGetCurrentPosition(error) {
    console.log(error.code);
    console.log(error.message);
  }

  // Google Mapsの表示.
  function initMap() {
    var uluru = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('minimap'), {
      zoom: 16,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
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

})(jQuery);
