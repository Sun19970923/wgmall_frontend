/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:08:52
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useNavigate } from "react-router-dom";
import styles from "./matic.module.less";
import { Button } from "antd"
import { formatAmount } from '@/utils/utils'
import CusttomTabBar from "../../components/CuttomTabber";
import { Tabs, List, InfiniteScroll, Toast, Tag, PullToRefresh, Card, Divider } from 'antd-mobile';
import React, { useRef, useState, useMemo, useEffect } from "react";
import MaskSubmit from '../../components/MatcingSubmit'
import { grab, complete } from '@/api/matic';
import { info } from '@/api/user';
import LoadingMask from '../../components/Loading';



const scrollList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const NumberList = (props) => {
  const myButtonRef = useRef([]);

  const style = useMemo(() => {
    if (props.result === "0") {
      return {};
    }


    let height = myButtonRef.current.clientHeight;
    
    return {
      top: 0 - Number(props.result) * height + "px",
      transitionDuration: 2000 + props.index * 500 + "ms",
    };
  }, [props.result]);
  return (
    <div className={styles.numList} style={style}>
      {[...scrollList, ...scrollList].map((item, key) => (
        <div key={key}  ref={myButtonRef}>{item}</div>
      ))}
    </div>
  );
};
const START_NUMBER = ["0", "0", "0"]


const Matic = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0); // 状态提升到父组件
  const [data, setData] = useState({}); // 状态提升到父组件
  const [user, setUser] = useState({}); // data
  const [loading, setLoading] = useState(false);

  

  const [num, setNum] = useState(478);
  const [lastResult, setLastResult] = useState(START_NUMBER);
  const numList = useRef(null);
  const handleStart = () => {
    setLastResult(START_NUMBER);
    getGrab()
  };


  
  const getGrab = async () => {
    setLoading(true);
    const res = await grab({ userId: user.user.id });
    
    setLoading(false);

    if(res.code == 200){
      setData({ ...res.data, status: 'pending' })
      
      setValue(true)

      getData()
    }

  }


  const submit = async (taskId) => {
    setLoading(true);
    let res = await complete({ taskId })
    setLoading(false);

    console.log(res, 'res res');
    if(res.code == 200){
      Toast.show({
        icon: 'success',
        content: res.data,
      })

      setValue(false)
      setData({})
      getData()
      return
    }
    if(res.code == 402){
      navigate('/order/list')
    }
  }

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    
    let infoData = await info({ userId: userinfo.id })

    console.log(infoData.data?.user, 'infoData infoData');
    

    localStorage.setItem("userInfo", JSON.stringify(infoData.data?.user))

    setUser(infoData.data || {})
  }


  useEffect(() => {
    getData()
  }, [])


  return (
      <div className={styles.indexBody}>

        <LoadingMask visible={loading} />


        {
          data.status &&
          <MaskSubmit parentValue={value} onValueChange={setValue} isClose={false} data={data} user={user} onSubmit={(taskId) => submit(taskId)}></MaskSubmit>
        }


        <div className={styles.data}>
          <div>
            <h1>$ {formatAmount(user?.user?.fakeBalance || 0)}</h1>
            <h2>Account balance</h2> 
          </div>
          <div>
            <h1>$ {formatAmount(user?.user?.totalProfit || 0)}</h1>
            <h2>Cumulative income</h2> 
          </div>
          <div>
            <h1>{user?.user?.orderCount}</h1>
            <h2>Single snatch times</h2> 
          </div>
        </div>

        <div className={styles.button} onClick={() => handleStart()}>

        </div>

          {/* <Card
            headerStyle={{
                color: '#1677ff',
            }}
            bodyClassName={styles.customBody}
            title=''
          >
              <h2>Account balance</h2>
              <h1>${ formatAmount(user?.user?.fakeBalance || 0) }</h1>
              <Divider />
              <div className={styles.datas}>
                <div className={styles.data_item}>
                  <h3>{ formatAmount(user?.user?.orderCount || 0) }</h3>
                  <p>Order Count</p>
                </div>
                <div className={styles.data_item}>
                  <h3>{ formatAmount(user?.profit?.total || 0) }</h3>
                  <p>Cumulative income</p>
                </div>
                <div className={styles.data_item}>
                  <h3>{ formatAmount(user?.profit?.today || 0) }</h3>
                  <p>Earnings today</p>
                </div>
              </div>
          </Card> */}

        <CusttomTabBar></CusttomTabBar>
      </div>
  );
};




export default Matic;
