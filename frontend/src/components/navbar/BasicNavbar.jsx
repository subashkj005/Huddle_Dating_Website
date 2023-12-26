import React from 'react'
import logo from '../../assets/images/logo_png_hd-cropped.png'

function BasicNavbar({ image }) {
  return (
    <>
        <div className="navbar rounded-lg">
	<div className="navbar-start">
		<a className="navbar-item">
            <img src={logo} style={{width:'7rem'}} />
        </a>
	</div>
	<div className="navbar-end">
		<div className="avatar avatar-ring avatar-md">
			<div className="dropdown-container">
				<div className="dropdown">
					<label className="btn btn-ghost flex cursor-pointer px-0" tabIndex="0">
						<img src={image?image:"https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=1024x1024&w=is&k=20&c=t1UxKUo5asF5EL4bncWciZwcWfIs9NOf7zfwy1dWl2U="} alt="avatar" />
					</label>
					<div className="dropdown-menu dropdown-menu-bottom-left">
						<a className="dropdown-item text-sm">Profile</a>
						<a tabIndex="-1" className="dropdown-item text-sm">Account settings</a>
						<a tabIndex="-1" className="dropdown-item text-sm">Subscriptions</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
    </>
  )
}

export default BasicNavbar