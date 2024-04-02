 import { FaShoppingCart, FaRegBookmark, FaStar, FaFireAlt } from 'react-icons/fa';
 import Style from './SellerProfile.module.css'

 export function SellerProfileCard({props}) {
     return(
         <div style={{width:'100%', height:'6rem',display:'flex',flexDirection:'row', alignItems:'center'}}>
             <div key={props.id} style={{display:'flex',flexDirection:'col', alignItems:'center', justifyContent:'space-between'}}>
                 <div style={{width:'10rem', marginTop:'15px',textAlign:'center', height:'6rem', flexDirection:'col', alignItems:'center', justifyContent:'center'}}>
                 <img style={{height:'3rem'}} src="https://cdn-icons-png.flaticon.com/128/4140/4140037.png" alt='user-img' >
                 </img>
                 <h1 style={{ marginTop:'-5px',marginLeft:'-5px' ,color:'green',textAlign:'center'}}>Seller</h1>
                 </div>
                 <div style={{alignItems:'start' , textAlign:'center'}}>
                     <div style={{display:'flex',flexDirection:'col'}} >
                         <h3 style={{ marginTop:'-1px', marginLeft:'-35px' ,color:'green',textAlign:'center'}} >{props?.email}</h3>
                     </div>
                     <h1 style={{ marginTop:'-5px', marginLeft:'-35px' ,color:'green',textAlign:'center'}} >{props?.mobileno}</h1>
                 </div>
             </div>
         </div>
     )
 }
