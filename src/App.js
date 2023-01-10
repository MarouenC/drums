import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      power: true,
      kit: acousticKit,
      volume: 10,
      display: ""
    };
    this.handlePower = this.handlePower.bind(this);
    this.handleKit = this.handleKit.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.handleDisplay = this.handleDisplay.bind(this);
    this.playSound = this.playSound.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.activatePad = this.activatePad.bind(this);

    this.keys = [];
    this.state.kit.map(obj => {
      this.keys.push(obj.key);
    });
  }
  
  handlePower() {
    if (this.state.power) {
      this.setState({
        power: !this.state.power,
        display: ""
      });
    }
    this.setState({
      power: !this.state.power
    });
  };
  handleKit() {
    const color = this.state.kit === acousticKit ? "#1151B0" : "#A45417";
    document.querySelector(":root").style.setProperty("--theme-color", color);
    
    if (this.state.kit === acousticKit) {
      this.setState({
        kit: houseKit,
        display: "House Kit"
      });
    } else {
      this.setState({
        kit: acousticKit,
        display: "Acoustic Kit"
      });
    }
  };
  handleVolume(e) {
    this.setState({
      volume: e.target.value,
      display: "Volume: " + e.target.value
    });
    setTimeout(() => this.handleDisplay(""), 1000);
  };
  handleDisplay(text) {
    this.setState({
      display: text
    });
  };
  activatePad(key) {
    const node = document.getElementById(key).parentElement;
    if (this.state.power) { 
      node.classList.add("active");
      node.classList.add("on");
      setTimeout(() => {
        node.classList.remove("active");
        node.classList.remove("on");
      }, 150);
    } else {
      node.classList.add("active");
      setTimeout(() => {
        node.classList.remove("active");
      }, 150);
    }
  };
  playSound(sound) {
    sound.volume = this.state.volume * 0.01;
    sound.currentTime = 0;
    sound.play();
  };
  onKeyPress(e) {    
    const key = e.key.toUpperCase();
    
    if (this.state.power && this.keys.includes(key)) {
      const node = document.getElementById(key);
      this.playSound(node);
      this.activatePad(key);
      this.setState({
        display: this.state.kit.find(obj => obj.key === key).id
      });
    } else if (this.keys.includes(key)) {
      this.activatePad(key);
    }
  }

  render(){
    return (
      <main id="drum-machine" tabIndex="0" onKeyPress={this.onKeyPress}>
       <div id="container">
        <Drumkit 
            kit={this.state.kit} 
            power={this.state.power}
            volume={this.state.volume}
            handleDisplay={this.handleDisplay}
            playSound={this.playSound}
            activatePad={this.activatePad} />
        <div id="control-panel">
          <Switch 
            name="Power"
            handlePower={this.handlePower}
            power={this.state.power} />
          <Display  
            display={this.state.display}
            power={this.state.power}/>
          <Volume 
           level={this.state.volume}
           handleDisplay={this.handleDisplay}
           handleVolume={this.handleVolume}
           power={this.state.power} />
          <Switch 
           name="Kit"
           handleKit={this.handleKit}
           handleDisplay={this.handleDisplay}
           kit={this.state.kit}
           power={this.state.power}/>
        </div>
       </div>
      </main>
    );
  }
}
const Drumkit = (props) =>{
  return (
    <div id="pad-container">
    {props.kit.map(obj => 
      <Drumpad 
        letter={obj.key}
        id={obj.id}
        sound={obj.URL}
        onClick={props.playSound}
        power={props.power}
        handleDisplay={props.handleDisplay}
        activatePad={props.activatePad}
      />
    )}
  </div>
);
}
const Drumpad =(props)=>{
  return(
    <button 
    id={props.id.replaceAll(" ", "-").toLowerCase()}
    className="drum-pad"
    onClick={() => {
      if (props.power) {
        props.onClick(document.getElementById(props.letter));
        props.handleDisplay(props.id);
        props.activatePad(props.letter);
      } else {
        props.activatePad(props.letter);
      }
    }}
  >
    {props.letter}
    <audio id={props.letter} src={props.sound} className="clip"></audio>
  </button>
);
}
const Switch = (props) => {
  return (
    <div className="control-node">
      <h4>{props.name}</h4>
      <label className="switch">
        <input 
          type="checkbox" 
          onChange={props.name === "Power" ? props.handlePower : props.power ? props.handleKit : null} 
          checked={props.name === "Power" ? props.power : props.kit === acousticKit ? false : true}
          />
        <span 
          id={props.name.toLowerCase()} 
          className={"toggle " + props.name.toLowerCase()}
        ></span>
      </label>
    </div>
  );
}
const Display = (props) => {
  return (
    <div id="display" className="display-feedback">
      {props.display}
    </div>  
  );
}
const Volume = (props) => {
  return (
    <input 
      className="volume" 
      id="volume"
      type="range" 
      min="0" 
      max="100" 
      value={props.level} 
      onChange={props.power ? props.handleVolume : null}
    />
  );
}
const acousticKit = [
  {
    key: "Q",
    id: "Tom 1",
    URL: "https://acoustic-kit.s3.amazonaws.com/Tom4-5.wav"
  },
  {
    key: "W",
    id: "Tom 2",
    URL: "https://acoustic-kit.s3.amazonaws.com/Tom4-8.wav"
  },
  {
    key: "E",
    id: "Snare Rim",
    URL: "https://acoustic-kit.s3.amazonaws.com/Rimshot2-4.wav"
  },
  {
    key: "A",
    id: "Cowbell",
    URL: "https://acoustic-kit.s3.amazonaws.com/Cowbell2.wav"
  },
  {
    key: "S",
    id: "Snare",
    URL: "https://acoustic-kit.s3.amazonaws.com/Snare2-7.wav"
  },
  {
    key: "D",
    id: "Triangle",
    URL: "https://acoustic-kit.s3.amazonaws.com/Triangle-5.wav"
  },
  {
    key: "Z",
    id: "Floor Tom",
    URL: "https://acoustic-kit.s3.amazonaws.com/Tom5-9.wav"
  },
  {
    key: "X",
    id: "Kick",
    URL: "https://acoustic-kit.s3.amazonaws.com/Kick8-5.wav"
  },
  {
    key: "C",
    id: "Closed HH",
    URL: "https://acoustic-kit.s3.amazonaws.com/Hat6-16.wav"
  }
];

