import { useNavigate } from "react-router-dom";
import styles from "./matic.module.less";
import { formatAmount } from '@/utils/utils';
import CusttomTabBar from "../../components/CuttomTabber";
import { Toast } from 'antd-mobile';
import React, { useRef, useState, useMemo, useEffect } from "react";
import MaskSubmit from '../../components/MatcingSubmit';
import { grab, complete } from '@/api/matic';
import { info } from '@/api/user';
import LoadingMask from '../../components/Loading';
import { useTranslation } from 'react-i18next';

const scrollList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const START_NUMBER = ["0", "0", "0"];

const CLOSE_ANIM_MS = 180;

const NumberList = (props) => {
  const myButtonRef = useRef([]);

  const style = useMemo(() => {
    if (props.result === "0") return {};
    let height = myButtonRef.current.clientHeight;
    return {
      top: 0 - Number(props.result) * height + "px",
      transitionDuration: 2000 + props.index * 500 + "ms",
    };
  }, [props.result]);

  return (
      <div className={styles.numList} style={style}>
        {[...scrollList, ...scrollList].map((item, key) => (
            <div key={key} ref={myButtonRef}>{item}</div>
        ))}
      </div>
  );
};

const Matic = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const [lastResult, setLastResult] = useState(START_NUMBER);

  // 红包状态
  const [showRedPacket, setShowRedPacket] = useState(false);
  const [redPacketAmount, setRedPacketAmount] = useState(0);

  // 关闭动画状态
  const [closing, setClosing] = useState(false);

  // 数字跳变显示值
  const [displayAmount, setDisplayAmount] = useState('0.00');

  const handleStart = () => {
    setLastResult(START_NUMBER);
    getGrab();
  };

  const getGrab = async () => {
    setLoading(true);
    const res = await grab({ userId: user.user?.id });
    setLoading(false);

    if (res.code === 200) {
      setData({ ...res.data, status: 'pending' });
      setValue(true);
      getData();
    }
  };

  const submit = async (taskId) => {
    setLoading(true);
    const res = await complete({ taskId });
    setLoading(false);

    if (res.code === 200) {
      Toast.show({
        icon: 'success',
        content: res.data?.message || 'Success',
      });

      // 如果接口返回需要发红包
      if (res.data?.showRedPacket) {
        const amt = Number(res.data.redPacketAmount || 0);
        setRedPacketAmount(amt);
        setShowRedPacket(true);
        setClosing(false);
      }

      setValue(false);
      setData({});
      getData();
      return;
    }

    if (res.code === 402) {
      navigate('/order/list');
    }
  };

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));
    let infoData = await info({ userId: userinfo.id });
    localStorage.setItem("userInfo", JSON.stringify(infoData.data?.user));
    setUser(infoData.data || {});
  };

  useEffect(() => {
    getData();
  }, []);

  // 金额从 0 数到 redPacketAmount 的动画
  useEffect(() => {
    if (!showRedPacket) return;
    let raf = 0;
    const from = 0;
    const to = Number(redPacketAmount || 0);
    const dur = 3000; // ms
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const v = (from + (to - from) * eased).toFixed(2);
      setDisplayAmount(v);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showRedPacket, redPacketAmount]);

  const handleCloseRedPacket = () => {
    setClosing(true);
    setTimeout(() => {
      setShowRedPacket(false);
      setClosing(false);
      setDisplayAmount('0.00');
    }, CLOSE_ANIM_MS);
  };

  return (
      <div className={styles.indexBody}>
        <LoadingMask visible={loading} />

        {showRedPacket && (
            <div
                className={`${styles.popup} ${closing ? styles.closing : ''}`}
                onClick={handleCloseRedPacket}
                role="button"
                aria-label="Close Red Packet"
            >
              <img src={require('@/assets/img.png')} alt="" />
              <span>${displayAmount}</span>
            </div>
        )}

        {data.status && (
            <MaskSubmit
                parentValue={value}
                onValueChange={setValue}
                isClose={false}
                data={data}
                user={user}
                onSubmit={(taskId) => submit(taskId)}
            />
        )}

        <div className={styles.data}>
          <div>
            <h1>$ {formatAmount(user?.user?.fakeBalance || 0)}</h1>
            <h2>{t('matic.accountBalance')}</h2>
          </div>
          <div>
            <h1>$ {formatAmount(user?.user?.totalProfit || 0)}</h1>
            <h2>{t('matic.cumulativeIncome')}</h2>
          </div>
          <div>
            <h1>{user?.user?.orderCount}</h1>
            <h2>{t('matic.singleSnatchTimes')}</h2>
          </div>
        </div>

        <div className={styles.button} onClick={handleStart}></div>

        <CusttomTabBar />
      </div>
  );
};

export default Matic;
