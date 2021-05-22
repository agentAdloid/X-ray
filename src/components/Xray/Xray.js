
import React, {Component} from 'react';
import './Xray.css';
import Aux from '../../hoc/Aux';
import Button from '../../UI/Button';
export default class XRay extends Component{
    constructor(props){
        super(props);
        //console.log('hi');
        //console.log('bi');
        this.state = {
            transform: true,
            images: this.props.images,
            cursor: this.props.cursor || false,
            diameter: this.props.diameter || 150,
            beyond: this.props.beyond || false,
            width: null,
            height: null,
            dim: null,
            type: this.props.type || 'circle',
            sensor: {
                width: null,
                height: null,
                top: null,
                left: null
            },
            responsive: this.props.responsive || false,
            resize: this.props.resize || [
                {
                    screen: 1199,
                    diameter: 130
                },
                {
                    screen: 991,
                    diameter: 100
                },
                {
                    screen: 767,
                    diameter: 80
                },
                {
                    screen: 575,
                    diameter: 50
                }
            ],
            centerX: 0 ,
            centerY: 0
        };
        this.move = this.move.bind(this);
    }

    componentDidMount = () =>{
        this.updateWidthHeight();
        window.addEventListener('resize', this.updateWidthHeight);
    };

    /**
     * get diameter
     * @returns {*}
     */

    getDiameter = () => {
        let {diameter, resize} = this.state;
        let getMaxResWidth = this.getMaxResize(resize);
        let newDiameter = this.matchesWindow(resize);
        if(this.state.responsive){
            if(window.matchMedia(`(min-width: ${getMaxResWidth + 1}px)`).matches){
                return (newDiameter > diameter)?(newDiameter):(diameter);
            }else{
                return newDiameter;
            }
        }else{
            return diameter;
        }
    };

    /**
     * update width and height
     */

    updateWidthHeight = () => {
        let {beyond} = this.state;
        let naturalWidth = this.firstImg.naturalWidth;
        let naturalHeight = this.firstImg.naturalHeight;
        let percent = naturalWidth / naturalHeight;
        if(naturalHeight===0)
            percent = 1.61;
        let width = this.firstImg.clientWidth;
        let height = Math.round((width / percent));
        let dim = this.getDiameter();
        //console.log(window.screen.width);
        let centerX = 0;
        let centerY = 0;
        let sensor;
        if(beyond){
            sensor = {
                width: width + dim,
                height: height + dim,
                top: -(dim / 2),
                left: -(dim / 2)
            }
        }else{
            sensor = {
                width: width,
                height: height,
                top: 0,
                left: 0
            }
        }
        centerY = Math.round(height/2)+Math.round(dim/2);
        centerX = Math.round(width/2)+Math.round(dim/2);
        console.log(centerX + " cc " + centerY + percent);
        // console.log(width + ' ' + height + ' ' + dim);
        this.setState({
            width,
            height,
            dim,
            sensor,
            centerX,
            centerY
        });
    };

    /**
     * get max width for diameter
     * @param diameter
     * @returns {number|Screen}
     */

    getMaxResize = (diameter) => {
        let newDiameter = diameter[0].screen;
        for(let i = 0; i < diameter.length; i++){
            if(diameter[i].screen > newDiameter){
                newDiameter = diameter[i].screen;
            }
        }
        return newDiameter;
    };

    /**
     * @param diameter
     * @returns {number|Screen}
     */

    matchesWindow = (diameter) => {
        let newDiameter = diameter[0].diameter;
        for(let i = 0; i < diameter.length; i++){
            if(window.matchMedia(`(max-width: ${diameter[i].screen}px)`).matches){
                newDiameter = diameter[i].diameter;
            }
        }
        return newDiameter;
    };

    /**
     * hover sensor get position zoom and photo
     * @param event
     */

