import React, {Component} from 'react';
import Main from './Main';
import './Main.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            started: false,
        };
    }

    componentDidMount() {
        document.title = "MP2 - Xiao Geng";
    }

    render() {
        if (this.state.started)
            return <Main/>;
        return (
            <div className="App">
                <div className="center">
                    <h1>ENGL 131 Major Project 2</h1>
                    <p>Xiao Geng</p>
                    <p>Laura J. Griffith</p>
                    <p>13 February 2019</p>
                    <div className="btn-container">
                        <button className="start-btn" onClick={() => this.setState({started: true})}>Start</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
