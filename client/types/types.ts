export interface TodoInterface {
    id : string | number
    _id : string;
    index : number;
    title: string;
    description?: string;
    status?: TodoStatus;
    priority? : TodoPriorities;
    deadline?: Date;
    createdAt : Date
    updatedAt : Date
  }
export interface IBoards {
  id : string | number;
  name : string;
  todos : TodoInterface[];
}

export enum TodoStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  FINISHED = "FINISHED"
}
export enum TodoPriorities {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  URGENT = "URGENT"
}

export interface UserInterface {
  name: string;
  password: string;
  email :String,
}
export interface BoardInterface {
  name : string,
}
export const statusColumns = [
  { status: TodoStatus.TODO, title: "To Do" },
  { status: TodoStatus.IN_PROGRESS, title: "In Progress" },
  { status: TodoStatus.UNDER_REVIEW, title: "Under Review" },
  { status: TodoStatus.FINISHED, title: "Finished" },
]
export const prioritiesColumns = [
  { priority: TodoPriorities.LOW, title: "Low" },
  { priority: TodoPriorities.MEDIUM, title: "Medium" },
  { priority: TodoPriorities.URGENT, title: "Urgent" },
]