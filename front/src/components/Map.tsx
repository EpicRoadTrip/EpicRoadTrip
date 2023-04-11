import React from "react";
import { IMap } from "@interfaces/map";

const Maps = ({style, position, mapOptions}: IMap) => {
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current as unknown as HTMLElement;
    const myLatlngDepart = new google.maps.LatLng(Number.parseFloat(position.depart.lat), Number.parseFloat(position.depart.long));

    const mapOptionsReformated: google.maps.MapOptions = {...mapOptions,
      center: myLatlngDepart
    }
    let mapGoogle = new google.maps.Map(map, mapOptionsReformated);

    const marker = new google.maps.Marker({
      position: myLatlngDepart,
      map: mapGoogle,
      animation: google.maps.Animation.DROP,
      title: "Material Dashboard React!",
    });

    const contentString =
      `<div class="info-window-content"><h2>${position.depart.data?.name ?? "EpiRoadTrip"}</h2>` +
      `<p>${position.depart.data?.description ?? "No description available"}</p></div>`;

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(mapGoogle, marker);
    });

    if (position.dest) {
      const myLatlngDest = new google.maps.LatLng(Number.parseFloat(position.dest.lat), Number.parseFloat(position.dest.long));

      const markerDest = new google.maps.Marker({
        position: myLatlngDest,
        map: mapGoogle,
        animation: google.maps.Animation.DROP,
        title: position.dest.data?.name ?? "EpiRoadTrip",
      });

      const contentStringDest = `<div class="info-window-content"><h2>${position.dest.data?.name ?? "EpiRoadTrip"}</h2>` +
      `<p>${position.dest.data?.description ?? "No description available"}</p></div>`;

      const infowindowDest = new google.maps.InfoWindow({
        content: contentStringDest
      });

      google.maps.event.addListener(markerDest, 'click', () => {
        infowindowDest.open(mapGoogle, markerDest)
      });
    }
  });
  return (
    <>
      <div ref={mapRef} style={style}></div>
    </>
  );
};

export default Maps;
