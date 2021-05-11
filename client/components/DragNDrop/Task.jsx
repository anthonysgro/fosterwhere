import React, { Component } from "react";

// Style Imports
import styled from "styled-components";

// Component Imports
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
    border: 1px solid lightgray;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: white;
`;

const Text = styled.p`
    font-size: 14px;
    margin: 6px 0px;
`;

const Small = styled.small`
    font-size: 10px;
`;

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { client, index } = this.props;
        return (
            <Draggable draggableId={client.id} index={index}>
                {(provided) => (
                    <Container
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Text>{client.name}</Text>
                        <Small>Commute: {client.commute} min.</Small>
                    </Container>
                )}
            </Draggable>
        );
    }
}

export default Task;
