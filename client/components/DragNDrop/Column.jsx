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
`;
const Title = styled.h3`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
`;

class Column extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { column, clients } = this.props;
        return (
            <Container>
                <Title>{column.name}</Title>
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
