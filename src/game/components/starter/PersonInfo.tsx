import React, {
  ReactElement,
  ReactNode,
  SFC,
} from 'react';
import {
  Select,
  Row,
  Col,
} from 'antd';
import {
  SelectValue,
} from 'antd/lib/select';

import {
  PersonInfoProps,
  PersonInfoInterface,
  CO,
} from '../../types';
import {
  without,
} from '../../utils';

const Option = Select.Option;
const styles = require('./Starter.less');

const PersonInfo: SFC<PersonInfoProps> = ({
  list,
  result,
  calcCallback,
  count,
  max,
}) => {
  const genOptions: (
    arr: Array<string>,
    keyMap: CO,
    selectedArr: Array<string>,
  ) => Array<ReactNode> = (
    arr,
    keyMap,
    selectedArr,
  ) => {
    return (
      arr.map(item => (
        <Option
          key={item}
          disabled={count + keyMap[item] > max && without(selectedArr, item)}
        >{item}</Option>
        ))
    )
  };

  const calculate: (selectionMap: CO) => number = (selectionMap) => (
    list.reduce((res: number, info: CO): number => {
      const selections = selectionMap[info.key];
      if (selections && 'length' in selections && selections.length) {
        res += selections.reduce((sCount: number, selection: string): number => {
          sCount += info.keyObject[selection];
          return sCount;
        }, 0);
      }
      return res;
    }, 0)
    );

  const getPersonRow: (
    rowInfo: PersonInfoInterface,
    defaultValue?: Array<string>|void,
  ) => ReactNode = (
    rowInfo,
    defaultValue,
  ) => {
    const {
      title,
      key: resKey,
      keyArray: value,
      keyObject: map,
      placeholder,
    } = rowInfo;

    const handleChange: (returnValue: SelectValue, options: ReactElement<any>|ReactElement<any>[]) => void = (returnValue) => {
      result[resKey] = returnValue;
      count = calculate(result);
      calcCallback(count, result);
    };

    return (
      <Row key={resKey} type={'flex'} gutter={8} align={'middle'} justify={'start'} className={styles.mb20}>
        <Col span={6} offset={3} className={styles.tc}>{title}</Col>
        <Col span={12}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={placeholder}
            defaultValue={defaultValue || []}
            onChange={handleChange}
          >
            {genOptions(value, map, result[resKey] || [])}
          </Select>
        </Col>
      </Row>
      );
  };

  return (
    <div>
      {
        list.map((info: PersonInfoInterface): ReactNode => (
          getPersonRow(info, result[info.key])
          ))
      }
    </div>
    );
};

export default PersonInfo;
