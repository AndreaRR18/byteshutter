import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className={'light-mode'}>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Me</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/buy-me-a-coffee">Buy Me a Coffee</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
