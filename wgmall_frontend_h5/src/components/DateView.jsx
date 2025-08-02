import React, { useState } from 'react';
import { Form, DatePickerView, Button, Popup } from 'antd-mobile';
import styles from './DateView.module.less';
import { formattedDate } from '@/utils/utils'

const now = new Date()

// 获取当前日期
const currentDate = new Date();

// 获取 100 年之前的日期
currentDate.setFullYear(currentDate.getFullYear() - 100);


const BirthdayPicker = ({ onConfrim, shengri }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(now);

  const onChange = (date) => {
    console.log(date);
    
    setValue(date);
  };

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const confrim = () => {
    onConfrim(formattedDate(value))
    setVisible(false);
  }

  return (
    <div className={styles.birthdayPicker}>
      <div  onClick={showModal} style={{ color: 'blue', paddingLeft: '50px' }} >{shengri ? shengri : 'Select birthday'}</div>
      <Popup
        visible={visible}
        onMaskClick={hideModal}
        bodyStyle={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            minHeight: '40vh',
        }}
      >
        <DatePickerView defaultValue={now} value={value} style={{ '--height': '200px' }} min={currentDate} max={now}/>
        
        <div style={{ padding: '12px' }}>
          <Button block onClick={hideModal} style={{ fontSize: '18px', marginBottom: '10px' }}>Cancel</Button>   
          <Button block onClick={confrim} type='primary' style={{ color: 'white', backgroundColor: '#1d7dfa', fontSize: '18px'}}>Confrim</Button>   
        </div>
      </Popup>
    </div>
  );
};

export default BirthdayPicker;
