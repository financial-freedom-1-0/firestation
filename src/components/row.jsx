import React from 'react';
import ReactDOM from 'react-dom';

var elemental = require('elemental');
var Button = elemental.Button;

import configuration from '../../firestation.config.js';

import {ImageCell, TextCell, SelectCell} from './cells.jsx';

export default React.createClass({
    getInitialState: function () {
        return {
            changed: false
        }
    },
    componentWillMount: function () {
        this.deltaVal = {};
    },
    save: function () {
        console.log('Saving', this.props.key);

        var key = this.props.item.key;
        var ref = configuration.ref.child(this.props.child).child(key);

        // Only update modified keys
        ref.update(this.deltaVal);

        this.setState({
            changed: false
        });
    },
    saveClick: function () {
        this.save();
    },
    valueChanged: function (key, value) {
        console.log('value changed!')
        this.deltaVal[key] = value;
        this.setState({
            changed: true
        });
    },
    render: function () {
        var childConfiguration = configuration.children[this.props.child];
        var columns = [];

        for (var i = 0; i < childConfiguration.length; i++) {
            var config = childConfiguration[i];
            var KeyCell = config.cell;
            var value = this.props.item.val[config.key];

            var col;

            if (config.cellProps !== undefined) {
                col = (
                    <td key={i} >
                        <KeyCell value={value} childKey={config.key} valueChanged={this.valueChanged} extras={config.cellProps} />
                    </td>
                )
            } else {
                col = (
                    <td key={i} >
                        <KeyCell value={value} childKey={config.key} valueChanged={this.valueChanged} />
                    </td>
                )
            };

            columns.push(col);
        };

        return (
            <tr>
                <td>
                    <label>
                        <input type="checkbox" />
                    </label>
                </td>
                {columns}
                <td>
                    <Button type="primary" onClick={this.saveClick} disabled={!this.state.changed}>Save</Button>
                </td>
            </tr>
        );
    }
});