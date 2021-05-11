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

        return "hi";
        // <div>
        //     {data.map((employee) => (
        //         <ul key={employee.id}>
        //             <li>{employee.name}</li>
        //             {employee.clients.map((client) => (
        //                 <li key={client.id}>{client.name}</li>
        //             ))}
        //         </ul>
        //     ))}
        // </div>
    }
}

function mapStateToProps(state) {
    return {
        data: state.employeeMap.optimizedMap,
    };
}

export default connect(mapStateToProps)(ResultList);
