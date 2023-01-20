import Image from 'next/image';
import Link from 'next/link';
//import logo from '/images/vector.png';
import style from './header.module.scss';
// eslint-disable-next-line react/display-name
export default function Header() {
  return (
    <nav className={style.header}>
      <ul>
        <li>
          <Link href={'/'}>
            <a>
              <img src="/images/vetor.png" alt="logo" width={40} height={40} />
              <p>
                spacetraveling <span>.</span>
              </p>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
