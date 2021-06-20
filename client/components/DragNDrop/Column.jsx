import React, { Component } from "react";

// Styles
import styled from "styled-components";

// Component Imports
import { Task } from "./index";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
    margin: 8px;
    border: 1px solid grey;
    border-radius: 2px;
    width: 12rem;
    background-color: ${({ color }) => color.employee};
`;
const Title = styled.h3`
    padding: 8px;
    text-align: center;
    background-color: ${({ color }) => color.client};
`;
const SubHeader = styled.h4`
    font-size: 16;
    margin: 2px;
    text-align: center;
`;

const TaskList = styled.div`
    padding: 8px;
`;

const Small = styled.h5`
    padding: 2px;
    text-align: center;
    text-transform: capitalize;
    margin: 6px 0px 0px 0px;
`;

class Column extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { column, clients, color } = this.props;
        return (
            <Container color={color}>
                <Title color={color}>{column.name}</Title>
                {column.totalCommute ? (
                    <SubHeader>{column.totalCommute} min</SubHeader>
                ) : (
                    <SubHeader>{clients.length} unassigned clients</SubHeader>
                )}
                {column.method ? (
                    <Small className="employee-method">{column.method}</Small>
                ) : (
                    <Small>Dragging coming soon!</Small>
                )}
                <Droppable droppableId={column.id}>
                    {(provided) => (
                        <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {clients.map((client, idx) => (
                                <Task
                                    key={client.id}
                                    client={client}
                                    index={idx}
                                    color={color}
                                />
                            ))}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>
        );
    }
}

export default Column;
