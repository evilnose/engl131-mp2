import React, {Component} from 'react'
import Controller from './Controller';
import './Main.css';
// import sceneMap from './sceneMap.json'

export default class Main extends Component {
    // props.choices is a list of objects { choiceText, targetScene, and onChoose }
    // if onChoose is null, we automatically redirect to targetScene, otherwise
    // call onChoose()
    constructor(props) {
        super(props);
        this.state = {
            ctrl: new Controller((ti) => {document.title = ti;}),
        };
    }

    callHandler(handlerFn) {
        handlerFn.call(this.state.ctrl);
        this.setState({
            ctrl: this.state.ctrl,
        });
    }

    render() {
        const choiceDivs = this.state.ctrl.choices.map((choice, idx) =>
            <li onClick={() => this.callHandler(choice.handler)} key={idx} className="choice">
                <p>{choice.text}</p>
            </li>);

        // const oldTexts = this.state.ctrl.oldText.map(ot =>
        //     <div className="oldTexts">
        //         <p dangerouslySetInnerHTML={{__html: ot}}/>
        //         <br/>
        //     </div>);

        return (
            <div>
                <div className="center">
                    <h1>{this.state.ctrl.sceneTitle}</h1>
                    <div className="texts">
                        {/*perhaps use react-scroll*/}
                        {/*<Fragment>*/}
                            {/*{oldTexts}*/}
                        {/*</Fragment>*/}
                        <p dangerouslySetInnerHTML={{__html: this.state.ctrl.sceneText}}/>
                    </div>
                    <ul className="choiceList">
                        {choiceDivs}
                    </ul>
                </div>
            </div>
        )
    }
}