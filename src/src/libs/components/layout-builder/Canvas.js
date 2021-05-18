import React, { Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button, Modal, Form, Col } from 'react-bootstrap';
import {faObjectGroup, faEdit, faArrowsAlt, faArrowUp,faArrowDown, faTrashAlt, faClone, faSave, faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {HTMLElementData} from './HTMLElementData';

export class Canvas extends Component
{
    static defaultProps = {
        children: null,
        style: null
    };      

	render(){     
        let style = {margin: "auto", display: "flex"};
        style = this.props.style;

		let main = 
            <div style={style}>
                {this.props.children}
            </div>; 

		return (main);
    }
}

export class CanvasElement{
    static draggingItem = null;

    constructor(dom, onSelectCallback, onDropCallback){
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.onSelectCallback = onSelectCallback;
        this.onDropCallback = onDropCallback;

        this.dom = dom;
        this.dom.ondragover = this.onDragOver;
        this.dom.ondragenter = this.onDragEnter;
        this.dom.ondragleave = this.onDragLeave;
        this.dom.ondragstart = this.onDragStart;
        this.dom.ondrop = this.onDrop;
        this.dom.onclick = this.onClick;
        this.dom.onmouseover = this.onMouseOver;
        this.dom.onmouseout = this.onMouseOut;

        this.droppingZoneAfter = document.createElement("div");
        this.droppingZoneAfter.classList.add("dropping-zone");

        for(let child of this.dom.childNodes){
            new CanvasElement(child, this.onSelectCallback, this.onDropCallback);
        }
    }

    onClick(event){        
        event.preventDefault(); // Cancel the default action (in case of href)
        event.stopPropagation();

        if(!this.dom.hasAttribute("contenteditable")){
            this.onSelectCallback(this.dom);
        }
    }

    onDrop(event){
        // it needs to stop propagation otherwise it will dispatch onFillInSlot in cascade. We want just assign a section to one single slot.
        event.stopPropagation();   

        let eventData = event.dataTransfer.getData("componentData");
        
        let el = null;
        if(eventData.length > 0){
            let componentData = JSON.parse(eventData);
            el = HTMLElementData.createElement(componentData);
        }
        else if (CanvasElement.draggingItem !== null){
            el = CanvasElement.draggingItem;
            CanvasElement.draggingItem = null;
        }
        
        if(el !== null){
            new CanvasElement(el, this.onSelectCallback, this.onDropCallback);

            if(event.target.classList.contains('dropping-zone')){
                try{
                    event.target.replaceWith(el);
                }
                catch(err){
                    console.log(err)
                }
            }
            else if(event.currentTarget.tagName.toLowerCase() === "body"){
                //this.dom.appendChild(el);
                event.currentTarget.appendChild(el);
            }
            else{
                console.log(`Fail to drop: `, event.target);
            }
        }
        
        //let el = React.createElement(component.element, {});
        //ReactDOM.render(el, this.dom);

        this.onDropCallback(this.dom);     

        return false;
    } 
    
    onDragOver(event){
        event.preventDefault(); // Necessary to allows us to drop.
        if(!event.target.classList.contains('dropping-zone-hover') && event.target.classList.contains('dropping-zone')){
            event.target.classList.add('dropping-zone-hover');
        }
        return false;
    }

    onDragEnter(event){
        if((this.dom.firstElementChild !== null) && (this.dom.firstElementChild.classList.contains("dropping-zone"))){
            return;
        }

        if(this.dom.children.length > 0){
            this.dom.setAttribute("data-dragging", "1");
            this.dom.insertBefore(this.createDroppingZone(), this.dom.firstChild);    
        }

        this.dom.appendChild(this.createDroppingZone());
    }

    onDragLeave(event){
        //console.log('leave')
        //this.dom.classList.remove('dropping-zone');
        event.preventDefault();

        if(event.target.classList.contains('dropping-zone-hover')){
            event.target.classList.remove('dropping-zone-hover');
        }
    }

    onDragStart(event){
        event.stopPropagation();

        //let data = HTMLElementData.getElementData(null, this.dom);
        //event.dataTransfer.setData("componentData", JSON.stringify(data));
        CanvasElement.draggingItem = this.dom;
    }

    createDroppingZone(pos){
        let el = document.createElement("div");
        el.classList.add("dropping-zone");
        return el;
    }

    onMouseOver(event){
        event.stopPropagation();
        event.preventDefault();
        this.dom.setAttribute("data-hovering", "1");
    }

    onMouseOut(event){
        this.dom.removeAttribute("data-hovering");
    }
}

export class FloatingMenu extends Component{
    static defaultProps = {
        canvas: null,
        selectedElement: null,
        onDeleteElement: null,
        onRefresh: null,
        onSaveCustomComponent: null,
        onCreateCanvasElement: null
    };      

    constructor(props){
        super(props);

        this.onEdit = this.onEdit.bind(this);
        this.onMoveNodeUp = this.onMoveNodeUp.bind(this);
        this.onMoveNodeDown = this.onMoveNodeDown.bind(this);
        this.onCloneNode = this.onCloneNode.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onSaveCustomComponent = this.onSaveCustomComponent.bind(this);

        this.state = {showModal: false};
    }

    render(){
        if(this.props.canvas === null){ return null;}
        if(this.props.canvas.current === null){ return null;}
        if(this.props.selectedElement === null){ return null;}
        let style = {display: 'block', top: 0, left: 0};

        let posCanvas = this.props.canvas.current.getBoundingClientRect();
        let posEl = this.props.selectedElement.getBoundingClientRect();

        style.top = Math.max(posCanvas.top + posEl.top - 32, 0);
        style.left = posCanvas.left + posEl.left;

        let main = 
            <div className='floating-menu' style={style}>
                <ButtonToolbar aria-label="Toolbar with Button groups">
                    <ButtonGroup size="sm">
                        <Button onClick={this.onEdit}><FontAwesomeIcon  icon={faEdit} title="Éditer"/></Button>
                        <Button onClick={() => this.showModal(true)}><FontAwesomeIcon icon={faObjectGroup} title="Créer un composant"/></Button>
                        <Button onClick={this.onMoveNodeUp}  disabled={this.props.selectedElement.previousSibling === null}><FontAwesomeIcon icon={faArrowUp} title="Déplacer l'élément vers le haut"/></Button>
                        <Button onClick={this.onMoveNodeDown} disabled={this.props.selectedElement.nextSibling === null}><FontAwesomeIcon icon={faArrowDown} title="Déplacer l'élément vers le bas"/></Button>
                        <Button onClick={this.onCloneNode}><FontAwesomeIcon icon={faClone} title="Dupliquer"/></Button>
                        <Button onClick={() => this.props.onDeleteElement()}><FontAwesomeIcon  icon={faTrashAlt} title="Supprimer"/></Button>
                    </ButtonGroup>
                </ButtonToolbar>
                {this.state.showModal && <CustomComponentForm onClose={() => this.showModal(false)} onSave={this.onSaveCustomComponent}/>}
            </div>
        return main;
    }

    onMoveNodeUp(){
        let parent = this.props.selectedElement.parentElement;
        let previousSibling = this.props.selectedElement.previousSibling;
        parent.insertBefore(this.props.selectedElement, previousSibling);
        this.props.onRefresh();
    }

    onMoveNodeDown(){
        let parent = this.props.selectedElement.parentElement;
        let nextSibling = this.props.selectedElement.nextSibling;
        parent.insertBefore(nextSibling, this.props.selectedElement);
        this.props.onRefresh();
    }

    onEdit(){
        this.props.selectedElement.setAttribute('contenteditable', 'true');
        this.setCaretToEnd(this.props.selectedElement);
    }

    setCaretToEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
      
        // set scroll to the end if multiline
        el.scrollTop = el.scrollHeight; 
      }

    onCloneNode(){
        let parent = this.props.selectedElement.parentElement;
        let el = this.props.selectedElement.cloneNode(true)
        el.removeAttribute("data-selected");
        el.removeAttribute("contenteditable");
        parent.appendChild(el);
        this.props.onCreateCanvasElement(el);
    }

    showModal(show){
        this.setState({showModal: show});
    }

    onSaveCustomComponent(data){
        this.props.onSaveCustomComponent(data);
        this.showModal(false);
    }
}

class CustomComponentForm extends Component{
    static defaultProps = {
        onClose: null,
        onSave: null
    };    

    constructor(props){
        super(props);

        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: {section: "", name: ""}};
    }

    render(){
        let main = 
            <Modal show={true} onHide={this.props.onClose} backdrop="static" keyboard={false} >
                <Modal.Header closeButton>
                    <Modal.Title>Créer un nouveau composant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Section"}</Form.Label>
                                <Form.Control type="text" required value={this.state.data.section} name="section" onChange={this.onDataChange}/>
                            </Form.Group>                           
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Nom"}</Form.Label>
                                <Form.Control type="text" required value={this.state.data.name} name="name" onChange={this.onDataChange}/>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onClose}><FontAwesomeIcon  icon={faTimes} title="Annuler"/>{" "}Annuler</Button>
                    <Button variant="success" onClick={() => this.props.onSave(this.state.data)}><FontAwesomeIcon  icon={faSave} title="Enregistrer"/>{" "}Enregistrer</Button>
                </Modal.Footer>
            </Modal>

        return main;
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }
}