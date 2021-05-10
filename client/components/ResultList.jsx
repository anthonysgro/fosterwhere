import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { data } = this.props;
        const employees = data.filter((item) => item.type === "employee");
        const clients = data.filter((item) => item.type === "client");

        return (
            <div>
                {employees.map((employee) => (
                    <ul key={employee.id}>
                        <li>{employee.name}</li>
                        {clients.map((client) => (
                            <li key={client.id}>{client.name}</li>
                        ))}
                    </ul>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
    };
}

export default connect(mapStateToProps)(ResultList);
