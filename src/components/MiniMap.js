import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import { setScore } from "../gameFunctions/gameFunctions";
import styles from "../styles/mapStyle.module.css";
import { findDistance } from "../mapFunctions/mapFunctions";
import ResultPage from "../pages/ResultPage";

import "leaflet/dist/leaflet.css";

function Map() {
  const doneGuessData = useSelector((state) => state.mapSlc.isGuessed);
  const data = useSelector((state) => state.mapSlc.coordinate);
  const [guess, setGuess] = useState({ lat: "", lng: "" });
  const [result, setResultPage] = useState(false);
  const [roundScore, setroundScore] = useState(0.0);
  // Dünya sınırları için
  const wolrdBounds = [
    [-90, -180],
    [90, 180],
  ];

  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    iconAnchor: [12, 41], // adjust the anchor point to position the icon above the clicked location
  });

  const calculateDistanceNScore = () => {
    if (guess.lat === "" || guess.lng === "") {
      alert("Lütfen tahmin yapın");
    } else {
      const distance = findDistance(data, guess);
      const score = parseFloat(setScore(distance));
      setroundScore(score);
      setResultPage(true);
    }
  };

  const center = {
    lat: guess.lat !== "" ? guess.lat : 38.9637,
    lng: guess.lng !== "" ? guess.lng : 35.2433,
  };

  useEffect(() => {
    setResultPage(false);
    setGuess({ lat: "", lng: "" });
  }, [doneGuessData]);

  function MapEvents() {
    useMapEvents({
      click: (e) => {
        setGuess(e.latlng);
        console.log(guess);
      },
    });
    return null;
  }

  return result ? (
    <ResultPage score={roundScore} guess={guess}></ResultPage>
  ) : (
    <div
      className={styles.mainContainer}
      style={{ color: "black", fontSize: 24 }}>
      <MapContainer
        className={styles.mapContainer}
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={false}
        maxBounds={wolrdBounds}
        maxBoundsViscosity={1.0}
        minZoom={2}
        maxZoom={18}>
        <TileLayer
          noWrap={true}
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        />
        {guess.lat === "" || guess.lng === "" ? (
          ""
        ) : (
          <Marker position={guess} icon={icon}>
            <Popup>Your Guess</Popup>
          </Marker>
        )}

        <MapEvents></MapEvents>
      </MapContainer>
      <button
        onClick={calculateDistanceNScore}
        className={
          guess.lat === "" || guess.lng === ""
            ? styles.buttonNoGuess
            : styles.buttonGuess
        }>
        "Complete your guess!"
      </button>
    </div>
  );
}

export default Map;
