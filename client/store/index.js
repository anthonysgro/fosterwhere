import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import {
    dataReducer,
    graphReducer,
    loadingReducer,
    algorithmReducer,
    // employeeMapReducer,
} from "./reducers";

// Combined Reducer
const primaryReducer = combineReducers({
    data: dataReducer,
    loading: loadingReducer,
    graphs: graphReducer,
    algorithms: algorithmReducer,
});

// Redux Middleware
const middleware = applyMiddleware(
    thunkMiddleware,
    createLogger({ collapsed: true }),
);

// Redux Store
const store = createStore(primaryReducer, middleware);
export default store;
