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
    background-color: ${({ color }) => color.client};
`;

const Text = styled.p`
    font-size: 14px;
    margin: 2px 0px;
    color: black;
`;

const Small = styled.small`
    font-size: 10px;
    color: black;
`;

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { client, index, color } = this.props;
        return (
            <Draggable draggableId={client.id} index={index}>
                {(provided) => (
                    <Container
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        color={color}
                    >
                        <Text>{client.name}</Text>
                        <Small>Commute: {client.commute} min</Small>
                    </Container>
                )}
            </Draggable>
        );
    }
}

export default Task;
