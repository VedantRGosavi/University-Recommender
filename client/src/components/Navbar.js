import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-semibold text-lg flex flex-col lg:flex-row gap-4"
      >
        <Link to="/how-it-works" className="flex items-center hover:text-blue-600 transition-colors">
          How it works
        </Link>
        <Menu>
          <MenuHandler>
            <button className="flex items-center hover:text-blue-600 transition-colors gap-1">
              Search
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </MenuHandler>
          <MenuList>
            <MenuItem><Link to="/advanced-search" className="w-full">Advanced Search</Link></MenuItem>
            <MenuItem><Link to="/search/sat" className="w-full">Search by SAT Score</Link></MenuItem>
            <MenuItem><Link to="/search/career" className="w-full">Search by Career</Link></MenuItem>
          </MenuList>
        </Menu>
        <Link to="/compare" className="flex items-center hover:text-blue-600 transition-colors">
          Compare Universities
        </Link>
        <Link to="/campus-maps" className="flex items-center hover:text-blue-600 transition-colors">
          Campus Maps
        </Link>
      </Typography>
    </ul>
  );

  const mobileNavList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-semibold text-lg flex flex-col gap-4"
      >
        <Link to="/how-it-works" className="flex items-center hover:text-blue-600 transition-colors">
          How it works
        </Link>
        <Link to="/advanced-search" className="flex items-center hover:text-blue-600 transition-colors">
          Advanced Search
        </Link>
        <Link to="/search/sat" className="flex items-center hover:text-blue-600 transition-colors">
          Search by SAT Score
        </Link>
        <Link to="/search/career" className="flex items-center hover:text-blue-600 transition-colors">
          Search by Career
        </Link>
        <Link to="/compare" className="flex items-center hover:text-blue-600 transition-colors">
          Compare Universities
        </Link>
        <Link to="/campus-maps" className="flex items-center hover:text-blue-600 transition-colors">
          Campus Maps
        </Link>
      </Typography>
    </ul>
  );

  return (
    <div>
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link to="/" className="font-semibold text-2xl">
            <span className="py-1.5 text-blue-600">Uni</span>
            <span className="py-1.5 text-gray-900">Match</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="hidden bg-blue-600 text-sm lg:inline-block"
                  >
                    <span>Sign In</span>
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
            <SignedIn>
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <MobileNav open={openNav}>
          {mobileNavList}
          <div className="flex items-center gap-x-1">
            <SignedOut>
              <SignInButton mode="modal">
                <Button fullWidth variant="text" size="sm" className="">
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </MobileNav>
      </Navbar>
    </div>
  );
}