// GPS-Loggger v1.0
// [https://github.com/code-of-design/gps-logggger-html5]
(function($){
  "use strict";

  var latitude; // 緯度.
  var longitude; // 経度.
  var latitude_id;
  var longitude_id;

  // 現在位置を取得する.
  // getCurrentPosition() は低精度の結果を使いなるべく速く応答しようとします.
  (function getCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // 緯度経度.
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        latitude = latitude.toFixed(3);
        longitude = longitude.toFixed(3);
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        latitude_id = document.getElementById("latitude");
        longitude_id = document.getElementById("longitude");
        // Google Mapsを初期化する.
        initMap();
        // 現在位置を表示する.
        viewCurrentPosition(latitude_id, longitude_id,latitude, longitude);
      }, errorGetCurrentPosition);
    }
    else {
      console.log("HTML5 Geolocation API is not available!");
      return;
    }
  })();

  // 現在位置を表示する.
  function viewCurrentPosition(latitude_id, longitude_id, latitude, longitude) {
    latitude_id.innerHTML = "Latitude: " + latitude;
    longitude_id.innerHTML = "Longitude: " + longitude;
  }

  // 現在位置の取得エラーハンドリング.
function errorGetCurrentPosition(error) {
  // console.log(error.code);
  // console.log(error.message);
}

  function initMap() {
    console.log(latitude);
    console.log(longitude);

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

  /*
  // 距離測定
  // https://developers.google.com/maps/documentation/javascript/geometry?hl=ja
  var tokyo = new google.maps.LatLng(35.681382, 139.76608399999998);
  var osaka = new google.maps.LatLng(34.701909, 135.49497700000006);
  var distance = google.maps.geometry.spherical.computeDistanceBetween(tokyo, osaka);
  console.log(distance + " m");
  */
})(jQuery);
