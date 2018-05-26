import React, {Component} from 'react';
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import WeatherIcon from 'material-ui/svg-icons/image/wb-sunny'
import TemperatureIcon from 'material-ui/svg-icons/editor/show-chart'
import './Weather.css';

class WeatherPage extends Component {
  constructor(props) {
    super(props)
    this.state = {placeName: null, weather: null, temperature: null, loading: false}
    this.Places = [
      {name: '東京', id: 1850147},
      {name: '石川', id: 1861387},
      {name: '金沢', id: 1860243},
      {name: '野々市', id: 1854979}
    ]
    // weatherMap clientId
    this.OpenWeatherMapKey = 'your weatherMap client id'
  }

  selectPlace(index) {
    if (index > 0) {
      const place = this.Places[index - 1]
      this.setState({placeName: place.name, weather: null, temperature: null, loading: true})
      this.getWeather(place.id)
    }
  }

  getWeather(id) {
    const delay = (mSec) => new Promise((resolve) => setTimeout(resolve, mSec))
    fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${this.OpenWeatherMapKey}&id=${id}&lang=ja&units=metric`)
      .then((response) => response.json())
      .then((json) => {
        delay(700)
          .then(() => this.setState({
            weather: json.weather[0].description,
            temperature: json.main.temp,
            loading: false
          }))
      })
      .catch((response) => {
        this.setState({loading: false})
        console.log('== ERROR ==', response)
      })
  }

  render() {
    return (
      <MuiThemeProvider>
        <Card style={{margin: 30}}>
          <CardHeader title={<Title place={this.state.placeName}/>}/>
          <CardText style={{position: 'relative'}}>
            <RefreshIndicator status={this.state.loading ? 'loading' : 'hide'} top={40} left={100}
                              loadingColor="#2196f3"/>
            <WeatherInfomation weather={this.state.weather} temperature={this.state.temperature}/>
          </CardText>
          <CardActions>
            <PlaceSelector places={this.Places} actionSelect={(ix) => this.selectPlace(ix)}/>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    )
  }
}

const Title = (props) => (
  <h1>{props.place ? props.place + 'の天気' : '天気情報'}</h1>
)

Title.propTypes = {
  place: PropTypes.string
}

const WeatherInfomation = (props) => {
  return (
    <List>
      <ListItem leftIcon={<WeatherIcon/>} primaryText={props.weather}/>
      <ListItem leftIcon={<TemperatureIcon/>} primaryText={props.temperature ? `${props.temperature}℃` : ''}/>
    </List>
  )
}

WeatherInfomation.propTypes = {
  weather: PropTypes.string,
  temperature: PropTypes.number
}

const PlaceSelector = (props) => (
  <DropDownMenu value={-1} onChange={(event, index) => props.actionSelect(index)}>
    <MenuItem value={-1} primaryText="場所を選択"/>
    {props.places.map((place, ix) => <MenuItem key={ix} value={ix} primaryText={place.name}/>)}
  </DropDownMenu>
)

PlaceSelector.propTypes = {
  places: PropTypes.array,
  actionSelect: PropTypes.func
}

export default WeatherPage