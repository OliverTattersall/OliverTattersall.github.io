import React, {Component} from 'react';
import './Node.css'

export default class Node extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        // issue with property passing on using list form
        const {isStart} = this.props
        const {isFinish} = this.props;
        let test = this.props;
        if(test['children'][1]===5){
            console.log(test)
            console.log(test['children'][3], isStart)
            // console.log({isStart} = test)
        }
        // console.log(isStart, isFinish)
        const extraClassName =
        test['children'][5]? 'node-finish' 
        : test['children'][3]? 'node-start'
        : '';
        return <div className={`node ${extraClassName}`}></div>;
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col: 0,
}