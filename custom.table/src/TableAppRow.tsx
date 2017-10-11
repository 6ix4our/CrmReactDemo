import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Table, Progress, Menu, Button, Icon } from 'semantic-ui-react';
import { IAppState } from './table-store';
import { MapStateToTableRowProps, MapDispatchToTableRowProps } from './AppPropMappers';

type TableRowProps = ITableRowStateProps & ITableRowDispatchProps & ITableRowContainerProps & DispatchProp<IAppState>;

export interface ITableRowStateProps
{
    OpportunityName: string;
    Probability: number;
}

export interface ITableRowDispatchProps
{
    IncrementClick: () => void;
    DecrementClick: () => void;
}

export interface ITableRowContainerProps
{
    RowIndex: number;
}

const TableAppRow: React.StatelessComponent<TableRowProps> = (props) =>
{
    const { OpportunityName, Probability, IncrementClick, DecrementClick } = props;

    return (
        <Table.Row>
            <Table.Cell>
                {OpportunityName}
            </Table.Cell>
            <Table.Cell>
                <Progress percent={Probability} indicating={true} />
            </Table.Cell>
            <Table.Cell>
                <Menu size="mini" compact={true}>
                    <Menu.Item>
                        <Button animated="vertical" onClick={IncrementClick} >
                            <Button.Content hidden={true}>+10%</Button.Content>
                            <Button.Content visible={true}>
                                <Icon name="plus" />
                            </Button.Content>
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button animated="vertical" onClick={DecrementClick} >
                            <Button.Content hidden={true}>-10%</Button.Content>
                            <Button.Content visible={true}>
                                <Icon name="minus" />
                            </Button.Content>
                        </Button>
                    </Menu.Item>
                </Menu>
            </Table.Cell>
        </Table.Row>
    );
};

/// This is a typing work-around
export default connect(MapStateToTableRowProps, MapDispatchToTableRowProps)(TableAppRow) as 
    object as React.StatelessComponent<ITableRowContainerProps>;