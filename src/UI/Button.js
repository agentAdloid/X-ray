import React from 'react';

import './Button.css';

const button = (props) => (
    <div className="Button">
    <button
        onClick={props.clicked}>{props.children}</button>
    </div>
);

export default button;