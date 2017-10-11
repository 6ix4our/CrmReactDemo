import thunk from 'redux-thunk';
import { createStore, applyMiddleware, Reducer } from 'redux';
import { EntityCollection } from '../xrm-models/DataTypes';
import { AppActions } from '../table-actions';

export interface IAppState
{
    RowCount: number;
    Rows: EntityCollection;
    IsUpdatingData: boolean;
}

const initialState: IAppState = {
    RowCount: 0,
    Rows: [],
    IsUpdatingData: true
};

const appReducer: Reducer<IAppState> = (state = initialState, action: AppActions) =>
{
    switch (action.type)
    {
        case 'REFRESH_REQUEST':
            return {
                ...state,
                RowCount: 0,
                Rows: [],
                IsUpdatingData: true
            };

        case 'REFRESH_COMPLETE':
            return {
                ...state,
                RowCount: action.Rows.length,
                Rows: action.Rows,
                IsUpdatingData: false
            };

        case 'UPDATE_ROW':
            state.Rows[action.RowIndex] = action.Record;

            return {
                ...state,
            };

        default:
            return state;
    }
};

export var TableStore = createStore(appReducer, applyMiddleware(thunk)) ;
