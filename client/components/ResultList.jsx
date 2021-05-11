import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

// Helper Fn import
import { lowestTimeNonBalanced } from "../helper-functions";

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
        };
    }

    componentDidMount() {
        const { data } = this.props;

        this.setState({
            data: data,
            loading: false,
        });
    }

    render() {
        const { data, loading } = this.state;

        if (loading) return "";

        // console.log(data);

        return (
            <div id="result-container">
                {data.map((employee) => (
                    <ul key={employee.id} className="employee-list">
                        <li className="result-headers">
                            <p></p>
                            <p>Name</p>
                            <p>Commute</p>
                        </li>
                        <li className="employee-container">
                            <p className="employee-name">{employee.name}</p>
                            <p className="employee-commute">
                                {parseInt(employee.commute)} min
                            </p>
                        </li>
                        {employee.clients.map((client) => (
                            <li key={client.id} className="client-container">
                                <p className="client-name">{client.name}</p>
                                <p className="client-commute">
                                    {parseInt(client.thisCommute)} min
                                </p>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.employeeMap.optimizedMap,
    };
}

export default connect(mapStateToProps)(ResultList);
