import * as React from 'react';
export class Layout extends React.Component {
    static displayName = Layout.name;

    render() {
        return (
            <div className="container-fluid">
                {this.props.children}
            </div>
        );
    }
}
    