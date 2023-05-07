// とりあえずの地図の拡大レベル
const defaultZoomLvl = 16;

// leaflet地図オブジェクト
let map = undefined;

// 現在位置（経度緯度）
let currentLatLng = {
    lat: 0,
    lng: 0
};

// URLパラメータの位置情報
let paramLatLng = undefined;

// 地図マーカーオブジェクト
let marker = undefined;

// マーカーのメッセージ
const popupMsg = () => {
    const today = new Date();
    const hours = ("00" + today.getHours()).slice(-2);
    const minutes = ("00" + (new Date()).getMinutes()).slice(-2);
    return `現在地<br>${hours}:${minutes}`
};

// モバイルユーザーかどうか
const isMobileUser = () => navigator.userAgent.match(/iPhone|Android.+Mobile/);

// メイン処理
window.onload = () => {
    // URL経度緯度パラメータを解析
    let url = location.href;
    let paramLatLng = url.substring(url.indexOf("#") + 1, url.length);
    let lat = parseFloat(paramLatLng.split("/")[0]);
    let lng = parseFloat(paramLatLng.split("/")[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
        paramLatLng = [lat, lng];
    }
    else {
        paramLatLng = undefined;
    }

    // Leafletマップオブジェクトを作成
    map = L.map("map", {doubleClickZoom: false});
    
    // 現在地を地図で表示
    map.locate({setView: true, maxZoom: defaultZoomLvl});

    // タイルレイヤーを設定
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: defaultZoomLvl,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.Control.geocoder().addTo(map);

    // 現在地にピン
    map.once("locationfound", (e) => {
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng).addTo(map);
        }

        // 現在地情報を控える
        currentLatLng = {lat: e.latlng.lat, lng: e.latlng.lng};

        // ピンに現在時刻を表示
        marker.bindPopup(popupMsg()).openPopup();
    });

    if (!navigator.geolocation) {
        console.log("Error: Geolocation機能がありません。");
    } else {
        if (isMobileUser()) {
            setInterval(() => {
                navigator.geolocation.getCurrentPosition(getPosition);
            }, 5000);
        }
    }
};

// お試し用
function quickStart(map) {
    // 現在地にピン
    map.once("locationfound", (e) => {
        let marker;
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng).addTo(map);
        }

        // 現在地情報を控える
        currentLatLng = {lat: e.latlng.lat, lng: e.latlng.lng};

        // ピンに現在時刻を表示
        marker.bindPopup(`現在地<br>${hours()}:${minutes()}`).openPopup();
    });

    // debug
    if (paramLatLng != undefined) {
        L.marker(paramLatLng).bindPopup("相手の現在地").addTo(map);
    }
}

// シェアボタンの設定
function initShareButton() {
    const btn = document.getElementById("share-button");
    btn.addEventListener("click", async () => {
        const shareData = {
            title: "現在地を共有",
            text: `経度緯度(${currentLatLng.lat}, ${currentLatLng.lng}), 時刻(${hours()}:${minutes()})`,
            url: `https://rainyseason-rainy-days.netlify.app/ls.html#${currentLatLng.lat}/${currentLatLng.lng}`
        };
    
        try {
            await navigator.share(shareData);
            console.log("Shared successfully");
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    });
}

// 位置を取得
function getPosition(position) {
    if (marker){
        map.removeLayer(marker);
    }

    marker = L.marker([
        position.coords.latitude, 
        position.coords.longitude
    ])
    .bindPopup(popupMsg())
    .addTo(map);
}

