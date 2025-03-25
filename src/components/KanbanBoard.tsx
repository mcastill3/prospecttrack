"use client";

import {
  ChevronDownIcon,
  PlusIcon,
  Bars3Icon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import BoardData from "../lib/board-data.json";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import Image from "next/image";
import KanbanItem from "../components/Cards/KanbanItem";

function createGuidId(): string {
  return Math.random().toString(36).substr(2, 9); // Genera un ID alfanumérico
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState(
    BoardData.map(board => ({
      ...board,
      items: board.items.map(item => ({
        ...item,
        id: item.id.toString(), // Convertimos id a string
      }))
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }
  }, []);

  const onDragEnd = (re: DropResult) => {
    if (!re.destination) return;
    
    let newBoardData = [...boardData]; // Copia para evitar mutaciones directas
    const sourceIndex = parseInt(re.source.droppableId);
    const destinationIndex = parseInt(re.destination.droppableId);
    const dragItem = newBoardData[sourceIndex].items[re.source.index];

    newBoardData[sourceIndex].items.splice(re.source.index, 1);
    newBoardData[destinationIndex].items.splice(re.destination.index, 0, dragItem);

    setBoardData(newBoardData);
  };

  const onTextAreaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const val = (e.target as HTMLTextAreaElement).value;
      if (val.length === 0) {
        setShowForm(false);
      } else {
        const boardId = (e.target as HTMLTextAreaElement).dataset.id;
        if (boardId !== undefined) {
          const item = {
            id: createGuidId(), // Ahora siempre será un string
            title: val,
            priority: 0,
            chat: 0,
            attachment: 0,
            assignees: [],
          };

          let newBoardData = [...boardData]; // Copia para evitar mutaciones
          newBoardData[parseInt(boardId)].items.push(item);
          setBoardData(newBoardData);
          setShowForm(false);
          (e.target as HTMLTextAreaElement).value = "";
        }
      }
    }
  };

  return (
    <div className="p-10 flex flex-col h-screen">
      {/* Board header */}
      <div className="flex flex-initial justify-between">
        <div className="flex items-center">
          <h4 className="text-4xl font-bold text-gray-600">Studio Board</h4>
          <ChevronDownIcon className="w-9 h-9 text-gray-500 rounded-full p-1 bg-white ml-5 shadow-xl" />
        </div>

        <ul className="flex space-x-3">
          <li>
            <Image
              src="https://randomuser.me/api/portraits/men/75.jpg"
              width="36"
              height="36"
              objectFit="cover"
              className="rounded-full"
              alt="User"
            />
          </li>
          <li>
            <Image
              src="https://randomuser.me/api/portraits/men/76.jpg"
              width="36"
              height="36"
              objectFit="cover"
              className="rounded-full"
              alt="User"
            />
          </li>
          <li>
            <Image
              src="https://randomuser.me/api/portraits/men/78.jpg"
              width="36"
              height="36"
              objectFit="cover"
              className="rounded-full"
              alt="User"
            />
          </li>
          <li>
            <button className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center rounded-full">
              <PlusIcon className="w-5 h-5 text-gray-500" />
            </button>
          </li>
        </ul>
      </div>

      {/* Board columns */}
      {ready && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-5 my-5">
            {boardData.map((board, bIndex) => (
              <div key={board.name}>
                <Droppable droppableId={bIndex.toString()}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <div
                        className={`bg-gray-100 rounded-md shadow-md flex flex-col relative overflow-hidden ${
                          snapshot.isDraggingOver && "bg-green-100"
                        }`}
                      >
                        <span className="w-full h-1 bg-gradient-to-r from-pink-700 to-red-200 absolute inset-x-0 top-0"></span>
                        <h4 className="p-3 flex justify-between items-center mb-2">
                          <span className="text-2xl text-gray-600">{board.name}</span>
                          <Bars3Icon className="w-5 h-5 text-gray-500" />
                        </h4>

                        <div
                          className="overflow-y-auto overflow-x-hidden h-auto"
                          style={{ maxHeight: "calc(100vh - 290px)" }}
                        >
                          {board.items.length > 0 &&
                            board.items.map((item, iIndex) => (
                              <KanbanItem key={item.id} data={item} index={iIndex} />
                            ))}
                          {provided.placeholder}
                        </div>

                        {showForm && selectedBoard === bIndex ? (
                          <div className="p-3">
                            <textarea
                              className="border-gray-300 rounded focus:ring-purple-400 w-full"
                              rows={3}
                              placeholder="Task info"
                              data-id={bIndex.toString()}
                              onKeyDown={onTextAreaKeyPress}
                            />
                          </div>
                        ) : (
                          <button
                            className="flex justify-center items-center my-3 space-x-2 text-lg"
                            onClick={() => {
                              setSelectedBoard(bIndex);
                              setShowForm(true);
                            }}
                          >
                            <span>Add task</span>
                            <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
