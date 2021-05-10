import React, { Component } from 'react';
import { FormControl, Container, Row, Col } from 'react-bootstrap';
//import { isNumber } from 'util';

export class MinValueMax extends Component {
    static defaultProps = {
        values: {},
        valueName: 'Value',
        placeholder: "",
        onChange: null,
        onKeyDown: null,
        autoFocus: false,
        autoSelect: false,
        onCommit: null,
        disabled: false,
        size: ""
    };

    constructor(props){
        super(props);
        
        this.onCommit = this.onCommit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.state = {values: {}};    
        if (this.props.values){
            if (this.props.values['min']){
                this.state.values['min'] = this.props.value['min'];
            }
            if (this.props.values['value']){
                this.state.values['value'] = this.props.value['value'];
            }
            if (this.props.values['max']){
                this.state.values['max'] = this.props.value['max'];
            }
        }
    }
    
    render() {       
        let main = <Container>
            <h5>{this.props.valueName}</h5>
        <Row>
          <Col>Minimum<br/><FormControl autoFocus={this.props.autoFocus} className={"InputMinValueMax"} name="min" type="text" 
                    value={this.state.values['min']} placeholder={this.props.placeholder} onChange={this.onChange} onBlur={this.onFocusOut} onKeyDown={this.onKeyDown}
                    disabled={this.props.disabled} size={this.props.size}/></Col>
          <Col>{this.props.valueName}<br/><FormControl autoFocus={this.props.autoFocus} className={"InputMinValueMax"} name="value" type="text" 
                    value={this.state.values['value']} placeholder={this.props.placeholder} onChange={this.onChange} onBlur={this.onFocusOut} onKeyDown={this.onKeyDown}
                    disabled={this.props.disabled} size={this.props.size}/></Col>
          <Col>Maximum<br/><FormControl autoFocus={this.props.autoFocus} className={"InputMinValueMax"} name="max" type="text" 
                    value={this.state.values['max']} placeholder={this.props.placeholder} onChange={this.onChange} onBlur={this.onFocusOut} onKeyDown={this.onKeyDown}
                    disabled={this.props.disabled} size={this.props.size}/></Col>
        </Row>
      </Container>;
        return (main);
    }   
    
    onChange(event){
        let values = this.state.values;
        values[event.target.name] = event.target.value;
        this.setState({values: values});
    }   
    
    onCommit(callback){
        callback = callback || null;
        
        let values = this.state.values;
        
        let eventData = {
            target: {name: this.props.valueName, value: values}  
        };
        
        this.setState({dataChanged: false}, () => {
            if (this.props.onChange) this.props.onChange(eventData);
            if (this.props.onCommit) this.props.onCommit(eventData);
            if(callback !== null){callback();};
        });
    }

    onFocusOut(event){
        this.onCommit();
    }

    onKeyDown(event){   
        let that = this;
        // React cannot access the event in an asynchronous way
        // If you want to access the event properties in an asynchronous way, you should call event.persist() on the event
        event.persist();
        let callback = function(){
            if(that.props.onKeyDown !== null){
                that.props.onKeyDown(event);
            }
        }

        switch(event.key){
            case "Enter":
                this.onCommit(callback);
                break;        
            default:
        }        
    }
}
