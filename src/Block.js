import React, { Component } from "react";
import "./Block.css";
import { Draggable } from "react-beautiful-dnd";
export default class BLock extends Component {
  render() {
    const blockNumber = this.props.number;
    const totalNumberOfBlocks = 5;
    const avgBlockWidth = 100 / totalNumberOfBlocks;
    const actualBlockWidth = avgBlockWidth * blockNumber;

    return (
      <Draggable draggableId={this.props.draggableId} index={this.props.index}>
        {(provided, snapshot) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              className="dragger"
            >
              <div className="block-parent">
                <div
                  className={
                    snapshot.isDragging
                      ? `block-wrapper block-dragging`
                      : "block-wrapper"
                  }
                  draggable={true}
                  style={{ width: `${actualBlockWidth}%` }}
                >
                  <p className="block-number">{blockNumber}</p>
                </div>
              </div>
            </div>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  }
}
