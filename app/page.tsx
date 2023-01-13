import "server-only";

// do not cache this page
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import hero from "../assets/hero.png";
import logo from "../assets/logo.png";
import Button from "../components/button";
import LogoutButton from "../components/logout-button";
import { createClient } from "../utils/supabase-server";

export default async function Page() {
  const supabase = createClient();
  const logged = (await supabase.auth.getSession()).data?.session?.user.id;
  return (
    <>
      <header className="text-gray-600 body-font bg-gray-900">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Image
            src={logo}
            alt="logo"
            sizes="45px 45px"
            className="w-[45px] h-[45px]"
          />
          <span className="px-4 font-bold text-sky-100">PiłkApp</span>
        </div>
      </header>
      <section className="text-gray-200 body-font bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-extrabold text-sky-300">
              Umawianie się na mecze
            </h1>
            <h2 className="title-font sm:text-xl text-xl mb-4 font-bold text-sky-200">
              Bez konieczności zakładania konta!
            </h2>
            <p className="mb-8 leading-relaxed">
              Czy masz dość bałaganu, który pojawia się przy umawianiu się na
              mecze piłkarskie? Z PiłkApp rozwiążesz ten problem raz na zawsze!
              Dzięki naszej aplikacji, łatwo zorganizujesz mecze z przyjaciółmi,
              bez niepotrzebnych komplikacji i rozczarowań związanych z
              wypisywaniem się z gry czy też zmianami w składach drużyn.
            </p>
            <div className="flex justify-center md:justify-start flex-wrap gap-4">
              {!logged ? (
                <Link href="/login">
                  <Button bold>
                    <p className="text-2xl">Login / Rejestracja</p>
                  </Button>
                </Link>
              ) : (
                <LogoutButton>
                  <p className="text-2xl">Wyloguj</p>
                </LogoutButton>
              )}
              {logged ? (
                <Link href="/admin">
                  <Button bold>
                    <p className="text-2xl">Panel Admina</p>
                  </Button>
                </Link>
              ) : null}
              <Link href="/public-games">
                <Button color="green" bold>
                  <p className="text-2xl">Mecze w Twoim mieście</p>
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image src={hero} alt="pilkapp" sizes="250px 250px" />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-teal-500 tracking-widest font-medium title-font mb-1">
              Czym jest PiłkApp?
            </h2>

            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              <Balancer>
                PiłkApp to aplikacja, która pozwala na łatwe organizowanie
                meczów
              </Balancer>
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Dzięki PiłkApp możesz łatwo umawiać się na mecze z przyjaciółmi,
              bez niepotrzebnych komplikacji i rozczarowań związanych z
              wypisywaniem się z gry czy też zmianami w składach drużyn. Dołącz
              do naszej społeczności już teraz i ciesz się bezproblemowym
              organizowaniem meczów piłkarskich!
            </p>
          </div>
          <div className="flex w-full p-4 item-center justify-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/xpxHOHxzhEo"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
          <div className="flex flex-wrap">
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Nie potrzebujesz konta
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Nie musisz tworzyć konta, aby korzystać z aplikacji. Konto musi
                posiadać tylko osoba, która tworzy mecz. Następnie inni gracze
                mogą dołączyć do meczu, bez konieczności tworzenia konta. Jeżeli
                jednak chcesz, możesz zarejestrować się w aplikacji. Wtedy
                będziesz mógł tworzyć własne mecze, a także mieć dostęp do
                swojego profilu i historii meczów.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Zarządzanie składami
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Podczas zapisywania się na mecz, gracz może wybrać pozycję, na
                której chce grać lub zaznaczyć, że jest w stanie zagrać na
                dowolnej pozycji. Dzięki temu, algorytm dobiera graczy do
                odpowiednich drużyn, w taki sposób, aby każda drużyna miała
                równą liczbę graczy na każdej pozycji. Organizator meczu może
                również samodzielnie ustawić skład drużyny.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Zarządzanie meczami
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Organizator meczu może samodzielnie ustawić datę, miejsce i
                godzinę rozpoczęcia meczu. Może również ustawić maksymalną
                liczbę graczy, którzy mogą dołączyć do meczu. W przypadku, gdy
                mecz jest płatny (np. za wynajem boiska), organizator może
                ustawić cenę za udział w meczu. Wszystkie te informacje są
                widoczne dla graczy, którzy chcą dołączyć do meczu. Organizator
                może również odznaczyć kto już zapłacił za mecz.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Powidomienia o meczach
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Mimo, że aplikacja nie wymaga konta, to jednak organizator może
                pozwolić urzytkownikom wypisać się z meczu. To funkcjonalność
                jakiej nie ma w żadnej innej aplikacji tego typu. Kiedy gracz
                wypisze się z meczu, organizator otrzyma E-maila z
                powiadomieniem o tym kto się wypisał i kto jest na ławce
                rezerowej.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <h2 className="sm:text-3xl text-2xl text-gray-900 text-center font-medium title-font mb-2 md:w-2/5">
            PWA
          </h2>
          <div className="md:w-3/5 md:pl-6">
            <p className="leading-relaxed text-base">
              Aplikacja jest dostępna w postaci Progressive Web App. Dzięki
              temu, możesz ją zainstalować na swoim telefonie i korzystać z niej
              bezpośrednio z ekranu głównego. Nie musisz wtedy otwierać
              przeglądarki, aby zobaczyć, czy ktoś dołączył do meczu.
            </p>
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font bono">
        <div className="container px-5 py-24 mx-auto">
          <div className="text-center mb-20">
            <h1 className="sm:text-3xl text-2xl text-center title-font font-extrabold text-sky-200 mb-4">
              Nad czym pracujemy
            </h1>
            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-sky-200 font-bold">
              W tej chwili pracujemy nad dodaniem kilku nowych funkcjonalności.
            </p>
          </div>
          <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
            <div className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  className="text-teal-500 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">Profil zawodnika</span>
              </div>
            </div>
            <div className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  className="text-teal-500 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">
                  Statystki - na jakiej pozycji idzie mi najepiej
                </span>
              </div>
            </div>
            <div className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  className="text-teal-500 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">
                  Mecze w Twojej okolicy
                </span>
              </div>
            </div>
            <div className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  className="text-teal-500 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">
                  Live preview meczu
                </span>
              </div>
            </div>
            <div className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  className="text-teal-500 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">
                  Tworzenie wyrównanych drużyn
                </span>
              </div>
            </div>
            <div className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  className="text-teal-500 w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span className="title-font font-medium">Mini liga</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <Image
            src={logo}
            alt="logo"
            sizes="45px 45px"
            className="w-[45px] h-[45px]"
          />
          <span className="px-4">PiłkApp</span>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            by Marek Chojecki
          </p>
        </div>
      </footer>
    </>
  );
}
