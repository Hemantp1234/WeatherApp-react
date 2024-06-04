import React from "react";
import  { MainWrapper } from "./style.module.ts";
import { FaSearch } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa6";
import { BsCloudyFill,BsFillCloudRainFill,BsCloudFog2Fill, BsFillSunFill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";


interface WeatherProps {
    name:string;

    main: {
        temp: number;
        humidity : number;
    };

    sys: {
        country:string;
    }
    weather: {
        main:string;
    }[];
    wind: {
        speed:number;
    };

}

const Display : React.FC = () =>
    {

        const api_key = "0cc86d16bf572f78cdc96c096c7627e5";
        const api_endpoint = "https://api.openweathermap.org/data/2.5/";
        const [weatherData,setWeatherData] = React.useState< WeatherProps | null >(null);
        const [isLoading,setLoading] = React.useState(false);
        const [searchCity,setsearchCity] = React.useState("");

        const fetchCurrentWeather = async (lat:number , lon:number) =>
            {
               const url = `${api_endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
               const responce = await axios.get(url);
               return responce.data;
            }

        const fetchWeatherdata = async (city:string) =>
            {
                try{
                    const url = `${api_endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
                    const searchResponce = await axios.get(url);

                    const currentSearchResults:WeatherProps = searchResponce.data;
                    return{currentSearchResults};

                }
                catch{
                    console.error("data not found");
                    throw Error;
                }
            }
        const handleSearch = async() =>
            {
                if(searchCity.trim() == "")
                    {
                        return;
                    }

                    try
                    {
                        const {currentSearchResults } = await fetchWeatherdata(searchCity);
                        setWeatherData(currentSearchResults);
                    }
                    catch(error)
                    {
                        console.error("No results found");
                    }
            }

        const iconChange = (weather:string) =>
        {
            let iconElement: React.ReactNode;
            let iconColor:string;

            switch(weather)
            {
                case "Rain":
                iconElement = <BsFillCloudRainFill/>
                iconColor="#272829";
                break;

                case "Clear":
                iconElement = <BsFillSunFill/>
                iconColor="#FFC436";
                break;

                case "Clouds":
                iconElement = <BsCloudyFill/>
                iconColor="#102C57";
                break;

                case "Mist":
                iconElement = <BsCloudFog2Fill/>
                iconColor="#279EFF";
                break;

                default:
                    iconElement = <TiWeatherPartlySunny/>
                    iconColor="#782869";

            }
            return(
                <span className="icon" style={{color:iconColor}}>
                    {iconElement}
                </span>
            )
        }

            React.useEffect(() =>
            {
                navigator.geolocation.getCurrentPosition((position) =>
                {
                    const {latitude,longitude} = position.coords;
                    Promise.all([fetchCurrentWeather(latitude,longitude)]).then(
                        ([currentWeather]) =>
                            {
                                console.log(currentWeather);
                               setWeatherData(currentWeather);
                               setLoading(true);
                            }
                    )
                })
            })


        return(
           <MainWrapper>
            <div className="container">
                <div className="searchArea">
                    <input type="text"  placeholder="enetr city" value={searchCity} onChange={(e) => setsearchCity(e.target.value)}/>
                    <div className="searchCircle">
                      <FaSearch  className="searchIcon" onClick={handleSearch}/>
                    </div>
                </div>

              {weatherData && isLoading ? (

                <>
                <div className="weatherArea">
                    <h1>{weatherData.name}</h1>
                    <span>{weatherData.sys.country}</span>
                    <div className="icon">
                        {iconChange(weatherData.weather[0].main)}
                    </div>
                    <h1>{weatherData.main.temp}</h1>
                    <h2>{weatherData.weather[0].main}</h2>
                </div>

                <div className="bottomInfoArea">
                    <div className="humidityLevel">
                    <WiHumidity className="humidIcon"/>
                    <div className="humidityInfo">
                        <h1>{weatherData.main.humidity}</h1>
                        <p>humidity</p>
                    </div>
                    </div>

                    <div className="wind">
                    <FaWind  className="windIcon"/>
                    <div className="humidityInfo">
                        
                        <h1>{weatherData.wind.speed}</h1>
                        <p>Wind speed</p>
                    </div>
                    </div>
                </div>
                </>
              ): (
              <div className="loading">
                <RiLoaderFill className="loadingIcon"/>
              </div>

              )}
                
            </div>
           </MainWrapper>
        );
    };

    export default Display;