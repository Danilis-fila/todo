import React, {useState, useEffect} from 'react';
import './App.css';


function App() {

  const [item, setItem] = useState('');
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  );
  const DeleteItem = (id) => { setItems( items.filter((item) => item.id !== id));};  
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataWeather, setDataWeather] = useState({});


  async function dataLoading () {
    const weather = await getWeather();
    setDataWeather(weather);
    setIsLoaded(true);
  }

  useEffect(() => dataLoading, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items]);

  const getWeather = async () => {
    const response = await fetch('http://api.weatherapi.com/v1/current.json?key=8dca48b06bb14095a46133028220506&q=Moscow&aqi=no&lang=ru');
    const json = await response.json();
    return json;
  }

  const newItem = () => {
    if(item !== '') {
      const newItem = {
        id: Date.now(),
        item: item
      }
      setItems((items) => [...items, newItem]);
      setItem(''); 
    } else {
      alert('Пустое значение!');
      setItem('');
    }
  }

  const dataWeatherToShow = (json) => {
    const {
      current: {
        gust_kph,
        wind_dir,
        temp_c,
        humidity,
        condition: {
          text,
          icon
        }
      },
      location: {
        name,
        country,
        region
      }
    } = json;
      return (<div>
        <h2 className='infoWeather'>Регион: {region}</h2>
        <h2 className='infoWeather'>Погода: {text}</h2>
        <img className='imagWeather' src={icon}></img>
        <h2 className='infoWeather'>Температура: {temp_c}°</h2>
        <h2 className='infoWeather'>Влажность: {humidity}</h2>
      </div> )
    
  }

  if (isLoaded) {
    return (
      <div className="App">
  
        <div className='todo'>
        <center className='todo-title'>Мои задачи на сегодня</center>
          <div className='wrapper'>
            <input type="text" value={item} placeholder='Введите...' onChange={(ev)=> setItem(ev.target.value)}></input>
            <button className='enter' onClick={newItem}>Добавить</button>
          </div>
          <div className='listItems'>
            <div className='item'>
              {items.map((item) => {return (
                    <div className="conteiner">
                      <div className="info">{item.item}</div>
                      <button className="delete" onClick={() => DeleteItem(item.id)}>X</button>
                    </div>
              )})}
            </div>
          </div>
        </div>
  
  
        <div className='weather'>
          <h2 className='weather-title'>Погода на сегодня</h2>
            {
              dataWeatherToShow(dataWeather)
            }
        </div>
      </div>
    );
  } else {
    return (
      <div className='cont-loader'>
        <div className='loader'> </div>
      </div>
    )
  }
}

export default App;