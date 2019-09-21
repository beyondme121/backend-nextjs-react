import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'
import axios from 'axios'

// state
const userInitialState = {}

// action-type
const LOGOUT = 'LOGOUT'

// reducer
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}
// reducer 组合
const allReducers = combineReducers({
  user: userReducer
})

// action creators
export function logout () {
  return dispatch => {
    axios.post('/logout').then(res => {
      if (res.status === 200) {
        dispatch({
          type: LOGOUT
        })
      } else {
        console.log('logout failed ', res)
      }
    }).catch(err => {
      console.log("err: ", handleLogout)
    })
  }
}


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
