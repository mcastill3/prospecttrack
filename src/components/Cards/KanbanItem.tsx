import { ChatBubbleLeftRightIcon, PaperClipIcon, PlusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

interface Assignee {
  avt: string;
}

interface KanbanData {
  id: string;
  priority: number;
  title: string;
  chat: number;
  attachment: number;
  assignees: Assignee[];
}

interface KanbanItemProps {
  data: KanbanData;
  index: number;
}

const KanbanItem: React.FC<KanbanItemProps> = ({ data, index }) => {
  return (
   <div>
        <Draggable index={index} draggableId={data.id.toString()}>
            {
               (provided) => (
                  <div ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white rounded-md p-3 m-3 mt-0 last:mb-0"
                  >
                        <label
                            className={`bg-gradient-to-r
                            px-2 py-1 rounded text-white text-sm
                            ${
                                data.priority === 0
                                ? "from-blue-600 to-blue-400"
                                : data.priority === 1
                                ? "from-green-600 to-green-400"
                                : "from-red-600 to-red-400"
                            }
                            `}
                        >
                            {data.priority === 0
                            ? "Low Priority"
                            : data.priority === 1
                            ? "Medium Priority"
                            : "High Priority"}
                        </label>
                          <h5 className="text-md my-3 text-lg leading-6">{data.title}</h5>
                          <div className="flex justify-between">
                              <div className="flex space-x-2 items-center">
                                 <span className="flex space-x-2 items-center">
                                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500 mr-2" />
                                    <span>{data.chat}</span> 
                                 </span>
                                 <span className="flex space-x-2 items-center">
                                    <PaperClipIcon className="w-4 h-4 text-gray-500 mr-2" />
                                    <span>{data.attachment}</span>
                                 </span>                         
                              </div> 
                        <ul className="flex space-x-3">
                           {data.assignees.map((ass: Assignee, index: number) => {
                                return (
                                <li key={index}>
                                    <Image
                                    src={ass.avt}
                                    width="36"
                                    height="36"
                                    objectFit="cover"
                                    className=" rounded-full "
                                    alt=''
                                    />
                                </li>
                                );
                            })}
                                <li>
                                    <button
                                    className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center
                                        rounded-full"
                                    >
                                    <PlusIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </li>
                        </ul>           
                          </div>  
                  </div>
               ) 
            }
        </Draggable>
   </div>
  )
}

export default KanbanItem;
