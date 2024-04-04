import './Header.css';
import logo from '../Images/Books_Lined.png';

function Header() {
    return (
        <header className="header">
            <div className='logoStack'>
                <img src={logo} alt="book stack" />
            </div>
            <div><b>Book Finder</b></div>
        </header>
    );
}

export default Header;