const houseKit = [
  {
    key: "Q",
    id: "Percussion 1",
    URL: "https://house-kit.s3.amazonaws.com/House+Percussion+06.wav"
  },
  {
    key: "W",
    id: "Percussion 2",
    URL: "https://house-kit.s3.amazonaws.com/House+Percussion+26.wav"
  },
  {
    key: "E",
    id: "Percussion 3",
    URL: "https://house-kit.s3.amazonaws.com/House+Percussion+31.wav"
  },
  {
    key: "A",
    id: "Bell",
    URL: "https://house-kit.s3.amazonaws.com/House+Cymbal+17.wav"
  },
  {
    key: "S",
    id: "Clap",
    URL: "https://house-kit.s3.amazonaws.com/House+Clap+16.wav"
  },
  {
    key: "D",
    id: "Snap",
    URL: "https://house-kit.s3.amazonaws.com/House+Snap+01.wav"
  },
  {
    key: "Z",
    id: "Zing",
    URL: "https://house-kit.s3.amazonaws.com/House+SFX+05.wav"
  },
  {
    key: "X",
    id: "Bass",
    URL: "https://house-kit.s3.amazonaws.com/House+Kick+02.wav"
  },
  {
    key: "C",
    id: "House HH",
    URL: "https://house-kit.s3.amazonaws.com/House+HiHat+19.wav"
  }
];

export default App;
