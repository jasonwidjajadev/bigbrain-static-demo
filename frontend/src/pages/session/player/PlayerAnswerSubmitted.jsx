function PlayerAnswerSubmitted() {

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="flex justify-center items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px] gap-2 sm:gap-0">
        <div className=" flex-1 text-center text-2xl sm:text-3xl font-Nunito-ExtraBold">
          Answer Submitted !
        </div>
      </nav>
      <main className="flex-1 flex justify-center items-center text-center p-6 bg-cyan-800">
        <div className="flex flex-col gap-8 sm:gap-10 text-white  justify-center items-center">
          <span className="loading loading-spinner loading-xl"></span>
          <p className="font-Nunito-Bold text-lg sm:text-xl">Waiting for other players...</p>
        </div>
      </main>
    </div>
  )
}

export default PlayerAnswerSubmitted;