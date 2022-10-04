import { uniqueId } from 'lodash';
import {
  ADD_SUB_TASK,
  ADD_TASK,
  CHANGE_TASK_TITLE,
  CHANGE_IS_EXPENDED,
  CONFIRM_CHANGE_POS,
  ITEM_ID_TO_MOVE,
  CHANGE_IS_CHECKED,
} from '../../actions/Todo';

const initialState = {
  items: [],
  itemParentId: null,
  itemIdToMove: null,
  itemsIdNotToMove: false,
};

function findSubtasksNotToMove(arr, itemToPush, oldItemsArr = []) {
  oldItemsArr.push(itemToPush);
  arr.forEach((item) => {
    findSubtasksNotToMove(item.subTasks, item.id, oldItemsArr);
  });
  return oldItemsArr;
}

function collect(arr, newArr = []) {
  arr.forEach((task) => {
    newArr.push(task);
    if (task.subTasks.length !== 0) {
      collect(task.subTasks, newArr);
    }
  });
  return newArr;
}
export default function todoReducer(state = initialState, { type, payload }) {
  const stateItems = collect(state.items);
  switch (type) {
    case ADD_TASK:
      return {
        ...state,
        items: [
          ...state.items,
          {
            title: payload.title,
            id: uniqueId(),
            isExpended: true,
            isChecked: false,
            subTasks: [],
          },
        ],
      };

    case ADD_SUB_TASK:
      if (!payload.title) return { ...state };
      stateItems.find((item) => item.id === payload.id).subTasks = [
        ...payload.subTasks,
        {
          title: payload.title,
          id: uniqueId(),
          isExpended: true,
          isChecked: false,
          subTasks: [],
        },
      ];

      return {
        ...state,
        items: [...state.items],
      };

    case CHANGE_TASK_TITLE:
      if (!payload.title) return { ...state };
      stateItems.find((item) => item.id === payload.id).title = payload.title;

      return {
        ...state,
        items: [...state.items],
      };

    case CHANGE_IS_EXPENDED:
      stateItems.find((item) => item.id === payload.id).isExpended = !payload.isExpended;

      return {
        ...state,
        items: [...state.items],
      };

    case CHANGE_IS_CHECKED:
      const findItemToChecked = stateItems.find((item) => item.id === payload.id);
      findItemToChecked.isChecked = !payload.isChecked;
      collect(findItemToChecked.subTasks).forEach((item) => (item.isChecked = !payload.isChecked));

      return {
        ...state,
        items: [...state.items],
      };

    case CONFIRM_CHANGE_POS:
      const oldTask = stateItems.find((item) => item.id === payload.changePosItemId);
      const parentTask = stateItems.find((item) => item.id === state.itemParentId);

      if (parentTask) {
        parentTask.subTasks = parentTask.subTasks.filter(
          (item) => item.id !== payload.changePosItemId,
        );
      } else {
        state.items = state.items.filter((item) => item.id !== payload.changePosItemId);
      }
      stateItems.find((item) => item.id === payload.id).subTasks = [
        ...payload.item.subTasks,
        { ...oldTask },
      ];
      return {
        ...state,
        items: [...state.items],
        itemIdToMove: null,
      };

    case ITEM_ID_TO_MOVE:
      if (payload.id === state.itemIdToMove) {
        return {
          ...state,
          itemIdToMove: false,
        };
      }
      if (payload.id) {
        state.itemParentId = payload.parentId;
        const findItem = stateItems.find((item) => item.id === payload.id);
        state.itemsIdNotToMove = findSubtasksNotToMove(findItem.subTasks);
      }

      return {
        ...state,
        itemIdToMove: payload.id,
      };

    default:
      return state;
  }
}
