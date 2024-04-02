import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Style from './featureItem.module.css';
import { AiOutlineVerticalRight, AiOutlineVerticalLeft } from "react-icons/ai";
import { useState } from 'react';
import { useEffect } from 'react';
import ProductCard from '../ProductCard';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/context';
import { firebaseApp } from '../../features/Authentication/firebase';
import { get, getDatabase, ref } from "firebase/database";
import ProductSliderCard from './ProductSliderCard';

let slidesToShow = 5;

const Data =[
    "https://thumbs.dreamstime.com/b/old-compass-vintage-map-adventure-stories-background-retro-style-111846900.jpg",
    "https://media.istockphoto.com/id/1141230543/photo/old-compass-on-vintage-map-background-adventure-stories-background-retro-style.jpg?s=170667a&w=0&k=20&c=SENFnCDIWz1wctfztJi5Wgz6zdvy6hib5IGQI0fFPmM=",
    "https://media.istockphoto.com/id/533608255/photo/antique-vase.jpg?s=1024x1024&w=is&k=20&c=-xcsjTJZ09vvabfBHUgAIB1H25d_q_TQzEG8IlIKW48=",
    "https://media.istockphoto.com/id/637341036/photo/asian-porcelain-flower-vase.jpg?s=1024x1024&w=is&k=20&c=fldjrZB4HteyKCzzUIYn_n7BxD4Jzv22iCKXRs1wg7c=",
    "https://craftzone.in/backend/uploads/products/SKU398319243746/ada1463493ffdffdd67a3013768180ea.jpg",
    "https://www.theknot.com/tk-media/images/e1c99db8-3df6-47d7-acfd-8d8a79028287~rs_768.h",
    "https://cf.ltkcdn.net/antiques/images/std-xs/265273-340x219-antique-clock.jpg",
    "https://i.pinimg.com/originals/bb/09/14/bb0914464e1abc8a18cb92dd11093fda.jpg",
    "https://i.ebayimg.com/images/g/ARAAAOSws4Rh0Ap-/s-l400.jpg",
    "https://img.youtube.com/vi/hH_T4DscGLY/hqdefault.jpg",
    "https://cf.shopee.com.my/file/cb90f5224a1ad362a1caca7ff863191a_tn",
    "https://4.imimg.com/data4/XA/AQ/MY-33504579/feather-dial-leather-band-quartz-analog-unique-wrist-watches-1000x1000.jpg",
    "https://5.imimg.com/data5/PN/XS/MY-49675968/fancy-beautiful-blue-leather-strap-dien-watch-1000x1000.jpg",
    "https://ae01.alicdn.com/kf/H1f526ff750d94b4187057a3523881fafU/Luxury-Retro-Women-Watches-Rose-Gold-Unique-Tonneau-Dial-Top-Brand-Dimond-Stone-Antique-Watch-for.jpg_640x640.jpg",
    "https://cdn.shopify.com/s/files/1/1125/5492/products/IMG_4569_2048x.jpg?v=1648761851",
    "https://romanovrussia.com/wp-content/uploads/DSC05415.jpg",
    "https://media.rugsandmore.com/wp-content/uploads/2016/02/14131521/Unique-antique-tapestry-Rugs-and-More-Santa-Barbara-Design-Center-27160-6-.jpg",
    "https://a.1stdibscdn.com/antique-18th-century-flemish-mythological-tapestry-with-the-greek-deity-apollo-for-sale/366869/f_99919231581027818822/35503_overhead_master.jpg?width=768",
    "https://aardvarkjewellery.com/wp-content/uploads/2019/06/marquise-lab-grown-sapphire-and-diamond-engagement-ring-in-gold-or-platinum-unique-handmade-antique-inspired-art-deco-floral-nature-leaf-5d1336dd.jpg",
    "https://cdn1.jewelxy.com/live/img/business_product/X8ANLCiuQj_20210604150723.jpg",
    "https://www.shutterstock.com/image-photo/beautiful-traditional-golden-necklace-wooden-260nw-1512590621.jpg",
    "https://womandilax.com/wp-content/uploads/2021/02/22067763161.jpg",
    "https://media.istockphoto.com/id/609916530/photo/heart-of-the-ocean-sapphire.jpg?s=612x612&w=0&k=20&c=3SP6PGthvqOOlpj6azIm_q-MycC-hQwZ7bnyUUo8rZs=",
    "https://diamondsbymanee.com/skin/frontend/manee/default/images/maneelife/bluenecklace.png",
    "https://w0.peakpx.com/wallpaper/155/655/HD-wallpaper-flintlock-pistol-flintlock-design-unique-old-metal-antique-gun-pistol-weapon-vintage.jpg",
    
    ];
