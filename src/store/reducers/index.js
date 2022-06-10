import { combineReducers } from 'redux'
import loader from './loader'
import basket from './basketReducer'

export const allReducers = combineReducers({
	loader,
	basket,
})

export default allReducers;