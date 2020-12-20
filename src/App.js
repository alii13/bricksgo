import React, { Component } from "react";
import "./App.css";
import Block from "./Block";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import UIfx from "uifx";
import clickSound from "./sounds/click-sound.mp3";
import clap from "./sounds/applause.mp3";
import restartSound from "./sounds/restart.mp3";
import githubLinkSound from "./sounds/link.mp3";
import Confetti from "react-dom-confetti";
import { MdReplay } from "react-icons/md";
import { AiFillGithub } from "react-icons/ai";

const itemMoved = new UIfx(clickSound);
const applause = new UIfx(clap);
const restart = new UIfx(restartSound);
const link = new UIfx(githubLinkSound);

const config = {
  angle: 239,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 5500,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "611px",
  colors: ["#000", "#f00"],
};

export default class App extends Component {
  state = {
    blockCount: 5,
    blockIds: ["block-1", "block-2", "block-3", "block-4", "block-5"],
    blockData: {
      "block-1": {
        number: 1,
        pos: 0,
      },
      "block-2": {
        number: 2,
        pos: 1,
      },
      "block-3": {
        number: 3,
        pos: 2,
      },
      "block-4": {
        number: 4,
        pos: 3,
      },
      "block-5": {
        number: 5,
        pos: 4,
      },
    },
    finish: false,
  };

  componentDidMount() {
    const shuffledIds = this.shuffleArray(this.state.blockIds);
    this.setState({
      blockIds: shuffledIds,
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  restartTimer = () => {
    setTimeout(() => {
      this.restart();
    }, 3000);
  };

  restart = () => {
    const shuffledIds = this.shuffleArray(this.state.blockIds);
    restart.play();
    this.setState({
      blockIds: shuffledIds,
    });
  };

  moveToGithub = () => {
    link.play();
    window.location.href = "https://github.com/alii13/bricksgo";
  };


  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      if (source.droppableId === "right-column") {
        this.setState({
          selectedExerciseIds: this.state.selectedExerciseIds.sort((a, b) =>
            a.localeCompare(b)
          ),
        });
      }
      return;
    }

    const blockData = this.state.blockData;

    //moving in same column
    let newBlockIds = Array.from(this.state.blockIds);
    newBlockIds.splice(source.index, 1);
    newBlockIds.splice(destination.index, 0, draggableId);
    let finishStatus = true;
    newBlockIds.forEach((id, i) => {
      if (blockData[id].pos !== i) {
        finishStatus = false;
      }
    });
    if (finishStatus === false) {
      itemMoved.play();
    } else {
      applause.play();
      this.restartTimer();
    }

    this.setState({
      blockIds: newBlockIds,
      finish: finishStatus,
    });
  };



  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="app-wrapper">
          <div className="app-body">
            <Droppable droppableId={"column-1"}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={"droppable-area"}
                >
                  {this.state.blockIds.map((blockId, index) => {
                    const blocksData = this.state.blockData;
                    const blockData = blocksData[blockId];
                    return (
                      <Block
                        key={blockId + "a"}
                        draggableId={blockId}
                        number={blockData.number}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="icons-wrapper">
            <div className="play-icon-wrapper">
              <AiFillGithub className="play-icon" onClick={this.moveToGithub} />
            </div>
            <div className="play-icon-wrapper">
              <MdReplay className="play-icon" onClick={this.restart} />
              <p className="icon-subheading">Restart</p>
            </div>
          </div>
          <div className="confetti">
            <Confetti active={this.state.finish} config={config} />
          </div>
        </div>
      </DragDropContext>
    );
  }
}
