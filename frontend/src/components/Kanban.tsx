import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task } from "../types";

interface KanbanProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
}

const Kanban: React.FC<KanbanProps> = ({ tasks, onDragEnd }) => {
  const statuses = ["To Do", "In Progress", "Completed"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 p-4 rounded shadow"
              >
                <h2 className="font-bold text-lg mb-4">{status}</h2>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gray-100 dark:bg-gray-700 p-4 rounded mb-2 shadow ${
                            task.status === "Completed" ? "line-through text-gray-500" : ""
                          }`}
                        >
                          <h3 className="font-bold">{task.title}</h3>
                          <p className="text-sm text-gray-500">{task.category}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
