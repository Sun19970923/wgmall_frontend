import { Toast, NoticeBar, Tabs, Empty, Ellipsis, Card } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "@/utils/utils";
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
  AppstoreOutline,
  BillOutline,
  FingerdownOutline,
} from "antd-mobile-icons";
import { info, getAddress } from "@/api/user";
import { buy } from "@/api/product";
import { useEffect, useState } from "react";
import { wishlistAdd } from "@/api/product";
import NavBar from "../components/NavBar";
import { useTranslation } from "react-i18next"; // 引入 useTranslation
import heart from "@/assets/level15.png";
import diamond from "@/assets/level610.png";
import oldcrown from "@/assets/level1115.png";
import newcrown from "@/assets/level1620.png";
import styles from "@/assets/css/shopPage.less";
import CuttomSwiper from "@/components/CuttomSwiper";

const ShopPage = () => {
  const { t } = useTranslation(); // 获取 t 函数
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // data
  const [data, setData] = useState({}); // data

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem("userInfo"));
    let item = JSON.parse(localStorage.getItem("item"));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.indexContainer}>
      <NavBar title={t("shophome.shop")} />

      <Header></Header>

      <List></List>
    </div>
  );
};

// 渲染等级图标
const renderLevelIcons = (level) => {
  if (!level || level < 1) return null;

  let iconSrc;
  let count;

  if (level >= 1 && level <= 5) {
    // 爱心
    iconSrc = heart;
    count = level;
  } else if (level >= 6 && level <= 10) {
    // 淘宝的钻石
    iconSrc = diamond;
    count = level - 5;
  } else if (level >= 11 && level <= 15) {
    // 老皇宫
    iconSrc = oldcrown;
    count = level - 10;
  } else if (level >= 16 && level <= 20) {
    // 新皇宫
    iconSrc = newcrown;
    count = level - 15;
  }

  return (
    <span style={{ display: "inline-flex", gap: 2, marginLeft: 4 }}>
      {Array.from({ length: count }, (_, i) => (
        <img
          key={i}
          src={iconSrc}
          alt="level icon"
          style={{ width: 14, height: 14 }}
        />
      ))}
    </span>
  );
};

function Header() {
  const navigate = useNavigate();
  let shopHeader = JSON.parse(
    localStorage.getItem("searchPageState"),
  )?.shopHeader;
  if (!shopHeader) navigate(-1);

  console.log(shopHeader, "shopHeader");

  return (
    <div style={{ padding: "8px 12px 0", cursor: "pointer" }}>
      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img
            src={shopHeader.avatarUrl ? baseApi + shopHeader.avatarUrl : ""}
            alt={shopHeader.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#f2f3f5",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "22px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {shopHeader.name}
              {renderLevelIcons(shopHeader.level)}
            </div>
            <div
              style={{
                color: "#999",
                marginTop: 2,
                fontSize: 12,
                lineHeight: "18px",
              }}
            >
              {shopHeader.description || "-"}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              {[shopHeader.tag1, shopHeader.tag2, shopHeader.tag3]
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: "3px 6px",
                      borderRadius: 999,
                      background: "#f5f5f5",
                      color: "#666",
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function List() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState("share"); // data

  let shopProducts = JSON.parse(
    localStorage.getItem("searchPageState"),
  )?.shopProducts;
  if (!shopProducts) navigate(-1);

  let reverse = shopProducts.slice().reverse();



  console.log(shopProducts, "shopProducts");
  console.log(reverse, "reverse");

  let images = shopProducts.slice(0, 5).map((msg) => {
    return baseApi + msg.imagePath
  })


  let shareProducts = shopProducts.slice(5).map((msg) => {
    return msg
  })

  console.log(images);
  console.log(shareProducts);


  // 
  const onClick = (i) => {
    console.log(i, 'i');
    localStorage.setItem("item", JSON.stringify(shopProducts[i]));
    navigate("/details")
  }
  

  return (
    <div style={{ background: "#fff", margin: "10px", borderRadius: "12px" }}>
      <Tabs
        onChange={(key) => {
          setActiveIndex(key);
        }}
      >
        <Tabs.Tab title="推荐" key="share"></Tabs.Tab>
        <Tabs.Tab title="商品" key="all"></Tabs.Tab>
      </Tabs>

      {
        activeIndex === "share" &&
        <CuttomSwiper images={images} onClick={(i) => onClick(i)}></CuttomSwiper>
      }

      {
        activeIndex === "share" ?
        <div className={styles.goodsGrid} style={{ paddingTop: 8 }}>
            {shareProducts.map((msg, i) => (
            <div
                key={i}
                className={styles.goodsItem}
                onClick={() => {
                localStorage.setItem("item", JSON.stringify(msg));
                navigate("/details");
                }}
            >
                <img
                className={styles.goodsImg}
                src={baseApi + msg.imagePath}
                alt={msg.name}
                />
                <div className={styles.goodsInfo}>
                <span className={styles.goodsName}>{msg.name}</span>
                <div className={styles.goodsPrice}>
                    <span className={styles.price}>${msg.price}</span>
                    <span className={styles.sales}>
                    {t("home.goods.sales")}：{msg.sales || 0}
                    </span>
                    <div className={styles.goodsSeller}>
                    {t("details.seller")}: {msg.seller || "-"}
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        :
        <div className={styles.goodsGrid} style={{ paddingTop: 8 }}>
            {reverse.map((msg, i) => (
            <div
                key={i}
                className={styles.goodsItem}
                onClick={() => {
                localStorage.setItem("item", JSON.stringify(msg));
                navigate("/details");
                }}
            >
                <img
                className={styles.goodsImg}
                src={baseApi + msg.imagePath}
                alt={msg.name}
                />
                <div className={styles.goodsInfo}>
                <span className={styles.goodsName}>{msg.name}</span>
                <div className={styles.goodsPrice}>
                    <span className={styles.price}>${msg.price}</span>
                    <span className={styles.sales}>
                    {t("home.goods.sales")}：{msg.sales || 0}
                    </span>
                    <div className={styles.goodsSeller}>
                    {t("details.seller")}: {msg.seller || "-"}
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
      }

    </div>
  );
}

export default ShopPage;
