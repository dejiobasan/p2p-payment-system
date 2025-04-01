import shapeBg from "../Images/Shape.png";
import Nav from "../components/Navbars/nav";

const Homepage = () => {
  return (
    <div className="relative h-screen bg-stone-200 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${shapeBg})` }}
      ></div>

      <header className="relative z-10">
        <Nav />
      </header>

      <div className="flex flex-col gap-20 flex-grow">
        <main className="flex-1 flex items-center justify-center text-center z-40">
          <div className="flex flex-col gap-6 w-2/3">
            <h1 className="text-black text-[45px] text-h1 leading-tight tracking-wide font-extrabold mb-5">
              Welcome to Dexchange
            </h1>
            <p className="text-black text-4xl">
              A peer to peer online transaction platform
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Homepage;
