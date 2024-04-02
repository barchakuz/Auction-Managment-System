import React from 'react'
import Style from "./FooterClone.module.css"

const FooterClone = () => {
  return (
    <div>
       <footer className={Style.footer}>
  	 <div className={Style.container}>
  	 	<div className={Style.row}>
  	 		<div className={Style.footercol}>
  	 			<h4>SKYEBY</h4>
  	 			<ul>
  	 				<li><a href="#">about us</a></li>
  	 				<li><a href="#">our services</a></li>
  	 				<li><a href="#">privacy policy</a></li>
                       <li><a href="#">How to buy</a></li>
  	 				<li><a href="#">How to sell</a></li>
  	 			</ul>
  	 		</div>
  	 		<div className={Style.footercol}>
  	 			<h4>get help</h4>
  	 			<ul>
  	 				<li><a href="#">FAQ</a></li>
  	 				<li><a href="#">shipping</a></li>
  	 				<li><a href="#">returns</a></li>
  	 				<li><a href="#">order status</a></li>
  	 				<li><a href="#">payment options</a></li>


  	 			</ul>
  	 		</div>
  	 		<div className={Style.footercol}>
  	 			<h4>Categories</h4>
  	 			<ul>
  	 				<li><a href="#">watches</a></li>
  	 				<li><a href="#">Cars</a></li>
  	 				<li><a href="#">jewelery</a></li>
  	 				<li><a href="#">Furniture</a></li>
                       <li><a href="#">All</a></li>
  	 			</ul>
  	 		</div>
  	 		<div className={Style.footercol}>
  	 			<h4>follow us</h4>
  	 			<div className={Style.sociallinks}>
  	 				<a href="#"><i className="fab fa-facebook-f"></i></a>
  	 				<a href="#"><i className="fab fa-twitter"></i></a>
  	 				<a href="#"><i className="fab fa-instagram"></i></a>
  	 				<a href="#"><i className="fab fa-linkedin-in"></i></a>
  	 			</div>
  	 		</div>
  	 	</div>
  	 </div>
  </footer>
    </div>
  )
}

export default FooterClone
