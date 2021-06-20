import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { updateTransitGraph } from "../store/action-creators";

// Helper Fn import
import {
    dndObjectBuilder,
    lowestTimeNonBalanced,
    graphToJson,
} from "../helper-functions";
import { cloneDeep } from "lodash";
import COLORS from "./Map/colors";

// Component Imports
import { Roller } from "react-awesome-spinners";
import { Column } from "./DragNDrop";
import { DragDropContext } from "react-beautiful-dnd";

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
            unassigned: [],
            totalEntries: NaN,
        };

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        const { subGraphs, data } = this.props;
        const setupSubGraphs = subGraphs.map((arrOfOne) =>
            cloneDeep(arrOfOne[0]),
        );

        setupSubGraphs.sort((a, b) => a.id - b.id);

        const initialData = dndObjectBuilder(setupSubGraphs);

        this.setState({
            data: initialData,
            loading: false,
            totalEntries: data.length,
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.subGraphs !== this.props.subGraphs) {
            console.log("hiiiii");
            const { subGraphs, data, fullGraphStructure, fullGraph } =
                this.props;

            // Run the lowestTimeNonBalanced Algo to find closest worker
            const result = lowestTimeNonBalanced(fullGraphStructure);

            // Parse out the subgraphs in json
            let employees = [];
            for (const sub of result.subGraphs) {
                employees.push(...graphToJson(sub, data));
            }

            let includedIds = [];
            for (const [{ clients }] of subGraphs) {
                for (const { id } of clients) {
                    includedIds.push(id);
                }
            }

            // Find unassigned clients
            let unassigned = [];
            for (const client of fullGraph[0].clients) {
                if (
                    !includedIds.includes(client.id) &&
                    client.type === "client"
                ) {
                    let closestWorker = null;
                    let thisCommute = NaN;

                    for (const employee of employees) {
                        for (const thisClient of employee.clients) {
                            if (thisClient.id === client.id) {
                                closestWorker = employee;
                                thisCommute = thisClient.thisCommute;
                            }
                        }
                    }

                    unassigned.push({ ...client, closestWorker, thisCommute });
                }
            }

            const setupSubGraphs = subGraphs.map((arrOfOne) =>
                cloneDeep(arrOfOne[0]),
            );

            setupSubGraphs.sort((a, b) => a.id - b.id);

            const initialData = dndObjectBuilder(setupSubGraphs);

            this.setState({
                ...this.state,
                data: initialData,
                unassigned,
            });
        }
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

        subGraphs.sort((a, b) => a.id - b.id);

        const refitSubGraphs = subGraphs.map((sub) => [sub]);

        this.props.updateTransitGraph(refitSubGraphs);

        const newData = dndObjectBuilder(cloneDeep(subGraphs));

        this.setState({
            data: newData,
            loading: false,
        });
    }

    render() {
        const { data, loading, unassigned, totalEntries } = this.state;

        if (loading) return <Roller color="#ffffff" sizeUnit="px" />;
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
                    <Column
                        key={data.employees.length}
                        column={{
                            name: "Unassigned",
                            id: totalEntries.toString(),
                        }}
                        color={{ employee: "#7a7879", client: "#b5b3b4" }}
                        clients={unassigned}
                    />
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
        fullGraphStructure: state.graphs.fullGraph.structure,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateTransitGraph: (subGraphJson) =>
            dispatch(updateTransitGraph(subGraphJson)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultList);
