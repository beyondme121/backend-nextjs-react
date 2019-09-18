import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'

// state
const initialState = {
  count: 0
}

// 外部页面dispatch action, 需要export
// actionCreator, return action.type & payload
export function add(num) {
  return {
    type: 'ADD',
    num
  }
}

// reducer
const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count: state.count + (action.num || 1)
      }
    default:
      return state
  }
}


// reducer 组合
const allReducers = combineReducers({
  counter: countReducer
})

// 每一次服务端渲染的时候, 通过调用这个方法来生成这个store, 每次渲染都是新的store
export default function initialStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        counter: initialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(reduxThunk))
  )
  return store
}
