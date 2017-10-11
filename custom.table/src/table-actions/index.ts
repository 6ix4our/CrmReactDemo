import Repository from '../opportunity-repository';
import OpportunitySchema from '../opportunity-repository/OpportunitySchema';
import Entity from '../xrm-models/Entity';
import { IAppState } from '../table-store';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { EntityCollection } from '../xrm-models/DataTypes';

export type AppActions = IUpdateRowAction | IRefreshAction;

export interface IUpdateRowAction extends Action 
{
    type: 'UPDATE_ROW';
    RowIndex: number;
    Record: Entity;
}

type RefreshActionTypes = 'REFRESH_REQUEST' | 'REFRESH_COMPLETE';

export interface IRefreshAction extends Action 
{
    type: RefreshActionTypes;
    Rows: EntityCollection;
}

export const UpdateRow = (rowIndex: number, record: Entity): IUpdateRowAction => 
    ({
        type: 'UPDATE_ROW',
        RowIndex: rowIndex,
        Record: record
    });

export const Refresh = (status: RefreshActionTypes, rows: EntityCollection = []): IRefreshAction => 
    ({
        type: status,
        Rows: rows
    });

export const LoadTable = (): ThunkAction<void, void, void> => (dispatch) =>
{
    dispatch(Refresh('REFRESH_REQUEST', []));
    
    Repository.GetTopTenByProbability()
        .then(result => {
            dispatch(Refresh('REFRESH_COMPLETE', result));
        });
};

export const UpStepProbability = (rowIndex: number): ThunkAction<void, IAppState, void> =>
    (dispatch, getState) => 
    {
        let affectedEntity = getState().Rows[rowIndex];
        let newProbability = affectedEntity.GetAttributeValue<number>(OpportunitySchema.Attributes.Probability) + 10;

        newProbability = newProbability > 100 ? 100 : newProbability;
        affectedEntity.Attributes[OpportunitySchema.Attributes.Probability] = newProbability;

        return Repository.Update(affectedEntity)
            .then(result => {
                dispatch(UpdateRow(rowIndex, affectedEntity));
            });
    };

export const DownStepProbability = (rowIndex: number): ThunkAction<void, IAppState, void> =>
    (dispatch, getState) => 
    {
        let affectedEntity = getState().Rows[rowIndex];
        let newProbability = affectedEntity.GetAttributeValue<number>(OpportunitySchema.Attributes.Probability) - 10;

        newProbability = newProbability < 0 ? 0 : newProbability;
        affectedEntity.Attributes[OpportunitySchema.Attributes.Probability] = newProbability;

        return Repository.Update(affectedEntity)
            .then(result => {
                dispatch(UpdateRow(rowIndex, affectedEntity));
            });
    };
