import React, { useState } from "react"
import { links, social } from "./data"
import Style from './navbar.module.css'

const Navbar = () => {
  const [show, setShow] = useState(false)

  return (
    <>
      <header style={{height:'4rem', display:'flex', alignItems:'center', justifyContent:'between' }}>
        <div className={Style.logo}>
          <h1>Skyeby</h1>
        </div>
        <nav className={`${show ? Style.mobile : Style.list}`}>
          <ul>
            {links.map((link) => {
              const { id, url, text } = link
              return (
                <li key={id}>
                  <a href={url}>{text}</a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={Style.socialIcons}>
          <ul>
            {social.map((socialIcon) => {
              const { id, url, icon } = socialIcon
              return (
                <li key={id}>
                  <a style={{}} href={url}>{socialIcon.icon}</a>
                </li>
              )
            })}
          </ul>
        </div>
        <div className={Style.toggleBtn}>
          <button onClick={() => setShow(!show)}>{show ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}</button>
        </div>
      </header>
    </>
  )
}

export default Navbar
