import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { updateTransitGraph } from "../store/action-creators";

// Helper Fn import
import { dndObjectBuilder } from "../helper-functions";
import { cloneDeep } from "lodash";
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

        const { data } = this.props;
        const subGraphs = this.props.subGraphs.map((arrOfOne) =>
            cloneDeep(arrOfOne[0]),
        );

        let dataMap = new Map();
        for (const entry of subGraphs) {
            dataMap.set(`${entry.id}`, entry);
            for (const client of entry.clients) {
                dataMap.set(`${client.id}`, client);
            }
        }

        // If dropping onto the same employee
        if (source.droppableId === destination.droppableId) {
            const employee = dataMap.get(source.droppableId);
            const client = dataMap.get(draggableId);

            let newClients = Array.from(employee.clients);
            newClients.splice(source.index, 1);
            newClients.splice(destination.index, 0, client);

            const newEmployee = {
                ...employee,
                clients: newClients,
            };

            const subGraphIndex = subGraphs.indexOf(
                subGraphs.filter((emp) => emp.id === employee.id)[0],
            );

            subGraphs.splice(subGraphIndex, 1, newEmployee);
        } else {
            const { fullGraph } = this.props;

            const fromEmployee = dataMap.get(source.droppableId);
            const toEmployee = dataMap.get(destination.droppableId);
            const client = dataMap.get(draggableId);

            // Gets client data form the "toEmployee" pov
            const toEmployeeClientData = fullGraph
                .filter((emp) => emp.id === toEmployee.id)[0]
                .clients.filter((cli) => cli.id === client.id)[0];

            // Replaces the client with this guy
            const newClient = cloneDeep(toEmployeeClientData);

            let newFromClients = Array.from(fromEmployee.clients);
            let newToClients = Array.from(toEmployee.clients);

            newFromClients.splice(source.index, 1);
            newToClients.splice(destination.index, 0, newClient);

            const fromDistance =
                parseFloat(fromEmployee.totalCommute) -
                parseFloat(client.thisCommute);

            const newFromEmployee = {
                ...fromEmployee,
                totalCommute: fromDistance.toFixed(2),
                clients: newFromClients,
            };

            const toDistance =
                parseFloat(toEmployee.totalCommute) +
                parseFloat(newClient.thisCommute);

            const newToEmployee = {
                ...toEmployee,
                totalCommute: toDistance.toFixed(2),
                clients: newToClients,
            };

            const subGraphIndexFrom = subGraphs.indexOf(
                subGraphs.filter((emp) => emp.id === fromEmployee.id)[0],
            );
            const subGraphIndexTo = subGraphs.indexOf(
                subGraphs.filter((emp) => emp.id === toEmployee.id)[0],
            );

            subGraphs.splice(subGraphIndexFrom, 1, newFromEmployee);
            subGraphs.splice(subGraphIndexTo, 1, newToEmployee);
        }

        const refitSubGraphs = subGraphs.map((sub) => [sub]);

        this.props.updateTransitGraph(refitSubGraphs);

        const newData = dndObjectBuilder(cloneDeep(subGraphs));

        this.setState({
            data: newData,
            loading: false,
        });
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
        fullGraph: state.graphs.fullGraph.json,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateTransitGraph: (subGraphJson) =>
            dispatch(updateTransitGraph(subGraphJson)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultList);
