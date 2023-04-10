import React from "react";
import { IMap } from "@interfaces/map";

const Maps = ({style, lat, long, mapOptions}: IMap) => {
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current as unknown as HTMLElement;
    const myLatlng = new google.maps.LatLng(Number.parseFloat(lat), Number.parseFloat(long));
    const mapOptionsReformated: google.maps.MapOptions = {...mapOptions,
      center: myLatlng
    }
    let mapGoogle = new google.maps.Map(map, mapOptionsReformated);


    const marker = new google.maps.Marker({
      position: myLatlng,
      map: mapGoogle,
      animation: google.maps.Animation.DROP,
      title: "Material Dashboard React!",
    });

    const contentString =
      '<div class="info-window-content"><h2>Material Dashboard React</h2>' +
      "<p>A premium Admin for React, Material-UI, and React Hooks.</p></div>";

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(mapGoogle, marker);
    });
  });
  return (
    <>
      <div ref={mapRef} style={style}></div>
    </>
  );
};

export default Maps;
