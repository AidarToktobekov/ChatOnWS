import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/User/userSlice";
import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/User/userThunk';

const AppToolbar = ()=>{

    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleLogout = () => {
      dispatch(logout());
    };

    const user = useAppSelector(selectUser);

    let links = (
        <>
            <NavLink className="navbar-brand text-light ms-auto" to='/register'>Sign up</NavLink>
            <NavLink className="navbar-brand text-light" to='/login'>Sign in</NavLink>
        </>
    );

    if (user) {
        links = (
            <>
                <button className="navbar-brand text-light btn d-flex align-items-center gap-2" onClick={handleClick}>
                    {user.username}
                </button>
                <Menu open={isOpen} anchorEl={anchorEl} onClose={handleClose} keepMounted>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </>
        )
    }

    return(
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <NavLink className="navbar-brand text-light" to='/' >Chat</NavLink>
                {links}
            </div>
        </nav>
    )
}

export default AppToolbar;