import "./FavouritePlace.css";
import { useState, useEffect } from "react";
import Icon from "react-icons-kit";
import { arrowUp } from "react-icons-kit/feather/arrowUp";
import { arrowDown } from "react-icons-kit/feather/arrowDown";
import { droplet } from "react-icons-kit/feather/droplet";
import { wind } from "react-icons-kit/feather/wind";
import { activity } from "react-icons-kit/feather/activity";
import { useDispatch, useSelector } from "react-redux";
import { get5DaysForecast, getCityData } from "../Store/Slices/WeatherSlice";
import { GooSpinner } from "react-spinners-kit";
import { useParams } from "react-router-dom";

const FavouritePlace = () => {
  // redux state
  const {
    citySearchLoading,
    citySearchData,
    forecastLoading,
    forecastData,
    forecastError,
  } = useSelector((state) => state.weather);

  const { place } = useParams();

  // main loadings state
  const [loadings, setLoadings] = useState(true);

  // check if any of redux loading state is still true
  const allLoadings = [citySearchLoading, forecastLoading];
  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoadings(isAnyChildLoading);
  }, [allLoadings]);

  // city state
  const [city, setCity] = useState(place);

  // unit state
  const [unit, setUnit] = useState("metric");

  // toggle unit
  const toggleUnit = () => {
    setLoadings(true);
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  // dispatch
  const dispatch = useDispatch();

  // fetch data
  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        );
      }
    });
  };

  // initial render
  useEffect(() => {
    fetchData();
  }, [unit]);

  // function to filter forecast data based on the time of the first object
  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

  return (
    <div className="favourite-place-dashboard">
      <div className="weather-box">
        {/* current weather details box */}
        <div className="current-weather-details">
          {/* header */}
          <div className="details-box-header">
            {/* heading */}
            <h4>Weather Updates</h4>

            {/* switch */}
            <div className="switch fv-switch" onClick={toggleUnit}>
              <div
                className={`switch-toggle ${unit === "metric" ? "c" : "f"}`}
              ></div>
              <span className="c">C</span>
              <span className="f">F</span>
            </div>
          </div>

          {loadings ? (
            <div className="loader">
              <GooSpinner loadings={loadings} color="#2fa5ed" size={20} />
            </div>
          ) : (
            <>
              {citySearchData && citySearchData.error ? (
                <div className="error-message">{citySearchData.error}</div>
              ) : (
                <>
                  {forecastError ? (
                    <div className="error-message">{forecastError}</div>
                  ) : (
                    <>
                      {citySearchData && citySearchData.data ? (
                        <div className="weather-details">
                          {/* city name and temperature */}
                          <div className="city-info">
                            <h4 className="city-name">
                              {citySearchData.data.name}
                            </h4>
                            <h1 className="temperature">
                              {citySearchData.data.main.temp}&deg;
                            </h1>
                          </div>

                          <h4 className="description">
                            {citySearchData.data.weather[0].description}
                          </h4>

                          {/* weather metrics */}
                          <div className="weather-metrics">
                            {/* feels like */}
                            <div className="metric-item">
                              <span>Feels like: </span>
                              <span>
                                {citySearchData.data.main.feels_like}&deg;
                              </span>
                            </div>

                            {/* min-max temp */}
                            <div className="metric-item">
                              <Icon icon={arrowUp} size={20} />
                              <span>
                                Max Temp: {citySearchData.data.main.temp_max}
                                &deg;
                              </span>
                            </div>
                            <div className="metric-item">
                              <Icon icon={arrowDown} size={20} />
                              <span>
                                Min Temp: {citySearchData.data.main.temp_min}
                                &deg;
                              </span>
                            </div>

                            {/* humidity */}
                            <div className="metric-item">
                              <Icon icon={droplet} size={20} />
                              <span>
                                Humidity: {citySearchData.data.main.humidity}%
                              </span>
                            </div>

                            {/* wind */}
                            <div className="metric-item">
                              <Icon icon={wind} size={20} />
                              <span>
                                Wind: {citySearchData.data.wind.speed} kph
                              </span>
                            </div>

                            {/* pressure */}
                            <div className="metric-item">
                              <Icon icon={activity} size={20} />
                              <span>
                                Pressure: {citySearchData.data.main.pressure}{" "}
                                hPa
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="error-message">No Data Found</div>
                      )}

                      {/* extended forecast */}
                      <h4 className="forecast-heading">Extended Forecast</h4>
                      {filteredForecast.length > 0 ? (
                        <div className="forecast-list">
                          {filteredForecast.map((data, index) => {
                            const date = new Date(data.dt_txt);
                            const day = date.toLocaleDateString("en-US", {
                              weekday: "short",
                            });
                            return (
                              <div className="forecast-item" key={index}>
                                <h5>{day}</h5>
                                <h5>{data.weather[0].description}</h5>
                                <h5 className="temp-range">
                                  {data.main.temp_max}&deg; /{" "}
                                  {data.main.temp_min}&deg;
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="error-message">No Data Found</div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavouritePlace;
