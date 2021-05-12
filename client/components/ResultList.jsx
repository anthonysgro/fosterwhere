import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { updateTransitGraph } from "../store/action-creators";

// Helper Fn import
import { dndObjectBuilder } from "../helper-functions";
import cloneDeep from "lodash";
import COLORS from "./Map/colors";

// Component Imports
import { Column } from "./DragNDrop";
import { DragDropContext } from "react-beautiful-dnd";

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
        };

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        const { subGraphs } = this.props;
        const setupSubGraphs = subGraphs.map((arrOfOne) =>
            cloneDeep(arrOfOne[0]),
        );
        const initialData = dndObjectBuilder(setupSubGraphs);

        this.setState({
            data: initialData,
            loading: false,
        });
    }

    onDragEnd(result) {
        const { destination, source, draggableId } = result;

        // If user didn't drop in a droppable, or in the same location, do nothing
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const { data, subGraphs } = this.props;

        // If dropping onto the same employee
        if (source.droppableId === destination.droppableId) {
            console.log(droppableId);
        } else {
        }

        // const { data } = this.state;

        // // If dropping onto the same employee
        // if (source.droppableId === destination.droppableId) {
        //     const employee = data.employees[source.droppableId];
        //     let newClientIds = Array.from(employee.clientIds);
        //     newClientIds.splice(source.index, 1);
        //     newClientIds.splice(destination.index, 0, draggableId);

        //     const newEmployee = {
        //         ...employee,
        //         clientIds: newClientIds,
        //     };

        //     this.setState({
        //         ...this.state,
        //         data: {
        //             ...data,
        //             employees: {
        //                 ...data.employees,
        //                 [employee.id]: newEmployee,
        //             },
        //         },
        //     });
        // } else {
        //     const fromEmployee = data.employees[source.droppableId];
        //     const toEmployee = data.employees[destination.droppableId];
        //     let newFromClientIds = Array.from(fromEmployee.clientIds);
        //     let newToClientIds = Array.from(toEmployee.clientIds);
        //     newFromClientIds.splice(source.index, 1);
        //     newToClientIds.splice(destination.index, 0, draggableId);

        //     const newFromEmployee = {
        //         ...fromEmployee,
        //         clientIds: newFromClientIds,
        //     };

        //     const newToEmployee = {
        //         ...toEmployee,
        //         clientIds: newToClientIds,
        //     };

        //     this.setState({
        //         ...this.state,
        //         data: {
        //             ...data,
        //             employees: {
        //                 ...data.employees,
        //                 [newFromEmployee.id]: newFromEmployee,
        //                 [newToEmployee.id]: newToEmployee,
        //             },
        //         },
        //     });
        // }
    }

    render() {
        const { data, loading } = this.state;

        if (loading) return "";

        return (
            <div id="result-container">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {data.employeeOrder.map((employeeId, idx) => {
                        const column = data.employees[employeeId];
                        const clients = column.clientIds.map(
                            (clientId) => data.clients[clientId],
                        );
                        return (
                            <Column
                                key={column.id}
                                column={column}
                                clients={clients}
                                color={COLORS[idx]}
                            />
                        );
                    })}
                </DragDropContext>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        subGraphs: state.graphs.subGraphs.json,
    };
}

function mapDispatchToProps(disaptch) {
    return {
        updateTransitGraph: () => dispatch(updateTransitGraph()),
    };
}

export default connect(mapStateToProps)(ResultList);
