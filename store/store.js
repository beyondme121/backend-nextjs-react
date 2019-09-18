import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'

// state
const userInitialState = {}

// reducer
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

// reducer 组合
const allReducers = combineReducers({
  user: userReducer
})

// 每一次服务端渲染的时候, 通过调用这个方法来生成这个store, 每次渲染都是新的store
export default function initialStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(reduxThunk))
  )
  return store
}
