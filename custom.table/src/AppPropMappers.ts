import OpportunitySchema from './opportunity-repository/OpportunitySchema';
import { MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux';
import { ITableStateProps, ITableDispatchProps } from './TableApp';
import { ITableRowStateProps, ITableRowContainerProps, ITableRowDispatchProps } from './TableAppRow';
import { IAppState } from './table-store';
import { UpStepProbability, DownStepProbability, LoadTable } from './table-actions';

export const MapStateToTableProps: MapStateToPropsParam<ITableStateProps, void> =
    (state: IAppState) =>
        ({
            RowCount: state.RowCount,
            IsLoading: state.IsUpdatingData
        });

export const MapDispatchToTableProps: MapDispatchToPropsParam<ITableDispatchProps, void> =
    (dispatch) =>
    ({
        RefreshClick: () => dispatch(LoadTable())
    });

export const MapStateToTableRowProps: MapStateToPropsParam<ITableRowStateProps, ITableRowContainerProps> =
    (state: IAppState, props) =>
        ({
            OpportunityName: state.Rows[props.RowIndex].GetAttributeValue<string>(OpportunitySchema.Attributes.Topic),
            Probability: state.Rows[props.RowIndex].GetAttributeValue<number>(OpportunitySchema.Attributes.Probability)
        });

export const MapDispatchToTableRowProps: MapDispatchToPropsParam<ITableRowDispatchProps, ITableRowContainerProps> =
    (dispatch, props) => 
        ({
            IncrementClick: () => dispatch(UpStepProbability(props.RowIndex)),
            DecrementClick: () => dispatch(DownStepProbability(props.RowIndex))
        });