import { Handshake } from 'lucide-react';
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="w-full flex justify-between lg:max-w-[90%] mx-auto px-8 py-12">
      <div>
        <Link to="/">
          <Handshake color="black" className="h-16 w-16" />
        </Link>
      </div>
    </nav>
  )
}

export default Nav