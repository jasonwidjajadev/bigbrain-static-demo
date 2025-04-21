import Typewriter from 'typewriter-effect';
import LinkLogoNavBar from '@/components/logo/LogoNavBar';
import tiger from '@/assets/Tiger-unscreen.gif';

/**
 * Displays the waiting lobby screen for players after they join a quiz.
 * Shows animated avatar, motivational messages, and a video while waiting for the host to start.
 *
 * @component
 * @returns {JSX.Element} The rendered lobby screen
 */
function PlayerGameLobby() {
  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] gap-2 sm:gap-0">
        <LinkLogoNavBar targetPath="/join" />
        <div className=" flex-1 text-center text-2xl sm:text-3xl font-Nunito-ExtraBold">
          Waiting for host to Start ...
        </div>
      </nav>
      <main className="flex-1 flex justify-center items-center text-center p-8 bg-cyan-800 pb-25 text-white">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 justify-around w-full">

          {/* //* Left Side */}
          <div className='flex-1 flex flex-col justify-center items-center'>
            <img src={tiger} alt="animal-avatar" className='h-45 sm:h-70 mb-3 sm:mb-7 shrink-0 transition-transform duration-500 ease-in-out hover:rotate-180' />
            <div className="text-4xl sm:text-5xl text-orange-500 whitespace-nowrap font-Nunito-ExtraBold mb-4">
              <Typewriter
                options={{
                  strings: ["You're in!", '⚡ Get Ready!', 'Think Fast!', 'Eyes on prize!'],
                  autoStart: true,
                  loop: true,
                  pauseFor: 5000,
                  delay: 100,
                  deleteSpeed: 75,
                }}
              />
            </div>

            <div className="text:md sm:text-lg font-Nunito-regulard">See your nickname on screen?</div>
          </div>

          {/* //* Right Side */}
          <div className="flex-1">
            <iframe
              className="border-10 sm:border-13 border-orange-300 shadow-md w-full h-[250px] sm:h-[400px]"
              src="https://www.youtube.com/embed/LgXVfDiGt7g?start=450"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            >
            </iframe>
          </div>

          {/* Dummy whitespace */}
          <div className='w-[0px] 2xl:w-[100px] hidden sm:block'></div>
        </div>
      </main>
    </div>
  )
}

export default PlayerGameLobby;