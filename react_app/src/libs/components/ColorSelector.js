import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Utils from '../utils/Utils';

export class ColorSelector extends Component {
    static defaultProps = {
        name: "",
        value: "", 
        options: [],
        flags: {},
        onChange: null,
    };
    
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.options = this.props.options;

        if (this.props.flags && this.props.flags.fetchFromTheme){
            let classes = Utils.getCSSClasses();
            for (let c of classes){
                for (let i in this.options){
                    let css = '.' + this.props.flags.prefix+this.options[i].value;
                    if (c.selectorText == css){
                        this.options[i].style = {backgroundColor: c.style.backgroundColor, color: c.style.color, borderColor: c.style.backgroundColor};
                    }
                }
            }
        }
    }
    
    render() {
        let that = this;
        let main = 
            <div className="color-selector">
                {this.options.map(function(item, index){
                    let result = null;
                    let props = {key:index,  onClick:() => that.onChange(item.value), size:'sm', title:item.text, className:'m-1', style: item.style};
                    let child = that.props.value === item.value && <FontAwesomeIcon  icon={faCheck} />;

                    if(item.value === "white"){
                        result = <Button {...props} variant="light" className="bg-white" >{child}</Button>
                    }
                    else{
                        result =<Button {...props} variant={item.value}>{child}</Button>
                    }

                    return result;
                })}
            </div>

        return (main);
    }   

    onChange(variant){
        let event = {target: {name: this.props.name, value: (this.props.value === variant ? "" : variant)}}

        this.props.onChange(event);
    }
}