    HoverSensor = (event) => {

        let positionX = event.layerX ;
        let positionY = event.layerY ;
        console.log("x" + event.layerX);
        console.log("y" + event.layerY);
        let {sensor, dim, beyond} = this.state;

        let position = {
            startY: 0,
            endY: sensor.height,
            startX: 0,
            endX: sensor.width
        };

        let coefficient = dim / 2;

        let zoomPosition;

        if(beyond){
            zoomPosition = dim / 2;
        }else{
            zoomPosition = 0;
        }

        if((positionY >= position.startY + coefficient) && (positionY <= position.endY - coefficient)){
            this.zoom.style.top = `${positionY - coefficient - zoomPosition}px`;
            this.lastImg.style.top = `${-positionY + coefficient + zoomPosition}px`;
        }else if(positionY < position.startY + coefficient){
            this.zoom.style.top = `${position.startY - zoomPosition}px`;
            this.lastImg.style.top = `${position.startY + zoomPosition}px`;
        }else if(positionY > position.endY - coefficient){
            this.zoom.style.top = `${position.endY - dim - zoomPosition}px`;
            this.lastImg.style.top = `${-position.endY + dim + zoomPosition}px`;
        }

        if((positionX >= position.startX + coefficient) && (positionX <= position.endX - coefficient)){
            this.zoom.style.left = `${positionX - coefficient - zoomPosition}px`;
            this.lastImg.style.left = `${-positionX + coefficient + zoomPosition}px`;
        }else if(positionX < position.startX + coefficient){
            this.zoom.style.left = `${position.startX - zoomPosition}px`;
            this.lastImg.style.left = `${position.startX + zoomPosition}px`;
        }else if(positionX > position.endX - coefficient){
            this.zoom.style.left = `${position.endX - dim - zoomPosition}px`;
            this.lastImg.style.left = `${-position.endX +  dim + zoomPosition}px`;
        }
        this.setState({centerX:event.layerX,centerY:event.layerY});
       // console.log(this.zoom.style.left + ' xx  ' + positionX + ' endxx' + position.endX);
        //console.log(this.zoom.style.top + ' yy ' + positionY + 'endyy' + position.endY);
    };

    /**
     * move mouse
     * @param event
     */

    move = (event) => {
        let {transform} = this.state;
        if(transform){
            this.setState({
                transform: false
            });
        }

        this.HoverSensor(event);
    };
    onLeftPress = () =>{
        if(this.state.centerX-Math.round(this.state.dim/2)<=0)
        {   return ;
        }
        this.move({
            layerX:this.state.centerX-10,
            layerY:this.state.centerY
            });
    }
    onRightPress = () =>{
        if(this.state.centerX >=Math.round(this.state.width)+Math.round(this.state.dim/2))
        {   return ;
        }
        this.move({
            layerX:this.state.centerX+10,
            layerY:this.state.centerY
            });
    }
    onTopPress = () =>{
        if(this.state.centerY-Math.round(this.state.dim/2)<=0)
        {   return ;
        }
        this.move({
            layerX:this.state.centerX,
            layerY:this.state.centerY-10
            });
    }
    onBottomPress = () =>{
        if(this.state.centerY >=Math.round(this.state.height)+Math.round(this.state.dim/2))
        {   return ;
        }
        this.move({
            layerX:this.state.centerX,
            layerY:this.state.centerY+10
                    });
    }
    render(){
        let {
            images,
            cursor,
            transform,
            width,
            height,
            dim,
            sensor,
            type
        } = this.state;
        let parentClass = (cursor)?('x-ray-photo-parent'):('x-ray-photo-parent cursor-none');
        let parentTransform = (transform)?('x-ray-last-photo transform'):('x-ray-last-photo');
        let lastImage = (transform)?('x-ray-last-photo-img transform'):('x-ray-last-photo-img');
        let lastStyle = {
            width: `${dim}px`,
            height: `${dim}px`
        };
        return(
            <Aux>
            <div className={parentClass}>
                <img
                    ref={(img)=>{
                        this.firstImg = img;
                        if(img!=null)
                        {   console.log(img.naturalHeight + ", " + img.naturalWidth + ',' +img.width);
                            console.log('firstImg is accesable');
                        }
                        //console.log("image1");
                        //if(img!=null)
                        // {console.log(this.firstImg.style.top);
                        // console.log(this.firstImg.style.left);
                        //}
                    }}
                    src={images[0]}
                    alt="first-photo"
                    className="x-ray-first-photo"
                />
                <div
                    ref={(zoom)=>{
                        this.zoom = zoom;
                        //console.log(zoom);
                    }}
                    className={parentTransform}
                    style={lastStyle}
                >
                    {
                        (type === 'magnifyingGlass')?(
                            <div className="magnifyingGlass"></div>
                        ):(null)
                    }
                    <div className="x-ray-last-photo-img-parent">
                        <img
                            ref={(img)=>{
                                this.lastImg = img;
                                ///console.log(img + "image2");
                            }}
                            style={{width: `${width}px`, height: `${height}px`}}
                            src={images[1]}
                            alt="last-photo"
                            className={lastImage}
                        />
                    </div>
                </div>
                {/* <div className="x-ray-sensor" style={sensor} onMouseMove={this.move}></div> */}
            </div>
            <div className="Buttons">
                <Button clicked={this.onLeftPress}>Left</Button>
                <Button clicked={this.onRightPress}>Right</Button>
                <Button clicked={this.onBottomPress}>Bottom</Button>
                <Button clicked={this.onTopPress}>Top</Button>
            </div>
            </Aux>
        );
    }
}