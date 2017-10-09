import * as React from 'react';
import TableAppRow from './TableAppRow';
import { connect, DispatchProp } from 'react-redux';
import { Table, Transition, Dimmer, Loader, Button, Icon } from 'semantic-ui-react';
import { MapTableStateToProps, MapTableDispatchToProps } from './AppPropMappers';
import { IAppState } from './table-store';

type TableState = ITableStateProps & ITableDispatchProps & DispatchProp<IAppState>;

export interface ITableStateProps {
    RowCount: number;
    IsLoading: boolean;
}

export interface ITableDispatchProps
{
    RefreshClick: () => void;
}

const TableApp: React.StatelessComponent<TableState> = (props) => {
    const { RowCount, IsLoading, RefreshClick } = props;
    const rows: JSX.Element[] = [];

    for (let i = 0; i < RowCount; i++)
        rows.push(<TableAppRow RowIndex={i} />);

    return (
        <Table size="small" celled={true}>
            <Transition.Group animation="fade" duration={1000} >
                <Dimmer active={IsLoading}>
                    <Loader>Loading...</Loader>
                </Dimmer>
            </Transition.Group>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Opportunity</Table.HeaderCell>
                    <Table.HeaderCell>Probability</Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button size="mini" floated="right" onClick={RefreshClick} >
                            <Icon name="refresh" />
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows || <Table.Cell colSpan={3}>No records.</Table.Cell>}
            </Table.Body>
        </Table>
    );
};

/// This is a typing work-around
export default connect(MapTableStateToProps, MapTableDispatchToProps)(TableApp) as
    object as React.StatelessComponent;