const PreviousBtn = (props) => {
  console.log(props);
  const { className, onClick, currentSlide } = props;
  return (
    <>
      {currentSlide !== 0 && (
        <div className={className} onClick={onClick}>
          <AiOutlineVerticalRight className='text-black text-[30px] font-semibold' />
        </div>
      )}
    </>
  );
};
const NextBtn = (props) => {
  const { className, onClick, slideCount, currentSlide } = props;
  console.log(props);
  return (
    <>
      {currentSlide !== slideCount - slidesToShow && (
        <div className={className} onClick={onClick}>
          <AiOutlineVerticalLeft className='text-black text-[30px] font-semibold' />
        </div>
      )}
    </>
  );
};

const carouselProperties = {
  prevArrow: <PreviousBtn />,
  nextArrow: <NextBtn />,
  slidesToShow: slidesToShow,
  slidesToScroll: 2,
  infinite: false,
  // slidesToScroll={3}
  responsive: [
    {
      breakpoint: 426,
      settings: {
        slidesToShow: 1,
        centerMode: false,
      },
    },
    {
      breakpoint: 769,
      settings: {
        slidesToShow: 3,
        centerMode: false,
      },
    },
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 4,
        centerMode: false,
        slidesToScroll: 2,
      },
    },
  ],
};

const ProductSlider = () => {

  const [width, setWidth] = useState(100);
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (width <= 426) {
    slidesToShow = 1;
  } else if (width > 426 && width <= 769) {
    slidesToShow = 3;
  } else if (width > 769 && width <= 1025) {
    slidesToShow = 4;
  } else {
    slidesToShow = 5;
  }


  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
  });
  const [filterList, setFilterList] = useState(null);
  const [productList, setProductList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [prod, setProd] = useState(undefined);

  const onFilter = (_filters) => {
    const tmp = [...productList].filter((prod) => {
      let f = [];
      if (_filters.category && _filters.category !== "all") {
        f.push(
          prod.category === _filters.category ||
            prod.bidState === _filters.category
        );
      }
      if (_filters.query) {
        f.push(prod.name.toLowerCase().includes(_filters.query.toLowerCase()));
      }

      return f.length === 0 || f.every((f) => f === true);
    });

    setFilterList(tmp);
    setFilters(_filters);
  };

  const loadProductData = async () => {
    const prods = [];
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      const snapshot = await get(valueRef);
      snapshot.forEach(function (childSnapshot) {
        const userProduct = childSnapshot.val();
        if (user.userType === "seller") {
          if (
            userProduct.userId === user.userId &&
            Object.keys(userProduct).length > 3
          )
            prods.push({ ...userProduct, mpid: childSnapshot.key });
        } else {
          if (userProduct && Object.keys(userProduct).length > 3) {
            prods.push({ ...userProduct, loadsAt: Date.now() });
          }
        }
      });
      setLoading(false);
      setProductList(prods);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleActions = (action, row) => {
    if (action === "edit") {
      setProd({
        ...row,
        startTime: dayjs(row.startTime),
        endTime: dayjs(row.endTime),
      });
      setShowAdd(true);
    } 
    if (action === "view") {
      navigate(`/app/products/${row.pid}`);
    } else {
      navigate(`/app/products/`);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
<div 
 style={{display:'block', width:'100%', zIndex:1, marginTop:'-5rem'}}
>
<div style={{ margin: '30px' }} className={Style.carousel}>
      <h1 style={{color:'black', textAlign:'start', fontSize:'2rem'}}>Top Trending Auctions</h1>
      {/* <Slider {...carouselProperties}>
        <div style={{ display:'flex'}}>

                {(filterList || productList).map((prod) => (
                  <div>
                    <ProductSliderCard
                      {...prod}
                      onAction={(action) => handleActions(action, prod)}
                      user={user}
                      onRefresh={loadProductData}
                      isLoading={loading}
                      onClick={() => navigate(`/app/products/${prod.pid}`)}
                    />
                    </div>
                ))}

        </div>
      </Slider> */}

      <Slider {...carouselProperties}>
        {productList.map((item ,i) => (
          <div  style={{cursor:'pointer'}}>
          <Card key={i} item={item} />
          </div>
        ))}
      </Slider>
    </div>
</div>


  );
};

const Card = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div  
    style={{ width:'310px', height:'350px',textAlign:'center', margin:'1rem',paddingLeft:'5rem'}}>
    <div style={{border:'1px solid lightgray', width:'100%'}}>

    
      <img
        style={{width:'100%', height:'190px', objectFit:'cover', marginBottom:'10px' }}
        src={item.images[0]}
        alt=''
      />
      <p style={{ fontSize: '18px', padding: '2px 0' }}>{item.name}</p>
      <p style={{ fontSize: '18px', padding: '2px 0', color: 'gray' }}>
        Initial Price : ${item.price}
      </p>
      <button onClick={() => navigate(`/app/products/${item.pid}`)} 
       style={{ backgroundColor:'#1677FF', cursor:'pointer', color:'white', padding:'0.5rem', paddingLeft:'2rem', paddingRight:'2rem', fontSize:'1rem', borderRadius:'15%', border:'5px solid white' }}
       >More</button>
    </div>
    </div>
  );
};

export default ProductSlider